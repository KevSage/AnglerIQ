# app/api/pattern/vision_tier.py

from typing import Any, Dict, Optional

from fastapi import APIRouter, HTTPException
from pydantic import ValidationError

from app.domain.pattern.schemas import ElitePatternRequest, ElitePatternResponse
from app.domain.pattern.context import VisionContext
from app.domain.pattern.logic_elite import build_elite_pattern

# 🔹 NEW — real weather ingestion
from app.services.weather import fetch_weather_for_location

# Align with pro.py / elite.py
router = APIRouter(prefix="/pattern", tags=["vision"])


@router.post("/vision-tier", response_model=ElitePatternResponse)
def pattern_vision_tier(payload: Dict[str, Any]) -> ElitePatternResponse:
    """
    Vision-tier = Elite + optional Vision context.

    Accepted request shapes:

    1) Flat Elite-style body (what Home / Pattern of the Day uses):

        {
          "location_name": "...",
          "time_of_day": "dawn",
          "pressure_trend": "falling",
          "water_level_trend": "rising",
          "tournament_mode": false
        }

    2) Nested Vision-aware body (for future Vision integration):

        {
          "pattern": {
            ...ElitePatternRequest fields...
          },
          "vision": {
            ...VisionContext fields (depth_ft, arch_count, activity_level, etc.)...
          }
        }

    In both cases we return an ElitePatternResponse. If a VisionContext
    is provided, it is passed into build_elite_pattern; otherwise we
    just build the standard Elite pattern.
    """

    # Detect flat vs nested pattern payload
    if "pattern" in payload:
        pattern_data = payload["pattern"]
        vision_data: Optional[Dict[str, Any]] = payload.get("vision")
    else:
        # Treat the entire body as the pattern; vision is optional
        pattern_data = payload
        vision_data = payload.get("vision")

    # Validate / build ElitePatternRequest
    try:
        pattern_req = ElitePatternRequest(**pattern_data)
    except ValidationError as e:
        raise HTTPException(
            status_code=422,
            detail={"error": "Invalid pattern payload", "details": e.errors()},
        )

    # Vision context is optional
    vision_ctx: Optional[VisionContext] = None
    if vision_data is not None:
        try:
            vision_ctx = VisionContext(**vision_data)
        except ValidationError as e:
            raise HTTPException(
                status_code=422,
                detail={"error": "Invalid vision payload", "details": e.errors()},
            )

    # Vision-tier reuses Elite logic with optional Vision context
    elite_result = build_elite_pattern(pattern_req, vision_ctx=vision_ctx)

    # 🔹 Live weather enrichment (non-destructive), same pattern as Pro/Elite
    if pattern_req.location_name:
        snapshot = fetch_weather_for_location(pattern_req.location_name)

        if snapshot:
            if elite_result.conditions is None:
                elite_result.conditions = {}

            if snapshot.temp_f is not None:
                elite_result.conditions["temp_f"] = snapshot.temp_f
            if snapshot.wind_mph is not None:
                elite_result.conditions["wind_mph"] = snapshot.wind_mph
            if snapshot.pressure_trend is not None:
                elite_result.conditions["pressure_trend"] = snapshot.pressure_trend
            if snapshot.cloud_cover is not None:
                elite_result.conditions["cloud_cover"] = snapshot.cloud_cover
            if snapshot.clarity_estimate is not None:
                elite_result.conditions["clarity_estimate"] = snapshot.clarity_estimate
            if snapshot.season_phase is not None:
                elite_result.conditions["season_phase"] = snapshot.season_phase

    return elite_result