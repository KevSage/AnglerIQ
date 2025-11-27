from fastapi import APIRouter
from app.domain.pattern.schemas import ProPatternRequest, ProPatternResponse
from app.domain.pattern.logic_pro import build_pro_pattern

router = APIRouter(prefix="/pattern", tags=["pattern-pro"])


@router.post("/pro", response_model=ProPatternResponse)
def pattern_pro(req: ProPatternRequest):
    return build_pro_pattern(req)
