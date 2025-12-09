# app/api/assistant.py

from __future__ import annotations

from typing import Any, Dict, Literal, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.domain.pattern.schemas import (
    ProPatternRequest,
    ElitePatternRequest,
)
from app.domain.pattern.logic_pro import build_pro_pattern
from app.domain.pattern.logic_elite import build_elite_pattern

from app.api.sage import SagePreferences
from app.api.sage_engine import generate_advice
from app.api.sage_personalization import personalize_sage_answer

router = APIRouter(prefix="/assistant", tags=["assistant"])


# ---------- Request / Response models ----------


class AssistantAskRequest(BaseModel):
    """
    Lightweight wrapper for the Assistant endpoint.

    The tests send:
    {
        "tier": "elite",
        "pattern": { ... fields used by ElitePatternRequest ... },
        "question": "How should I start fishing this pattern?"
    }

    `preferences` is optional and will default to a neutral SagePreferences.
    """
    tier: Literal["pro", "elite", "vision"]
    pattern: Dict[str, Any]
    question: str
    preferences: Optional[SagePreferences] = None


class AssistantAskResponse(BaseModel):
    tier: str
    question: str
    answer: str
    # This is where we surface the underlying pattern engine output
    pattern_summary: Dict[str, Any]


# ---------- Route ----------


@router.post("/ask", response_model=AssistantAskResponse)
def assistant_ask(payload: AssistantAskRequest) -> AssistantAskResponse:
    """
    High-level "assistant" endpoint that:
      1) Builds the appropriate pattern based on tier.
      2) Runs the SAGE rules engine to produce coaching text.
      3) Applies personalization (tone + confidence framing) via SagePreferences.
      4) Returns a rich `pattern_summary` block that mirrors the pattern engine output.

    IMPORTANT:
    - `pattern_summary` is built from the full pattern response,
      so it always contains keys like `phase`, `depth_zone`,
      `recommended_lures`, `recommended_targets`, `strategy_tips`,
      `gameplan`, `adjustments`, and `conditions`.
    - Personalization is TEXT ONLY and does NOT modify any engine behavior.
    """

    # --- 1) Build the underlying pattern ------------------------------

    tier = payload.tier

    if tier == "pro":
        req = ProPatternRequest(**payload.pattern)
        pattern = build_pro_pattern(req)
        # Using model_dump to avoid Pydantic v2 deprecation warnings
        summary: Dict[str, Any] = pattern.model_dump()

    elif tier in ("elite", "vision"):
        # Vision currently shares the Elite request/response shape,
        # so we reuse ElitePatternRequest / build_elite_pattern here.
        req = ElitePatternRequest(**payload.pattern)
        pattern = build_elite_pattern(req)
        summary = pattern.model_dump()

    else:
        raise HTTPException(status_code=400, detail=f"Unsupported tier: {tier}")

    # --- 2) Run SAGE rules engine (base advice) -----------------------

    base_answer, key_points, meta = generate_advice(
        pattern=summary,
        question=payload.question,
    )

    # --- 3) Apply personalization (tone + confidence framing) --------

    prefs = payload.preferences or SagePreferences()
    personalized_answer, _personalized_key_points = personalize_sage_answer(
        base_answer,
        key_points,
        prefs,
    )

    # NOTE:
    # We are not yet exposing key_points or meta through this endpoint.
    # `pattern_summary` remains the pure pattern engine output for now.

    # --- 4) Return the combined response -----------------------------

    return AssistantAskResponse(
        tier=tier,
        question=payload.question,
        answer=personalized_answer,
        pattern_summary=summary,
    )