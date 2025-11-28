# backend/app/domain/pattern/logic_pro.py

from typing import Optional, List, Tuple
from dataclasses import dataclass
from datetime import datetime
from .schemas import ProPatternRequest, ProPatternResponse, LureSetup


def _classify_phase(temp_f: float, month: int) -> str:
    """
    Very simple seasonal/temperature phase classification.
    You can replace this with your existing classify_phase() later.
    """
    if 48 <= temp_f <= 60 and 2 <= month <= 4:
        return "pre-spawn"
    if 60 <= temp_f <= 72 and 3 <= month <= 5:
        return "spawn"
    if 65 <= temp_f <= 75 and 4 <= month <= 6:
        return "post-spawn"
    if temp_f > 75 and 5 <= month <= 9:
        return "summer"
    if 55 <= temp_f <= 70 and 9 <= month <= 11:
        return "fall"
    return "winter"


def _classify_depth_zone(depth_ft: Optional[float]) -> str:
    """
    Map a numeric depth into a named depth zone.
    If depth_ft is None, use a reasonable default for most 'pro' requests.
    """
    if depth_ft is None:
        return "mid-depth"

    if depth_ft <= 3:
        return "ultra_shallow"
    if depth_ft <= 6:
        return "shallow"
    if depth_ft <= 10:
        return "mid_shallow"
    if depth_ft <= 18:
        return "mid_depth"
    if depth_ft <= 30:
        return "deep"
    return "offshore"


def _pick_lures_and_colors(
    phase: str,
    depth_zone: str,
    clarity: Optional[str],
    bottom_composition: Optional[str],
    forage: Optional[List[str]],
) -> Tuple[List[str], List[str]]:
    """
    Very simple lure + color recommendation logic.
    This is a placeholder you can later replace with gear_presets or more advanced logic.
    """
    forage = forage or []
    clarity = clarity or "stained"
    bottom_composition = (bottom_composition or "mixed").lower()

    lures: List[str] = []
    colors: List[str] = []

    # Base lure families by phase/depth
    if phase in ("pre-spawn", "post-spawn"):
        if depth_zone in ("mid_shallow", "mid_depth"):
            lures.append("Mid-depth Crankbait")
            lures.append("Bladed Jig")
        else:
            lures.append("Texas Rig Worm")
    elif phase == "spawn":
        lures.append("Texas Rig Creature")
        lures.append("Weightless Stickbait")
    elif phase == "summer":
        if depth_zone in ("mid_depth", "deep", "offshore"):
            lures.append("Football Jig")
            lures.append("Carolina Rig")
        else:
            lures.append("Spinnerbait")
    elif phase == "fall":
        lures.append("Shallow Crankbait")
        lures.append("Swimbait")
    else:  # winter
        lures.append("Finesse Jig")
        lures.append("Ned Rig")

    # Color logic based on clarity + forage
    if clarity == "clear":
        if "shad" in forage:
            colors.append("Natural shad")
        if "bluegill" in forage:
            colors.append("Green pumpkin with subtle flake")
        if not colors:
            colors.append("Translucent natural")
    elif clarity == "stained":
        colors.append("Green pumpkin")
        colors.append("Chartreuse/blue back crankbait")
    else:  # muddy
        colors.append("Black/blue")
        colors.append("Chartreuse/black")

    # Small bottom tweak
    if "rock" in bottom_composition and "Football Jig" not in lures:
        lures.append("Football Jig")

    # Deduplicate while preserving order
    seen = set()
    lures = [l for l in lures if not (l in seen or seen.add(l))]
    seen = set()
    colors = [c for c in colors if not (c in seen or seen.add(c))]

    return lures, colors


def _build_lure_setups(
    lures: List[str],
    depth_zone: str,
    clarity: str,
) -> List[LureSetup]:
    """
    Build simple, generic setups tied to each lure.
    This is where you can later plug in gear_presets or more detailed rules.
    """
    setups: List[LureSetup] = []

    for lure in lures:
        if "Crankbait" in lure:
            setups.append(
                LureSetup(
                    lure=lure,
                    technique="Cranking",
                    rod="7'0\" MH Moderate Rod",
                    reel="6.4:1 Baitcaster",
                    line="10–14lb Fluorocarbon",
                    hook_or_leader="Stock trebles",
                    lure_size="3/8–1/2 oz",
                )
            )
        elif "Jig" in lure:
            setups.append(
                LureSetup(
                    lure=lure,
                    technique="Bottom contact",
                    rod="7'2\" H Fast Rod",
                    reel="7.1:1 Baitcaster",
                    line="15–17lb Fluorocarbon",
                    hook_or_leader="3/0–4/0 jig hook",
                    lure_size="3/8–1/2 oz",
                )
            )
        elif "Carolina Rig" in lure:
            setups.append(
                LureSetup(
                    lure=lure,
                    technique="Dragging",
                    rod="7'3\" MH/H Fast Rod",
                    reel="7.1:1 Baitcaster",
                    line="Main: 15–20lb, leader: 10–15lb",
                    hook_or_leader="Offset worm hook",
                    lure_size="3/8–3/4 oz weight",
                )
            )
        elif "Swimbait" in lure:
            setups.append(
                LureSetup(
                    lure=lure,
                    technique="Steady retrieve",
                    rod="7'2\" MH Rod",
                    reel="6.4:1 Baitcaster",
                    line="12–17lb Fluorocarbon",
                    hook_or_leader="Swimbait hook or jig head",
                    lure_size="3–5\"",
                )
            )
        elif "Spinnerbait" in lure:
            setups.append(
                LureSetup(
                    lure=lure,
                    technique="Slow roll / burn",
                    rod="7'0\" MH Rod",
                    reel="6.4:1 Baitcaster",
                    line="14–17lb Fluorocarbon or mono",
                    hook_or_leader="Spinnerbait with trailer hook optional",
                    lure_size="3/8–1/2 oz",
                )
            )
        else:
            # Generic fallback
            setups.append(
                LureSetup(
                    lure=lure,
                    technique="General purpose",
                    rod="7'0\" MH Rod",
                    reel="6.4:1 Baitcaster",
                    line="12–17lb Fluorocarbon",
                    hook_or_leader="Appropriate hook/rig for lure",
                    lure_size="Standard size",
                )
            )

    return setups

@dataclass
class WeatherContext:
    temp_f: float
    wind_speed: float
    sky_condition: str
    timestamp: datetime


def get_weather_for_location(
    location_name: str,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
) -> WeatherContext:
    """
    V1 stub: replace with a real weather API integration later.

    For now we just return a static but reasonable context so tests and the
    engine work end-to-end.
    """
    return WeatherContext(
        temp_f=60.0,
        wind_speed=5.0,
        sky_condition="partly_cloudy",
        timestamp=datetime.utcnow(),
    )

def build_pro_pattern(req: ProPatternRequest) -> ProPatternResponse:
    """
    Pro pattern builder:

    - Fetches weather for the given location.
    - Derives seasonal context from the weather timestamp.
    - Uses optional clarity / bottom_composition / forage hints if provided.
    - Returns a ProPatternResponse with a conditions snapshot.
    """
    # 1. Weather + time context
    weather: WeatherContext = get_weather_for_location(
    location_name=req.location_name,
    latitude=req.latitude,
    longitude=req.longitude,
)


    month = weather.timestamp.month

    # 2. Resolve clarity / bottom / forage with safe defaults
    clarity = req.clarity or "stained"
    bottom_composition = req.bottom_composition or "mixed"
    forage = req.forage or ["shad"]

    # 3. Derive phase + depth zone
    phase = _classify_phase(weather.temp_f, month)

    if req.depth_ft is not None:
        depth_zone = _classify_depth_zone(req.depth_ft)
    else:
        # Fallback: infer depth zone from phase if depth not provided
        # (reuse or mirror your basic depth logic)
        # You might already have a helper for this.
        depth_zone = "mid_shallow"

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

    # You already have logic for targets & strategy tips; just call it:
    recommended_targets: List[str] = []  # fill via your existing helpers
    strategy_tips: List[str] = []        # same

    # 5. Conditions snapshot (for UI + debugging + future AI)
    conditions: Dict[str, Any] = {
        "tier": "pro",
        "location_name": req.location_name,
        "latitude": req.latitude,
        "longitude": req.longitude,
        "temp_f": weather.temp_f,
        "wind_speed": weather.wind_speed,
        "sky_condition": weather.sky_condition,
        "timestamp": weather.timestamp.isoformat(),
        "month": month,
        "clarity": clarity,
        "bottom_composition": bottom_composition,
        "depth_ft": req.depth_ft,
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
