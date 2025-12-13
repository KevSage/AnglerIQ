# app/api/conditions.py

from __future__ import annotations

from fastapi import APIRouter, Query

from app.services.weather import WeatherSnapshot, fetch_current_weather_by_coords

router = APIRouter(prefix="/conditions", tags=["conditions"])


@router.get("", response_model=WeatherSnapshot)
def get_conditions(
    lat: float = Query(..., ge=-90, le=90),
    lon: float = Query(..., ge=-180, le=180),
) -> WeatherSnapshot:
    """
    Weather-only conditions for the SELECTED LAKE coords.
    Fail-soft: if live weather fails, return a safe stub (never 500s).
    """
    try:
        return fetch_current_weather_by_coords(lat, lon)
    except Exception:
        # Safe fallback so frontend never breaks.
        return WeatherSnapshot(
            temp_f=None,
            wind_mph=None,
            cloud_cover=None,
            clarity_estimate=None,  # Vision owns water clarity
            season_phase=None,
        )