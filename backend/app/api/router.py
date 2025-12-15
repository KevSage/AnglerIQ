from fastapi import APIRouter

from app.api.debug import router as debug_router
from app.api.pattern.basic import router as pattern_basic_router
from app.api.pattern.pro import router as pattern_pro_router
from app.api.pattern.elite import router as pattern_elite_router
from app.api.pattern.vision_tier import router as pattern_vision_tier_router
from app.api.assistant import router as assistant_router
from app.api.vision import router as vision_router

api_router = APIRouter()

api_router.include_router(debug_router)
api_router.include_router(pattern_basic_router)
api_router.include_router(pattern_pro_router)
api_router.include_router(pattern_elite_router)
api_router.include_router(pattern_vision_tier_router)
api_router.include_router(assistant_router)
api_router.include_router(vision_router)