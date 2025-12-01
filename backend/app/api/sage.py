# app/api/sage.py

from __future__ import annotations

from typing import Any, Dict, Optional, List, Literal

from fastapi import APIRouter
from pydantic import BaseModel
from .sage_personalization import apply_personalization_lines

router = APIRouter(prefix="/sage", tags=["sage"])

# ---------- Context models ----------

class SagePatternContext(BaseModel):
    """
    Optional pattern snapshot for SAGE.
    You can pass the raw pattern response, or a trimmed subset.
    """
    phase: Optional[str] = None
    depth_zone: Optional[str] = None
    tier: Optional[str] = None  # "pro", "elite", "vision"
    conditions: Optional[Dict[str, Any]] = None
    gameplan: Optional[List[str]] = None
    adjustments: Optional[List[str]] = None


class SageVisionContext(BaseModel):
    """
    Optional vision/sonar context for SAGE.
    Mirrors the structures you already expose under conditions["vision"] / ["fusion"].
    """
    vision: Optional[Dict[str, Any]] = None
    fusion: Optional[Dict[str, Any]] = None


class SageImageRef(BaseModel):
    """
    Optional future-proof hook for raw images.
    For V1, this is just metadata; you don't have to process these yet.
    """
    type: str  # e.g. "on_water_photo", "fishfinder_screenshot", "fusion_panel"
    url: Optional[str] = None
    id: Optional[str] = None  # if you later store images internally


class SageContext(BaseModel):
    """
    Aggregated context that the front end can send to SAGE.
    All fields are optional so you can call SAGE 'cold' with just a question.
    """
    pattern: Optional[SagePatternContext] = None
    vision: Optional[SageVisionContext] = None
    images: Optional[List[SageImageRef]] = None


class SagePreferences(BaseModel):
    """
    Personalization knobs for SAGE.
    These DO NOT affect the underlying Pro/Elite/Vision engines –
    they only change how SAGE speaks and what it emphasizes.
    """

    # Experience level: affects level of detail and jargon
    experience_level: Literal["agnostic", "beginner", "intermediate", "advanced"] = "agnostic"

    # Coaching "archetype" / style
    coaching_style: Literal[
        "agnostic",
        "calm_guide",        # steady, reassuring, explanatory
        "old_school_pro",    # blunt, confident, no-nonsense
        "data_analyst",      # more logic-y, references signals
        "hype_coach",        # energetic, motivational
        "minimalist"         # short, direct, no fluff
    ] = "agnostic"

    # Preferred fishing styles (power/finesse/etc.)
    preferred_styles: List[Literal[
        "agnostic",
        "power",
        "finesse",
        "offshore",
        "bank",
        "dock",
        "grass"
    ]] = ["agnostic"]

    # Optional “confidence” and “no confidence” hooks for SAGE wording only.
    # These are *free-form* strings so we don't have to touch the rules engine yet.
    confidence_baits: Optional[List[str]] = None
    banned_techniques: Optional[List[str]] = None


# ---------- Chat request/response ----------

class SageChatRequest(BaseModel):
    message: str
    context: Optional[SageContext] = None
    preferences: Optional[SagePreferences] = None
    user_name: Optional[str] = None   # NEW



class SageChatResponse(BaseModel):
    reply: str
    # Echoing context can help debug and keep the contract stable
    context_used: Optional[SageContext] = None
    # Echo preferences so the UI can verify what was applied
    preferences_used: Optional[SagePreferences] = None


# ---------- Personalization helpers (Step 2: hybrid B/C intensity) ----------

def _summarize_pattern_context(pattern: SagePatternContext) -> Optional[str]:
    bits: list[str] = []
    if pattern.phase:
        bits.append(f"phase={pattern.phase}")
    if pattern.depth_zone:
        bits.append(f"depth_zone={pattern.depth_zone}")
    if pattern.tier:
        bits.append(f"tier={pattern.tier}")
    if not bits:
        return None
    return "Pattern context: " + ", ".join(bits)


def _build_experience_line(prefs: SagePreferences) -> Optional[str]:
    exp = prefs.experience_level
    if exp == "beginner":
        return (
            "I'll keep the language simple and focus on clear, practical steps "
            "without too much jargon."
        )
    if exp == "intermediate":
        return (
            "I'll assume you know the basics and give you a bit more tactical detail "
            "without overcomplicating it."
        )
    if exp == "advanced":
        return (
            "I'll speak more like a tournament partner—short on fluff, comfortable "
            "with depth, phase, and pattern jargon."
        )
    # agnostic → no extra line
    return None


def _build_coaching_line(prefs: SagePreferences) -> Optional[str]:
    style = prefs.coaching_style
    if style == "calm_guide":
        return "I'll keep the tone steady and reassuring, walking you through the pattern one step at a time."
    if style == "old_school_pro":
        return "I'll be a bit more blunt and direct so you always know the next move."
    if style == "data_analyst":
        return "I'll lean into the signals—conditions, structure, and trends—to explain *why* each move makes sense."
    if style == "hype_coach":
        return "I'll keep the energy up and focus on what gives you the best shot at a confidence bite."
    if style == "minimalist":
        return "I'll keep things tight and to the point, focusing on only what actually matters."
    # agnostic → no extra line
    return None


def _build_style_emphasis_line(prefs: SagePreferences) -> Optional[str]:
    styles = [s for s in prefs.preferred_styles if s != "agnostic"]
    if not styles:
        return None

    # Hybrid B/C: noticeable but not overwhelming
    if "power" in styles and "offshore" in styles:
        return (
            "I'll lean a bit harder into power moves and offshore structure when either path is reasonable."
        )
    if "power" in styles:
        return "I'll favor power-style approaches when there are multiple good options."
    if "finesse" in styles:
        return "I'll highlight finesse options any time they make sense for the conditions."
    if "grass" in styles:
        return "I'll call out grass edges and vegetation lines whenever they naturally fit the pattern."
    if "bank" in styles or "dock" in styles:
        return "I'll give extra attention to bank lines and dock targets when the pattern supports it."
    if "offshore" in styles:
        return "I'll nudge you toward offshore structure and breaks when the pattern allows for it."

    return None


def _build_confidence_baits_line(prefs: SagePreferences) -> Optional[str]:
    if not prefs.confidence_baits:
        return None
    baits = [b.strip() for b in prefs.confidence_baits if b.strip()]
    if not baits:
        return None
    if len(baits) == 1:
        return f"If the bite feels off, we can lean on your confidence bait: {baits[0]}."
    if len(baits) == 2:
        return (
            f"If things get weird, we can fall back on your confidence baits like {baits[0]} and {baits[1]}."
        )
    # 3+ baits
    head = ", ".join(baits[:2])
    tail = baits[2]
    return (
        f"If conditions shift, we can rotate through your confidence baits like "
        f"{head}, and {tail} to stay grounded."
    )


def _build_banned_techniques_line(prefs: SagePreferences) -> Optional[str]:
    if not prefs.banned_techniques:
        return None
    banned = [b.strip() for b in prefs.banned_techniques if b.strip()]
    if not banned:
        return None

    # Hybrid B/C: clearly state avoidance, but still advisory-only
    if len(banned) == 1:
        return f"I'll avoid pushing {banned[0]} as a primary suggestion."
    if len(banned) == 2:
        return f"I'll steer clear of leaning on {banned[0]} and {banned[1]} unless there's no better option."
    head = ", ".join(banned[:2])
    tail = banned[2]
    return (
        f"I'll de-emphasize techniques like {head}, and {tail} so the plan stays aligned with what you actually enjoy fishing."
    )


def _apply_personalization_lines(
    base_lines: list[str],
    prefs: SagePreferences,
) -> list[str]:
    """
    Hybrid B/C intensity:
    - Always preserves the core pattern/context lines.
    - Adds 1–4 short lines describing how SAGE will talk,
      with noticeable but not overwhelming emphasis.
    """
    extra: list[str] = []

    exp_line = _build_experience_line(prefs)
    if exp_line:
        extra.append(exp_line)

    coach_line = _build_coaching_line(prefs)
    if coach_line:
        extra.append(coach_line)

    style_line = _build_style_emphasis_line(prefs)
    if style_line:
        extra.append(style_line)

    conf_line = _build_confidence_baits_line(prefs)
    if conf_line:
        extra.append(conf_line)

    banned_line = _build_banned_techniques_line(prefs)
    if banned_line:
        extra.append(banned_line)

    if not extra:
        return base_lines

    # Keep base lines together, then add a small divider + personalization flavor
    return base_lines + ["", "Personalization:", *extra]


# ---------- Route (with personalization Step 2) ----------

@router.post("/chat", response_model=SageChatResponse)
def sage_chat(payload: SageChatRequest) -> SageChatResponse:
    """
    V1 SAGE endpoint.

    - Uses Pro/Elite/Vision pattern context as provided by the caller.
    - Uses optional Vision context, but does not change pattern engines.
    - Applies SAGE personalization to TEXT ONLY (tone, emphasis).
    """

    prefs = payload.preferences or SagePreferences()
    
    # Personalized greeting (first message heuristic)
    if    payload.user_name:
      greeting = f"Alright {payload.user_name}, I'm here with you. Let's dial in this pattern."
    else:
      greeting = "Alright, I'm here with you. Let's dial in this pattern."

    base_reply_lines: list[str] = [
    greeting,
    f"You asked: {payload.message!r}",
]

    if payload.context and payload.context.pattern:
        p = payload.context.pattern
        summary_bits: list[str] = []
        if p.phase:
            summary_bits.append(f"phase={p.phase}")
        if p.depth_zone:
            summary_bits.append(f"depth_zone={p.depth_zone}")
        if p.tier:
            summary_bits.append(f"tier={p.tier}")
        if summary_bits:
            base_reply_lines.append("Pattern context: " + ", ".join(summary_bits))

    if payload.context and payload.context.vision:
        v = payload.context.vision
        if v.vision or v.fusion:
            base_reply_lines.append(
                "Vision context is available and will be treated as advisory on top of your core pattern."
            )

    if payload.context and payload.context.images:
        base_reply_lines.append(
            f"Image references provided: {len(payload.context.images)} "
            "(these will be used by future vision upgrades)."
        )

    # TEXT-ONLY personalization (Step 2, hybrid intensity)
    personalized_lines = apply_personalization_lines(base_reply_lines, prefs)
    reply = "\n".join(personalized_lines)

    return SageChatResponse(
        reply=reply,
        context_used=payload.context,
        preferences_used=prefs,
    )
