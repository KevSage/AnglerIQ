from dataclasses import dataclass
from typing import Literal


@dataclass
class WeatherContext:
    """
    Compact representation of the weather / environment signals
    your pattern engine cares about.

    These can be populated from your weather integration later.
    """
    temp_f: float
    wind_mph: float
    cloud_cover: Literal["sunny", "partly_cloudy", "overcast"]
    # Add more when needed:
    # pressure_trend: Literal["rising", "falling", "stable"] | None = None
    # recent_rain: bool = False
    # etc.


@dataclass
class VisionContext:
    """
    Distilled sonar/vision info coming from your Vision pipeline.
    This is intentionally small for V1 fusion.
    """
    depth_ft: float
    arch_count: int
    activity_level: Literal["low", "medium", "high"]
    bait_present: bool
    bottom_hardness: Literal["soft", "medium", "hard"]
    stop_or_keep_moving: Literal["stop", "keep_moving"]


@dataclass
class FusedContext:
    """
    The fused view that Elite / Vision tiers will use.
    Fusion will produce this from WeatherContext + VisionContext.
    """
    weather: WeatherContext
    vision: VisionContext

    should_camp: bool               # stop vs keep moving based on fusion
    likely_quality_bite_zone: Literal["shallow", "mid", "deep"]
    confidence_level: Literal["low", "medium", "high"]
