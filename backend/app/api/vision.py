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


# ---------- Stub Endpoints ----------


@router.post("/on-water")
def on_water_stub(_: OnWaterStubRequest) -> Dict[str, Any]:
    """
    Simple deterministic stub used by tests.

    Returns a fixed on-water read with the keys the tests expect.
    """
    return {
        "water_clarity": "stained",
        "visible_structure": "riprap",
        "vegetation": "sparse",
        "bank_angle": "moderate",
        "shade_cover": "low",
        "light_penetration": "medium",
        "worth_fishing": True,
        "raw_attributes": {},
    }


@router.post("/fishfinder")
def fishfinder_stub(_: FishfinderStubRequest) -> Dict[str, Any]:
    """
    Deterministic sonar stub.

    Tests expect depth_ft, arch_count, activity_level, bait_present,
    bottom_hardness, and stop_or_keep_moving.
    """
    return {
        "depth_ft": 12.5,
        "arch_count": 5,
        "activity_level": "medium",
        "bait_present": True,
        "bottom_hardness": "hard",
        "stop_or_keep_moving": "stop",
    }


@router.post("/apply-to-pattern")
def apply_vision_to_pattern(payload: ApplyVisionRequest) -> Dict[str, Any]:
    conditions = dict(payload.pattern_conditions)

    # Basic flags
    conditions["vision_enhanced"] = True
    conditions["vision_applied"] = True

    # Echo the on-water read into a dedicated field for the pattern
    # (tests expect this key to exist)
    conditions["vision_on_water"] = payload.on_water or {}

    # If a depth_zone exists, reuse it; otherwise fall back to a generic band
    conditions.setdefault("vision_depth_zone", conditions.get("depth_zone", "mid_band"))

    # Very simple summary block
    conditions["vision_summary"] = {
        "should_camp": payload.on_water.get("worth_fishing", True)
        if payload.on_water
        else True,
        "likely_quality_bite_zone": "primary",
        "confidence_level": "medium",
    }

    return {"updated_conditions": conditions}