# tests/test_routes_basic.py

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_endpoint_returns_ok():
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


def test_pattern_basic_returns_simplified_summary():
    payload = {
        "temp_f": 55.0,
        "month": 3,
        "clarity": "stained",
        "wind_speed": 8.0,
    }

    resp = client.post("/pattern/basic", json=payload)
    assert resp.status_code == 200, resp.json()
    body = resp.json()

    # BASIC should expose only high-level pieces + techniques
    assert "phase" in body
    assert "depth_zone" in body
    assert "recommended_techniques" in body
    assert "notes" in body

    # and should NOT expose the advanced fields
    assert "recommended_lures" not in body
    assert "recommended_targets" not in body
    assert "strategy_tips" not in body
    assert "color_recommendations" not in body
    assert "conditions" not in body
    assert "recommended_setups" not in body

    assert isinstance(body["recommended_techniques"], list)
    assert len(body["recommended_techniques"]) > 0


def test_pattern_pro_returns_full_summary():
    payload = {
        "temp_f": 55.0,
        "month": 3,
        "clarity": "stained",
        "wind_speed": 8.0,
        "sky_condition": "cloudy",
        "depth_ft": 10.0,
        "bottom_composition": "rock",
    }

    resp = client.post("/pattern/pro", json=payload)
    assert resp.status_code == 200, resp.json()
    body = resp.json()

    assert "phase" in body
    assert "depth_zone" in body
    assert "recommended_lures" in body
    assert "recommended_targets" in body
    assert "strategy_tips" in body
    assert "color_recommendations" in body
    assert "lure_setups" in body
    assert "conditions" in body
    assert "notes" in body

    lures = body["recommended_lures"]
    setups = body["lure_setups"]
    assert isinstance(lures, list)
    assert isinstance(setups, list)
    assert len(setups) == len(lures)

    # Ensure each setup is tied to a lure and has gear fields
    lure_names_in_setups = [s["lure"] for s in setups]
    for lure in lures:
        assert lure in lure_names_in_setups

    first = setups[0]
    for key in ["lure", "technique", "rod", "reel", "line", "hook_or_leader", "lure_size"]:
        assert key in first


def test_chat_placeholder_echoes_message():
    msg = "What should I throw in 55 degree water?"
    resp = client.post("/chat", json={"message": msg})
    assert resp.status_code == 200
    body = resp.json()

    assert "message" in body
    assert "SAGE received:" in body["message"]
    assert "55 degree water" in body["message"]


def test_sonar_placeholder_returns_message_and_inputs():
    resp = client.post("/sonar", json={"video_id": "abc123"})
    assert resp.status_code == 200
    body = resp.json()

    assert "message" in body
    assert "input" in body
    assert body["input"]["video_id"] == "abc123"
