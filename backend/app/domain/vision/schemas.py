from __future__ import annotations

from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class ConfidenceLevel(str, Enum):
    STRONG = "strong"
    MODERATE = "moderate"
    SOFT = "soft"
    NONE = "none"


# ---------- ON-WATER (BANK PHOTO) ----------

class WaterClarity(BaseModel):
    value: Optional[str] = Field(
        default=None,
        description="clear | lightly_stained | stained | muddy",
    )
    confidence: ConfidenceLevel = ConfidenceLevel.SOFT
    notes: Optional[str] = None


class StructureType(BaseModel):
    type: str = Field(
        ..., description="rock | wood | dock | riprap | bluff | bare_bank | mixed"
    )
    confidence: ConfidenceLevel = ConfidenceLevel.SOFT
    notes: Optional[str] = None


class VegetationInfo(BaseModel):
    present: bool = False
    types: List[str] = Field(
        default_factory=list,
        description="bank_grass | pads | emergent_veg | submerged_veg_hint",
    )
    confidence: ConfidenceLevel = ConfidenceLevel.SOFT
    notes: Optional[str] = None


class ShadeProfile(BaseModel):
    level: Optional[str] = Field(
        default=None,
        description="low | medium | high",
    )
    confidence: ConfidenceLevel = ConfidenceLevel.SOFT
    notes: Optional[str] = None


class BankAngle(BaseModel):
    value: Optional[str] = Field(
        default=None,
        description="flat | moderate | steep",
    )
    confidence: ConfidenceLevel = ConfidenceLevel.SOFT
    notes: Optional[str] = None


class SnagRisk(BaseModel):
    level: Optional[str] = Field(
        default=None,
        description="low | medium | high",
    )
    confidence: ConfidenceLevel = ConfidenceLevel.SOFT
    notes: Optional[str] = None


class CastingLane(BaseModel):
    label: str
    priority: int = 1
    notes: Optional[str] = None


class CastingSuggestions(BaseModel):
    confidence: ConfidenceLevel = ConfidenceLevel.SOFT
    lanes: List[CastingLane] = Field(default_factory=list)


class OnWaterVisionResult(BaseModel):
    """High-level summary of a bank / on-water photo."""

    overall_confidence: ConfidenceLevel = ConfidenceLevel.SOFT

    water_clarity: WaterClarity = Field(default_factory=WaterClarity)
    structure_types: List[StructureType] = Field(default_factory=list)
    vegetation: VegetationInfo = Field(default_factory=VegetationInfo)
    shade_profile: ShadeProfile = Field(default_factory=ShadeProfile)
    bank_angle: BankAngle = Field(default_factory=BankAngle)
    snag_risk: SnagRisk = Field(default_factory=SnagRisk)
    casting_suggestions: CastingSuggestions = Field(
        default_factory=CastingSuggestions
    )


# ---------- SONAR (FISHFINDER) ----------

class DepthReading(BaseModel):
    value_ft: Optional[float] = None
    confidence: ConfidenceLevel = ConfidenceLevel.SOFT
    notes: Optional[str] = None


class BottomHardness(BaseModel):
    value: Optional[str] = Field(
        default=None,
        description="soft | medium | hard | mixed",
    )
    confidence: ConfidenceLevel = ConfidenceLevel.SOFT
    notes: Optional[str] = None


class ActivityLevel(BaseModel):
    level: Optional[str] = Field(
        default=None,
        description="none | low | medium | high",
    )
    confidence: ConfidenceLevel = ConfidenceLevel.SOFT
    notes: Optional[str] = None


class FishActivity(BaseModel):
    level: Optional[str] = Field(
        default=None,
        description="none | low | medium | high",
    )
    position: Optional[str] = Field(
        default=None,
        description="bottom_oriented | suspended | around_bait | scattered",
    )
    confidence: ConfidenceLevel = ConfidenceLevel.SOFT
    notes: Optional[str] = None


class SpeciesGroup(BaseModel):
    group: str = Field(
        ...,
        description="predator | baitfish | panfish | bottom_feeder",
    )
    confidence: ConfidenceLevel = ConfidenceLevel.SOFT
    notes: Optional[str] = None


class SchoolingBehavior(BaseModel):
    value: Optional[str] = Field(
        default=None,
        description="none | loosely_grouped | tightly_schooled",
    )
    confidence: ConfidenceLevel = ConfidenceLevel.SOFT
    notes: Optional[str] = None


class SonarVisionResult(BaseModel):
    """High-level summary of a sonar / fishfinder screenshot."""

    overall_confidence: ConfidenceLevel = ConfidenceLevel.SOFT

    depth_reading: DepthReading = Field(default_factory=DepthReading)
    bottom_hardness: BottomHardness = Field(default_factory=BottomHardness)
    structure_types: List[StructureType] = Field(default_factory=list)
    bait_activity: ActivityLevel = Field(default_factory=ActivityLevel)
    fish_activity: FishActivity = Field(default_factory=FishActivity)
    species_groups: List[SpeciesGroup] = Field(default_factory=list)
    schooling_behavior: SchoolingBehavior = Field(
        default_factory=SchoolingBehavior
    )


# ---------- FUSION (ON-WATER + SONAR) ----------

class PotentialScore(BaseModel):
    score: int = Field(
        0,
        ge=0,
        le=100,
        description="0–100 potential score for this specific spot.",
    )
    label: str = Field(
        "low",
        description="low | medium | high",
    )
    confidence: ConfidenceLevel = ConfidenceLevel.SOFT
    notes: Optional[str] = None


class DepthZoneFusion(BaseModel):
    from_rules: Optional[str] = Field(
        default=None,
        description="e.g. ultra_shallow | mid_shallow | mid_depth | deep",
    )
    adjusted: Optional[str] = None
    confidence: ConfidenceLevel = ConfidenceLevel.SOFT
    reason: Optional[str] = None


class TargetStructureFusion(BaseModel):
    primary: Optional[StructureType] = None
    secondary: List[StructureType] = Field(default_factory=list)


class ForageProfile(BaseModel):
    type: Optional[str] = Field(
        default=None,
        description="baitfish | crawfish | panfish_mix",
    )
    confidence: ConfidenceLevel = ConfidenceLevel.SOFT
    notes: Optional[str] = None


class ForageProfileFusion(BaseModel):
    primary: Optional[ForageProfile] = None
    secondary: List[ForageProfile] = Field(default_factory=list)


class BehaviorSummary(BaseModel):
    role: Optional[str] = Field(
        default=None,
        description="feeding_area | staging_spot | travel_corridor | low_intel",
    )
    confidence: ConfidenceLevel = ConfidenceLevel.SOFT
    notes: Optional[str] = None


class VisionInfluenceFlags(BaseModel):
    depth_adjusted: bool = False
    structure_adjusted: bool = False
    forage_adjusted: bool = False
    recommendation_strength: str = Field(
        "baseline",
        description="baseline | elevated | conservative",
    )


class FusionVisionResult(BaseModel):
    enabled: bool = False
    reason_disabled: Optional[str] = None

    overall_potential: PotentialScore = Field(default_factory=PotentialScore)
    depth_zone: DepthZoneFusion = Field(default_factory=DepthZoneFusion)
    target_structure: TargetStructureFusion = Field(
        default_factory=TargetStructureFusion
    )
    forage_profile: ForageProfileFusion = Field(
        default_factory=ForageProfileFusion
    )
    behavior_summary: BehaviorSummary = Field(default_factory=BehaviorSummary)
    vision_influence_flags: VisionInfluenceFlags = Field(
        default_factory=VisionInfluenceFlags
    )


# ---------- TOP-LEVEL VISION PAYLOAD ----------

class VisionMeta(BaseModel):
    request_id: Optional[str] = None
    version: str = "vision-v1.0"
    processing_ms: Optional[int] = None
    input: dict = Field(
        default_factory=dict,
        description="Flags like has_on_water, has_sonar, paired, etc.",
    )


class VisionPayload(BaseModel):
    """
    Canonical vision structure used across the app:
    - returned by /vision endpoints
    - attached to pattern responses under conditions['vision']
    """

    on_water: Optional[OnWaterVisionResult] = None
    sonar: Optional[SonarVisionResult] = None
    fusion: Optional[FusionVisionResult] = None
    meta: VisionMeta = Field(default_factory=VisionMeta)
