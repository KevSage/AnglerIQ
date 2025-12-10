# app/api/assistant.py

from __future__ import annotations

from typing import Any, Dict, Literal, Optional, List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.domain.pattern.schemas import ProPatternRequest, ElitePatternRequest
from app.domain.pattern.logic_pro import build_pro_pattern
from app.domain.pattern.logic_elite import build_elite_pattern

# SAGE rules + personalization
from app.api.sage_engine import generate_advice
from app.api.sage_personalization import personalize_sage_answer
from app.api.sage import SagePreferences

router = APIRouter(prefix="/assistant", tags=["assistant"])


# ---------- Request / Response models (ASK) ----------


class AssistantAskRequest(BaseModel):
    """
    High-level Assistant request.

    Tests currently send:

    {
        "tier": "elite",
        "pattern": { ... fields used by ElitePatternRequest ... },
        "question": "How should I start fishing this pattern?"
    }

    `preferences` is optional and defaults to a neutral SAGE profile.
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


# ---------- Request / Response models (CHAT) ----------


class AssistantChatTurn(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class AssistantChatRequest(BaseModel):
    """
    Conversational SAGE endpoint.

    Minimal V1 contract:
      - `message` is the latest user message.
      - `history` is optional (for future use; ignored for now).
      - `tier` + `pattern` are optional; when present, we build a pattern
        and let SAGE give pattern-aware coaching.
      - `preferences` uses the same SagePreferences model as Control Center.

    This keeps the wire format future-proof without forcing full
    conversational state on the backend yet.
    """
    message: str
    history: Optional[List[AssistantChatTurn]] = None

    tier: Optional[Literal["pro", "elite", "vision"]] = None
    pattern: Optional[Dict[str, Any]] = None

    preferences: Optional[SagePreferences] = None


class AssistantChatResponse(BaseModel):
    reply: str
    # Optional pattern snapshot if one was used
    pattern_summary: Optional[Dict[str, Any]] = None
    preferences_used: SagePreferences


# ---------- /assistant/ask ----------


@router.post("/ask", response_model=AssistantAskResponse)
def assistant_ask(payload: AssistantAskRequest) -> AssistantAskResponse:
    """
    High-level 'assistant' endpoint that:

      1) Builds the appropriate pattern based on tier.
      2) Runs the SAGE rules engine on that pattern (generate_advice).
      3) Applies SAGE personalization (experience_level, coaching_style,
         confidence / low-confidence baits) *in wording only*.
      4) Returns a rich `pattern_summary` block for the UI.

    IMPORTANT:
      - `pattern_summary` is built from the full pattern response.
      - Tier boundaries, engines, depth logic, weather rules, Vision behavior,
        and pricing are NOT changed here; this is text-only guidance.
    """

    tier = payload.tier

    # --- 1) Build the underlying pattern ---------------------------------

    if tier == "pro":
        req = ProPatternRequest(**payload.pattern)
        pattern = build_pro_pattern(req)
        summary: Dict[str, Any] = pattern.dict()

    elif tier in ("elite", "vision"):
        # Vision currently shares the Elite request/response shape,
        # so we reuse ElitePatternRequest / build_elite_pattern here.
        req = ElitePatternRequest(**payload.pattern)
        pattern = build_elite_pattern(req)
        summary = pattern.dict()

    else:
        raise HTTPException(status_code=400, detail=f"Unsupported tier: {tier}")

    # --- 2) Run SAGE rules engine on the pattern --------------------------

    base_answer, key_points, meta = generate_advice(
        pattern=summary,
        question=payload.question,
    )

    # --- 3) Apply personalization (Confidence Spectrum, tone, etc.) ------

    prefs = payload.preferences or SagePreferences()
    personalized_answer, _ = personalize_sage_answer(
        base_answer,
        key_points,
        prefs,
    )

    # --- 4) Return combined response --------------------------------------

    return AssistantAskResponse(
        tier=tier,
        question=payload.question,
        answer=personalized_answer,
        pattern_summary=summary,
    )


# ---------- /assistant/chat ----------


@router.post("/chat", response_model=AssistantChatResponse)
def assistant_chat(payload: AssistantChatRequest) -> AssistantChatResponse:
    """
    Conversational SAGE endpoint.

    V1 behavior:
      - If tier + pattern are provided:
          * Build the Pro/Elite/Vision pattern as in /assistant/ask.
          * Run SAGE rules engine with the user's message as the 'question'.
          * Apply personalization (tone + Confidence Spectrum wording).
      - If no pattern is provided:
          * Return a deterministic, coaching-style reply based only on
            the message + preferences (no pattern logic called).

    This keeps Chat wired into the same SAGE brain without changing any
    engine behavior or test expectations.
    """

    prefs = payload.preferences or SagePreferences()

    # --- Pattern-aware path (if tier + pattern present) -------------------

    summary: Optional[Dict[str, Any]] = None

    if payload.tier and payload.pattern:
        tier = payload.tier

        if tier == "pro":
            req = ProPatternRequest(**payload.pattern)
            pattern = build_pro_pattern(req)
            summary = pattern.dict()
        elif tier in ("elite", "vision"):
            req = ElitePatternRequest(**payload.pattern)
            pattern = build_elite_pattern(req)
            summary = pattern.dict()
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported tier: {tier}")

        base_answer, key_points, meta = generate_advice(
            pattern=summary,
            question=payload.message,
        )

        personalized_answer, _ = personalize_sage_answer(
            base_answer,
            key_points,
            prefs,
        )

        return AssistantChatResponse(
            reply=personalized_answer,
            pattern_summary=summary,
            preferences_used=prefs,
        )

    # --- Pattern-less path (pure conversational coaching) -----------------

    # Simple, deterministic reply that still respects preferences.
    # We reuse the personalization helper by treating the base reply
    # as a single "answer" paragraph.
    base_answer = (
        "Let’s keep this simple and practical. "
        "Tell me what you’re seeing out there or what you’re unsure about, "
        "and I’ll help you turn it into a clear next step."
    )

    # We don't have key_points here yet; pass an empty list.
    personalized_answer, _ = personalize_sage_answer(
        base_answer,
        [],
        prefs,
    )

    reply = (
        f"You said: {payload.message}\n\n"
        f"{personalized_answer}"
    )

    return AssistantChatResponse(
        reply=reply,
        pattern_summary=None,
        preferences_used=prefs,
    )