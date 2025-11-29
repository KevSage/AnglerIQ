from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Query

from app.domain.pattern.logic_pro import get_weather_for_location, WeatherContext

router = APIRouter(prefix="/debug", tags=["debug"])


def _serialize_weather_context(ctx: WeatherContext) -> dict:
    return {
        "temp_f": ctx.temp_f,
        "wind_speed": ctx.wind_speed,
        "sky_condition": ctx.sky_condition,
        "timestamp": ctx.timestamp.isoformat()
        if isinstance(ctx.timestamp, datetime)
        else str(ctx.timestamp),
    }


@router.get("/weather")
async def debug_weather(
    latitude: Optional[float] = Query(None),
    longitude: Optional[float] = Query(None),
    location_name: Optional[str] = Query(None),
):
    """
    Debug endpoint to inspect the WeatherContext used by Pro/Elite.

    Notes:
    - In tests, `location_name=Test Lake` will hit the stub and not the real API.
    - In real usage, supplying latitude/longitude will query WeatherAPI.
    - Location name is optional and mainly useful for manual experimentation.
    """
    ctx: WeatherContext = get_weather_for_location(
        location_name=location_name,
        latitude=latitude,
        longitude=longitude,
    )
    return _serialize_weather_context(ctx)
