from typing import List, Dict, Any

from .schemas import BasicPatternRequest, BasicPatternResponse
# You can use either the engine version or your domain version
# but we KNOW the engine one returns the dict shape your tests use:
from app.engines.pattern.logic import build_basic_pattern_summary, build_targets_and_tips


def build_basic_pattern(req: BasicPatternRequest) -> BasicPatternResponse:
    """
    Domain-level wrapper around the engine's build_basic_pattern_summary.

    The engine returns a dict; we map it into BasicPatternResponse and
    compute targets using the same engine-style helper.
    """
    summary: Dict[str, Any] = build_basic_pattern_summary(
        temp_f=req.temp_f,
        month=req.month,
        clarity=req.clarity,
        wind_speed=req.wind_speed,
    )

    phase = summary["phase"]
    depth_zone = summary["depth_zone"]
    recommended_techniques: List[str] = summary["recommended_techniques"]
    notes: str = summary.get("notes", "")

    # build_targets_and_tips returns a dict with "recommended_targets" and "strategy_tips"
    targets_result = build_targets_and_tips(
        phase=phase,
        depth_zone=depth_zone,
        clarity=req.clarity,
        wind_speed=req.wind_speed,
        bottom_composition=None,
    )

    # Defensive handling in case this ever changes
    if isinstance(targets_result, dict):
        targets = targets_result.get("recommended_targets", [])
    elif isinstance(targets_result, (list, tuple)):
        # e.g. (targets, tips) fallback shape
        targets = targets_result[0] if len(targets_result) >= 1 else []
    else:
        targets = []

    return BasicPatternResponse(
        phase=phase,
        depth_zone=depth_zone,
        recommended_techniques=recommended_techniques,
        targets=targets,
        notes=notes,
    )
