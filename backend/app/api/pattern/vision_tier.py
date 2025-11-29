from __future__ import annotations

from typing import Any, Dict

from fastapi import APIRouter

from app.domain.pattern.schemas import ElitePatternRequest, ElitePatternResponse
from app.domain.pattern.logic_vision import build_vision_tier_pattern

router = APIRouter()


@router.post(
    "/pattern/vision-tier",
    response_model=ElitePatternResponse,
)
def pattern_vision_tier(payload: Dict[str, Any]) -> ElitePatternResponse:
    """
    Vision-tier endpoint.

    Expects payload of the form:

    {
      "pattern": { ... fields for ElitePatternRequest ... },
      "vision": {
        "depth_ft": 12.5,
        "arch_count": 5,
        "activity_level": "medium",
        "bait_present": true,
        "bottom_hardness": "hard",
        "stop_or_keep_moving": "stop"
      }
    }

    All fusion + vision adjustments are handled in the domain layer
    (logic_vision → build_vision_tier_pattern → build_elite_pattern).
    """

    pattern_raw = payload.get("pattern", {})
    vision_raw = payload.get("vision", {})

    elite_req = ElitePatternRequest(**pattern_raw)

    # domain layer handles dict → VisionContext + fusion
    result = build_vision_tier_pattern(elite_req, vision=vision_raw)

    return result
