from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Tuple

from app.services.snapshot_hash import SnapshotHashConfig, build_hash_input, snapshot_hash


@dataclass(frozen=True)
class RegenThresholds:
    # Location trigger
    location_distance_m: float = 500.0  # choose your canonical default

    # Weather triggers (meaningful deltas)
    temp_f_delta: float = 4.0
    wind_mph_delta: float = 4.0

    # Cloud cover changes treated as meaningful if bucket changes
    cloud_cover_bucket_change: bool = True


def _haversine_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Haversine distance in meters. No external deps.
    """
    import math

    r = 6371000.0  # meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return r * c


def _bucket_cloud_cover(v: Optional[str]) -> Optional[str]:
    if not v:
        return None
    s = v.strip().lower()
    # Your weather service currently yields: clear / partly cloudy / overcast
    # If later you expand, bucket here.
    if "overcast" in s:
        return "overcast"
    if "partly" in s:
        return "partly"
    if "clear" in s:
        return "clear"
    return s


def should_suggest_regeneration(
    *,
    tier: str,  # "pro" | "elite" | "vision"
    # stored pattern context
    pattern_snapshot_hash: str,
    pattern_weather: Dict[str, Any],
    pattern_lat: Optional[float] = None,
    pattern_lon: Optional[float] = None,
    pattern_time_bucket: Optional[str] = None,
    # current context
    current_weather: Dict[str, Any],
    current_lat: Optional[float] = None,
    current_lon: Optional[float] = None,
    current_time_bucket: Optional[str] = None,
    # Vision-only input flag (no implementation detail here)
    vision_contradiction: Optional[bool] = None,
    thresholds: RegenThresholds = RegenThresholds(),
    hash_config: SnapshotHashConfig = SnapshotHashConfig(),
) -> Tuple[bool, List[str]]:
    """
    Returns (should_suggest, reasons[])

    IMPORTANT:
    - Suggestion only. Caller must require explicit user confirmation.
    - Tier gating:
      Pro/Elite: location/weather/time drift
      Vision: adds optional vision_contradiction flag (provided by caller)
    """
    tier_norm = tier.strip().lower()
    if tier_norm not in ("pro", "elite", "vision"):
        raise ValueError(f"Unknown tier: {tier}")

    reasons: List[str] = []

    # Build current hash using the same canonical builder
    current_hash = snapshot_hash(
        weather=current_weather,
        config=hash_config,
        lat=current_lat,
        lon=current_lon,
        time_bucket=current_time_bucket,
    )

    # Quick exit: if identical, no need to dig deeper
    if current_hash == pattern_snapshot_hash:
        # Vision contradiction can still matter if you want it to override
        if tier_norm == "vision" and vision_contradiction:
            return True, ["vision_contradiction"]
        return False, []

    # 1) Location shift (Pro/Elite/Vision)
    if (
        pattern_lat is not None
        and pattern_lon is not None
        and current_lat is not None
        and current_lon is not None
    ):
        dist = _haversine_m(pattern_lat, pattern_lon, current_lat, current_lon)
        if dist >= thresholds.location_distance_m:
            reasons.append("location_shift")

    # 2) Meaningful weather delta (Pro/Elite/Vision)
    # (Use rounded values if you want, but keep consistent with hash_config rounding policy.)
    p_temp = pattern_weather.get("temp_f")
    c_temp = current_weather.get("temp_f")
    if isinstance(p_temp, (int, float)) and isinstance(c_temp, (int, float)):
        if abs(float(c_temp) - float(p_temp)) >= thresholds.temp_f_delta:
            reasons.append("weather_shift_temp")

    p_wind = pattern_weather.get("wind_mph")
    c_wind = current_weather.get("wind_mph")
    if isinstance(p_wind, (int, float)) and isinstance(c_wind, (int, float)):
        if abs(float(c_wind) - float(p_wind)) >= thresholds.wind_mph_delta:
            reasons.append("weather_shift_wind")

    if thresholds.cloud_cover_bucket_change:
        if _bucket_cloud_cover(pattern_weather.get("cloud_cover")) != _bucket_cloud_cover(
            current_weather.get("cloud_cover")
        ):
            reasons.append("weather_shift_clouds")

    # 3) Time bucket drift (Pro/Elite/Vision)
    # Keep it gentle: only count if bucket differs AND there is at least one other supporting factor,
    # otherwise you will nag.
    if pattern_time_bucket and current_time_bucket:
        if pattern_time_bucket.strip().lower() != current_time_bucket.strip().lower():
            # Only add time drift if already meaningful changes exist
            if reasons:
                reasons.append("time_bucket_change")

    # 4) Vision-only contradiction hook (Vision)
    if tier_norm == "vision" and vision_contradiction:
        reasons.append("vision_contradiction")

    return (len(reasons) > 0), reasons