# app/api/pattern/vision_tier.py

from typing import Any, Dict

from fastapi import APIRouter, HTTPException

from app.domain.pattern.schemas import ElitePatternRequest, ElitePatternResponse
from app.domain.pattern.context import VisionContext
from app.domain.pattern.logic_elite import build_elite_pattern

router = APIRouter()


@router.post("/pattern/vision-tier", response_model=ElitePatternResponse)
def pattern_vision_tier(payload: Dict[str, Any]) -> ElitePatternResponse:
    """
    Vision-tier = Elite + Vision fusion.

    Request shape (used by the mobile app / frontend):

    {
      "pattern": {
        ...ElitePatternRequest fields...
      },
      "vision": {
        ...VisionContext fields (depth_ft, arch_count, activity_level, etc.)...
      }
    }

    Response shape is a standard ElitePatternResponse, with Vision / fusion
    details exposed inside `conditions`.
    """
    # Defensive guard for malformed requests
    if "pattern" not in payload or "vision" not in payload:
        raise HTTPException(
            status_code=422,
            detail="Request body must include 'pattern' and 'vision' objects.",
        )

    pattern_req = ElitePatternRequest(**payload["pattern"])
    vision_req = VisionContext(**payload["vision"])

    elite_result = build_elite_pattern(pattern_req, vision_ctx=vision_req)
    return elite_result
