from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class BasicPatternRequest(BaseModel):
    temp_f: float
    month: int
    clarity: str
    wind_speed: float


class BasicPatternResponse(BaseModel):
    phase: str
    depth_zone: str
    recommended_techniques: List[str]
    targets: List[str]
    notes: str


class LureSetup(BaseModel):
    lure: str
    technique: str
    rod: str
    reel: str
    line: str
    hook_or_leader: str
    lure_size: str


from typing import Any, Dict, List, Optional
from pydantic import BaseModel

# --- existing Basic + LureSetup stay as-is ---

class BasicPatternRequest(BaseModel):
    temp_f: float
    month: int
    clarity: str
    wind_speed: float


class BasicPatternResponse(BaseModel):
    phase: str
    depth_zone: str
    recommended_techniques: List[str]
    targets: List[str]
    notes: str


class LureSetup(BaseModel):
    lure: str
    technique: str
    rod: str
    reel: str
    line: str
    hook_or_leader: str
    lure_size: str


# --- UPDATED: ProPatternRequest / Response (no month, auto-weather) ---


# --- UPDATED: ProPatternRequest / Response (no month, auto-weather) ---


class ProPatternRequest(BaseModel):
    """
    Pro = rules-based pattern engine with auto weather.

    The client does NOT send date/month or weather.
    We use location to fetch weather, but allow optional overrides for clarity
    and bottom composition.

    In V1, location_name is required; lat/lon are optional.
    """
    location_name: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    # Optional user hints
    clarity: Optional[str] = None
    bottom_composition: Optional[str] = None  # "rock", "sand", "mud", etc.
    depth_ft: Optional[float] = None
    forage: Optional[List[str]] = None


class ProPatternResponse(BaseModel):
    phase: str
    depth_zone: str
    recommended_lures: List[str]
    recommended_targets: List[str]
    strategy_tips: List[str]
    color_recommendations: List[str]
    lure_setups: List[LureSetup]
    conditions: Dict[str, Any]
    notes: str


# --- UPDATED: ElitePatternRequest / Response on top of Pro ---


class ElitePatternRequest(ProPatternRequest):
    """
    Elite = Pro + session context (no vision, no manual weather/date).
    """
    time_of_day: Optional[str] = None        # "dawn" | "midday" | "afternoon" | "evening" | "night"
    pressure_trend: Optional[str] = None    # "rising" | "falling" | "stable"
    water_level_trend: Optional[str] = None # "rising" | "falling" | "stable"
    tournament_mode: bool = False


class ElitePatternResponse(BaseModel):
    """
    Elite returns:
    - Pro-style pattern
    - PLUS a session gameplan and adjustment rules.
    """
    phase: str
    depth_zone: str
    recommended_lures: List[str]
    recommended_targets: List[str]
    strategy_tips: List[str]
    color_recommendations: List[str]
    lure_setups: List[LureSetup]
    notes: str

    gameplan: List[str]
    adjustments: List[str]
    conditions: Dict[str, Any]
