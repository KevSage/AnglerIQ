# app/api/sage/router.py

from __future__ import annotations

from fastapi import APIRouter

from .schemas import SageAskRequest, SageAskResponse
from .service import answer_with_sage

router = APIRouter(prefix="/sage", tags=["sage"])


@router.post("/ask", response_model=SageAskResponse)
def sage_ask(payload: SageAskRequest) -> SageAskResponse:
    """
    Primary SAGE endpoint.

    Expected request shape (example):

    {
      "pattern": { ... full JSON from /pattern/elite or /pattern/vision-tier ... },
      "question": "How should I fish this in a 3 hour evening trip?"
    }
    """
    return answer_with_sage(payload)
