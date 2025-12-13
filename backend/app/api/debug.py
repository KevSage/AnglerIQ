from fastapi import APIRouter
from app.services.weather import fetch_current_weather_by_coords
from app.domain.pattern.context import WeatherContext

router = APIRouter(prefix="/debug", tags=["debug"])

@router.get("/weather")
def debug_weather(lat: float, lon: float):
    snap = fetch_current_weather_by_coords(lat, lon)
    if not snap or snap.temp_f is None or snap.wind_mph is None:
        return WeatherContext(
            temp_f=60.0,
            wind_speed=5.0,
            sky_condition="partly_cloudy",
            timestamp=datetime.utcnow(),
        )

    sky = (snap.cloud_cover or "partly_cloudy").strip().lower().replace(" ", "_")
    return WeatherContext(
        temp_f=float(snap.temp_f),
        wind_speed=float(snap.wind_mph),
        sky_condition=sky,
        timestamp=datetime.utcnow(),
    )