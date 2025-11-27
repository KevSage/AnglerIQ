from .schemas import ProPatternRequest, ProPatternResponse
from .logic_common import (
    classify_phase,
    infer_depth_zone,
    recommend_lures,
    adjust_lures_for_clarity_and_bottom,
    build_targets_and_tips,
)
from .gear_presets import build_pro_setups_for_lures


def build_pro_pattern(req: ProPatternRequest) -> ProPatternResponse:
    phase = classify_phase(req.temp_f, req.month)
    depth_zone = infer_depth_zone(phase, req.depth_ft)

    base_lures = recommend_lures(phase)
    adjusted_lures = adjust_lures_for_clarity_and_bottom(
        base_lures=base_lures,
        clarity=req.clarity,
        bottom_composition=req.bottom_composition,
        wind_speed=req.wind_speed,
    )

    targets_tips = build_targets_and_tips(
        phase=phase,
        depth_zone=depth_zone,
        clarity=req.clarity,
        wind_speed=req.wind_speed,
        bottom_composition=req.bottom_composition,
    )

    setups = build_pro_setups_for_lures(adjusted_lures)

    notes = (
        "This is a first-pass Pro pattern suggestion based on phase, clarity, "
        "wind, and depth. On-the-water adjustments and SAGE AI Assistant will refine this further."
    )

    return ProPatternResponse(
        phase=phase,
        depth_zone=depth_zone,
        recommended_lures=adjusted_lures,
        recommended_targets=targets_tips["recommended_targets"],
        strategy_tips=targets_tips["strategy_tips"],
        color_recommendations=[],  # you can wire your existing color logic here
        lure_setups=setups,
        conditions={
            "temp_f": req.temp_f,
            "month": req.month,
            "clarity": req.clarity,
            "wind_speed": req.wind_speed,
            "sky_condition": req.sky_condition,
            "depth_ft": req.depth_ft,
            "bottom_composition": req.bottom_composition,
        },
        notes=notes,
    )
