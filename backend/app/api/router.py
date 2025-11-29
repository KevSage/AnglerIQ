from fastapi import APIRouter

from app.api.pattern.basic import router as basic_router
from app.api.pattern.pro import router as pro_router
from app.api.pattern.elite import router as elite_router
from app.api.chat import router as chat_router
from app.api.sonar import router as sonar_router
from app.api.vision import router as vision_router  
from app.api.debug import router as debug_router  
from app.api.pattern.vision_tier import router as vision_tier_router

api_router = APIRouter()

api_router.include_router(basic_router)
api_router.include_router(pro_router)
api_router.include_router(elite_router)
api_router.include_router(chat_router)
api_router.include_router(sonar_router)
api_router.include_router(vision_router)  
api_router.include_router(debug_router)  
api_router.include_router(vision_tier_router)
