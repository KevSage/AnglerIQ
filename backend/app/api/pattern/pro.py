from fastapi import APIRouter

from app.domain.pattern.schemas import ProPatternRequest, ProPatternResponse
from app.domain.pattern import logic_pro

router = APIRouter(prefix="/pattern", tags=["pro"])


@router.post("/pro", response_model=ProPatternResponse)
async def pattern_pro(payload: ProPatternRequest) -> ProPatternResponse:
    return logic_pro.build_pro_pattern(payload)
