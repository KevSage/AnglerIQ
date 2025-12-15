from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Query

from app.domain.pattern.context import WeatherContext
from app.services.weather import fetch_current_weather_by_coords, fetch_weather_for_location

router = APIRouter(prefix="/debug", tags=["debug"])


def _stub_weather_context() -> WeatherContext:
    return WeatherContext(
        temp_f=60.0,
        wind_speed=5.0,
        sky_condition="partly_cloudy",
        timestamp=datetime.utcnow(),
    )


@router.get("/weather", response_model=WeatherContext)
def debug_weather(
    lat: Optional[float] = Query(default=None),
    lon: Optional[float] = Query(default=None),
    location_name: Optional[str] = Query(default=None),
):
    # Test stub branch
    if location_name and location_name.strip().lower() == "test lake":
        return _stub_weather_context()

    # Coords mode
    if lat is not None and lon is not None:
        try:
            snap = fetch_current_weather_by_coords(lat, lon)
            if not snap or snap.temp_f is None or snap.wind_mph is None:
                return _stub_weather_context()

            sky = (snap.cloud_cover or "partly_cloudy").strip().lower().replace(" ", "_")
            return WeatherContext(
                temp_f=float(snap.temp_f),
                wind_speed=float(snap.wind_mph),
                sky_condition=sky,
                timestamp=datetime.utcnow(),
            )
        except Exception:
            return _stub_weather_context()

    # Name mode
    if location_name:
        snap = fetch_weather_for_location(location_name)
        if not snap or snap.temp_f is None or snap.wind_mph is None:
            return _stub_weather_context()

        sky = (snap.cloud_cover or "partly_cloudy").strip().lower().replace(" ", "_")
        return WeatherContext(
            temp_f=float(snap.temp_f),
            wind_speed=float(snap.wind_mph),
            sky_condition=sky,
            timestamp=datetime.utcnow(),
        )

    # No params
    return _stub_weather_context()