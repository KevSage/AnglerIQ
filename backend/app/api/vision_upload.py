# app/api/vision_upload.py

from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import Optional, Literal

router = APIRouter(prefix="/vision", tags=["vision"])


class VisionAnalysis(BaseModel):
    depth_ft: Optional[float] = None
    bottom_hardness: Optional[str] = None
    bait_present: Optional[bool] = None
    fish_present: Optional[bool] = None
    arch_count: Optional[int] = None
    activity_level: Optional[str] = None
    worth_fishing: Optional[bool] = None
    stop_or_keep_moving: Optional[Literal["stop", "keep_moving"]] = None
    raw_attributes: dict = {}


@router.post("/analyze", response_model=VisionAnalysis)
async def analyze_vision_image(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    image_bytes = await file.read()
    # TODO: later send `image_bytes` to OpenAI / other Vision model.

    # Stub for now – just to prove the plumbing
    return VisionAnalysis(
        depth_ft=14.0,
        bottom_hardness="hard",
        bait_present=True,
        fish_present=True,
        arch_count=7,
        activity_level="medium",
        worth_fishing=True,
        stop_or_keep_moving="keep_moving",
        raw_attributes={"note": "Stubbed Vision analysis from uploaded image"},
    )