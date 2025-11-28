from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_pattern_elite_returns_gameplan_and_adjustments():
    payload = {
        "location_name": "Test Lake",

        # optional hints (we can omit to exercise auto-inference)
        # "clarity": "stained",
        # "bottom_composition": "rock",
        # "depth_ft": 6.0,
        # "forage": ["shad"],

        # Elite-only context
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
    assert isinstance(data["recommended_targets"], list)
    assert isinstance(data["strategy_tips"], list)
    assert isinstance(data["color_recommendations"], list)
    assert isinstance(data["lure_setups"], list)

    # Elite extras
    assert isinstance(data["gameplan"], list)
    assert len(data["gameplan"]) > 0

    assert isinstance(data["adjustments"], list)
    assert len(data["adjustments"]) > 0

    assert isinstance(data["conditions"], dict)
    assert data["conditions"]["tier"] == "elite"
    assert data["conditions"]["time_of_day_normalized"] == "dawn"
