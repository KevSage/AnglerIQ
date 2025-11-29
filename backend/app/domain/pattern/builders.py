from __future__ import annotations
from typing import Optional

from .context import WeatherContext, VisionContext


# ---------------------------------------------------------------------------
# Build WeatherContext from raw weather data (placeholder for now)
# ---------------------------------------------------------------------------

def build_weather_context(
    temp_f: Optional[float] = None,
    wind_mph: Optional[float] = None,
    cloud_cover: Optional[str] = None,
) -> WeatherContext:
    """
    Convert raw weather input (future API output) into a WeatherContext.

    For now, defaults handle the absence of real weather integration:
      - temp_f:      70°F fallback
      - wind_mph:    5 mph fallback
      - cloud_cover: 'partly_cloudy' fallback
    """

    return WeatherContext(
        temp_f=temp_f if temp_f is not None else 70.0,
        wind_mph=wind_mph if wind_mph is not None else 5.0,
        cloud_cover=(cloud_cover or "partly_cloudy"),
    )


# ---------------------------------------------------------------------------
# Build VisionContext from raw vision/sonar data
# ---------------------------------------------------------------------------

def build_vision_context(
    depth_ft: Optional[float] = None,
    arch_count: Optional[int] = None,
    activity_level: Optional[str] = None,
    bait_present: Optional[bool] = None,
    bottom_hardness: Optional[str] = None,
    stop_or_keep_moving: Optional[str] = None,
) -> VisionContext:
    """
    Convert raw sonar/vision output into a VisionContext.
    Defaults match your test stub's semantics.
    """

    return VisionContext(
        depth_ft=depth_ft if depth_ft is not None else 10.0,
        arch_count=arch_count if arch_count is not None else 3,
        activity_level=(activity_level or "medium"),
        bait_present=bait_present if bait_present is not None else False,
        bottom_hardness=(bottom_hardness or "medium"),
        stop_or_keep_moving=(stop_or_keep_moving or "keep_moving"),
    )
