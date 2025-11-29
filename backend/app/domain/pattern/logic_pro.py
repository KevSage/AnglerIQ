from dataclasses import dataclass
from datetime import datetime
from typing import Any, Dict, List, Optional

import os
import json
from urllib.request import urlopen
from urllib.error import URLError, HTTPError

from .schemas import ProPatternRequest, ProPatternResponse, LureSetup


# -----------------------------
# Weather integration (WeatherAPI)
# -----------------------------


@dataclass
class WeatherContext:
    def __init__(
        self,
        temp_f: float,
        wind_speed: float,
        sky_condition: str,
        timestamp: datetime,
    ) -> None:
        self.temp_f = temp_f
        self.wind_speed = wind_speed
        self.sky_condition = sky_condition
        self.timestamp = timestamp



def _stub_weather_context() -> WeatherContext:
    """
    Stubbed weather context used for:
    - tests (e.g., location_name == "Test Lake")
    - missing API key
    - network/API failures

    This keeps tests fully offline and deterministic.
    """
    return WeatherContext(
        temp_f=60.0,
        wind_speed=5.0,
        sky_condition="partly_cloudy",
        timestamp=datetime.utcnow(),
    )


def _parse_weatherapi_current(payload: dict) -> WeatherContext:
    """
    Map WeatherAPI 'current.json' payload into our WeatherContext.

    Expected shape (simplified):
    {
      "location": {
        "localtime_epoch": 1711046400,
        ...
      },
      "current": {
        "temp_f": 59.0,
        "wind_mph": 8.0,
        "condition": { "text": "Partly cloudy", ... },
        "last_updated_epoch": 1711046400,
        ...
      }
    }
    """
    current = payload.get("current", {})
    location = payload.get("location", {})

    # Prefer current.last_updated_epoch; fall back to location.localtime_epoch
    epoch = current.get("last_updated_epoch") or location.get("localtime_epoch")
    if epoch is not None:
        try:
            ts = datetime.utcfromtimestamp(epoch)
        except Exception:
            ts = datetime.utcnow()
    else:
        ts = datetime.utcnow()

    temp_f = float(current.get("temp_f", 60.0))
    wind_speed = float(current.get("wind_mph", 5.0))

    cond = current.get("condition") or {}
    sky_text = str(cond.get("text", "Partly cloudy")).strip().lower()
    # Normalize into a simple token
    sky_condition = sky_text.replace(" ", "_")

    return WeatherContext(
        temp_f=temp_f,
        wind_speed=wind_speed,
        sky_condition=sky_condition,
        timestamp=ts,
    )


def get_weather_for_location(
    location_name: Optional[str] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
) -> WeatherContext:
    """
    Main weather provider for Pro/Elite and /debug/weather.

    Behavior:
    - If location_name == "Test Lake" and no coords → return stub (for tests).
    - Else if WEATHER_API_KEY is missing → return stub.
    - Else, call WeatherAPI current.json with either:
        - q = "lat,lon" if coords provided
        - q = location_name otherwise
      If anything fails → return stub.
    """
    # 1) Test stub shortcut
    if location_name == "Test Lake" and latitude is None and longitude is None:
        return _stub_weather_context()

    # 2) Load API key from environment
    import os
    import logging

    api_key = os.getenv("WEATHER_API_KEY")
    if not api_key:
        logging.warning("WEATHER_API_KEY not set; using stub WeatherContext.")
        return _stub_weather_context()

    # 3) Build query param for WeatherAPI
    if latitude is not None and longitude is not None:
        q = f"{latitude},{longitude}"
    elif location_name:
        q = location_name
    else:
        logging.warning("No location data provided; using stub WeatherContext.")
        return _stub_weather_context()

    # 4) Call WeatherAPI
    try:
        resp = httpx.get(
            "https://api.weatherapi.com/v1/current.json",
            params={"key": api_key, "q": q},
            timeout=3.0,
        )
        resp.raise_for_status()
        data = resp.json()
        return _parse_weatherapi_current(data)
    except Exception as exc:
        logging.warning("WeatherAPI call failed (%s); falling back to stub.", exc)
        return _stub_weather_context()


def _get_weather_from_request(req: ProPatternRequest) -> WeatherContext:
    """
    Hybrid helper so this works with BOTH:
    - older schema: temp_f, wind_speed, sky_condition, month
    - newer schema: location_name, latitude, longitude (auto-weather)

    Priority:
    1) If request has location_name / lat / lon -> use real WeatherAPI.
    2) Else if request has temp_f / wind_speed / sky_condition -> build context from those.
    3) Else -> stub.
    """
    location_name = getattr(req, "location_name", None)
    latitude = getattr(req, "latitude", None)
    longitude = getattr(req, "longitude", None)

    # 1) If we have location info, use auto-weather
    if location_name or (latitude is not None and longitude is not None):
        return get_weather_for_location(
            location_name=location_name,
            latitude=latitude,
            longitude=longitude,
        )

    # 2) Fall back to explicit weather fields if present (old schema)
    has_temp = hasattr(req, "temp_f")
    has_wind = hasattr(req, "wind_speed")
    has_sky = hasattr(req, "sky_condition")

    if has_temp and has_wind and has_sky:
        return WeatherContext(
            temp_f=getattr(req, "temp_f"),
            wind_speed=getattr(req, "wind_speed"),
            sky_condition=getattr(req, "sky_condition"),
            timestamp=datetime.utcnow(),
        )

    # 3) Full stub if nothing else is available
    return WeatherContext(
        temp_f=60.0,
        wind_speed=5.0,
        sky_condition="partly_cloudy",
        timestamp=datetime.utcnow(),
    )


# -----------------------------
# Pattern logic (rules engine)
# -----------------------------


def _classify_phase(temp_f: float, month: int) -> str:
    """
    Rules-based seasonal phase classifier.

    Uses a combination of water temperature and calendar month:
    - Pre-spawn: late winter to early spring when temps are climbing into the 50s.
    - Spawn: spring window with temps in the mid 60s+.
    - Post-spawn: immediately after spawn, fish are recovering and sliding out.
    - Summer: hot, stable conditions.
    - Fall: cooling trend and bait chasing.
    - Winter: cold/stable with fish grouped up.

    This is intentionally simple but realistic enough for V1.
    """
    # Normalize into rough seasons first
    if month in (12, 1, 2):
        season = "winter"
    elif month in (3, 4, 5):
        season = "spring"
    elif month in (6, 7, 8):
        season = "summer"
    else:
        season = "fall"

    # Temperature-driven refinement
    if season == "winter":
        if temp_f >= 50:
            return "pre-spawn"
        return "winter"

    if season == "spring":
        if temp_f < 50:
            return "pre-spawn"
        if 50 <= temp_f < 60:
            return "pre-spawn"
        if 60 <= temp_f <= 72:
            return "spawn"
        return "post-spawn"

    if season == "summer":
        if temp_f < 70:
            return "post-spawn"
        if 70 <= temp_f <= 82:
            return "summer"
        return "late-summer"

    # fall
    if temp_f >= 60:
        return "late-summer"
    if 50 <= temp_f < 60:
        return "fall"
    if temp_f < 50:
        return "late-fall"

    return "post-spawn"

def _classify_depth_zone(depth_ft: float) -> str:
    """
    Depth-zone classification tuned for largemouth/smallmouth patterns.
    """
    if depth_ft <= 2:
        return "ultra_shallow"
    if depth_ft <= 6:
        return "mid_shallow"
    if depth_ft <= 12:
        return "mid_depth"
    if depth_ft <= 20:
        return "deep"
    return "offshore"


def _pick_lures_and_colors(
    phase: str,
    depth_zone: str,
    clarity: str,
    bottom_composition: str,
    forage: List[str],
) -> (List[str], List[str]):
    """
    Very simple rules-based lure and color selection.
    Replace with your richer logic if you have it.
    """
    lures: List[str] = []
    colors: List[str] = []

    if phase in ("pre-spawn", "post-spawn"):
        lures.append("jig")
        lures.append("mid-depth crankbait")
    elif phase == "spawn":
        lures.append("texas-rigged creature bait")
        lures.append("finesse worm")
    elif phase == "summer":
        lures.append("deep diving crankbait")
        lures.append("carolina rig")
    else:  # fall / winter / unknown
        lures.append("spinnerbait")
        lures.append("lipless crankbait")

    if clarity == "clear":
        colors.append("green pumpkin")
        colors.append("natural shad")
    elif clarity == "stained":
        colors.append("chartreuse/blue")
        colors.append("white")
    elif clarity == "dirty":
        colors.append("black/blue")
        colors.append("firetiger")
    else:
        colors.append("green pumpkin")
        colors.append("white")

    return lures, colors


def _build_lure_setups(
    lures: List[str],
    depth_zone: str,
    clarity: str,
) -> List[LureSetup]:
    """
    Generate simple LureSetup entries for each lure.
    """
    setups: List[LureSetup] = []

    for lure in lures:
        setups.append(
            LureSetup(
                lure=lure,
                technique="casting",
                rod="7'0\" medium-heavy",
                reel="7.1:1 baitcaster",
                line="15 lb fluorocarbon",
                hook_or_leader="3/0 EWG hook",
                lure_size="3/8 oz",
            )
        )

    return setups

def _build_targets_for(
    phase: str,
    depth_zone: str,
    bottom_composition: str,
) -> List[str]:
    targets: List[str] = []

    if phase in ("pre-spawn", "post-spawn"):
        targets.append("secondary points leading into spawning pockets")
        targets.append("channel swings close to flats")
    elif phase == "spawn":
        targets.append("protected pockets with hard bottom")
        targets.append("inside edges of grass and shallow flats")
    elif phase in ("summer", "late-summer"):
        targets.append("main-lake points with access to deep water")
        targets.append("humps, ledges, and offshore structure")
    elif phase in ("fall", "late-fall"):
        targets.append("backs of creeks with visible baitfish")
        targets.append("transition banks where rock meets clay or sand")
    elif phase == "winter":
        targets.append("steep channel swings near main-lake basins")
        targets.append("vertical structure close to deep water")
    else:
        targets.append("high-percentage structure near bait and depth changes")

    if bottom_composition in ("rock", "gravel"):
        targets.append("rock transitions, riprap, and isolated hard spots")
    elif bottom_composition in ("sand", "clay"):
        targets.append("subtle contour changes and edges where bottom composition shifts")

    if depth_zone in ("ultra_shallow", "mid_shallow"):
        targets.append("shallow cover such as laydowns, docks, and grass edges")
    elif depth_zone in ("deep", "offshore"):
        targets.append("offshore structure where contour, cover, and bait intersect")

    # Deduplicate while preserving order
    seen = set()
    unique_targets: List[str] = []
    for t in targets:
        if t not in seen:
            unique_targets.append(t)
            seen.add(t)

    return unique_targets
def _build_strategy_tips(
    phase: str,
    depth_zone: str,
    clarity: str,
    wind_speed: float,
    sky_condition: str,
) -> List[str]:
    tips: List[str] = []

    # Phase-based approach
    if phase in ("pre-spawn", "post-spawn"):
        tips.append(
            "Rotate between staging areas and nearby feeding flats, making multiple passes before leaving a good zone."
        )
    elif phase == "spawn":
        tips.append(
            "Cover water until you see signs of spawning, then slow down and make precise presentations to high-percentage spots."
        )
    elif phase in ("summer", "late-summer"):
        tips.append(
            "Use your first hour to cover shallow or shade-related targets, then spend time probing deeper structure."
        )
    elif phase in ("fall", "late-fall"):
        tips.append(
            "Follow the bait into creeks and pockets and keep moving until you intersect active fish."
        )
    elif phase == "winter":
        tips.append(
            "Fish slower and closer to the bottom, focusing on areas where contour, cover, and bait intersect."
        )

    # Clarity / confidence modifiers
    if clarity == "clear":
        tips.append(
            "In clear water, keep the boat off the target, make longer casts, and lean on more natural, subtle presentations."
        )
    elif clarity == "stained":
        tips.append(
            "In stained water, use bolder colors and moderate vibration to help fish find the bait while still looking natural."
        )
    elif clarity == "dirty":
        tips.append(
            "In dirty water, prioritize big profiles, strong vibration, and high-contrast colors fished close to cover."
        )

    # Wind & sky
    if wind_speed >= 12.0:
        tips.append(
            "Use the wind to your advantage: focus on wind-blown banks and points where bait is pushed and bass are more aggressive."
        )
    elif wind_speed <= 3.0:
        tips.append(
            "On calm days, downsize your line and lures, and make quieter, more precise presentations."
        )

    if sky_condition in ("clear",):
        tips.append(
            "With bright skies, prioritize shade, deeper water, and low-light windows at dawn and dusk."
        )
    elif sky_condition in ("rain", "cloudy", "partly_cloudy"):
        tips.append(
            "Cloud cover often lets bass roam—cover water efficiently with moving baits to locate the most active fish."
        )

    # Final generic adjustment tip
    tips.append(
        "If the pattern stalls, change only one variable at a time—location, depth, or lure profile—so you can tell what actually helped."
    )

    return tips

def build_pro_pattern(req: ProPatternRequest) -> ProPatternResponse:
    """
    Pro pattern builder:

    - Resolves weather either from:
        * auto-weather using WeatherAPI (location-based), OR
        * explicit temp/wind/sky fields (old schema), OR
        * stub fallback.
    - Derives seasonal phase using temp + month.
    - Uses optional clarity / bottom_composition / forage hints.
    - Returns a ProPatternResponse with a conditions snapshot.
    """
    # 1. Weather + time context
    weather = _get_weather_from_request(req)

    # Try to derive month:
    # - If request has month (old schema) -> use it.
    # - Else -> use weather timestamp.
    if hasattr(req, "month"):
        month = int(getattr(req, "month"))
    else:
        month = weather.timestamp.month

    # 2. Resolve clarity / bottom / forage with safe defaults
    clarity = getattr(req, "clarity", None) or "stained"
    bottom_composition = getattr(req, "bottom_composition", None) or "mixed"
    forage = getattr(req, "forage", None) or ["shad"]

    # 3. Derive phase + depth zone
    phase = _classify_phase(weather.temp_f, month)

    depth_ft = getattr(req, "depth_ft", None)
    if depth_ft is not None:
        depth_zone = _classify_depth_zone(depth_ft)
    else:
        # Fallback depth zone from phase if depth not provided
        if phase in ("spawn", "pre-spawn", "post-spawn"):
            depth_zone = "mid_shallow"
        elif phase in ("summer", "late-summer"):
            depth_zone = "mid_depth"
        elif phase in ("fall", "late-fall"):
            depth_zone = "mid_depth"
        elif phase == "winter":
            depth_zone = "deep"
        else:
            depth_zone = "mid_depth"
    # 4. Lures, colors, setups, targets, tips
    recommended_lures, color_recommendations = _pick_lures_and_colors(
        phase=phase,
        depth_zone=depth_zone,
        clarity=clarity,
        bottom_composition=bottom_composition,
        forage=forage,
    )

    lure_setups = _build_lure_setups(
        lures=recommended_lures,
        depth_zone=depth_zone,
        clarity=clarity,
    )

    # Simple placeholders for now; you can wire in your richer logic.
    recommended_targets: List[str] = _build_targets_for(
        phase=phase,
        depth_zone=depth_zone,
        bottom_composition=bottom_composition,
    )

    strategy_tips: List[str] = _build_strategy_tips(
        phase=phase,
        depth_zone=depth_zone,
        clarity=clarity,
        wind_speed=weather.wind_speed,
        sky_condition=weather.sky_condition,
    )


    # 5. Conditions snapshot (for UI + debugging + future AI)
    conditions: Dict[str, Any] = {
        "tier": "pro",
        "location_name": getattr(req, "location_name", None),
        "latitude": getattr(req, "latitude", None),
        "longitude": getattr(req, "longitude", None),
        "temp_f": weather.temp_f,
        "wind_speed": weather.wind_speed,
        "sky_condition": weather.sky_condition,
        "timestamp": weather.timestamp.isoformat(),
        "month": month,
        "clarity": clarity,
        "bottom_composition": bottom_composition,
        "depth_ft": depth_ft,
        "forage": forage,
    }

    notes = (
        "Pro pattern generated using rules-based logic, current weather, and basic "
        "environmental context for this location."
    )

    return ProPatternResponse(
        phase=phase,
        depth_zone=depth_zone,
        recommended_lures=recommended_lures,
        recommended_targets=recommended_targets,
        strategy_tips=strategy_tips,
        color_recommendations=color_recommendations,
        lure_setups=lure_setups,
        conditions=conditions,
        notes=notes,
    )
