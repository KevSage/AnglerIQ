from typing import List, Dict, Any

from .schemas import ProPatternRequest, ProPatternResponse, LureSetup
from app.engines.pattern.logic import build_pattern_summary  # 👈 key import


def build_pro_pattern(req: ProPatternRequest) -> ProPatternResponse:
    """
    Domain-level wrapper around the existing engine's build_pattern_summary.

    The engine returns a dict; we map it into the ProPatternResponse Pydantic model.
    """
    summary: Dict[str, Any] = build_pattern_summary(
        temp_f=req.temp_f,
        month=req.month,
        clarity=req.clarity,
        wind_speed=req.wind_speed,
        sky_condition=req.sky_condition,
        depth_ft=req.depth_ft,
        bottom_composition=req.bottom_composition,
        lake_type=None,          # or wire this later if/when you add it
        forage=req.forage,       # 🔥 new line
    )

    # Extract fields from engine summary (already tested in test_pattern_logic.py)
    phase = summary["phase"]
    depth_zone = summary["depth_zone"]
    recommended_lures = summary["recommended_lures"]
    recommended_targets = summary["recommended_targets"]
    strategy_tips = summary["strategy_tips"]
    color_recommendations = summary["color_recommendations"]
    conditions = summary["conditions"]
    notes = summary["notes"]

    # Lure setups come back as list[dict]; convert to list[LureSetup]
    lure_setups_raw = summary["lure_setups"]
    lure_setups: List[LureSetup] = [LureSetup(**s) for s in lure_setups_raw]

    return ProPatternResponse(
        phase=phase,
        depth_zone=depth_zone,
        recommended_lures=recommended_lures,
        recommended_targets=recommended_targets,
        strategy_tips=strategy_tips,
        color_recommendations=color_recommendations,
        lure_setups=lure_setups,
        conditions=conditions,
        notes=notes,
    )
