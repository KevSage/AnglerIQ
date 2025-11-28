from typing import List

from .schemas import BasicPatternRequest, BasicPatternResponse


# NOTE:
# 'Basic' here refers to an internal, simplified pattern endpoint.
# It is not a customer-facing tier (current tiers: Pro / Elite / Elite+).


def _classify_phase(temp_f: float, month: int) -> str:
    """
    Simple phase classification used by the Basic (internal Pro-lite) tier.
    Mirrors the general behavior of the Pro engine, but kept light.
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


def _basic_depth_zone_from_phase(phase: str) -> str:
    """
    Basic tier doesn't ask for depth_ft, so we infer a simple default depth zone
    based on seasonal behavior. This keeps the UX light.
    """
    if phase in ("pre-spawn", "post-spawn"):
        return "mid_shallow"
    if phase == "spawn":
        return "ultra_shallow"
    if phase == "summer":
        return "mid_depth"
    if phase == "fall":
        return "mid_shallow"
    return "mid_depth"  # winter default


def _basic_techniques_for(
    phase: str,
    depth_zone: str,
    clarity: str,
) -> List[str]:
    """
    Return a simple list of technique names, NOT full setups.
    Basic (Pro-lite) tier is intentionally high-level.
    """
    clarity = (clarity or "").lower()
    techniques: List[str] = []

    if phase == "pre-spawn":
        techniques.append("Slow-rolled spinnerbait")
        techniques.append("Jig on staging points")
    elif phase == "spawn":
        techniques.append("Texas-rigged creature bait")
        techniques.append("Weightless stickbait")
    elif phase == "post-spawn":
        techniques.append("Topwater over shallow flats")
        techniques.append("Swimbait near spawning pockets")
    elif phase == "summer":
        techniques.append("Deep crankbait on offshore structure")
        techniques.append("Carolina rig on points")
    elif phase == "fall":
        techniques.append("Shallow crankbait around bait")
        techniques.append("Spinnerbait along windblown banks")
    else:  # winter
        techniques.append("Jig on steep banks")
        techniques.append("Finesse presentation on vertical cover")

    # Light clarity tweak (doesn't change schema, just guidance)
    if clarity == "clear":
        techniques.append("Natural, subtle presentations")
    elif clarity == "muddy":
        techniques.append("Bulky, high-vibration baits")

    # Deduplicate while preserving order
    seen = set()
    return [t for t in techniques if not (t in seen or seen.add(t))]


def _basic_targets_for(phase: str, depth_zone: str) -> List[str]:
    """
    Simple target area suggestions based on phase + depth.
    """
    targets: List[str] = []

    if phase == "pre-spawn":
        targets.append("Staging points near spawning pockets")
        targets.append("Channel swings close to flats")
    elif phase == "spawn":
        targets.append("Protected pockets and shallow flats")
        targets.append("Visible cover in protected coves")
    elif phase == "post-spawn":
        targets.append("First drop-offs outside spawning areas")
        targets.append("Shade lines and isolated cover")
    elif phase == "summer":
        targets.append("Offshore humps and ledges")
        targets.append("Points with current or wind")
    elif phase == "fall":
        targets.append("Creek arms holding baitfish")
        targets.append("Windblown banks and pockets")
    else:
        targets.append("Steep banks near deep water")
        targets.append("Vertical structure and bluff walls")

    return targets


def build_basic_pattern(req: BasicPatternRequest) -> BasicPatternResponse:
    """
    Core Basic (Pro-lite) pattern engine.

    Basic tier:
      - Classifies phase from temp + month
      - Infers a simple depth_zone (no depth_ft required)
      - Returns only high-level techniques + targets + notes
      - Does NOT expose detailed lure setups or conditions
    """

    phase = _classify_phase(req.temp_f, req.month)
    depth_zone = _basic_depth_zone_from_phase(phase)

    recommended_techniques = _basic_techniques_for(
        phase=phase,
        depth_zone=depth_zone,
        clarity=req.clarity,
    )

    targets = _basic_targets_for(phase, depth_zone)

    notes = (
        "This Basic pattern is a high-level guide based on current water temp, "
        "season, and water clarity. Use it to choose general areas and techniques, "
        "then refine on the water based on fish response."
    )

    return BasicPatternResponse(
        phase=phase,
        depth_zone=depth_zone,
        recommended_techniques=recommended_techniques,
        targets=targets,
        notes=notes,
    )
