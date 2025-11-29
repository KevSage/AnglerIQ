from __future__ import annotations

from typing import Optional

from app.domain.pattern.schemas import ElitePatternResponse
from .context import FusedContext


def _classify_vision_depth_zone(depth_ft: Optional[float]) -> Optional[str]:
    """
    Very simple depth zoning for vision:

    - < 8 ft   → "shallow"
    - 8–20 ft  → "mid"
    - > 20 ft  → "deep"
    """
    if depth_ft is None:
        return None

    if depth_ft < 8.0:
        return "shallow"
    if depth_ft <= 20.0:
        return "mid"
    return "deep"


def apply_vision_adjustments(
    base_pattern: ElitePatternResponse,
    fused: Optional[FusedContext],
) -> ElitePatternResponse:
    """
    Apply Vision/Fusion-based adjustments to an ElitePatternResponse.

    V1 rules:
    - If fused is None, this is a pure no-op (returns base_pattern unchanged).
    - If fused is provided, we only add information:
        * annotate conditions with vision/fusion info
        * optionally tilt depth_zone slightly toward vision (high confidence only)
        * append a couple of hints to gameplan/adjustments
    """

    # No vision/fusion context provided → behave exactly as before.
    if fused is None:
        return base_pattern

    # --- 0) Optional: depth_zone tilt based on vision ----------------------
    original_depth_zone = base_pattern.depth_zone
    vision_depth_zone = _classify_vision_depth_zone(fused.vision.depth_ft)

    # We only consider overriding for very simple labels, and only on high confidence.
    if (
        vision_depth_zone is not None
        and fused.confidence_level == "high"
        and original_depth_zone in ("shallow", "mid", "deep")
        and original_depth_zone != vision_depth_zone
    ):
        # Lightly tilt the primary depth_zone toward vision-informed zone.
        base_pattern.depth_zone = vision_depth_zone

        # Transparent note for the angler.
        note_snip = (
            f" Vision suggests most activity around {vision_depth_zone} depth; "
            "pattern depth focus has been lightly tilted toward that zone."
        )
        base_pattern.notes = (base_pattern.notes + note_snip).strip()

    # --- 1) Enrich conditions with vision/fusion details -------------------
    conditions = dict(base_pattern.conditions or {})

    # Preserve what the rules engine originally decided.
    conditions.setdefault("base_depth_zone", original_depth_zone)

    # Simple boolean flag to indicate this pattern was vision-enhanced
    conditions["vision_enhanced"] = True

    # Expose the vision-derived depth zone even if we didn't override
    if vision_depth_zone is not None:
        conditions["vision_depth_zone"] = vision_depth_zone

    # High-level summary
    conditions["vision_summary"] = {
        "should_camp": fused.should_camp,
        "likely_quality_bite_zone": fused.likely_quality_bite_zone,
        "confidence_level": fused.confidence_level,
    }

    # Raw-ish sonar signals for transparency / debug
    conditions["vision_signals"] = {
        "depth_ft": fused.vision.depth_ft,
        "arch_count": fused.vision.arch_count,
        "activity_level": fused.vision.activity_level,
        "bait_present": fused.vision.bait_present,
        "bottom_hardness": fused.vision.bottom_hardness,
        "stop_or_keep_moving": fused.vision.stop_or_keep_moving,
    }

    # Direct vision block for UI consumption (clean, stable shape)
    conditions["vision"] = {
        "depth_ft": fused.vision.depth_ft,
        "arch_count": fused.vision.arch_count,
        "activity_level": fused.vision.activity_level,
        "bait_present": fused.vision.bait_present,
        "bottom_hardness": fused.vision.bottom_hardness,
        "stop_or_keep_moving": fused.vision.stop_or_keep_moving,
    }

    # Fusion block: structure expected by tests and UI
    conditions["fusion"] = {
        "sonar": {
            "depth_ft": fused.vision.depth_ft,
            "arch_count": fused.vision.arch_count,
            "activity_level": fused.vision.activity_level,
            "bait_present": fused.vision.bait_present,
            "bottom_hardness": fused.vision.bottom_hardness,
            "stop_or_keep_moving": fused.vision.stop_or_keep_moving,
        },
        "weather": {
            "temp_f": fused.weather.temp_f,
            "wind_mph": fused.weather.wind_mph,
            "cloud_cover": fused.weather.cloud_cover,
        },
        "strength": fused.confidence_level,
        "should_camp": fused.should_camp,
        "likely_quality_bite_zone": fused.likely_quality_bite_zone,
    }

    base_pattern.conditions = conditions

    # --- 2) Lightly tint gameplan / adjustments (append-only) -------------
    gameplan = list(base_pattern.gameplan)
    adjustments = list(base_pattern.adjustments)

    # should_camp hint
    if fused.should_camp:
        gameplan.append(
            "Vision/fusion suggests there is enough life here to work this area thoroughly "
            "before moving on."
        )
    else:
        gameplan.append(
            "Vision/fusion does not show overwhelming life; be prepared to keep moving if "
            "you don't see signs of activity."
        )

    # confidence hint
    if fused.confidence_level == "high":
        adjustments.append(
            "Fusion confidence is high—trust this area and rotate through multiple looks "
            "before abandoning it."
        )
    elif fused.confidence_level == "low":
        adjustments.append(
            "Fusion confidence is low—treat this as a quick check rather than a long-term stop."
        )

    base_pattern.gameplan = gameplan
    base_pattern.adjustments = adjustments

    return base_pattern
