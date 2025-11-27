# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router


app = FastAPI(title="SAGE Backend")

# Allow your Next.js frontend to talk to this API
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Simple health check so the frontend (and you) can verify it's up
@app.get("/health")
def health():
    return {"status": "ok"}


# Mount all versioned / structured API routes
app.include_router(api_router)


# For running directly: `python -m app.main` or `python app/main.py`
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
