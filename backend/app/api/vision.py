from fastapi import APIRouter

from app.domain.vision.schemas import (
    OnWaterVisionResult,
    FishfinderVisionResult,
    VisionApplyToPatternRequest,
    VisionApplyToPatternResponse,
)

router = APIRouter(prefix="/vision", tags=["vision"])


@router.post("/on-water", response_model=OnWaterVisionResult)
async def analyze_on_water_snapshot(_: dict) -> OnWaterVisionResult:
    """
    Elite+: On-water snapshot analysis (stub).

    NOTE:
    - We intentionally accept a plain JSON body instead of UploadFile to avoid
      requiring the python-multipart dependency in this backend slice.
    - In a future version, this can be changed to accept real image uploads.
    """
    return OnWaterVisionResult(
        water_clarity="stained",
        visible_structure="rock with scattered wood",
        vegetation="sparse shoreline grass",
        bank_angle="moderate",
        shade_cover="partial",
        light_penetration="medium",
        worth_fishing=True,
        raw_attributes={"stub": True},
    )


@router.post("/fishfinder", response_model=FishfinderVisionResult)
async def analyze_fishfinder_snapshot(_: dict) -> FishfinderVisionResult:
    """
    Elite+: Fishfinder snapshot MVP (stub).

    Also accepts JSON only for now, for the same dependency reason.
    """
    return FishfinderVisionResult(
        depth_ft=18.0,
        bottom_hardness="medium",
        bait_presence="moderate",
        fish_activity_level="medium",
        arch_count=3,
        stop_or_keep_moving="stop_and_fish",
        raw_attributes={"stub": True},
    )


@router.post("/apply-to-pattern", response_model=VisionApplyToPatternResponse)
async def apply_vision_to_pattern(
    payload: VisionApplyToPatternRequest,
) -> VisionApplyToPatternResponse:
    """
    Elite+: Inject vision findings into an existing pattern's conditions.

    For now:
    - We simply attach vision results into the conditions dict.
    - Future versions will actually modify depth, targets, and lures using these insights.
    """
    conditions = dict(payload.pattern_conditions or {})
    conditions["vision_applied"] = True

    if payload.on_water is not None:
        conditions["vision_on_water"] = payload.on_water.dict()

    if payload.fishfinder is not None:
        conditions["vision_fishfinder"] = payload.fishfinder.dict()

    notes = (
        "Vision results have been attached to the pattern conditions. "
        "In a future version, this endpoint will adjust depth, targets, and lures "
        "based on the vision insights."
    )

    return VisionApplyToPatternResponse(
        updated_conditions=conditions,
        notes=notes,
    )
