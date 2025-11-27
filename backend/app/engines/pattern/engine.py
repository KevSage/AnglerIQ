# app/engines/pattern/engine.py

from .logic import (
    classify_phase,
    recommend_lures,
    infer_depth_zone,
    adjust_lures_for_clarity_and_bottom,
    build_targets_and_tips,
)


class PatternEngine:
    """
    Thin wrapper around the pattern logic functions.

    For now this just centralizes the logic that your /pattern/basic
    and /pattern/pro routes already use. We are NOT changing behavior,
    just moving it behind a class so we can evolve tiers later.
    """

    def build_basic_summary(
        self,
        *,
        temp_f: float,
        month: int,
        clarity: str,
        wind_speed: float,
        bottom_composition: str | None,
    ) -> dict:
        """
        Copy the existing 'basic' pattern dict construction here.

        IMPORTANT: keep the returned keys EXACTLY the same as your current
        /pattern/basic route so tests keep passing.
        """
        phase = classify_phase(temp_f, month)
        depth_zone = infer_depth_zone(phase, None)

        # 👉 Replace this return with whatever your current basic route returns.
        return {
            "phase": phase,
            "depth_zone": depth_zone,
            "clarity": clarity,
            "wind_speed": wind_speed,
            "bottom_composition": bottom_composition,
        }

    def build_pro_summary(
        self,
        *,
        temp_f: float,
        month: int,
        clarity: str,
        wind_speed: float,
        bottom_composition: str | None,
        depth_ft: float | None,
        sky_condition: str | None,
    ) -> dict:
        """
        Copy the existing 'pro' pattern dict construction here.

        Again: keep returned keys IDENTICAL to what your /pattern/pro
        route currently sends to the frontend.
        """
        phase = classify_phase(temp_f, month)
        depth_zone = infer_depth_zone(phase, depth_ft)

        base_lures = recommend_lures(phase)
        lures = adjust_lures_for_clarity_and_bottom(
            base_lures,
            clarity,
            bottom_composition,
            wind_speed,
        )
        targets_and_tips = build_targets_and_tips(
            phase,
            depth_zone,
            clarity,
            wind_speed,
            bottom_composition,
        )

        # 👉 Replace/extend this dict with whatever your pro route currently returns.
        return {
            "phase": phase,
            "depth_zone": depth_zone,
            "clarity": clarity,
            "wind_speed": wind_speed,
            "bottom_composition": bottom_composition,
            "lures": lures,
            **targets_and_tips,
        }
