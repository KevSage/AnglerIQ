from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

#Create the FastAPI application instance

app = FastAPI()

# ---------- Request models ----------

class PatternRequest(BaseModel):
  """
    Request body for the Pattern Assistant.
    For V1 this will grow, but for now we keep it minimal so we can test the plumbing.
  """
  temp_f: Optional[float] = None
  month: Optional[int] = None

class ChatRequest(BaseModel):
  """
    Request body for the SAGE Chat Coach.
  """
  message: str

class SonarRequest(BaseModel):
  """
    Request body for the Sonar Analysis endpoint.
    In V1 this will eventually handle uploaded videos or references to them.
  """
  video_id: Optional[str] = None


# ---------- Routes ----------
@app.get("/health")
def health():
  """
    Simple health check endpoint to verify the API is running.
    This is what we and any uptime monitor will hit.
  """
  return {"status": "ok"}

@app.post("/pattern")
def pattern(req: PatternRequest):
  """
    Placeholder Pattern Assistant endpoint.
  """
  return {
    "message": "Pattern Assistant placeholder",
    "input": req.model_dump(),
  }

@app.post("/chat")
def chat(req: ChatRequest):
  """
    Placeholder SAGE Chat Coach endpoint.
  """
  return {
    "message": f"Sage received: {req.message}"
  }
@app.post("/sonar")
def sonar(req: SonarRequest):
    """
    Placeholder Sonar Analysis endpoint.

    For now we return a predictable 'input' shape with a video_id key
    so tests (and future code) can rely on that contract.
    """
    return {
        "message": "Sonar Analysis placeholder",
        "input": {
            "video_id": req.video_id
        },
    }
