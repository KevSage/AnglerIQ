# app/api/pattern/pro.py

from fastapi import APIRouter

from app.domain.pattern.schemas import ProPatternRequest, ProPatternResponse
from app.domain.pattern import logic_pro

router = APIRouter(prefix="/pattern", tags=["pro"])


@router.post("/pro", response_model=ProPatternResponse)
async def pattern_pro(payload: ProPatternRequest) -> ProPatternResponse:
    """
    Pro Pattern-of-the-Day endpoint.

    Canon rules:
    - Pattern logic lives in logic_pro only
    - Weather/conditions are resolved INSIDE logic_pro
    - This endpoint does NOT fetch or mutate conditions
    - This endpoint is a thin orchestration layer
    """

    # Single source of truth
    return logic_pro.build_pro_pattern(payload)