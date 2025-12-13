# app/services/weather.py

from __future__ import annotations

import os
from typing import Optional

import requests
from pydantic import BaseModel, Field


class WeatherSnapshot(BaseModel):
    temp_f: Optional[float] = Field(default=None)
    wind_mph: Optional[float] = Field(default=None)
    cloud_cover: Optional[str] = Field(default=None)
    clarity_estimate: Optional[str] = Field(default=None)
    season_phase: Optional[str] = Field(default=None)


class GeocodeResult(BaseModel):
    lat: float
    lon: float
    name: str


class WeatherServiceError(RuntimeError):
    pass


def _get_base() -> str:
    return os.getenv("AIQ_WEATHER_API_BASE", "https://api.openweathermap.org")


def _get_key() -> str:
    key = os.getenv("AIQ_WEATHER_API_KEY")
    if not key:
        raise WeatherServiceError("AIQ_WEATHER_API_KEY is not set")
    return key


def geocode_location(location_name: str) -> Optional[GeocodeResult]:
    """
    Very simple geocode using OpenWeather's geo API.
    If it fails, we just return None and fall back to stubbed conditions.
    """
    try:
        base = _get_base()
        key = _get_key()
        url = f"{base}/geo/1.0/direct"
        resp = requests.get(url, params={"q": location_name, "limit": 1, "appid": key}, timeout=5)
        resp.raise_for_status()
        data = resp.json()
        if not data:
            return None

        first = data[0]
        return GeocodeResult(
            lat=float(first["lat"]),
            lon=float(first["lon"]),
            name=str(first.get("name") or location_name),
        )
    except Exception:
        # Be fail-soft: no crash, just no live weather
        return None
    
    
# Weather snapshot rules:
# - Updated on:
#   • app reload / new session
#   • explicit user refresh
#   • lake change
# - NOT updated:
#   • continuously
#   • on GPS drift
#   • in background

def fetch_current_weather_by_coords(lat: float, lon: float) -> WeatherSnapshot:
    """
    Fetch current conditions in imperial units and map into AnglerIQ's conditions shape.
    """
    base = _get_base()
    key = _get_key()
    url = f"{base}/data/2.5/weather"

    resp = requests.get(
        url,
        params={
            "lat": lat,
            "lon": lon,
            "appid": key,
            "units": "imperial",  # temp in F, wind in mph-ish
        },
        timeout=5,
    )
    resp.raise_for_status()
    data = resp.json()

    main = data.get("main", {})
    wind = data.get("wind", {})
    clouds = data.get("clouds", {})
    weather = (data.get("weather") or [{}])[0]

    temp_f = main.get("temp")
    wind_mph = wind.get("speed")
    cloud_pct = clouds.get("all")
    description = weather.get("description", "")

    # Super simple mappings for now; you can refine later from canon.
    if isinstance(cloud_pct, (int, float)):
        if cloud_pct < 20:
            cloud_cover = "clear"
        elif cloud_pct < 60:
            cloud_cover = "partly cloudy"
        else:
            cloud_cover = "overcast"
    else:
        cloud_cover = description or None

    # Placeholder for clarity; we can upgrade later.
    clarity_estimate = None

    # Season phase could be derived from date + lat later; stub for now.
    season_phase = None

    return WeatherSnapshot(
        temp_f=temp_f,
        wind_mph=wind_mph,
        cloud_cover=cloud_cover,
        clarity_estimate=clarity_estimate,
        season_phase=season_phase,
    )


def fetch_weather_for_location(location_name: str) -> Optional[WeatherSnapshot]:
    """
    High-level helper: location_name → coords → weather.
    Returns None if anything fails, so callers can fall back gracefully.
    """
    geo = geocode_location(location_name)
    if not geo:
        return None

    try:
        return fetch_current_weather_by_coords(geo.lat, geo.lon)
    except Exception:
        return None