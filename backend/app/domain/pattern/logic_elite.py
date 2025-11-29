from __future__ import annotations

from datetime import datetime
from typing import Any, List, Optional

from app.domain.pattern.schemas import (
    ProPatternResponse,
    ElitePatternRequest,
    ElitePatternResponse,
)
from .logic_pro import build_pro_pattern
from .vision_adjustments import apply_vision_adjustments

# NEW: fusion + context builders (not used yet)
from .context import WeatherContext, VisionContext, FusedContext
from .fusion import fuse_weather_and_vision
from .builders import build_weather_context, build_vision_context

# ---------------------------------------------------------------------------
# Helper: normalize time of day
# ---------------------------------------------------------------------------

def _normalize_time_of_day(
    time_of_day: Optional[str],
    weather_timestamp: Optional[datetime] = None,
) -> str:
    """
    Normalize time_of_day into one of:
    - "dawn"
    - "morning"
    - "midday"
    - "afternoon"
    - "evening"
    - "night"

    If time_of_day is not provided, we *could* infer it from a timestamp.
    For now, tests only rely on "dawn" staying "dawn".
    """
    if time_of_day:
        t = time_of_day.lower().strip()

        if t in ("dawn", "sunrise", "first_light"):
            return "dawn"
        if t in ("morning", "am", "early_morning"):
            return "morning"
        if t in ("midday", "noon", "mid-day"):
            return "midday"
        if t in ("afternoon", "pm"):
            return "afternoon"
        if t in ("evening", "dusk", "sunset"):
            return "evening"
        if t in ("night", "after_dark"):
            return "night"

        # fallback to lower-cased if unknown
        return t

    # If we wanted to infer from timestamp, we’d use weather_timestamp here.
    if weather_timestamp is None:
        # safe, generic default
        return "afternoon"

    hour = weather_timestamp.hour

    if 5 <= hour < 8:
        return "dawn"
    if 8 <= hour < 11:
        return "morning"
    if 11 <= hour < 14:
        return "midday"
    if 14 <= hour < 18:
        return "afternoon"
    if 18 <= hour < 21:
        return "evening"
    return "night"


# ---------------------------------------------------------------------------
# Core: Pro → Elite layering
# ---------------------------------------------------------------------------

def _add_elite_only_layers(
    pro_result: ProPatternResponse,
    req: ElitePatternRequest,
) -> ElitePatternResponse:
    """
    Take a ProPatternResponse and layer on Elite-only context:
    - gameplan: a simple, ordered plan the angler can follow
    - adjustments: what to do as conditions change
    - conditions: merged Pro conditions + Elite session context
    """
    base_conditions = pro_result.conditions or {}

    # Build session context from Elite-only inputs
    session_context = {}

    if req.time_of_day is not None:
        session_context["time_of_day"] = req.time_of_day
    if req.pressure_trend is not None:
        session_context["pressure_trend"] = req.pressure_trend
    if req.water_level_trend is not None:
        session_context["water_level_trend"] = req.water_level_trend

    # always expose tournament_mode
    session_context["tournament_mode"] = req.tournament_mode

    # Start with Pro conditions, then override tier and add session_context / normalized time
    conditions = dict(base_conditions)
    conditions["tier"] = "elite"

    if req.time_of_day is not None:
        conditions["time_of_day_normalized"] = _normalize_time_of_day(
            req.time_of_day,
            weather_timestamp=None,
        )

    if session_context:
        conditions["session_context"] = session_context

    # Simple V1 gameplan based on Pro output
    first_target = (
        pro_result.recommended_targets[0]
        if pro_result.recommended_targets
        else "high-percentage cover"
    )

    gameplan: List[str] = [
        (
            f"Start on {pro_result.depth_zone} targets at "
            f"{req.time_of_day or 'prime hours'}, focusing on {first_target}."
        ),
        "Rotate through your top confidence baits and cover water methodically.",
    ]

    # Simple V1 adjustments list
    adjustments: List[str] = [
        "If fish slow down, switch to more subtle presentations and slow your retrieve.",
        "If wind or falling pressure picks up, lean into moving baits and cover more water.",
    ]

    return ElitePatternResponse(
        phase=pro_result.phase,
        depth_zone=pro_result.depth_zone,
        recommended_lures=pro_result.recommended_lures,
        recommended_targets=pro_result.recommended_targets,
        strategy_tips=pro_result.strategy_tips,
        color_recommendations=pro_result.color_recommendations,
        lure_setups=pro_result.lure_setups,
        notes=pro_result.notes,
        gameplan=gameplan,
        adjustments=adjustments,
        conditions=conditions,
    )


# ---------------------------------------------------------------------------
# Public entrypoint: build_elite_pattern
# ---------------------------------------------------------------------------

def build_elite_pattern(
    req: ElitePatternRequest,
    vision_ctx: Any = None,
) -> ElitePatternResponse:
    """
    Elite includes all Pro logic.

    Vision is optional:
    - If provided, we build a WeatherContext + FusedContext and pass that into
      the vision adjustment hook.
    - If not provided, we behave exactly like Pro + Elite-only layers.
    """

    # 1) Build Pro-level base pattern
    pro_result: ProPatternResponse = build_pro_pattern(req)

    # 2) Add Elite-only layers (gameplan, adjustments, extra conditions)
    elite_base: ElitePatternResponse = _add_elite_only_layers(pro_result, req)

    # 3) Optionally build a fused context if vision_ctx is provided
    fused_ctx: Optional[FusedContext] = None

    if vision_ctx is not None:
        # Ensure we have a VisionContext instance
        if isinstance(vision_ctx, VisionContext):
            v_ctx = vision_ctx
        elif isinstance(vision_ctx, dict):
            # best-effort coercion from dict; safe defaults inside builder
            v_ctx = build_vision_context(**vision_ctx)
        else:
            # Unknown type; fall back to default VisionContext
            v_ctx = build_vision_context()

        # For now, WeatherContext uses defaults; later we’ll feed real weather
        w_ctx: WeatherContext = build_weather_context()

        fused_ctx = fuse_weather_and_vision(w_ctx, v_ctx)

    # 4) Apply vision adjustments (currently a no-op; returns elite_base unchanged)
    elite_with_vision = apply_vision_adjustments(elite_base, fused_ctx)

    return elite_with_vision

