from fastapi import APIRouter
from app.domain.pattern.schemas import BasicPatternRequest, BasicPatternResponse
from app.domain.pattern.logic_basic import build_basic_pattern

router = APIRouter(prefix="/pattern", tags=["pattern-basic"])


@router.post("/basic", response_model=BasicPatternResponse)
def pattern_basic(req: BasicPatternRequest):
    return build_basic_pattern(req)
