# app/api/vision.py

from __future__ import annotations

from typing import Any, Dict, Optional

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/vision", tags=["vision"])


# ---------- Request Models ----------


class OnWaterStubRequest(BaseModel):
    # Tests send {"stub": True}, but we ignore the content.
    stub: Optional[bool] = None


class FishfinderStubRequest(BaseModel):
    stub: Optional[bool] = None


class ApplyVisionRequest(BaseModel):
    """
    Shape matches tests/test_routes_vision.py:

    {
        "pattern_conditions": {...},
        "on_water": {...},     # optional
        "fishfinder": {...}    # optional, future-proof
    }
    """

    pattern_conditions: Dict[str, Any]
    on_water: Optional[Dict[str, Any]] = None
    fishfinder: Optional[Dict[str, Any]] = None


# ---------- Responses ----------


@router.post("/on-water")
async def vision_on_water_stub(
    payload: OnWaterStubRequest,
) -> Dict[str, Any]:
    """
    Stubbed on-water vision endpoint.

    Tests call this with JSON and only expect:
    - 200 status
    - A predictable, simple shape with known keys.
    """
    return {
        "water_clarity": "stained",
        "visible_structure": "riprap",
        "vegetation": "none",
        "bank_angle": "steep",
        "shade_cover": "low",
        "light_penetration": "medium",
        "worth_fishing": True,
        "raw_attributes": {},
    }


@router.post("/fishfinder")
async def vision_fishfinder_stub(
    payload: FishfinderStubRequest,
) -> Dict[str, Any]:
    """
    Stubbed fishfinder / sonar vision endpoint.

    Shape is driven by tests in tests/test_routes_vision.py.
    """
    return {
        "depth_ft": 14.0,
        "bottom_hardness": "hard",
        "bait_present": True,
        "fish_present": True,
        "arch_count": 7,
        "activity_level": "medium",
        "worth_fishing": True,
        "stop_or_keep_moving": "keep_moving",  # 👈 REQUIRED BY TESTS
        "raw_attributes": {},
    }



@router.post("/apply-to-pattern")
async def apply_vision_to_pattern(
    req: ApplyVisionRequest,
) -> Dict[str, Any]:
    conditions = dict(req.pattern_conditions)  # shallow copy

    has_on_water = req.on_water is not None
    has_fishfinder = req.fishfinder is not None

    if has_on_water:
        conditions["vision_on_water"] = req.on_water

    if has_fishfinder:
        conditions["vision_fishfinder"] = req.fishfinder

    conditions["vision_flags"] = {
        "has_on_water": has_on_water,
        "has_fishfinder": has_fishfinder,
        "fusion_ready": has_on_water and has_fishfinder,
    }

    # NEW: explicit flag the tests expect
    conditions["vision_applied"] = bool(has_on_water or has_fishfinder)

    return {"updated_conditions": conditions}
