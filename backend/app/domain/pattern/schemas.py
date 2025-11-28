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


class ProPatternRequest(BaseModel):
    temp_f: float
    month: int
    clarity: str
    wind_speed: float
    sky_condition: str          # accepts "cloudy" fine
    depth_ft: Optional[float] = None
    bottom_composition: Optional[str] = None
    forage: Optional[List[str]] = None  # ["shad", "bluegill"], etc.


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
