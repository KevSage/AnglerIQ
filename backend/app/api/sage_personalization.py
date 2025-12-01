# app/api/sage_personalization.py

from __future__ import annotations

from typing import Any, List, Optional


def _build_experience_line(prefs: Any) -> Optional[str]:
    exp = getattr(prefs, "experience_level", "agnostic")
    if exp == "beginner":
        return (
            "I'll keep the language simple and focus on clear, practical steps "
            "without too much jargon."
        )
    if exp == "intermediate":
        return (
            "I'll assume you know the basics and give you a bit more tactical detail "
            "without overcomplicating it."
        )
    if exp == "advanced":
        return (
            "I'll speak more like a tournament partner—short on fluff, comfortable "
            "with depth, phase, and pattern jargon."
        )
    # agnostic → no extra line
    return None


def _build_coaching_line(prefs: Any) -> Optional[str]:
    style = getattr(prefs, "coaching_style", "agnostic")
    if style == "calm_guide":
        return "I'll keep the tone steady and reassuring, walking you through the pattern one step at a time."
    if style == "old_school_pro":
        return "I'll be a bit more blunt and direct so you always know the next move."
    if style == "data_analyst":
        return "I'll lean into the signals—conditions, structure, and trends—to explain *why* each move makes sense."
    if style == "hype_coach":
        return "I'll keep the energy up and focus on what gives you the best shot at a confidence bite."
    if style == "minimalist":
        return "I'll keep things tight and to the point, focusing on only what actually matters."
    # agnostic → no extra line
    return None


def _build_style_emphasis_line(prefs: Any) -> Optional[str]:
    styles: List[str] = [
        s for s in getattr(prefs, "preferred_styles", []) if s != "agnostic"
    ]
    if not styles:
        return None

    # Hybrid B/C: noticeable but not overwhelming
    if "power" in styles and "offshore" in styles:
        return (
            "I'll lean a bit harder into power moves and offshore structure when either path is reasonable."
        )
    if "power" in styles:
        return "I'll favor power-style approaches when there are multiple good options."
    if "finesse" in styles:
        return "I'll highlight finesse options any time they make sense for the conditions."
    if "grass" in styles:
        return "I'll call out grass edges and vegetation lines whenever they naturally fit the pattern."
    if "bank" in styles or "dock" in styles:
        return "I'll give extra attention to bank lines and dock targets when the pattern supports it."
    if "offshore" in styles:
        return "I'll nudge you toward offshore structure and breaks when the pattern allows for it."

    return None


def _build_confidence_baits_line(prefs: Any) -> Optional[str]:
    raw = getattr(prefs, "confidence_baits", None)
    if not raw:
        return None
    baits = [str(b).strip() for b in raw if str(b).strip()]
    if not baits:
        return None
    if len(baits) == 1:
        return f"If the bite feels off, we can lean on your confidence bait: {baits[0]}."
    if len(baits) == 2:
        return (
            f"If things get weird, we can fall back on your confidence baits like {baits[0]} and {baits[1]}."
        )
    # 3+ baits
    head = ", ".join(baits[:2])
    tail = baits[2]
    return (
        f"If conditions shift, we can rotate through your confidence baits like "
        f"{head}, and {tail} to stay grounded."
    )


def _build_banned_techniques_line(prefs: Any) -> Optional[str]:
    raw = getattr(prefs, "banned_techniques", None)
    if not raw:
        return None
    banned = [str(b).strip() for b in raw if str(b).strip()]
    if not banned:
        return None

    # Hybrid B/C: clearly state avoidance, but still advisory-only
    if len(banned) == 1:
        return f"I'll avoid pushing {banned[0]} as a primary suggestion."
    if len(banned) == 2:
        return f"I'll steer clear of leaning on {banned[0]} and {banned[1]} unless there's no better option."
    head = ", ".join(banned[:2])
    tail = banned[2]
    return (
        f"I'll de-emphasize techniques like {head}, and {tail} so the plan stays aligned with what you actually enjoy fishing."
    )


def apply_personalization_lines(
    base_lines: list[str],
    prefs: Any,
) -> list[str]:
    """
    Hybrid B/C intensity:
    - Always preserves the core pattern/context lines.
    - Adds 1–4 short lines describing how SAGE will talk,
      with noticeable but not overwhelming emphasis.

    TEXT ONLY. This must never change engines, tiers, or pattern logic.
    """
    extra: list[str] = []

    exp_line = _build_experience_line(prefs)
    if exp_line:
        extra.append(exp_line)

    coach_line = _build_coaching_line(prefs)
    if coach_line:
        extra.append(coach_line)

    style_line = _build_style_emphasis_line(prefs)
    if style_line:
        extra.append(style_line)

    conf_line = _build_confidence_baits_line(prefs)
    if conf_line:
        extra.append(conf_line)

    banned_line = _build_banned_techniques_line(prefs)
    if banned_line:
        extra.append(banned_line)

    if not extra:
        return base_lines

    # Keep base lines together, then add a small divider + personalization flavor
    return base_lines + ["", "Personalization:", *extra]
