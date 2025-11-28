from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_on_water_vision_stub_returns_expected_shape():
    # We send a dummy JSON payload; the endpoint ignores the body content for now.
    resp = client.post("/vision/on-water", json={"stub": True})
    assert resp.status_code == 200

    data = resp.json()
    assert "water_clarity" in data
    assert "visible_structure" in data
    assert "worth_fishing" in data
    assert "raw_attributes" in data


def test_fishfinder_vision_stub_returns_expected_shape():
    resp = client.post("/vision/fishfinder", json={"stub": True})
    assert resp.status_code == 200

    data = resp.json()
    assert "depth_ft" in data
    assert "arch_count" in data
    assert "stop_or_keep_moving" in data


def test_apply_vision_to_pattern_attaches_flags():
    payload = {
        "pattern_conditions": {
            "tier": "elite",
            "phase": "pre-spawn",
        },
        "on_water": {
            "water_clarity": "stained",
            "visible_structure": "riprap",
            "vegetation": "none",
            "bank_angle": "steep",
            "shade_cover": "low",
            "light_penetration": "medium",
            "worth_fishing": True,
            "raw_attributes": {},
        },
    }

    resp = client.post("/vision/apply-to-pattern", json=payload)
    assert resp.status_code == 200

    data = resp.json()
    updated = data["updated_conditions"]

    assert updated["tier"] == "elite"
    assert updated["vision_applied"] is True
    assert "vision_on_water" in updated
