from fastapi import APIRouter

from app.api.pattern.basic import router as basic_router
from app.api.pattern.pro import router as pro_router
from app.api.pattern.elite import router as elite_router
from app.api.pattern.vision_tier import router as vision_tier_router

router = APIRouter(prefix="/pattern", tags=["pattern"])

router.include_router(basic_router)
router.include_router(pro_router)
router.include_router(elite_router)
router.include_router(vision_tier_router)