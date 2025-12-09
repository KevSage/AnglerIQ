# app/api/vision.py

from __future__ import annotations

from typing import Any, Dict, Optional, Literal

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/vision", tags=["vision"])


# ---------- Request Models ----------


class OnWaterStubRequest(BaseModel):
    # Tests send {"stub": True}, but we ignore the content.
    stub: Optional[bool] = None


class FishfinderStubRequest(BaseModel):
    stub: Optional[bool] = None


class ApplyVisionRequest(BaseModel):
    """
    Shape matches tests/test_routes_vision.py:

    {
        "pattern_conditions": {...},
        "on_water": {...},     # optional
        "fishfinder": {...}    # optional, future-proof
    }
    """

    pattern_conditions: Dict[str, Any]
    on_water: Optional[Dict[str, Any]] = None
    fishfinder: Optional[Dict[str, Any]] = None

class VisionIntelRequest(BaseModel):
    pattern_conditions: Dict[str, Any]
    on_water: Optional[Dict[str, Any]] = None
    fishfinder: Optional[Dict[str, Any]] = None


class VisionConditionsPanel(BaseModel):
    global_line: str
    local_line: str


class VisionConfidenceBlock(BaseModel):
    level: Literal["low", "medium", "high"]
    value: float  # 0–1


class VisionSummaryBlock(BaseModel):
    lines: list[str]


class VisionEnhancedBlock(BaseModel):
    area_confidence: str
    quality_zone: str
    movement_logic: str
    environmental_interpretation: str


class VisionIntelResponse(BaseModel):
    conditions_panel: VisionConditionsPanel
    confidence: VisionConfidenceBlock
    vision_summary: VisionSummaryBlock
    vision_enhanced: VisionEnhancedBlock
    meta: Dict[str, Any] = {}

# ---------- Stub Endpoints ----------


@router.post("/on-water")
def on_water_stub(_: OnWaterStubRequest) -> Dict[str, Any]:
    """
    Simple deterministic stub used by tests.

    Returns a fixed on-water read with the keys the tests expect.
    """
    return {
        "water_clarity": "stained",
        "visible_structure": "riprap",
        "vegetation": "sparse",
        "bank_angle": "moderate",
        "shade_cover": "low",
        "light_penetration": "medium",
        "worth_fishing": True,
        "raw_attributes": {},
    }


@router.post("/fishfinder")
def fishfinder_stub(_: FishfinderStubRequest) -> Dict[str, Any]:
    """
    Deterministic sonar stub.

    Tests expect depth_ft, arch_count, activity_level, bait_present,
    bottom_hardness, and stop_or_keep_moving.
    """
    return {
        "depth_ft": 12.5,
        "arch_count": 5,
        "activity_level": "medium",
        "bait_present": True,
        "bottom_hardness": "hard",
        "stop_or_keep_moving": "stop",
    }


@router.post("/apply-to-pattern")
def apply_vision_to_pattern(payload: ApplyVisionRequest) -> Dict[str, Any]:
    conditions = dict(payload.pattern_conditions)

    # Basic flags
    conditions["vision_enhanced"] = True
    conditions["vision_applied"] = True

    # Echo the on-water read into a dedicated field for the pattern
    # (tests expect this key to exist)
    conditions["vision_on_water"] = payload.on_water or {}

    # If a depth_zone exists, reuse it; otherwise fall back to a generic band
    conditions.setdefault("vision_depth_zone", conditions.get("depth_zone", "mid_band"))

    # Very simple summary block
    conditions["vision_summary"] = {
        "should_camp": payload.on_water.get("worth_fishing", True)
        if payload.on_water
        else True,
        "likely_quality_bite_zone": "primary",
        "confidence_level": "medium",
    }

    return {"updated_conditions": conditions}


def _infer_confidence_level(fishfinder: Dict[str, Any]) -> tuple[str, float]:
    """Very simple, deterministic confidence mapping from arch_count."""
    arches = fishfinder.get("arch_count")
    if not isinstance(arches, (int, float)):
        return "medium", 0.5

    if arches >= 6:
        return "high", 0.85
    if arches >= 3:
        return "medium", 0.6
    return "low", 0.3

@router.post("/intel-screen", response_model=VisionIntelResponse)
def vision_intel_screen(payload: VisionIntelRequest) -> VisionIntelResponse:
    """
    Backend contract for the Vision Intelligence Screen.

    - No AI calls.
    - No pattern regeneration or tier changes.
    - Produces calm, deterministic copy that matches the UI design.
    """

    pattern = payload.pattern_conditions or {}
    on_water = payload.on_water or {}
    fishfinder = payload.fishfinder or {}

    # --- Conditions panel text ---
    global_line = (
        "Today's overall weather and seasonal cues are shaping the current pattern."
    )
    local_line = (
        "Vision is interpreting this specific area from your latest surface and/or sonar inputs."
    )

    conditions_panel = VisionConditionsPanel(
        global_line=global_line,
        local_line=local_line,
    )

    # --- Confidence block ---
    level, value = _infer_confidence_level(fishfinder)
    confidence = VisionConfidenceBlock(level=level, value=value)

    # --- Vision summary lines (the purple card bullets) ---
    summary_lines: list[str] = []

    depth_ft = fishfinder.get("depth_ft")
    if isinstance(depth_ft, (int, float)):
        summary_lines.append(
            f"High confidence around the mid-depth break around ~{depth_ft:.0f} ft."
        )
    elif level == "high":
        summary_lines.append("High confidence around the mid-depth break.")

    visible_structure = on_water.get("visible_structure")
    vegetation = on_water.get("vegetation")
    if visible_structure or vegetation:
        bits = []
        if visible_structure:
            bits.append(visible_structure)
        if vegetation:
            bits.append(vegetation)
        summary_lines.append(
            "Best quality zone is the transition edge where " + " and ".join(bits) + " meet."
        )

    if depth_ft:
        summary_lines.append(
            f"Target {max(depth_ft - 4, 1):.0f}–{depth_ft + 4:.0f} ft as the primary strike window."
        )

    summary_lines.append(
        "Work the best-looking stretches thoroughly, then hop to similar structure."
    )

    vision_summary = VisionSummaryBlock(lines=summary_lines)

    # --- Vision Enhanced detail sections (lower card) ---
    area_confidence = summary_lines[0] if summary_lines else (
        "Confidence here is moderate based on the available surface and sonar cues."
    )

    quality_zone = (
        "Best quality zone is the transition edge where grass ends and hard bottom begins."
    )

    movement_logic = (
        "Slide along the contour, focusing on points, subtle inside turns, and any stretch where the screen looks most alive."
    )

    environmental_interpretation = (
        "Wind and light angle are positioning baitfish slightly off the main break, so cast across the seam rather than straight up and down it."
    )

    vision_enhanced = VisionEnhancedBlock(
        area_confidence=area_confidence,
        quality_zone=quality_zone,
        movement_logic=movement_logic,
        environmental_interpretation=environmental_interpretation,
    )

    meta = {
        "version": "vision-intel-v1-stub",
        "has_on_water": bool(on_water),
        "has_fishfinder": bool(fishfinder),
        "phase": pattern.get("phase"),
        "tier": pattern.get("tier"),
    }

    return VisionIntelResponse(
        conditions_panel=conditions_panel,
        confidence=confidence,
        vision_summary=vision_summary,
        vision_enhanced=vision_enhanced,
        meta=meta,
    )