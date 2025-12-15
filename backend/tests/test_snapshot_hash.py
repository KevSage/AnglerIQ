from app.services.snapshot_hash import SnapshotHashConfig, snapshot_hash
from app.services.weather import WeatherSnapshot


def test_hash_is_deterministic_across_key_order_and_whitespace():
    w1 = WeatherSnapshot(temp_f=72.04, wind_mph=7.06, cloud_cover=" Partly Cloudy ")
    w2 = WeatherSnapshot(temp_f=72.0, wind_mph=7.1, cloud_cover="partly cloudy")

    # With rounding to 1 decimal, these should match
    h1 = snapshot_hash(weather=w1)
    h2 = snapshot_hash(weather=w2)
    assert h1 == h2


def test_hash_changes_when_weather_meaningfully_changes():
    w1 = WeatherSnapshot(temp_f=72.0, wind_mph=7.0, cloud_cover="clear")
    w2 = WeatherSnapshot(temp_f=76.0, wind_mph=7.0, cloud_cover="clear")
    assert snapshot_hash(weather=w1) != snapshot_hash(weather=w2)


def test_hash_optional_location_inclusion():
    w = WeatherSnapshot(temp_f=72.0, wind_mph=7.0, cloud_cover="clear")

    h_no_loc = snapshot_hash(weather=w)
    h_with_loc = snapshot_hash(weather=w, lat=35.1234567, lon=-80.7654321)

    assert h_no_loc != h_with_loc


def test_location_rounding_is_stable():
    w = WeatherSnapshot(temp_f=72.0, wind_mph=7.0, cloud_cover="clear")
    cfg = SnapshotHashConfig(lat_digits=4, lon_digits=4)

    # Both should round to the same 4-decimal coordinates:
    # 35.12344 -> 35.1234
    # -80.76544 -> -80.7654
    h1 = snapshot_hash(weather=w, config=cfg, lat=35.1234401, lon=-80.7654401)
    h2 = snapshot_hash(weather=w, config=cfg, lat=35.1234402, lon=-80.7654402)

    assert h1 == h2