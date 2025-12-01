# app/api/sage/service.py

from __future__ import annotations

from typing import Tuple

from .schemas import SageAskRequest, SageAskResponse
from .sage_engine import generate_advice


def answer_with_sage(req: SageAskRequest) -> SageAskResponse:
    """
    Thin service wrapper around the core SAGE engine.

    Keeps the FastAPI router clean and gives us a place to add logging,
    analytics, or experiment flags later without touching the HTTP layer.
    """
    answer, key_points, meta = generate_advice(
        pattern=req.pattern,
        question=req.question,
    )

    return SageAskResponse(
        answer=answer,
        key_points=key_points,
        meta=meta,
    )
