from fastapi import APIRouter

from app.domain.pattern.schemas import ElitePatternRequest, ElitePatternResponse
from app.domain.pattern import logic_elite

# 🔹 NEW — real weather ingestion
from app.services.weather import fetch_weather_for_location

router = APIRouter(prefix="/pattern", tags=["elite"])


@router.post("/elite", response_model=ElitePatternResponse)
async def pattern_elite(payload: ElitePatternRequest) -> ElitePatternResponse:
    """
    Elite Pattern-of-the-Day endpoint.
    Now includes optional live weather ingestion to update the conditions block.
    """
    # 1) Build Elite pattern using existing engine logic
    result = logic_elite.build_elite_pattern(payload)

    # 2) Live weather graft (only if location_name is provided)
    if payload.location_name:
        snapshot = fetch_weather_for_location(payload.location_name)

        if snapshot:
            if result.conditions is None:
                result.conditions = {}

            # Merge real-world weather (non-destructive)
            if snapshot.temp_f is not None:
                result.conditions["temp_f"] = snapshot.temp_f
            if snapshot.wind_mph is not None:
                result.conditions["wind_mph"] = snapshot.wind_mph
            if snapshot.pressure_trend is not None:
                result.conditions["pressure_trend"] = snapshot.pressure_trend
            if snapshot.cloud_cover is not None:
                result.conditions["cloud_cover"] = snapshot.cloud_cover
            if snapshot.clarity_estimate is not None:
                result.conditions["clarity_estimate"] = snapshot.clarity_estimate
            if snapshot.season_phase is not None:
                result.conditions["season_phase"] = snapshot.season_phase

    return result