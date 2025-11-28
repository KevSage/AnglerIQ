from typing import Any, Dict, List

from .schemas import ElitePatternRequest, ElitePatternResponse, ProPatternRequest
from .logic_pro import build_pro_pattern


def _build_gameplan(
    phase: str,
    depth_zone: str,
    clarity: str,
    time_of_day: str,
    tournament_mode: bool,
) -> List[str]:
    steps: List[str] = []

    if time_of_day == "dawn":
        steps.append(
            "Capitalize on low light at dawn with shallow, high-percentage banks and points near deep water."
        )
    elif time_of_day == "midday":
        steps.append(
            "During midday, focus on shade, docks, and deeper breaks where fish slide when the sun is high."
        )
    elif time_of_day == "afternoon":
        steps.append(
            "In the afternoon, target wind-blown banks and transitions as the water warms."
        )
    elif time_of_day == "evening":
        steps.append(
            "Use the evening low-light window to revisit shallow feeding areas and productive stretches."
        )
    elif time_of_day == "night":
        steps.append(
            "At night, concentrate on shallow hard-bottom areas close to deep water with baits that create vibration."
        )
    else:
        steps.append(
            "Start on your highest-confidence areas near the launch, then expand once you locate bait or fish."
        )

    if phase in ("pre-spawn", "spawn"):
        steps.append(
            "Rotate between staging points and likely spawning pockets, making multiple passes before leaving an area."
        )
    elif phase in ("post-spawn", "summer"):
        steps.append(
            "Mix shallow shade targets with nearby offshore or mid-depth structure to intercept roaming fish."
        )
    elif phase == "fall":
        steps.append(
            "Cover water in creeks and pockets where bait is present, then slow down anywhere producing multiple bites."
        )
    else:
        steps.append(
            "Focus on deeper structure and subtle breaks, using slower presentations and watching for bait."
        )

    if clarity == "clear":
        steps.append(
            "In clear water, keep the boat off the target, make longer casts, and lean on natural colors."
        )
    elif clarity == "stained":
        steps.append(
            "In stained water, use bolder colors and moderate vibration, and cover water until you identify key stretches."
        )
    elif clarity == "dirty":
        steps.append(
            "In dirty water, prioritize larger profiles, strong vibration, and high-contrast colors fished close to cover."
        )

    if depth_zone in ("mid_depth", "deep", "offshore"):
        steps.append(
            "Dedicate time to graphing structure before fishing; focus where contour, cover, and bait intersect."
        )

    if tournament_mode:
        steps.append(
            "Protect your best water: rotate through 2–3 main zones and a couple of emergency 'get a limit' spots."
        )
    else:
        steps.append(
            "Once you find a productive area, slow down, experiment with different lures, and learn the pattern."
        )

    return steps


def _build_adjustments(req: ElitePatternRequest, depth_zone: str) -> List[str]:
    adjustments: List[str] = []

    if req.pressure_trend == "falling":
        adjustments.append(
            "If the bite slows and pressure is falling, move shallower or to more wind-blown banks with moving baits."
        )
    elif req.pressure_trend == "rising":
        adjustments.append(
            "If fish follow but won't commit and pressure is rising, slow down with finesse lures and make repeated casts."
        )

    if req.water_level_trend == "rising":
        adjustments.append(
            "If water is rising and fish disappear, push slightly shallower and target newly flooded cover."
        )
    elif req.water_level_trend == "falling":
        adjustments.append(
            "If water is falling, back off to the first break adjacent to formerly productive shallow areas."
        )

    if depth_zone in ("mid_depth", "deep", "offshore"):
        adjustments.append(
            "If you graph fish offshore but can't get bites, change retrieve speed and angles before abandoning the area."
        )

    if not adjustments:
        adjustments.append(
            "If the pattern stalls, change only one variable at a time—location, depth, or lure profile—so you can tell what helped."
        )

    return adjustments


def build_elite_pattern(req: ElitePatternRequest) -> ElitePatternResponse:
    """
    Elite:
    - Calls Pro engine for core pattern using the same location-based weather.
    - Adds a gameplan and adjustment rules.
    - Tags conditions with tier='elite'.
    """
    time_of_day = req.time_of_day or "dawn"

    # Reuse Pro logic (location + hints)
    pro_req = ProPatternRequest(
        location_name=req.location_name,
        latitude=req.latitude,
        longitude=req.longitude,
        clarity=req.clarity,
        bottom_composition=req.bottom_composition,
        depth_ft=req.depth_ft,
        forage=req.forage,
    )

    pro_resp = build_pro_pattern(pro_req)

    # Pull clarity from Elite request or from Pro conditions
    clarity = req.clarity or str(pro_resp.conditions.get("clarity", "unknown"))

    gameplan = _build_gameplan(
        phase=pro_resp.phase,
        depth_zone=pro_resp.depth_zone,
        clarity=clarity,
        time_of_day=time_of_day,
        tournament_mode=req.tournament_mode,
    )

    adjustments = _build_adjustments(req, pro_resp.depth_zone)

    # Extend conditions
    conditions: Dict[str, Any] = dict(pro_resp.conditions)
    conditions.update(
        {
            "tier": "elite",
            "time_of_day": req.time_of_day,
            "time_of_day_normalized": time_of_day,
            "pressure_trend": req.pressure_trend,
            "water_level_trend": req.water_level_trend,
            "tournament_mode": req.tournament_mode,
        }
    )

    notes = (
        pro_resp.notes
        + " | Elite: This pattern has been expanded into a full-session gameplan "
          "with adjustment rules based on pressure and water-level trends."
    )

    return ElitePatternResponse(
        phase=pro_resp.phase,
        depth_zone=pro_resp.depth_zone,
        recommended_lures=pro_resp.recommended_lures,
        recommended_targets=pro_resp.recommended_targets,
        strategy_tips=pro_resp.strategy_tips,
        color_recommendations=pro_resp.color_recommendations,
        lure_setups=pro_resp.lure_setups,
        notes=notes,
        gameplan=gameplan,
        adjustments=adjustments,
        conditions=conditions,
    )
