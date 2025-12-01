from __future__ import annotations

from typing import Optional

from app.domain.pattern.schemas import ElitePatternResponse
from .context import FusedContext


def _classify_vision_depth_zone(depth_ft: Optional[float]) -> Optional[str]:
    """
    Coarse depth zoning for vision (for high-level labels):

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


def _classify_vision_depth_band(depth_ft: Optional[float]) -> Optional[str]:
    """
    More detailed depth banding so that 3 ft vs 8 ft are clearly distinct.

    - 0–3 ft      → "ultra_shallow_0_3ft"
    - 3–8 ft      → "shallow_3_8ft"
    - 8–15 ft     → "mid_8_15ft"
    - 15–25 ft    → "deep_15_25ft"
    - 25+ ft      → "very_deep_25plus"
    """
    if depth_ft is None:
        return None

    if depth_ft < 3.0:
        return "ultra_shallow_0_3ft"
    if depth_ft < 8.0:
        return "shallow_3_8ft"
    if depth_ft < 15.0:
        return "mid_8_15ft"
    if depth_ft < 25.0:
        return "deep_15_25ft"
    return "very_deep_25plus"


from typing import Optional

from .context import FusedContext
from .schemas import ElitePatternResponse


def _classify_vision_depth_zone(depth_ft: float) -> str:
    """
    Coarse depth zone for vision, separate from the rules-engine depth zoning.
    """
    if depth_ft <= 5:
        return "shallow"
    if depth_ft <= 15:
        return "mid"
    return "deep"


def _classify_vision_depth_band(depth_ft: float) -> str:
    """
    Finer-grained depth band for vision (for UI / debug).
    """
    if depth_ft <= 3:
        return "0-3"
    if depth_ft <= 8:
        return "4-8"
    if depth_ft <= 15:
        return "9-15"
    if depth_ft <= 25:
        return "16-25"
    return "25+"


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
        * lightly bias targets toward what vision is seeing (append-only)
        * lightly bias lures toward what vision is seeing (append-only)
        * append a couple of hints to gameplan/adjustments

    NOTE: We currently do NOT override the core depth_zone. The rules engine
    remains the canonical source for depth_zone; vision depth is advisory and
    exposed via conditions["vision_depth_zone"] and conditions["vision_depth_band"].
    """

    # No vision/fusion context provided → behave exactly as before.
    if fused is None:
        return base_pattern

    # Prefer a "raw" sonar depth_ft attribute if present (set by the route),
    # otherwise fall back to whatever depth_ft fusion put on the vision context.
    raw_depth_ft = getattr(fused.vision, "raw_depth_ft", fused.vision.depth_ft)

    # --- 0) Compute vision depth zone + band (advisory only) --------------
    original_depth_zone = base_pattern.depth_zone
    vision_depth_zone = _classify_vision_depth_zone(raw_depth_ft)
    vision_depth_band = _classify_vision_depth_band(raw_depth_ft)

    # --- 1) Enrich conditions with vision/fusion details -------------------
    conditions = dict(base_pattern.conditions or {})

    # Preserve what the rules engine originally decided.
    conditions.setdefault("base_depth_zone", original_depth_zone)

    # Simple boolean flag to indicate this pattern was vision-enhanced
    conditions["vision_enhanced"] = True

    # Expose the vision-derived depth zone (coarse) and band (detailed)
    if vision_depth_zone is not None:
        conditions["vision_depth_zone"] = vision_depth_zone
    if vision_depth_band is not None:
        conditions["vision_depth_band"] = vision_depth_band

    # Compact snapshot to make QA and UI wiring easier
    conditions["vision_debug"] = {
        "depth_ft": raw_depth_ft,
        "depth_zone": vision_depth_zone,
        "depth_band": vision_depth_band,
        "activity_level": fused.vision.activity_level,
        "should_camp": fused.should_camp,
        "confidence": fused.confidence_level,
    }

    # High-level summary
    conditions["vision_summary"] = {
        "should_camp": fused.should_camp,
        "likely_quality_bite_zone": fused.likely_quality_bite_zone,
        "confidence_level": fused.confidence_level,
    }

    # Raw-ish sonar signals for transparency / debug (use raw_depth_ft here too)
    conditions["vision_signals"] = {
        "depth_ft": raw_depth_ft,
        "arch_count": fused.vision.arch_count,
        "activity_level": fused.vision.activity_level,
        "bait_present": fused.vision.bait_present,
        "bottom_hardness": fused.vision.bottom_hardness,
        "stop_or_keep_moving": fused.vision.stop_or_keep_moving,
    }

    # Direct vision block for UI consumption (clean, stable shape)
    conditions["vision"] = {
        "depth_ft": raw_depth_ft,
        "arch_count": fused.vision.arch_count,
        "activity_level": fused.vision.activity_level,
        "bait_present": fused.vision.bait_present,
        "bottom_hardness": fused.vision.bottom_hardness,
        "stop_or_keep_moving": fused.vision.stop_or_keep_moving,
    }

    # --- Weather block: adapt to new WeatherContext shape ------------------
    # WeatherContext now uses: temp_f, wind_speed, sky_condition, timestamp.
    # We still expose 'wind_mph' and 'cloud_cover' in the response for
    # backward-compatible JSON, but read from the new attribute names.
    temp_f = getattr(fused.weather, "temp_f", None)

    wind_mph = getattr(fused.weather, "wind_mph", None)
    if wind_mph is None:
        wind_mph = getattr(fused.weather, "wind_speed", None)

    cloud_cover = getattr(fused.weather, "cloud_cover", None)
    if cloud_cover is None:
        cloud_cover = getattr(fused.weather, "sky_condition", None)

    conditions["fusion"] = {
        "sonar": {
            "depth_ft": raw_depth_ft,
            "arch_count": fused.vision.arch_count,
            "activity_level": fused.vision.activity_level,
            "bait_present": fused.vision.bait_present,
            "bottom_hardness": fused.vision.bottom_hardness,
            "stop_or_keep_moving": fused.vision.stop_or_keep_moving,
        },
        "weather": {
            "temp_f": temp_f,
            "wind_mph": wind_mph,
            "cloud_cover": cloud_cover,
        },
        "strength": fused.confidence_level,
        "should_camp": fused.should_camp,
        "likely_quality_bite_zone": fused.likely_quality_bite_zone,
    }

    # --- 2) Light-touch content nudges (targets, lures, gameplan, adjustments)
    # For now we keep these very minimal and additive.

    # Copy lists so we don't mutate the original Pydantic instance internals
    gameplan = list(base_pattern.gameplan or [])
    adjustments = list(base_pattern.adjustments or [])
    targets = list(base_pattern.recommended_targets or [])
    lures = list(base_pattern.recommended_lures or [])

    # Example: if sonar suggests "should_camp", reinforce that in gameplan
    if fused.should_camp:
        gameplan.append(
            "Vision suggests quality fish are present—commit more time to this area before running new water."
        )
    else:
        gameplan.append(
            "Vision suggests more of a roaming/low-commitment situation—keep a quicker rotation through spots."
        )

    # Example adjustment note using the advisory vision depth zone
    adjustments.append(
        f"Use sonar depth (~{raw_depth_ft:.1f} ft, {vision_depth_zone} zone) as a sanity check against your "
        "rules-based depth focus; if they disagree and bites are scarce, trust the sonar for a while."
    )

    # Example: nudge targets with a simple sonar-informed hint
    targets.append(
        f"Vision indicates consistent marks around ~{raw_depth_ft:.1f} ft—ensure you have at least one key area in that band."
    )

    # Example: soft lure hint based on activity level
    if fused.vision.activity_level == "high":
        lures.append("add a faster-moving search bait to capitalize on active fish")
    elif fused.vision.activity_level == "low":
        lures.append("add a slower, more subtle presentation to tempt inactive fish")

    # De-duplicate lists while preserving order
    def _dedupe(seq):
        seen = set()
        out = []
        for x in seq:
            if x not in seen:
                seen.add(x)
                out.append(x)
        return out

    return ElitePatternResponse(
        phase=base_pattern.phase,
        depth_zone=base_pattern.depth_zone,
        recommended_lures=_dedupe(lures),
        recommended_targets=_dedupe(targets),
        strategy_tips=_dedupe(list(base_pattern.strategy_tips or [])),
        color_recommendations=list(base_pattern.color_recommendations or []),
        lure_setups=list(base_pattern.lure_setups or []),
        notes=base_pattern.notes,
        gameplan=_dedupe(gameplan),
        adjustments=_dedupe(adjustments),
        conditions=conditions,
    )
