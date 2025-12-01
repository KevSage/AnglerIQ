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


def _build_vision_area_read(
    context: SageContext | None,
    preferences: SagePreferences | None,
) -> str | None:
    """
    Build a 2–4 sentence 'Vision Area Read' describing the area being fished,
    based purely on existing Vision / fusion context.

    Text-only:
      - Does NOT modify any pattern, depth, weather, fusion, tier, or pricing behavior.
      - Uses coaching_style + experience_level to shape tone and detail.
    """
    if context is None:
        return None

    pattern_ctx = context.pattern
    vision_ctx = context.vision

    # Gate: only for Vision-tier / vision-enhanced patterns
    is_vision_tier = False
    if pattern_ctx and pattern_ctx.tier == "vision":
        is_vision_tier = True

    vision_enhanced_flag = False
    pattern_conditions = pattern_ctx.conditions or {} if pattern_ctx and pattern_ctx.conditions else {}
    if isinstance(pattern_conditions, dict):
        vision_enhanced_flag = bool(pattern_conditions.get("vision_enhanced"))

    # Gather possible vision / fusion sources
    vision_signals: dict[str, Any] = {}
    fusion: dict[str, Any] | None = None

    # Primary source: SageContext.vision
    if vision_ctx:
        if isinstance(vision_ctx.vision, dict):
            vision_signals.update(vision_ctx.vision)
        if isinstance(vision_ctx.fusion, dict):
            fusion = vision_ctx.fusion  # type: ignore[assignment]

    # Secondary source: pattern.conditions (if present)
    if isinstance(pattern_conditions, dict):
        cond_vision_signals = pattern_conditions.get("vision_signals")
        if isinstance(cond_vision_signals, dict):
            # Only add keys that don't already exist
            for k, v in cond_vision_signals.items():
                vision_signals.setdefault(k, v)
        cond_fusion = pattern_conditions.get("fusion")
        if isinstance(cond_fusion, dict) and fusion is None:
            fusion = cond_fusion  # type: ignore[assignment]

    # If we have neither explicit Vision context nor usable signals, bail
    has_any_vision_data = bool(vision_signals) or fusion is not None
    if not has_any_vision_data:
        return None

    # Require "vision-ness" of the pattern in some form
    if not (is_vision_tier or vision_enhanced_flag):
        return None

    # ---- Extract signals (using fusion sonar first if present) ----
    sonar_from_fusion = None
    weather_from_fusion = None
    should_camp = None
    likely_quality_bite_zone = None
    confidence_level = None

    if fusion and isinstance(fusion, dict):
        sonar_from_fusion = fusion.get("sonar") or {}
        weather_from_fusion = fusion.get("weather") or fusion.get("fusion_weather") or {}
        should_camp = fusion.get("should_camp")
        likely_quality_bite_zone = fusion.get("likely_quality_bite_zone")
        confidence_level = fusion.get("confidence_level")

    if not isinstance(sonar_from_fusion, dict):
        sonar_from_fusion = {}

    if not isinstance(weather_from_fusion, dict):
        weather_from_fusion = {}

    # Prefer fusion.sonar for core fields, fall back to vision_signals
    depth_ft = (
        sonar_from_fusion.get("depth_ft")
        or vision_signals.get("depth_ft")
    )
    arch_count = (
        sonar_from_fusion.get("arch_count")
        or vision_signals.get("arch_count")
    )
    activity_level = (
        sonar_from_fusion.get("activity_level")
        or vision_signals.get("activity_level")
    )
    bait_present = vision_signals.get("bait_present")
    bottom_hardness = vision_signals.get("bottom_hardness")
    stop_or_keep_moving = vision_signals.get("stop_or_keep_moving")

    # Weather hints (optional)
    temp_f = weather_from_fusion.get("temp_f")
    wind_mph = weather_from_fusion.get("wind_mph")
    cloud_cover = weather_from_fusion.get("cloud_cover")

    # If even core fields are totally missing, don't fabricate a read
    core_any = depth_ft or arch_count or activity_level or bottom_hardness
    if not core_any:
        return None

    # ---- Personalization knobs ----
    experience_level = (preferences.experience_level
                        if preferences is not None
                        else "agnostic")
    coaching_style = (preferences.coaching_style
                      if preferences is not None
                      else "agnostic")

    # ---- Build neutral facts first ----
    facts_sentences: list[str] = []

    # 1) Location / depth / bottom
    depth_phrase = None
    if isinstance(depth_ft, (int, float)):
        depth_phrase = f"around {depth_ft:.0f} feet"

    bottom_phrase = None
    if isinstance(bottom_hardness, str):
        bottom_phrase = f"{bottom_hardness} bottom"

    area_bits: list[str] = []
    if depth_phrase:
        area_bits.append(depth_phrase)
    if bottom_phrase:
        area_bits.append(bottom_phrase)

    if area_bits:
        area_desc = " and ".join(area_bits)
    else:
        area_desc = None

    # 2) Fish presence / activity
    fish_bits: list[str] = []
    if isinstance(arch_count, (int, float)):
        if arch_count <= 1:
            fish_bits.append("very few fish on the screen")
        elif arch_count <= 4:
            fish_bits.append("a small group of fish showing")
        else:
            fish_bits.append("a solid group of fish stacked up")

    if isinstance(activity_level, str):
        if activity_level == "high":
            fish_bits.append("activity looks high")
        elif activity_level == "medium":
            fish_bits.append("activity looks moderate")
        elif activity_level == "low":
            fish_bits.append("activity looks on the low side")

    if bait_present is True:
        fish_bits.append("bait is present in the area")
    elif bait_present is False:
        fish_bits.append("you’re not seeing much bait on this pass")

    fish_desc = ", ".join(fish_bits) if fish_bits else None

    # 3) Stay / move recommendation
    camp_phrase = None
    if isinstance(should_camp, bool):
        if should_camp:
            camp_phrase = "This is a spot worth camping on for a bit instead of immediately running new water."
        else:
            camp_phrase = "This doesn’t look like a place to camp long-term—be ready to keep moving."

    move_hint = None
    if isinstance(stop_or_keep_moving, str):
        if stop_or_keep_moving == "stop":
            move_hint = "Sonar is hinting that you should slow down and work this stretch carefully."
        elif stop_or_keep_moving == "keep_moving":
            move_hint = "Sonar suggests you keep moving until you see a tighter group of fish or bait."

    # 4) Confidence band
    confidence_phrase = None
    if isinstance(confidence_level, str):
        if confidence_level == "high":
            confidence_phrase = "Overall confidence here is high enough to give it a real look."
        elif confidence_level == "medium":
            confidence_phrase = "Confidence is moderate—good enough to fish, but pay attention to how quickly you get feedback."
        elif confidence_level == "low":
            confidence_phrase = "Confidence is on the low side, so treat this as a feel-out pass rather than a guaranteed stop."

    # 5) Light weather seasoning (optional)
    weather_snippet = None
    if isinstance(temp_f, (int, float)) or isinstance(wind_mph, (int, float)) or isinstance(cloud_cover, str):
        pieces: list[str] = []
        if isinstance(temp_f, (int, float)):
            pieces.append(f"{temp_f:.0f}° air temp")
        if isinstance(wind_mph, (int, float)):
            pieces.append(f"{wind_mph:.0f} mph wind")
        if isinstance(cloud_cover, str):
            pieces.append(cloud_cover.replace("_", " "))
        if pieces:
            weather_snippet = "Conditions look like " + ", ".join(pieces) + "."

    # Build a neutral 2–4 sentence scaffold we can restyle
    # Sentence 1 – core area description
    if area_desc and fish_desc:
        facts_sentences.append(
            f"Right now you’re over a {area_desc} with {fish_desc}."
        )
    elif area_desc:
        facts_sentences.append(
            f"Right now you’re over a {area_desc}."
        )
    elif fish_desc:
        facts_sentences.append(
            f"Sonar is showing {fish_desc} in front of you."
        )

    # Sentence 2 – camp / move / confidence
    second_bits: list[str] = []
    if camp_phrase:
        second_bits.append(camp_phrase)
    if move_hint and not camp_phrase:
        second_bits.append(move_hint)
    if confidence_phrase:
        second_bits.append(confidence_phrase)

    if second_bits:
        facts_sentences.append(" ".join(second_bits))

    # Sentence 3 – optional weather seasoning
    if weather_snippet:
        facts_sentences.append(weather_snippet)

    if not facts_sentences:
        return None

    # Trim to 2–4 sentences max
    facts_sentences = facts_sentences[:4]

    # ---- Tone + detail adaptation ----
    # We’ll lightly remap the scaffold based on coaching_style + experience_level.
    style = coaching_style or "agnostic"
    level = experience_level or "agnostic"

    def wrap_calm(sentences: list[str]) -> list[str]:
        if sentences:
            sentences[0] = "Based on what I’m seeing out there, " + sentences[0][0].lower() + sentences[0][1:]
        return sentences

    def wrap_old_school(sentences: list[str]) -> list[str]:
        if sentences:
            sentences[0] = "Your sonar says " + sentences[0].lstrip("Right now you’re ").replace("Right now you’re ", "")
        return sentences

    def wrap_analyst(sentences: list[str]) -> list[str]:
        if sentences:
            sentences[0] = "Sonar and conditions together suggest that " + sentences[0][0].lower() + sentences[0][1:]
        return sentences

    def wrap_hype(sentences: list[str]) -> list[str]:
        if sentences:
            sentences[0] = "This is a legit-looking stretch — " + sentences[0][0].lower() + sentences[0][1:]
        return sentences

    def wrap_minimal(sentences: list[str]) -> list[str]:
        # Keep it to 1–2 compact lines
        core = sentences[:2]
        return core

    # Apply coaching style
    styled = facts_sentences.copy()
    if style == "calm_guide" or style == "agnostic":
        styled = wrap_calm(styled)
    elif style == "old_school_pro":
        styled = wrap_old_school(styled)
    elif style == "data_analyst":
        styled = wrap_analyst(styled)
    elif style == "hype_coach":
        styled = wrap_hype(styled)
    elif style == "minimalist":
        styled = wrap_minimal(styled)

    # Experience level tweaks: adjust jargon/length lightly.
    if level == "beginner":
        # For beginners, avoid stacking too much in one sentence
        styled = [s.replace("deal", "area").replace("rotation", "pass") for s in styled]
        if len(styled) > 3:
            styled = styled[:3]
    elif level == "advanced":
        # Allow slightly more pattern-ish phrasing but still grounded
        styled = [s.replace("spot worth camping on", "quality-looking area to camp on") for s in styled]

    # Final join
    return " ".join(styled)


# ---------- Route (with personalization Step 2) ----------

@router.post("/chat", response_model=SageChatResponse)
def sage_chat(payload: SageChatRequest) -> SageChatResponse:
    """
    SAGE endpoint.

    Text-only behavior:
      - Uses pattern / vision context for description.
      - Uses SagePreferences to shape tone and detail.
      - DOES NOT modify any pattern engines, depth logic, weather, fusion rules,
        pricing, or tier behavior.
    """

    # Ensure we always have a preferences object to work with
    prefs = payload.preferences or SagePreferences()

    base_reply_lines: list[str] = [
        "SAGE AI is online and ready to help.",
        f"You asked: {payload.message!r}",
    ]

    # NEW: Vision Area Read (Vision tier only, if context/fusion available)
    vision_area_read = _build_vision_area_read(
        context=payload.context,
        preferences=prefs,
    )
    if vision_area_read:
        base_reply_lines.insert(0, vision_area_read)

    # Existing context echoing / debug lines stay the same
    if payload.context and payload.context.pattern:
        p = payload.context.pattern
        summary_bits = []
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
            base_reply_lines.append("Vision context received and available for guidance.")

    if payload.context and payload.context.images:
        base_reply_lines.append(
            f"Image references provided: {len(payload.context.images)} "
            "(these will be used by future vision upgrades)."
        )

    reply = "\n".join(base_reply_lines)

    return SageChatResponse(
        reply=reply,
        context_used=payload.context,
    )
