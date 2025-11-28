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
        "location_name": "Test Lake",
        # optional hints; leaving them out here to exercise auto-inference
    }

    resp = client.post("/pattern/pro", json=payload)
    assert resp.status_code == 200

    data = resp.json()
    assert data["phase"]
    assert data["depth_zone"]
    assert isinstance(data["recommended_lures"], list)
    assert isinstance(data["lure_setups"], list)
    assert isinstance(data["conditions"], dict)
    assert data["conditions"]["tier"] == "pro"


def test_pattern_elite_returns_gameplan_and_adjustments():
    payload = {
        "location_name": "Test Lake",
        "time_of_day": "dawn",
        "pressure_trend": "falling",
        "water_level_trend": "rising",
        "tournament_mode": True,
    }

    resp = client.post("/pattern/elite", json=payload)
    assert resp.status_code == 200

    data = resp.json()

    # Core pattern
    assert data["phase"]
    assert data["depth_zone"]
    assert isinstance(data["recommended_lures"], list)
    assert isinstance(data["lure_setups"], list)

    # Elite extras
    assert isinstance(data["gameplan"], list)
    assert len(data["gameplan"]) > 0

    assert isinstance(data["adjustments"], list)
    assert len(data["adjustments"]) > 0

    assert isinstance(data["conditions"], dict)
    assert data["conditions"]["tier"] == "elite"
    assert data["conditions"]["time_of_day_normalized"] == "dawn"