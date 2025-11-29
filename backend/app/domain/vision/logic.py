from __future__ import annotations

import time
import uuid
from typing import Optional

from .schemas import (
    BehaviorSummary,
    ConfidenceLevel,
    DepthZoneFusion,
    ForageProfile,
    ForageProfileFusion,
    FusionVisionResult,
    OnWaterVisionResult,
    PotentialScore,
    SonarVisionResult,
    StructureType,
    TargetStructureFusion,
    VisionMeta,
    VisionPayload,
    VisionInfluenceFlags,
)


# --------- ON-WATER ANALYSIS (STUB) ---------


def analyze_on_water_bytes(data: bytes) -> OnWaterVisionResult:
    """
    Placeholder on-water analysis.

    For V1 backend, this is a deterministic stub:
    - We do NOT attempt real CV yet.
    - We produce a believable, safe, conservative structure.
    """
    # For now, we don't actually inspect `data`.
    # You can later plug in real CV and populate these fields properly.

    result = OnWaterVisionResult(
        overall_confidence=ConfidenceLevel.MODERATE,
    )

    # Example: rocky bank with some shade and moderate snag risk
    result.water_clarity.value = "stained"
    result.water_clarity.confidence = ConfidenceLevel.MODERATE
    result.water_clarity.notes = "Default stained assumption for stub."

    result.structure_types.append(
        StructureType(
            type="rock",
            confidence=ConfidenceLevel.MODERATE,
            notes="Assuming visible rock along bank (stub).",
        )
    )

    result.vegetation.present = False
    result.vegetation.confidence = ConfidenceLevel.SOFT

    result.shade_profile.level = "medium"
    result.shade_profile.confidence = ConfidenceLevel.MODERATE
    result.shade_profile.notes = "Assuming partial shade along bank (stub)."

    result.bank_angle.value = "moderate"
    result.bank_angle.confidence = ConfidenceLevel.MODERATE

    result.snag_risk.level = "medium"
    result.snag_risk.confidence = ConfidenceLevel.SOFT
    result.snag_risk.notes = "Some wood/rock likely present (stub)."

    # Simple casting suggestion
    result.casting_suggestions.confidence = ConfidenceLevel.SOFT
    result.casting_suggestions.lanes.append(
        {
            "label": "Parallel casts along bank",
            "priority": 1,
            "notes": "Work along the contour before moving deeper.",
        }
    )

    return result


# --------- SONAR ANALYSIS (STUB) ---------


def analyze_sonar_bytes(data: bytes) -> SonarVisionResult:
    """
    Placeholder sonar analysis.

    For V1 backend:
    - We DO NOT parse the image yet.
    - We return a simple, consistent pattern that can feed Fusion.
    """
    result = SonarVisionResult(
        overall_confidence=ConfidenceLevel.MODERATE,
    )

    result.depth_reading.value_ft = 14.0
    result.depth_reading.confidence = ConfidenceLevel.MODERATE
    result.depth_reading.notes = "Stub depth reading."

    result.bottom_hardness.value = "hard"
    result.bottom_hardness.confidence = ConfidenceLevel.MODERATE
    result.bottom_hardness.notes = "Stub hard bottom assumption."

    result.bait_activity.level = "medium"
    result.bait_activity.confidence = ConfidenceLevel.MODERATE
    result.bait_activity.notes = "Stub moderate bait presence."

    result.fish_activity.level = "medium"
    result.fish_activity.position = "around_bait"
    result.fish_activity.confidence = ConfidenceLevel.SOFT
    result.fish_activity.notes = "Stub moderate predator presence around bait."

    result.species_groups.append(
        {
            "group": "predator",
            "confidence": ConfidenceLevel.SOFT,
            "notes": "Stub: bass-type predator near structure.",
        }
    )

    result.schooling_behavior.value = "loosely_grouped"
    result.schooling_behavior.confidence = ConfidenceLevel.SOFT

    # You can expand with more nuanced stub behavior later
    return result


# --------- FUSION LOGIC (ON-WATER + SONAR) ---------


def fuse_on_water_and_sonar(
    base_phase: str,
    base_depth_zone: str,
    on_water: Optional[OnWaterVisionResult],
    sonar: Optional[SonarVisionResult],
) -> FusionVisionResult:
    """
    Combine on-water + sonar into a FusionVisionResult, using conservative rules.

    This is where we encode:
    - when to adjust depth zone
    - when to elevate potential
    - how structure/forage are derived
    - how strong/soft the adjustments should be
    """
    fusion = FusionVisionResult(enabled=False)

    if on_water is None and sonar is None:
        fusion.enabled = False
        fusion.reason_disabled = "no_vision_inputs"
        return fusion

    fusion.enabled = True
    fusion.reason_disabled = None

    # ---- Overall Potential ----
    potential = PotentialScore(
        score=50,
        label="medium",
        confidence=ConfidenceLevel.SOFT,
        notes="Baseline potential from fusion stub.",
    )

    if sonar is not None and sonar.bait_activity.level in ("medium", "high"):
        potential.score = 75
        potential.label = "high"
        potential.confidence = ConfidenceLevel.MODERATE
        potential.notes = "Stub: bait + medium fish activity."

    fusion.overall_potential = potential

    # ---- Depth Zone ----
    depth_zone = DepthZoneFusion(
        from_rules=base_depth_zone,
        adjusted=base_depth_zone,
        confidence=ConfidenceLevel.SOFT,
        reason=None,
    )

    # Simple stub rule: if sonar depth exists and differs from base depth band,
    # nudge depth_zone to mid_depth.
    if sonar is not None and sonar.depth_reading.value_ft is not None:
        # Example: always nudge toward mid_depth in stub
        depth_zone.adjusted = "mid_depth"
        depth_zone.confidence = ConfidenceLevel.MODERATE
        depth_zone.reason = (
            "Stub fusion: sonar suggests productive mid-depth zone."
        )

    fusion.depth_zone = depth_zone

    # ---- Target Structure ----
    primary_structure = None
    secondary_structures = []

    if on_water is not None and on_water.structure_types:
        primary_structure = on_water.structure_types[0]
        secondary_structures.extend(on_water.structure_types[1:])

    if primary_structure is None and sonar is not None and sonar.structure_types:
        primary_structure = sonar.structure_types[0]
        secondary_structures.extend(sonar.structure_types[1:])

    fusion.target_structure = TargetStructureFusion(
        primary=primary_structure,
        secondary=secondary_structures,
    )

    # ---- Forage Profile ----
    primary_forage = ForageProfile(
        type="baitfish",
        confidence=ConfidenceLevel.SOFT,
        notes="Stub: default baitfish-driven forage.",
    )

    if sonar is not None and sonar.bait_activity.level in ("medium", "high"):
        primary_forage.confidence = ConfidenceLevel.MODERATE
        primary_forage.notes = "Stub: bait activity suggests shad-type forage."

    fusion.forage_profile = ForageProfileFusion(primary=primary_forage)

    # ---- Behavior Summary ----
    behavior = BehaviorSummary(
        role="feeding_area",
        confidence=ConfidenceLevel.SOFT,
        notes="Stub: fish behaving as feeding area.",
    )

    if sonar is not None and sonar.bait_activity.level == "none":
        behavior.role = "low_intel"
        behavior.notes = "Stub: little bait detected; lower certainty."

    fusion.behavior_summary = behavior

    # ---- Influence Flags ----
    flags = VisionInfluenceFlags(
        depth_adjusted=(depth_zone.adjusted != depth_zone.from_rules),
        structure_adjusted=primary_structure is not None,
        forage_adjusted=True,
        recommendation_strength="elevated",
    )

    if behavior.role == "low_intel":
        flags.recommendation_strength = "conservative"

    fusion.vision_influence_flags = flags

    return fusion


# --------- HIGH-LEVEL HELPER TO BUILD FULL PAYLOAD ---------


def build_vision_payload(
    *,
    has_on_water: bool,
    on_water_bytes: Optional[bytes],
    has_sonar: bool,
    sonar_bytes: Optional[bytes],
    base_phase: str,
    base_depth_zone: str,
) -> VisionPayload:
    """
    End-to-end builder used by /vision endpoints or pattern engine:

    - Optionally analyze on-water and sonar images
    - Build a FusionVisionResult
    - Wrap everything in VisionPayload + meta
    """
    start_ms = int(time.time() * 1000)

    on_water = analyze_on_water_bytes(on_water_bytes) if has_on_water and on_water_bytes else None
    sonar = analyze_sonar_bytes(sonar_bytes) if has_sonar and sonar_bytes else None

    fusion = fuse_on_water_and_sonar(
        base_phase=base_phase,
        base_depth_zone=base_depth_zone,
        on_water=on_water,
        sonar=sonar,
    )

    end_ms = int(time.time() * 1000)

    meta = VisionMeta(
        request_id=str(uuid.uuid4()),
        version="vision-v1.0",
        processing_ms=end_ms - start_ms,
        input={
            "has_on_water": bool(on_water),
            "has_sonar": bool(sonar),
            "paired": bool(on_water and sonar),
        },
    )

    return VisionPayload(
        on_water=on_water,
        sonar=sonar,
        fusion=fusion,
        meta=meta,
    )
