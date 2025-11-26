from typing import Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.pattern_logic import (
    build_basic_pattern_summary,
    build_pattern_summary,
)

app = FastAPI()

# --- CORS so frontend on :3000 can talk to backend on :8000 ---

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Request models ----------


class BasicPatternRequest(BaseModel):
    """
    BASIC tier pattern request.
    """
    temp_f: float
    month: int
    clarity: str
    wind_speed: float


class ProPatternRequest(BaseModel):
    """
    PRO tier pattern request.
    """
    temp_f: float
    month: int
    clarity: str
    wind_speed: float
    sky_condition: str
    depth_ft: Optional[float] = None
    bottom_composition: Optional[str] = None


class ChatRequest(BaseModel):
    message: str


class SonarRequest(BaseModel):
    video_id: Optional[str] = None


# ---------- Routes ----------


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/pattern/basic")
def pattern_basic(req: BasicPatternRequest):
    """
    BASIC SAGE Pattern Assistant endpoint.

    Returns a simplified pattern summary: phase, depth zone,
    and technique-level guidance.
    """
    summary = build_basic_pattern_summary(
        temp_f=req.temp_f,
        month=req.month,
        clarity=req.clarity,
        wind_speed=req.wind_speed,
    )
    return summary


@app.post("/pattern/pro")
def pattern_pro(req: ProPatternRequest):
    """
    PRO SAGE Pattern Engine endpoint.

    Returns the full pattern summary including targets, strategy tips,
    color recommendations, and detailed setups.
    """
    summary = build_pattern_summary(
        temp_f=req.temp_f,
        month=req.month,
        clarity=req.clarity,
        wind_speed=req.wind_speed,
        sky_condition=req.sky_condition,
        depth_ft=req.depth_ft,
        bottom_composition=req.bottom_composition,
    )
    return summary


@app.post("/chat")
def chat(req: ChatRequest):
    return {"message": f"SAGE received: {req.message}"}


@app.post("/sonar")
def sonar(req: SonarRequest):
    return {
        "message": "Sonar Analysis placeholder",
        "input": {"video_id": req.video_id},
    }
