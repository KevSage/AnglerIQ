from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_debug_weather_with_test_lake_uses_stub():
    # This should hit the stub branch in get_weather_for_location
    resp = client.get("/debug/weather", params={"location_name": "Test Lake"})
    assert resp.status_code == 200

    data = resp.json()
    assert "temp_f" in data
    assert "wind_speed" in data
    assert "sky_condition" in data
    assert "timestamp" in data

    # Because it's stubbed, we can reasonably expect these defaults:
    assert data["temp_f"] == 60.0
    assert data["wind_speed"] == 5.0
    assert data["sky_condition"] == "partly_cloudy"
