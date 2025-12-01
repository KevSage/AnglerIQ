# app/domain/pattern/context.py
from dataclasses import dataclass
from datetime import datetime
from typing import Optional, Literal


@dataclass
class WeatherContext:
    """
    Shared weather context used by Pro/Elite/Vision/fusion logic.
    """
    temp_f: float
    wind_speed: float
    sky_condition: str
    timestamp: datetime


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
