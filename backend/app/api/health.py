# app/api/health.py

from __future__ import annotations

from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health_check():
    """
    Basic sanity endpoint used by tests/test_health.py.
    """
    return {"status": "ok"}