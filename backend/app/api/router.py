# app/api/router.py

from __future__ import annotations

from fastapi import APIRouter

api_router = APIRouter()

# ---------- Health ----------

try:
    # If you have app/api/health.py, use its router
    from .health import router as health_router  # type: ignore[import-not-found]

    api_router.include_router(health_router)
except ImportError:
    # Fallback: define a minimal /health endpoint inline
    health_router = APIRouter()

    @health_router.get("/health")
    def health_check():
        return {"status": "ok"}

    api_router.include_router(health_router)


# ---------- Pattern routes ----------

from .pattern.basic import router as pattern_basic_router
from .pattern.pro import router as pattern_pro_router
from .pattern.elite import router as pattern_elite_router
from .pattern.vision_tier import router as pattern_vision_tier_router

api_router.include_router(pattern_basic_router)
api_router.include_router(pattern_pro_router)
api_router.include_router(pattern_elite_router)
api_router.include_router(pattern_vision_tier_router)


# ---------- Debug routes ----------

from .debug import router as debug_router

api_router.include_router(debug_router)


# ---------- Vision routes ----------

from .vision import router as vision_router

api_router.include_router(vision_router)


# ---------- Assistant routes ----------

from .assistant import router as assistant_router

api_router.include_router(assistant_router)