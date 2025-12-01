# tests/test_routes_assistant.py

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_assistant_elite_ask_returns_answer_and_summary():
    payload = {
        "tier": "elite",
        "pattern": {
            "location_name": "Test Lake",
            "time_of_day": "dawn",
            "pressure_trend": "falling",
            "water_level_trend": "rising",
            "tournament_mode": True,
        },
        "question": "How should I start fishing this pattern?",
    }

    resp = client.post("/assistant/ask", json=payload)
    assert resp.status_code == 200

    data = resp.json()

    # Top-level shape
    assert data["tier"] == "elite"
    assert data["question"] == payload["question"]
    assert isinstance(data["answer"], str)
    assert len(data["answer"]) > 0

    # Pattern summary block
    summary = data["pattern_summary"]
    assert isinstance(summary, dict)

    # Core pattern bits should be present
    assert "phase" in summary
    assert "depth_zone" in summary
    assert "recommended_lures" in summary
    assert "recommended_targets" in summary
    assert "strategy_tips" in summary
    assert "gameplan" in summary
    assert "adjustments" in summary
    assert "conditions" in summary

    # Conditions should still be elite-tier
    assert summary["conditions"]["tier"] == "elite"
