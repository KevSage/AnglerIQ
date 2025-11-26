from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_pattern_placeholder_returns_message_and_input():
  """
    For the Pattern Assistant endpoint, even in placeholder form,
    we expect a JSON object with 'message' and 'input' keys.
  """
  resp = client.post("/pattern", json={"temp_f": 55, "month": 3})
  assert resp.status_code == 200
  body = resp.json()

  assert "message" in body
  assert "input" in body

  # extra sanity: did it echo our inputs correctly?
  assert body["input"]["temp_f"] == 55
  assert body["input"]["month"] == 3

def test_chat_placeholder_echoes_message():
  """
  For the Chat endpoint, we expect a canned response that includes the user's message.
  """
  msg = "What should I throw in 55 degree water?" 
  resp = client.post("/chat", json={"message": msg})
  assert resp.status_code == 200
  body = resp.json()

  assert "message" in body
  assert "Sage received:" in body["message"]
  assert "55 degree water" in body["message"]

def test_sonar_placeholder_returns_message_and_inputs():
  """
  For the Sonar endpoint, we expect a 'message' and 'input' echo for now.
  """
  resp = client.post("/sonar", json={"video_id": "abc123"})
  assert resp.status_code == 200
  body = resp.json()

  assert "message" in body
  assert "input" in body
  assert body["input"]["video_id"] == "abc123"