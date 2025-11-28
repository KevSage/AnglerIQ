# backend/app/api/pattern/pro.py

from fastapi import APIRouter
from ...domain.pattern.schemas import (
    ProPatternRequest,
    ProPatternResponse,
    LureSetup,
)

from ...domain.pattern.schemas import ProPatternRequest, ProPatternResponse, LureSetup
from ...domain.pattern import logic_pro

router = APIRouter(prefix="/pattern", tags=["pro"])

@router.post("/pro", response_model=ProPatternResponse)
def generate_pro_pattern(req: ProPatternRequest) -> ProPatternResponse:
    return logic_pro.build_pro_pattern(req)