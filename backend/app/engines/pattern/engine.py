

# app/engines/pattern/engine.py

from app.domain.pattern.schemas import BasicPatternRequest, BasicPatternResponse
from app.domain.pattern.logic_common import (
    classify_phase,
    infer_depth_zone,
    build_targets_and_tips,
)


class PatternEngine:
    """
    Central place for pattern-building logic.

    For now we only implement the Basic pattern logic here,
    moved over from app.domain.pattern.logic_basic.build_basic_pattern.
    Later we'll add Pro/Elite methods as well.
    """

    def build_basic_pattern(self, req: BasicPatternRequest) -> BasicPatternResponse:
        """
        Build the Basic pattern response.

        This is almost a direct copy of the previous
        app.domain.pattern.logic_basic.build_basic_pattern implementation,
        just relocated into the engine layer.
        """
        phase = classify_phase(req.temp_f, req.month)
        depth_zone = infer_depth_zone(phase, None)

        techniques: list[str] = []

        if phase == "pre-spawn":
            techniques = ["spinnerbait", "lipless crankbait", "jig"]
        elif phase == "spawn/post-spawn":
            techniques = ["weightless fluke", "texas rig", "wacky rig"]
        elif phase == "summer":
            techniques = ["deep crankbait", "carolina rig", "big worm"]
        elif phase == "winter":
            techniques = ["jerkbait", "finesse jig", "blade bait"]
        else:
            techniques = ["moving bait (swimbait, crankbait)", "spinnerbait"]

        tips_targets = build_targets_and_tips(
            phase=phase,
            depth_zone=depth_zone,
            clarity=req.clarity,
            wind_speed=req.wind_speed,
            bottom_composition=None,
        )

        targets = tips_targets["recommended_targets"]

        return BasicPatternResponse(
            phase=phase,
            depth_zone=depth_zone,
            techniques=techniques,
            recommended_targets=targets_tips["recommended_targets"],
            strategy_tips=targets_tips["strategy_tips"],
            conditions={ ... },
            notes=notes,
        )