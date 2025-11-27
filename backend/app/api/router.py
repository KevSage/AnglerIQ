from fastapi import APIRouter
from app.api.pattern.basic import router as basic_router
from app.api.pattern.pro import router as pro_router
from app.api.chat import router as chat_router 
from app.api.sonar import router as sonar_router

api_router = APIRouter()
api_router.include_router(basic_router)
api_router.include_router(pro_router)
api_router.include_router(chat_router) 
api_router.include_router(sonar_router)  