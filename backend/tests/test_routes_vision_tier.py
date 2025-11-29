# tests/test_routes_vision_tier.py

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_pattern_vision_tier_basic_flow():
    payload = {
        "pattern": {
            "location_name": "Test Lake",
            "time_of_day": "dawn",
            "pressure_trend": "falling",
            "water_level_trend": "rising",
            "tournament_mode": False
        },
        "vision": {
            "depth_ft": 12.5,
            "arch_count": 5,
            "activity_level": "medium",
            "bait_present": True,
            "bottom_hardness": "hard",
            "stop_or_keep_moving": "stop"
        }
    }

    resp = client.post("/pattern/vision-tier", json=payload)
    assert resp.status_code == 200

    data = resp.json()

    # Core Elite structure
    assert data["phase"]
    assert data["depth_zone"]
    assert isinstance(data["recommended_lures"], list)
    assert isinstance(data["recommended_targets"], list)
    assert isinstance(data["strategy_tips"], list)
    assert isinstance(data["lure_setups"], list)

    # Elite extras
    assert isinstance(data["gameplan"], list)
    assert isinstance(data["adjustments"], list)
    assert isinstance(data["conditions"], dict)

    # The fused path should annotate conditions
    conditions = data["conditions"]

    assert conditions["tier"] == "elite"  # Elite remains elite even with vision
    assert "vision_enhanced" in conditions
    assert conditions["vision_enhanced"] is True

    # Fused context presence
    assert "fusion" in conditions
    fusion = conditions["fusion"]

    assert "sonar" in fusion
    assert "weather" in fusion
    assert "strength" in fusion
