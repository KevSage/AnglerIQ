# app/engines/pattern/engine.py

"""
Thin wrapper around the pattern logic functions.

Right now this is just a convenience layer so that routes (and later,
other engines or the assistant) can work with a single PatternEngine
object instead of importing functions directly.

Behavior is intentionally identical to calling the functions in logic.py.
We can gradually evolve this into more structured "basic / pro / elite"
builders without changing the underlying logic.
"""

from typing import Optional, List

from .logic import (
    classify_phase,
    recommend_lures,
    infer_depth_zone,
    adjust_lures_for_clarity_and_bottom,
    build_targets_and_tips,
)


class PatternEngine:
    """
    Thin OO wrapper over the existing pattern logic.

    For now, this mostly forwards to the underlying functions. Later,
    we'll add richer helpers like `build_basic_summary(...)`,
    `build_pro_summary(...)`, etc.
    """

    def classify_phase(self, temp_f: float, month: int) -> str:
        return classify_phase(temp_f, month)

    def recommend_lures(self, phase: str) -> List[str]:
        return recommend_lures(phase)

    def infer_depth_zone(self, phase: str, depth_ft: Optional[float]) -> str:
        return infer_depth_zone(phase, depth_ft)

    def adjust_lures_for_clarity_and_bottom(
        self,
        base_lures: List[str],
        clarity: str,
        bottom_composition: Optional[str],
        wind_speed: float,
    ) -> List[str]:
        return adjust_lures_for_clarity_and_bottom(
            base_lures=base_lures,
            clarity=clarity,
            bottom_composition=bottom_composition,
            wind_speed=wind_speed,
        )

    def build_targets_and_tips(
        self,
        phase: str,
        depth_zone: str,
        clarity: str,
        wind_speed: float,
        bottom_composition: Optional[str],
    ) -> dict:
        return build_targets_and_tips(
            phase=phase,
            depth_zone=depth_zone,
            clarity=clarity,
            wind_speed=wind_speed,
            bottom_composition=bottom_composition,
        )
