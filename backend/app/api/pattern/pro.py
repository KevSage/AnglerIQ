from fastapi import APIRouter

from app.domain.pattern.schemas import ProPatternRequest, ProPatternResponse
from app.domain.pattern import logic_pro

# 🔹 IMPORT weather service (new)
from app.services.weather import fetch_weather_for_location

router = APIRouter(prefix="/pattern", tags=["pro"])


@router.post("/pro", response_model=ProPatternResponse)
async def pattern_pro(payload: ProPatternRequest) -> ProPatternResponse:
    """
    Pro Pattern-of-the-Day endpoint.
    Now includes optional real weather ingestion.
    """
    # 1) Build the base pattern using existing engine
    result = logic_pro.build_pro_pattern(payload)

    # 2) If caller provided a location_name, attempt live weather retrieval
    if payload.location_name:
        snapshot = fetch_weather_for_location(payload.location_name)

        if snapshot:
            # Ensure conditions object exists
            if result.conditions is None:
                result.conditions = {}

            # Merge live weather into the conditions block
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