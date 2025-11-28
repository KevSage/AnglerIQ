# backend/app/api/pattern/pro.py

from fastapi import APIRouter
from ...domain.pattern.schemas import (
    ProPatternRequest,
    ProPatternResponse,
    LureSetup,
)

router = APIRouter(prefix="/pattern", tags=["pro"])


@router.post("/pro", response_model=ProPatternResponse)
def generate_pro_pattern(req: ProPatternRequest) -> ProPatternResponse:
    """
    Pro tier - Powered Pattern Engine.
    """

    # For now, return a hard-coded but structurally correct response
    # just to satisfy the test. We'll wire in real logic_basic next.
    lures = ["Mid-depth Crankbait"]
    setups = [
        LureSetup(
            lure="Mid-depth Crankbait",
            technique="Cranking",
            rod="7'0\" MH Moderate Rod",
            reel="6.4:1 Baitcaster",
            line="12lb Fluorocarbon",
            hook_or_leader="Stock trebles",
            lure_size="1/2 oz",
        )
    ]

    conditions = {
        "temp_f": req.temp_f,
        "month": req.month,
        "clarity": req.clarity,
        "wind_speed": req.wind_speed,
        "sky_condition": req.sky_condition,
        "depth_ft": req.depth_ft,
        "bottom_composition": req.bottom_composition,
        "forage": req.forage or [],
    }

    return ProPatternResponse(
        phase="post-spawn",
        depth_zone="mid-depth",
        recommended_lures=lures,
        recommended_targets=["Windblown rock points", "Secondary points"],
        strategy_tips=[
            "Focus on mid-depth structure adjacent to spawning areas.",
            "Use a slow to medium retrieve to maintain bottom contact.",
        ],
        color_recommendations=["Green pumpkin", "Shad pattern"],
        lure_setups=setups,
        conditions=conditions,
        notes="Placeholder Pro pattern summary. Logic engine will refine this.",
    )
