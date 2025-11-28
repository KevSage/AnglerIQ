from fastapi import APIRouter

from app.domain.pattern.schemas import ElitePatternRequest, ElitePatternResponse
from app.domain.pattern import logic_elite

router = APIRouter(prefix="/pattern", tags=["elite"])


@router.post("/elite", response_model=ElitePatternResponse)
async def pattern_elite(payload: ElitePatternRequest) -> ElitePatternResponse:
    return logic_elite.build_elite_pattern(payload)
