# app/api/assistant.py

from __future__ import annotations

from typing import Any, Dict, Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.domain.pattern.schemas import (
    ProPatternRequest,
    ElitePatternRequest,
)
from app.domain.pattern.logic_pro import build_pro_pattern
from app.domain.pattern.logic_elite import build_elite_pattern

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
    """
    tier: Literal["pro", "elite", "vision"]
    pattern: Dict[str, Any]
    question: str


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
      2) Returns a human-readable answer (stubbed for now).
      3) Returns a rich `pattern_summary` block.

    IMPORTANT: `pattern_summary` is built from the full pattern response,
    so it always contains keys like `phase`, `depth_zone`,
    `recommended_lures`, `recommended_targets`, `strategy_tips`,
    `gameplan`, `adjustments`, and `conditions`.
    """

    tier = payload.tier

    # --- 1) Build the underlying pattern ------------------------------

    if tier == "pro":
        req = ProPatternRequest(**payload.pattern)
        pattern = build_pro_pattern(req)
        summary = pattern.dict()

    elif tier in ("elite", "vision"):
        # Vision currently shares the Elite request/response shape,
        # so we reuse ElitePatternRequest / build_elite_pattern here.
        req = ElitePatternRequest(**payload.pattern)
        pattern = build_elite_pattern(req)
        summary = pattern.dict()

    else:
        raise HTTPException(status_code=400, detail=f"Unsupported tier: {tier}")

    # --- 2) Build an answer string (simple but non-empty) -------------

    phase = summary.get("phase", "this")
    depth_zone = summary.get("depth_zone", "mixed depths")

    answer = (
        f"Here’s how I’d start fishing this {tier} pattern. "
        f"Right now SAGE reads this as a '{phase}' pattern "
        f"with a '{depth_zone}' focus. Begin by working through the "
        f"first few recommended lures in the highest-percentage target areas, "
        f"then adjust using the gameplan and adjustments if the bite slows down."
    )

    # --- 3) Return the combined response ------------------------------

    return AssistantAskResponse(
        tier=tier,
        question=payload.question,
        answer=answer,
        pattern_summary=summary,
    )