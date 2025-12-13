# tests/test_pattern_pro.py

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_pro_pattern_with_test_lake_stub_weather():
    """
    Pro pattern generation using Test Lake should:
    - Use stubbed weather
    - Produce a stable, explainable pattern
    - NOT auto-regenerate or escalate tiers
    """
    payload = {
        "location_name": "Test Lake",
        "clarity": "stained",
        "bottom_composition": "rock",
        "forage": ["shad"],
    }

    resp = client.post("/pattern/pro", json=payload)
    assert resp.status_code == 200

    data = resp.json()

    # --- Core pattern fields ---
    assert data["phase"] is not None
    assert data["depth_zone"] is not None
    assert isinstance(data["recommended_lures"], list)
    assert len(data["recommended_lures"]) > 0
    assert isinstance(data["recommended_targets"], list)
    assert len(data["recommended_targets"]) > 0

    # --- Technique-first confirmation ---
    assert data["primary_technique"] is not None
    assert data["featured_lure_name"] is not None
    assert data["featured_lure_family"] is not None

    # --- Conditions snapshot integrity ---
    conditions = data["conditions"]
    assert conditions["tier"] == "pro"
    assert conditions["location_name"] == "Test Lake"
    assert conditions["temp_f"] == 60.0
    assert conditions["wind_speed"] == 5.0
    assert conditions["sky_condition"] == "partly_cloudy"

    # --- Guardrails ---
    assert "clarity_estimate" not in conditions  # Vision-only
    assert "vision" not in data
    assert "elite" not in data


def test_pro_pattern_without_location_uses_stub_weather():
    """
    When no location or weather fields are provided:
    - Pro logic should still succeed
    - Stub weather must be used
    """
    payload = {}

    resp = client.post("/pattern/pro", json=payload)
    assert resp.status_code == 200

    data = resp.json()
    conditions = data["conditions"]

    assert conditions["temp_f"] == 60.0
    assert conditions["wind_speed"] == 5.0
    assert conditions["sky_condition"] == "partly_cloudy"


def test_pro_pattern_respects_explicit_depth():
    """
    Providing depth_ft should affect depth_zone classification,
    without changing authority or tier behavior.
    """
    payload = {
        "location_name": "Test Lake",
        "depth_ft": 18,
    }

    resp = client.post("/pattern/pro", json=payload)
    assert resp.status_code == 200

    data = resp.json()
    assert data["depth_zone"] in ("deep", "offshore")