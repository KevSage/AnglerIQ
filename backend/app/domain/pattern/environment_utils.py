# environment_utils.py

from __future__ import annotations
from typing import Optional

def classify_clarity_band(clarity: Optional[str]) -> str:
    """
    Normalize water clarity into a small set of buckets:
      - "clear"
      - "stained"
      - "dirty"
      - "unknown"
    """
    if not clarity:
        return "unknown"

    c = clarity.strip().lower()

    clear_keywords = ["clear", "very clear", "ultra clear", "gin clear"]
    stained_keywords = ["stained", "moderate", "slightly stained", "off-color"]
    dirty_keywords = ["dirty", "muddy", "heavily stained", "chocolate", "chocolate milk"]

    if any(k in c for k in clear_keywords):
        return "clear"
    if any(k in c for k in stained_keywords):
        return "stained"
    if any(k in c for k in dirty_keywords):
        return "dirty"

    if "clear" in c:
        return "clear"
    if "mud" in c or "dirty" in c or "chocolate" in c:
        return "dirty"
    if "stain" in c or "color" in c:
        return "stained"

    return "unknown"


def normalize_sky_condition(sky_condition: Optional[str]) -> str:
    """
    Normalize sky condition to:
      - "sunny"
      - "partly_cloudy"
      - "overcast"
      - "low_light"
      - "unknown"
    """
    if not sky_condition:
        return "unknown"

    s = sky_condition.strip().lower()

    if any(k in s for k in ["sunny", "bluebird", "bright"]):
        return "sunny"
    if any(k in s for k in ["partly", "scattered", "broken"]):
        return "partly_cloudy"
    if any(k in s for k in ["overcast", "cloudy"]):
        return "overcast"
    if any(k in s for k in ["dawn", "dusk", "low light", "dark", "night"]):
        return "low_light"

    return "unknown"


def infer_activity_level(
    wind_speed: float | None,
    clarity_band: str,
    sky_condition_norm: Optional[str] = None,
    *,
    simple: bool = False,
) -> str:
    """
    Estimate feeding activity: 'low' | 'moderate' | 'high'

    - If simple=True: only uses wind + clarity (for Basic)
    - If simple=False: also uses sky (for Pro)
    """
    if wind_speed is None:
        wind_speed = 0.0

    score = 0

    # Wind influence
    if 3 <= wind_speed <= 12:
        score += 2
    elif wind_speed > 12:
        score += 1

    # Clarity influence
    if clarity_band == "stained":
        score += 2
    elif clarity_band in ("clear", "dirty"):
        score += 1

    if not simple:
        # Sky influence (Pro flavor)
        s = sky_condition_norm or "unknown"
        if s in ("partly_cloudy", "overcast", "low_light"):
            score += 2
        elif s == "sunny":
            score += 1
        else:
            score += 1  # neutral / unknown

    if score >= 5 if not simple else score >= 4:
        return "high"
    if score >= 3 if not simple else score >= 2:
        return "moderate"
    return "low"
