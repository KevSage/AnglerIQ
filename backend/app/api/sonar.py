# app/api/sonar.py

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Any, Dict


class SonarRequest(BaseModel):
  video_id: str


class SonarResponse(BaseModel):
  message: str
  input: Dict[str, Any]


router = APIRouter(tags=["sonar"])


@router.post("/sonar", response_model=SonarResponse)
def sonar(req: SonarRequest):
  return SonarResponse(
      message="Sonar endpoint placeholder – SAGE will analyze sonar in a future release.",
      input=req.dict(),
  )
