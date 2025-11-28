

# app/api/pattern/basic.py

from fastapi import APIRouter

from app.domain.pattern.schemas import (
    BasicPatternRequest,
    BasicPatternResponse,
)
from app.domain.pattern.logic_basic import build_basic_pattern

router = APIRouter(prefix="/pattern", tags=["pattern-basic"])


@router.post("/basic", response_model=BasicPatternResponse)
def pattern_basic(req: BasicPatternRequest) -> BasicPatternResponse:
    """
    Basic pattern endpoint.

    API layer is intentionally very thin:
    - validate request with BasicPatternRequest
    - delegate to domain layer (build_basic_pattern)
    - return a BasicPatternResponse

    Any calls into PatternEngine happen inside the domain layer,
    so we keep a clean separation between API and engine logic.
    """
    return build_basic_pattern(req)