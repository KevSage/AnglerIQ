# app/domain/common/weather.py

from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class WeatherContext:
    temp_f: float
    wind_speed: float
    sky_condition: str  # "sunny", "cloudy", "overcast", etc.
    timestamp: datetime


def get_weather_for_location(
    location_name: Optional[str] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
) -> WeatherContext:
    """
    V1 stub.

    In production, this will:
    - Call a weather API using location_name or lat/lon.
    - Return current temp, wind, sky, and local timestamp.

    For now, we just return a static, reasonable context so the engine works.
    """

    # TODO: integrate real weather API
    # For now, pretend it's a mild, partly cloudy day.
    return WeatherContext(
        temp_f=60.0,
        wind_speed=5.0,
        sky_condition="partly_cloudy",
        timestamp=datetime.utcnow(),
    )
