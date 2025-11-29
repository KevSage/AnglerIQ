from __future__ import annotations

from typing import Literal

from .context import WeatherContext, VisionContext, FusedContext


def _estimate_confidence(
    arch_count: int,
    activity_level: Literal["low", "medium", "high"],
    bait_present: bool,
) -> Literal["low", "medium", "high"]:
    """
    Simple heuristic for how confident we are that this is a 'good area'
    based on sonar signal quality.
    """

    score = 0

    # More arches = more life
    score += min(arch_count, 10)  # cap at 10 for sanity

    # Activity level
    if activity_level == "high":
        score += 3
    elif activity_level == "medium":
        score += 1

    # Bait presence is a big deal
    if bait_present:
        score += 3

    if score >= 12:
        return "high"
    if score >= 6:
        return "medium"
    return "low"


def _classify_depth_zone_from_vision(depth_ft: float) -> Literal["shallow", "mid", "deep"]:
    """
    Map raw sonar depth into a coarse zone. These thresholds can be revisited later.
    """
    if depth_ft <= 8:
        return "shallow"
    if depth_ft <= 15:
        return "mid"
    return "deep"


def fuse_weather_and_vision(
    weather: WeatherContext,
    vision: VisionContext,
) -> FusedContext:
    """
    V1 fusion of weather context + sonar/vision context into a FusedContext.

    - should_camp:
        True when sonar shows enough life that it's worth really working the area
        before moving on.
    - likely_quality_bite_zone:
        Depth zone suggested by sonar.
    - confidence_level:
        How strongly sonar suggests 'this is a good area'.
    """

    # Decide whether to 'camp' based on sonar signal
    should_camp = (
        vision.arch_count >= 5
        and vision.activity_level in ("medium", "high")
        and vision.bait_present
        and vision.stop_or_keep_moving == "stop"
    )

    # Depth zone from sonar
    likely_zone = _classify_depth_zone_from_vision(vision.depth_ft)

    # Confidence from sonar quality
    confidence = _estimate_confidence(
        arch_count=vision.arch_count,
        activity_level=vision.activity_level,
        bait_present=vision.bait_present,
    )

    return FusedContext(
        weather=weather,
        vision=vision,
        should_camp=should_camp,
        likely_quality_bite_zone=likely_zone,
        confidence_level=confidence,
    )
