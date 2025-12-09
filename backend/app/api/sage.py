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

    IMPORTANT:
    - These DO NOT affect the underlying Pro/Elite/Vision engines.
    - They only change how SAGE speaks and what it emphasizes in text.
    """

    # Experience level: affects level of detail and jargon
    # Legacy 'agnostic' is treated as 'general' in the personalization layer.
    experience_level: Literal["agnostic", "beginner", "intermediate", "advanced"] = "agnostic"

    # Coaching "archetype" / style
    coaching_style: Literal[
        "agnostic",
        "calm_guide",        # steady, reassuring, explanatory
        "old_school_pro",    # blunt, confident, no-nonsense
        "data_analyst",      # more logic-y, references signals
        "hype_coach",        # measured energy, still premium
        "minimalist"         # short, direct, no fluff
    ] = "agnostic"

    # Legacy field, no longer used for logic, but kept for compatibility.
    # Personalization currently ignores this in the canon.
    preferred_styles: List[str] = ["agnostic"]

    # Confidence Spectrum (text-only for now, via personalization layer):
    # confidence_baits → high-confidence baits
    # banned_techniques → low-confidence / optional techniques
    confidence_baits: Optional[List[str]] = None
    banned_techniques: Optional[List[str]] = None


# ---------- Chat request/response ----------


class SageChatRequest(BaseModel):
    message: str
    context: Optional[SageContext] = None
    user_name: Optional[str] = None  # name from frontend, optional
    preferences: Optional[SagePreferences] = None  # Step 2: wired in


class SageChatResponse(BaseModel):
    reply: str
    # Echoing context can help debug and keep the contract stable
    context_used: Optional[SageContext] = None
    # Echo preferences so the UI can verify what was applied
    preferences_used: Optional[SagePreferences] = None


# ---------- Vision Area Read helper ----------


def _build_vision_area_read(
    context: SageContext | None,
    preferences: SagePreferences | None,
) -> str | None:
    """
    Build a 2–4 sentence 'Vision Area Read' describing the area being fished,
    based purely on existing Vision / fusion context.

    Text-only:
      - Does NOT modify any pattern, depth, weather, Vision, or tier behavior.
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
    experience_level = preferences.experience_level if preferences else "agnostic"
    coaching_style = preferences.coaching_style if preferences else "agnostic"

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
        return sentences[:2]

    # Apply coaching style
    styled = facts_sentences.copy()
    if style in ("calm_guide", "agnostic"):
        styled = wrap_calm(styled)
    elif style == "old_school_pro":
        styled = wrap_old_school(styled)
    elif style == "data_analyst":
        styled = wrap_analyst(styled)
    elif style == "hype_coach":
        styled = wrap_hype(styled)
    elif style == "minimalist":
        styled = wrap_minimal(styled)

    # Experience level tweaks
    if level == "beginner":
        styled = [s.replace("deal", "area").replace("rotation", "pass") for s in styled]
        if len(styled) > 3:
            styled = styled[:3]
    elif level == "advanced":
        styled = [s.replace("spot worth camping on", "quality-looking area to camp on") for s in styled]

    return " ".join(styled)


# ---------- Route (with personalization) ----------


# app/api/sage.py  — REPLACE the entire /chat route with this

@router.post("/chat", response_model=SageChatResponse)
def sage_chat(payload: SageChatRequest) -> SageChatResponse:
    """
    SAGE conversational endpoint — deterministic, personalization-aware,
    Vision-aware, and test-stable.
    """

    prefs = payload.preferences or SagePreferences()
    context = payload.context

    reply_parts: list[str] = []

    # ---- 1) Vision Area Read (if present) ----
    vision_area = _build_vision_area_read(context, prefs)
    if vision_area:
        reply_parts.append(vision_area)

    # ---- 2) Coaching Intro ----
    coaching_intro = _build_coaching_intro(prefs)
    if coaching_intro:
        reply_parts.append(coaching_intro)

    # ---- 3) Greeting ----
    if payload.user_name:
        reply_parts.append(f"Hey {payload.user_name},")
    else:
        reply_parts.append("Alright, let’s get into it.")

    # ---- 4) Echo the user question ----
    reply_parts.append(f"You asked: {payload.message!r}")

    # ---- 5) Personalization block ----
    personalized = apply_personalization_lines([], prefs)
    if personalized and len(personalized) > 0:
        reply_parts.extend(personalized)

    # ---- 6) Debug/context echo (stable contract) ----
    if context and context.pattern:
        p = context.pattern
        bits = []
        if p.phase: bits.append(f"phase={p.phase}")
        if p.depth_zone: bits.append(f"depth_zone={p.depth_zone}")
        if p.tier: bits.append(f"tier={p.tier}")
        if bits:
            reply_parts.append("Pattern context: " + ", ".join(bits))

    if context and context.vision:
        if context.vision.vision or context.vision.fusion:
            reply_parts.append("Vision context received.")

    if context and context.images:
        reply_parts.append(
            f"Image references provided: {len(context.images)} (future vision use)."
        )

    final_reply = "\n".join(reply_parts)

    return SageChatResponse(
        reply=final_reply,
        context_used=context,
        preferences_used=prefs,
    )
    """
    SAGE endpoint (text-only for V1).

    Behavior:
      - Uses pattern / vision context for description.
      - Uses SagePreferences to shape tone and detail.
      - Uses apply_personalization_lines to describe Confidence Spectrum
        and coaching tone.
      - DOES NOT modify any pattern engines, depth logic, weather, Vision rules,
        pricing, or tier behavior.
    """

    # Ensure we always have a preferences object to work with
    prefs = payload.preferences or SagePreferences()

    # Very simple, deterministic base greeting.
    if payload.user_name:
        greeting = f"Hey {payload.user_name}, catch anything yet?"
    else:
        greeting = "I guess that's why they don't call it catchin'. Need any help?"

    base_reply_lines: list[str] = [
        greeting,
        f"You asked: {payload.message!r}",
    ]

    # Optional Vision Area Read (Vision-tier only, if context/fusion available)
    vision_area_read = _build_vision_area_read(
        context=payload.context,
        preferences=prefs,
    )
    if vision_area_read:
        base_reply_lines.insert(0, vision_area_read)

    # Context echo lines (lightweight debug + UX transparency)
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
            "(these will be used by future Vision upgrades)."
        )

    # Apply Step 2 personalization (experience, coaching tone, Confidence Spectrum)
    reply_lines = apply_personalization_lines(base_reply_lines, prefs)
    reply = "\n".join(reply_lines)

    return SageChatResponse(
        reply=reply,
        context_used=payload.context,
        preferences_used=prefs,
    )