# app/api/sage/sage_engine.py

from __future__ import annotations

from typing import Any, Dict, List, Optional, Tuple


def _safe_get(d: Dict[str, Any], *keys: str, default: Any = None) -> Any:
    """
    Helper to safely walk nested dictionaries, e.g.:

    _safe_get(pattern, "conditions", "fusion", "sonar", "depth_ft")
    """
    cur: Any = d
    for k in keys:
        if not isinstance(cur, dict):
            return default
        if k not in cur:
            return default
        cur = cur[k]
    return cur


def _extract_core_context(pattern: Dict[str, Any]) -> Dict[str, Any]:
    """
    Pull out the bits SAGE cares about, tolerating missing fields.
    """
    conditions = pattern.get("conditions") or {}

    phase = pattern.get("phase") or conditions.get("phase")
    depth_zone = pattern.get("depth_zone") or conditions.get("depth_zone")

    clarity = conditions.get("clarity")
    temp_f = conditions.get("temp_f")
    wind_speed = conditions.get("wind_speed")
    sky_condition = conditions.get("sky_condition")
    location_name = conditions.get("location_name")

    # Vision / fusion bits
    vision_enhanced = bool(conditions.get("vision_enhanced"))
    vision_depth_zone = conditions.get("vision_depth_zone")
    vision_depth_band = conditions.get("vision_depth_band")

    sonar_depth_ft = _safe_get(conditions, "fusion", "sonar", "depth_ft")
    sonar_arch_count = _safe_get(conditions, "fusion", "sonar", "arch_count")
    sonar_activity = _safe_get(conditions, "fusion", "sonar", "activity_level")
    sonar_bait_present = _safe_get(conditions, "fusion", "sonar", "bait_present")
    sonar_stop_keep = _safe_get(conditions, "fusion", "sonar", "stop_or_keep_moving")

    vision_summary = conditions.get("vision_summary") or {}
    should_camp = vision_summary.get("should_camp")
    likely_quality_zone = vision_summary.get("likely_quality_bite_zone")
    confidence_level = vision_summary.get("confidence_level")

    return {
        "phase": phase,
        "depth_zone": depth_zone,
        "clarity": clarity,
        "temp_f": temp_f,
        "wind_speed": wind_speed,
        "sky_condition": sky_condition,
        "location_name": location_name,
        "vision_enhanced": vision_enhanced,
        "vision_depth_zone": vision_depth_zone,
        "vision_depth_band": vision_depth_band,
        "sonar_depth_ft": sonar_depth_ft,
        "sonar_arch_count": sonar_arch_count,
        "sonar_activity": sonar_activity,
        "sonar_bait_present": sonar_bait_present,
        "sonar_stop_keep": sonar_stop_keep,
        "should_camp": should_camp,
        "likely_quality_zone": likely_quality_zone,
        "confidence_level": confidence_level,
    }


def _summarize_context(ctx: Dict[str, Any]) -> str:
    """
    Build a short, human-readable one-liner about current conditions.
    """
    pieces: List[str] = []

    if ctx.get("location_name"):
        pieces.append(f"at {ctx['location_name']}")
    if ctx.get("phase"):
        pieces.append(f"in a {ctx['phase']} phase")
    if ctx.get("depth_zone"):
        pieces.append(f"focused on {ctx['depth_zone'].replace('_', ' ')} water")
    if ctx.get("clarity"):
        pieces.append(f"with {ctx['clarity']} water")
    if ctx.get("temp_f") is not None:
        pieces.append(f"around {ctx['temp_f']:.0f}°F")
    if ctx.get("wind_speed") is not None:
        pieces.append(f"and ~{ctx['wind_speed']:.0f} mph wind")

    if not pieces:
        return "under typical mixed conditions"

    return ", ".join(pieces)


def _build_opening_line(ctx: Dict[str, Any], question: Optional[str]) -> str:
    base_summary = _summarize_context(ctx)

    if question:
        return (
            f"Given this pattern {base_summary}, here's how I’d approach it based on your question: "
            f"“{question.strip()}”."
        )

    return f"Given this pattern {base_summary}, here's how I’d fish it."

def _build_vision_line(ctx: Dict[str, Any]) -> Optional[str]:
    if not ctx.get("vision_enhanced"):
        return None

    depth = ctx.get("sonar_depth_ft")
    arches = ctx.get("sonar_arch_count")
    activity = ctx.get("sonar_activity")
    bait = ctx.get("sonar_bait_present")
    stop_keep = ctx.get("sonar_stop_keep")
    v_zone = ctx.get("vision_depth_zone") or ctx.get("depth_zone")

    parts: List[str] = ["Your sonar/vision pass is adding a few important clues:"]

    if depth is not None:
        parts.append(f"fish activity is showing around ~{depth:.0f} ft in the {v_zone} band")
    if arches is not None:
        parts.append(f"with roughly {arches} arches on the screen")
    if activity:
        parts.append(f"and {activity} overall activity")
    if bait is not None:
        parts.append("bait is present in the cone" if bait else "little to no bait is showing")
    if stop_keep:
        if stop_keep == "stop":
            parts.append("this looks like a spot worth camping on for a bit")
        elif stop_keep == "keep_moving":
            parts.append("this looks more like a pass-through zone—keep moving until the screen stacks up")

    if len(parts) <= 1:
        return None

    # Glue into a readable paragraph
    first = parts[0]
    rest = parts[1:]
    return first + " " + "; ".join(rest) + "."


def _build_execution_section(ctx: Dict[str, Any], pattern: Dict[str, Any]) -> str:
    lures = pattern.get("recommended_lures") or []
    targets = pattern.get("recommended_targets") or []
    tips = pattern.get("strategy_tips") or []

    lines: List[str] = []

    # Where to start / positioning
    if targets:
        lines.append(
            f"Start by fishing your highest-confidence targets first — "
            f"things like {', '.join(targets[:2])}."
        )
    else:
        dz = ctx.get("depth_zone") or ctx.get("vision_depth_zone")
        if dz:
            lines.append(
                f"Start by covering classic {dz.replace('_', ' ')} structure like points, breaks, and transitions."
            )

    # What to throw
    if lures:
        lines.append(
            f"Lead with your confidence baits from the pattern — for example: {', '.join(lures[:3])}."
        )
    else:
        lines.append(
            "Use one moving bait and one slower bottom-contact bait so you can cover water and still fish thoroughly."
        )

    # How to adjust
    if tips:
        lines.append(
            "Use the existing strategy tips as your baseline, but slow down on any stretch where you get a bite, "
            "see bait on sonar, or feel hard bottom."
        )
    else:
        lines.append(
            "Anytime you get a bite, mark that depth and angle, then repeat it on similar pieces of structure nearby."
        )

    return " ".join(lines)


def _build_key_points(ctx: Dict[str, Any], pattern: Dict[str, Any]) -> List[str]:
    bullets: List[str] = []

    dz = ctx.get("depth_zone") or ctx.get("vision_depth_zone")
    depth_phrase = dz.replace("_", " ") if isinstance(dz, str) else "your primary depth zone"

    bullets.append(f"Focus on {depth_phrase} first before exploring secondary zones.")

    if ctx.get("vision_enhanced"):
        depth = ctx.get("sonar_depth_ft")
        arches = ctx.get("sonar_arch_count")
        if depth is not None:
            bullets.append(f"Use sonar depth (~{depth:.0f} ft) as your ‘home base’ for casting angles.")
        if arches is not None:
            bullets.append(f"Treat screens with more arches as A+ water and fish them more thoroughly.")

        stop_keep = ctx.get("sonar_stop_keep")
        if stop_keep == "stop":
            bullets.append("If sonar says 'stop', make multiple passes and change angles before leaving.")
        elif stop_keep == "keep_moving":
            bullets.append("If sonar says 'keep moving', cover water until you consistently see bait and arches.")

    # Generic adaptation bullet
    bullets.append(
        "When the bite changes, adjust only one thing at a time (depth, location, or lure profile) so you can see what actually helped."
    )

    # Trim / de-dup
    seen = set()
    out: List[str] = []
    for b in bullets:
        if b not in seen:
            seen.add(b)
            out.append(b)
    return out[:5]


def generate_advice(
    pattern: Dict[str, Any],
    question: Optional[str] = None,
) -> Tuple[str, List[str], Dict[str, Any]]:
    """
    Main SAGE logic entrypoint.

    This is intentionally rules-based and deterministic for V1. It does not
    call any external LLMs. It just reads the pattern + conditions and emits
    structured coaching text.
    """
    ctx = _extract_core_context(pattern)

    opening = _build_opening_line(ctx, question)
    vision_line = _build_vision_line(ctx)
    execution = _build_execution_section(ctx, pattern)

    paragraphs: List[str] = [opening]
    if vision_line:
        paragraphs.append(vision_line)
    paragraphs.append(execution)

    answer = "\n\n".join(paragraphs)
    key_points = _build_key_points(ctx, pattern)

    meta: Dict[str, Any] = {
        "version": "sage-v1-rules",
        "used_vision": bool(ctx.get("vision_enhanced")),
        "depth_zone": ctx.get("depth_zone"),
        "vision_depth_zone": ctx.get("vision_depth_zone"),
        "vision_depth_band": ctx.get("vision_depth_band"),
        "sonar_depth_ft": ctx.get("sonar_depth_ft"),
        "sonar_arch_count": ctx.get("sonar_arch_count"),
        "confidence_level": ctx.get("confidence_level"),
        "likely_quality_zone": ctx.get("likely_quality_zone"),
    }

    return answer, key_points, meta
