from fastapi import APIRouter
from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    message: str

router = APIRouter(tags=["chat"])

@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    return ChatResponse(message=f"SAGE received: {req.message}")
