# app/pattern_logic.py

from typing import List, Optional
import calendar


def classify_phase(temp_f: float, month: int) -> str:
    """
    Very simple, first-pass phase classifier based on water temp and month.
    """
    if temp_f < 50:
        return "winter"
    if 50 <= temp_f < 60:
        return "pre-spawn"
    if 60 <= temp_f < 70:
        return "spawn/post-spawn"
    if 70 <= temp_f < 80:
        return "summer"
    return "fall"


def recommend_lures(phase: str) -> List[str]:
    """
    Base set of 'confidence baits' for the given seasonal phase.
    """
    phase = phase.lower()

    if phase == "winter":
        return [
            "suspending jerkbait",
            "blade bait",
            "finesse jig",
        ]

    if phase == "pre-spawn":
        return [
            "lipless crankbait",
            "spinnerbait",
            "jig",
        ]

    if phase == "spawn/post-spawn":
        return [
            "texas-rigged creature bait",
            "wacky-rigged worm",
            "light finesse jig",
        ]

    if phase == "summer":
        return [
            "deep-diving crankbait",
            "carolina rig",
            "big worm on offshore structure",
        ]

    # default: fall / transition
    return [
        "shad-style swimbait",
        "squarebill crankbait",
        "spinnerbait",
    ]


def infer_depth_zone(phase: str, depth_ft: Optional[float]) -> str:
    """
    Infer a simple depth zone label based on either explicit depth
    or the seasonal phase if depth is not provided.
    """
    if depth_ft is not None:
        if depth_ft < 8:
            return "shallow"
        if 8 <= depth_ft <= 15:
            return "mid-depth"
        return "offshore"

    phase = phase.lower()

    if phase in ("winter", "summer"):
        return "offshore"
    if phase in ("pre-spawn", "spawn/post-spawn"):
        return "shallow"
    # fall / default
    return "mid-depth"


def adjust_lures_for_clarity_and_bottom(
    base_lures: List[str],
    clarity: str,
    bottom_composition: Optional[str],
    wind_speed: float,
) -> List[str]:
    """
    Take a base lure list and adjust it based on clarity, bottom composition,
    and wind speed.
    """
    clarity = clarity.lower().strip()
    bottom = (bottom_composition or "").lower().strip()

    lures = list(base_lures)  # copy

    # Adjust for clarity
    if clarity == "clear":
        lures.append("finesse worm on light line")
        lures.append("natural shad-style swimbait")
    elif clarity == "stained":
        lures.append("medium-diving crankbait")
    elif clarity == "muddy":
        lures.append("chatterbait")
        lures.append("black/blue jig")

    # Adjust for bottom composition
    if "rock" in bottom:
        lures.append("jig dragged on rock")
        lures.append("squarebill deflected off rock")
    if "grass" in bottom or "vegetation" in bottom:
        lures.append("swim jig over grass")
        lures.append("texas-rigged creature bait for flipping grass")
    if "sand" in bottom or "clay" in bottom:
        lures.append("lipless crankbait ticking bottom")

    # Adjust for wind
    if wind_speed >= 10:
        lures.append("spinnerbait in wind-blown areas")
        lures.append("chatterbait along wind-blown banks")
    elif wind_speed <= 3 and clarity == "clear":
        lures.append("finesse jerkbait worked slowly")

    # De-duplicate while preserving order
    seen = set()
    deduped: List[str] = []
    for lure in lures:
        key = lure.lower()
        if key not in seen:
            seen.add(key)
            deduped.append(lure)

    return deduped


def build_targets_and_tips(
    phase: str,
    depth_zone: str,
    clarity: str,
    wind_speed: float,
    bottom_composition: Optional[str],
) -> dict:
    """
    Build a set of target areas and strategy tips based on
    phase, inferred depth, clarity, wind, and bottom.
    """
    clarity = clarity.lower().strip()
    bottom = (bottom_composition or "").lower().strip()
    phase_lower = phase.lower()

    targets: List[str] = []
    tips: List[str] = []

    # Phase-driven targets
    if phase_lower == "pre-spawn":
        targets.append("secondary points near spawning flats")
        targets.append("channel swings close to shallow flats")
        tips.append(
            "Use your baits to cover secondary points and channel swings leading into spawning pockets."
        )
    elif phase_lower == "spawn/post-spawn":
        targets.append("protected spawning pockets and flats")
        targets.append("nearby bluegill beds or docks")
        tips.append(
            "Focus on protected shallow areas and nearby cover where post-spawn bass can recover and feed."
        )
    elif phase_lower == "winter":
        targets.append("steep channel swings and main-lake drops")
        targets.append("offshore structure close to deep water")
        tips.append(
            "Slow down around steep structure close to deep water; fish are less willing to chase."
        )
    elif phase_lower == "summer":
        targets.append("offshore humps, ledges, and river channels")
        targets.append("current-related structure if available")
        tips.append(
            "Use your electronics to find groups of fish on offshore structure and rotate through key spots."
        )
    else:  # fall / transition
        targets.append("wind-blown banks and points")
        targets.append("shad-filled pockets and creek arms")
        tips.append(
            "Follow the bait into creeks and pockets, especially where wind pushes bait toward the bank."
        )

    # Depth zone adjustments
    if depth_zone == "shallow":
        tips.append(
            "Prioritize shoreline cover, docks, laydowns, and shallow grass—keep your bait in the top 0–8 feet."
        )
    elif depth_zone == "mid-depth":
        tips.append(
            "Spend time on mid-depth structure like secondary points, channel bends, and inside turns in 8–15 feet."
        )
    elif depth_zone == "offshore":
        tips.append(
            "Focus on offshore structure and subtle contour changes; let electronics guide you more than visible cover."
        )

    # Clarity-driven adjustments
    if clarity == "clear":
        tips.append(
            "In clear water, stay a bit farther from the targets, use more natural colors, and rely on finesse or realistic presentations."
        )
    elif clarity == "muddy":
        tips.append(
            "In muddy water, target obvious shallow cover and high-percentage spots, using loud, bulky baits bass can feel."
        )

    # Bottom composition-driven adjustments
    if "rock" in bottom:
        targets.append("rock transitions, chunk rock banks, and riprap")
        tips.append(
            "Fish angles that let crankbaits and jigs deflect off rock to trigger reaction bites."
        )
    if "grass" in bottom or "vegetation" in bottom:
        targets.append("edges and holes in grass lines")
        tips.append(
            "Key on irregularities in grass—points, holes, and edges where bass can ambush prey."
        )

    # Wind-driven adjustments
    if wind_speed >= 10:
        targets.append("wind-blown banks, points, and flats")
        tips.append(
            "Use wind to your advantage—fish wind-blown structure where bait is being pushed toward the bank or into ambush spots."
        )
    elif wind_speed <= 3 and clarity == "clear":
        tips.append(
            "On calm, clear days, downsize and slow down; fish may be spooky and less willing to chase."
        )

    # Deduplicate while preserving order
    def dedupe(items: List[str]) -> List[str]:
        seen = set()
        out: List[str] = []
        for x in items:
            key = x.lower()
            if key not in seen:
                seen.add(key)
                out.append(x)
        return out

    return {
        "recommended_targets": dedupe(targets),
        "strategy_tips": dedupe(tips),
    }


def recommend_color_palettes(clarity: str, sky_condition: str) -> List[str]:
    """
    Recommend general color guidelines based on clarity and sky conditions.
    """
    clarity = clarity.lower().strip()
    sky = sky_condition.lower().strip()

    recs: List[str] = []

    if clarity == "clear":
        if "sun" in sky:
            recs.append(
                "In clear & sunny conditions, favor natural translucent shad colors, "
                "finesse green pumpkin, and subtle metallic finishes."
            )
        else:
            recs.append(
                "In clear & cloudy conditions, still lean natural (shad, green pumpkin) "
                "but add a bit more contrast with slightly darker backs."
            )
        recs.append(
            "Use lighter line and less flashy hardware in ultra-clear water to avoid spooking fish."
        )

    elif clarity == "stained":
        if "sun" in sky:
            recs.append(
                "In stained & sunny water, balance realism and visibility: green pumpkin with chartreuse, "
                "white/chartreuse, and craw patterns with some orange."
            )
        else:
            recs.append(
                "In stained & cloudy water, lean into contrast: white/chartreuse, firetiger, "
                "and darker-back crankbaits or jigs that stand out."
            )
        recs.append(
            "Stained water usually rewards some flash or vibration, so pair these colors with baits that move water."
        )

    else:  # muddy / very dirty
        if "sun" in sky:
            recs.append(
                "In muddy & sunny conditions, high contrast is key: black/blue, black/red, "
                "and solid chartreuse help bass locate the bait."
            )
        else:
            recs.append(
                "In muddy & cloudy conditions, go all-in on silhouette: solid black, black/blue, "
                "and bold chartreuse/black back patterns."
            )
        recs.append(
            "Focus on profile and vibration first, then choose colors that maximize contrast against the water."
        )

    seen = set()
    out: List[str] = []
    for line in recs:
        key = line.lower()
        if key not in seen:
            seen.add(key)
            out.append(line)

    return out


def recommend_techniques(phase: str, depth_zone: str) -> List[str]:
    """
    BASIC-tier technique recommendations instead of specific lures.
    """
    phase = phase.lower()
    depth_zone = depth_zone.lower()

    techniques: List[str] = []

    if depth_zone == "offshore":
        techniques.extend([
            "dropshot",
            "carolina rig",
            "football jig",
        ])
    elif depth_zone == "mid-depth":
        techniques.extend([
            "texas rig",
            "mid-depth crankbait",
            "swimbait on a jighead",
        ])
    else:  # shallow
        if phase in ("spawn/post-spawn", "pre-spawn"):
            techniques.extend([
                "weightless fluke",
                "wacky rig",
                "texas rig around cover",
            ])
        else:
            techniques.extend([
                "shallow squarebill crankbait",
                "spinnerbait",
                "texas rig around shallow cover",
            ])

    # de-duplicate while preserving order
    seen = set()
    out: List[str] = []
    for t in techniques:
        key = t.lower()
        if key not in seen:
            seen.add(key)
            out.append(t)
    return out

def classify_lure_to_setup_type(lure: str) -> str:
    """
    Classify a lure string into a coarse setup type so we can attach an
    appropriate gear template.

    Returns one of: 'finesse', 'bottom', 'moving'.
    """
    l = lure.lower()

    # Finesse / dropshot style
    if "dropshot" in l or "drop shot" in l or "finesse" in l:
        return "finesse"

    # Texas rig / jigs / worms / bottom-contact
    if (
        "texas" in l
        or "jig" in l
        or "worm" in l
        or "creature" in l
        or "carolina" in l
    ):
        return "bottom"

    # Moving baits
    if (
        "spinnerbait" in l
        or "chatterbait" in l
        or "crankbait" in l
        or "lipless" in l
        or "swimbait" in l
        or "jerkbait" in l
    ):
        return "moving"

    # Fallback based on vague intuition: offshore -> finesse, shallow -> moving/bottom,
    # but since we don't have depth here, default to moving.
    return "moving"


def build_pro_setups(
    lures: List[str],
    phase: str,
    depth_zone: str,
    clarity: str,
    wind_speed: float,
    bottom_composition: Optional[str],
    sky_condition: str,
) -> List[dict]:
    """
    Build PRO-tier setups *per lure*.

    Each entry includes:
      - lure
      - technique label
      - rod, reel, line
      - hook/leader size (if applicable)
      - lure size
    """
    clarity = clarity.lower().strip()
    depth_zone = depth_zone.lower()

    # Base templates for different setup types
    finesse_template = {
        "technique": "finesse / dropshot",
        "rod": "7'0\" medium-light spinning rod, fast action",
        "reel": "2500-size spinning reel, ~6.2:1 gear ratio",
        "line": "10 lb braid main line to 6–8 lb fluorocarbon leader",
        "hook_or_leader": "size 1 or 1/0 dropshot hook; 12–18\" leader below weight",
        "lure_size": "3–4 inch finesse worm or minnow profile",
    }

    bottom_template = {
        "technique": "bottom-contact (Texas rig / jig / worm)",
        "rod": "7'1\"–7'3\" medium-heavy casting rod, fast action",
        "reel": "7.1:1 casting reel",
        "line": "14–20 lb fluorocarbon (or 40–50 lb braid in heavy cover)",
        "hook_or_leader": "3/0–4/0 EWG or straight-shank hook",
        "lure_size": "3.5–5 inch creature bait or worm; 3/16–1/2 oz weight",
    }

    moving_template = {
        "technique": "moving bait (spinnerbait / chatterbait / crankbait / swimbait)",
        "rod": "7'0\" medium or medium-heavy rod, moderate or mod-fast action",
        "reel": "6.3:1–7.1:1 casting reel",
        "line": "12–17 lb fluorocarbon or mono (or 30–40 lb braid around grass)",
        "hook_or_leader": "standard jig hook or treble hooks on hard baits",
        "lure_size": "3/8–1/2 oz moving baits; 2–3.5\" crankbaits or swimbaits",
    }

    setups: List[dict] = []

    for lure in lures:
        setup_type = classify_lure_to_setup_type(lure)

        if setup_type == "finesse":
            base = finesse_template
        elif setup_type == "bottom":
            base = bottom_template
        else:
            base = moving_template

        # Clone and attach the lure name; tweak label a bit
        setup = {
            "lure": lure,
            "technique": f"{base['technique']} ({lure})",
            "rod": base["rod"],
            "reel": base["reel"],
            "line": base["line"],
            "hook_or_leader": base["hook_or_leader"],
            "lure_size": base["lure_size"],
        }

        setups.append(setup)

    # We don't dedupe by technique here because user may want distinct lines
    # per lure, even if templates are similar.
    return setups


def build_pattern_summary(
    temp_f: float,
    month: int,
    clarity: str,
    wind_speed: float,
    sky_condition: str,
    depth_ft: Optional[float] = None,
    bottom_composition: Optional[str] = None,
) -> dict:
    """
    PRO-tier pattern summary builder.
    """
    month_name = calendar.month_name[month]  # e.g. 3 -> "March"

    phase = classify_phase(temp_f, month)
    base_lures = recommend_lures(phase)
    depth_zone = infer_depth_zone(phase, depth_ft)
    adjusted_lures = adjust_lures_for_clarity_and_bottom(
        base_lures,
        clarity=clarity,
        bottom_composition=bottom_composition,
        wind_speed=wind_speed,
    )

    targets_and_tips = build_targets_and_tips(
        phase=phase,
        depth_zone=depth_zone,
        clarity=clarity,
        wind_speed=wind_speed,
        bottom_composition=bottom_composition,
    )

    color_recs = recommend_color_palettes(clarity, sky_condition)
    setups = build_pro_setups(
        lures=adjusted_lures,
        phase=phase,
        depth_zone=depth_zone,
        clarity=clarity,
        wind_speed=wind_speed,
        bottom_composition=bottom_composition,
        sky_condition=sky_condition,
    )

    # Clean, angler-friendly note
    notes = (
        f"In {month_name} with water around {temp_f:.0f}°F, {clarity} water, "
        f"about {wind_speed:.0f} mph wind, and {sky_condition} skies, "
        f"SAGE identifies this as a '{phase}' pattern with a '{depth_zone}' focus. "
        f"The recommended lures, target areas, color guidelines, and gear setups "
        f"are all tuned to this seasonal window and water color."
    )

    return {
        "phase": phase,
        "depth_zone": depth_zone,
        "recommended_lures": adjusted_lures,
        "recommended_targets": targets_and_tips["recommended_targets"],
        "strategy_tips": targets_and_tips["strategy_tips"],
        "color_recommendations": color_recs,
        "lure_setups": setups,
        "conditions": {
            "temp_f": temp_f,
            "month": month,
            "clarity": clarity,
            "wind_speed": wind_speed,
            "sky_condition": sky_condition,
            "depth_ft": depth_ft,
            "bottom_composition": bottom_composition,
        },
        "notes": notes,
    }

def build_basic_pattern_summary(
    temp_f: float,
    month: int,
    clarity: str,
    wind_speed: float,
) -> dict:
    """
    BASIC-tier pattern summary.

    BASIC focuses on high-level seasonal pattern and technique guidance.
    No lures, colors, gear, or PRO-specific features.
    """
    # Convert month number → full month name
    month_name = calendar.month_name[month]  # e.g. 3 → "March"

    # Compute phase + inferred depth
    phase = classify_phase(temp_f, month)
    depth_zone = infer_depth_zone(phase, depth_ft=None)

    # High-level techniques only
    techniques = recommend_techniques(phase, depth_zone)

    # Cleaner BASIC-tier note
    notes = (
        f"With water temperatures around {temp_f:.0f}°F in {month_name}, "
        f"{clarity} water, and roughly {wind_speed:.0f} mph wind, "
        f"SAGE identifies this as a '{phase}' pattern. "
        f"The inferred depth zone is '{depth_zone}', so these core techniques "
        f"are a solid starting point for the conditions."
    )

    return {
        "phase": phase,
        "depth_zone": depth_zone,
        "recommended_techniques": techniques,
        "notes": notes,
    }

