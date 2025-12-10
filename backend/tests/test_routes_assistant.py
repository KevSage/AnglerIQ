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

# tests/test_routes_assistant.py

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_assistant_chat_patternless_basic_flow():
    """
    /assistant/chat should return a reply even without pattern/tier,
    and echo back the user's message.
    """
    payload = {
        "message": "How should I think about tonight's trip?",
        "preferences": {
            "experience_level": "beginner",
            "coaching_style": "calm_guide",
            "preferred_styles": ["agnostic"],
            "confidence_baits": ["spinnerbait"],
            "banned_techniques": [],
        },
    }

    resp = client.post("/assistant/chat", json=payload)
    assert resp.status_code == 200

    data = resp.json()
    assert "reply" in data
    assert "How should I think about tonight's trip?" in data["reply"]
    assert data["pattern_summary"] is None

    prefs_used = data["preferences_used"]
    assert prefs_used["experience_level"] == "beginner"
    assert prefs_used["coaching_style"] == "calm_guide"


def test_assistant_chat_with_elite_pattern_uses_pattern_summary():
    """
    /assistant/chat with tier + pattern should:
      - build an Elite pattern,
      - run SAGE advice,
      - return a non-empty reply and pattern_summary.
    """
    payload = {
        "message": "Where should I start?",
        "tier": "elite",
        "pattern": {
            "location_name": "Test Lake",
            "time_of_day": "dawn",
            "pressure_trend": "falling",
            "water_level_trend": "rising",
            "tournament_mode": True,
        },
        "preferences": {
            "experience_level": "advanced",
            "coaching_style": "old_school_pro",
            "preferred_styles": ["power", "offshore"],
            "confidence_baits": ["jig", "spinnerbait"],
            "banned_techniques": ["ned rig"],
        },
    }

    resp = client.post("/assistant/chat", json=payload)
    assert resp.status_code == 200

    data = resp.json()
    assert "reply" in data

    # SAGE echoes the question in its opening line
    assert "Where should I start?" in data["reply"]

    # pattern_summary should be present and carry core fields
    summary = data["pattern_summary"]
    assert summary is not None
    assert "phase" in summary
    assert "depth_zone" in summary

    # location_name lives under conditions in the canonical pattern shape
    conditions = summary.get("conditions") or {}
    assert conditions.get("location_name") == "Test Lake"

    prefs_used = data["preferences_used"]
    assert prefs_used["coaching_style"] == "old_school_pro"