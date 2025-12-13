# app/api/pattern/elite.py

from fastapi import APIRouter

from app.domain.pattern.schemas import ElitePatternRequest, ElitePatternResponse
from app.domain.pattern import logic_elite

router = APIRouter(prefix="/pattern", tags=["elite"])


@router.post("/elite", response_model=ElitePatternResponse)
async def pattern_elite(payload: ElitePatternRequest) -> ElitePatternResponse:
    """
    Elite Pattern-of-the-Day endpoint.

    Elite logic resolves:
    - lake-centered weather
    - surface refinement
    - conditions snapshot

    Endpoint must remain a thin orchestrator.
    """
    return logic_elite.build_elite_pattern(payload)