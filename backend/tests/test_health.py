from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_ok():
  """
    Basic sanity test: /health should return 200 and the expected body.
  """
  resp = client.get("/health")
  assert resp.status_code == 200
  assert resp.json() == {"status": "ok"}

  