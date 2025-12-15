from app.services.regeneration import should_suggest_regeneration
from app.services.snapshot_hash import snapshot_hash


def test_no_suggestion_when_hash_identical():
    pattern_weather = {"temp_f": 70.0, "wind_mph": 5.0, "cloud_cover": "clear"}
    h = snapshot_hash(weather=pattern_weather, lat=35.0, lon=-80.0, time_bucket="morning")

    ok, reasons = should_suggest_regeneration(
        tier="pro",
        pattern_snapshot_hash=h,
        pattern_weather=pattern_weather,
        pattern_lat=35.0,
        pattern_lon=-80.0,
        pattern_time_bucket="morning",
        current_weather=pattern_weather,
        current_lat=35.0,
        current_lon=-80.0,
        current_time_bucket="morning",
    )

    assert ok is False
    assert reasons == []


def test_location_shift_triggers():
    pattern_weather = {"temp_f": 70.0, "wind_mph": 5.0, "cloud_cover": "clear"}
    h = snapshot_hash(weather=pattern_weather, lat=35.0, lon=-80.0)

    ok, reasons = should_suggest_regeneration(
        tier="elite",
        pattern_snapshot_hash=h,
        pattern_weather=pattern_weather,
        pattern_lat=35.0,
        pattern_lon=-80.0,
        current_weather=pattern_weather,
        current_lat=35.01,
        current_lon=-80.01,
    )

    assert ok is True
    assert "location_shift" in reasons


def test_weather_shift_temp_triggers():
    pattern_weather = {"temp_f": 70.0, "wind_mph": 5.0, "cloud_cover": "clear"}
    current_weather = {"temp_f": 76.0, "wind_mph": 5.0, "cloud_cover": "clear"}

    h = snapshot_hash(weather=pattern_weather)

    ok, reasons = should_suggest_regeneration(
        tier="pro",
        pattern_snapshot_hash=h,
        pattern_weather=pattern_weather,
        current_weather=current_weather,
    )

    assert ok is True
    assert "weather_shift_temp" in reasons


def test_vision_contradiction_can_trigger_even_if_hash_matches():
    weather = {"temp_f": 70.0, "wind_mph": 5.0, "cloud_cover": "clear"}
    h = snapshot_hash(weather=weather)

    ok, reasons = should_suggest_regeneration(
        tier="vision",
        pattern_snapshot_hash=h,
        pattern_weather=weather,
        current_weather=weather,
        vision_contradiction=True,
    )

    assert ok is True
    assert reasons == ["vision_contradiction"]