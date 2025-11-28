from typing import Any, Dict, Optional
from pydantic import BaseModel


class OnWaterVisionResult(BaseModel):
    """
    Elite+ on-water snapshot result.

    This is what the computer vision layer should produce
    from a bank/boat photo.
    """
    water_clarity: str
    visible_structure: str
    vegetation: str
    bank_angle: str
    shade_cover: str
    light_penetration: str
    worth_fishing: bool
    raw_attributes: Dict[str, Any]


class FishfinderVisionResult(BaseModel):
    """
    Elite+ fishfinder snapshot result.
    """
    depth_ft: float
    bottom_hardness: str
    bait_presence: str
    fish_activity_level: str
    arch_count: int
    stop_or_keep_moving: str
    raw_attributes: Dict[str, Any]


class VisionApplyToPatternRequest(BaseModel):
    """
    Used when the client wants to inject vision results into
    an existing pattern's conditions block (from Pro/Elite).
    """
    pattern_conditions: Dict[str, Any]
    on_water: Optional[OnWaterVisionResult] = None
    fishfinder: Optional[FishfinderVisionResult] = None


class VisionApplyToPatternResponse(BaseModel):
    updated_conditions: Dict[str, Any]
    notes: str
