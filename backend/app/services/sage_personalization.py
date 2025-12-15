from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Optional, Sequence


@dataclass(frozen=True)
class SagePrefs:
    experience_level: str = "general"  # general|beginner|intermediate|advanced
    coaching_style: str = "balanced"   # whatever your existing set is
    preferred_styles: Optional[List[str]] = None
    high_confidence_baits: Optional[List[str]] = None
    low_confidence_baits: Optional[List[str]] = None


def _norm_list(xs: Optional[Sequence[str]]) -> List[str]:
    if not xs:
        return []
    return [str(x).strip().lower() for x in xs if str(x).strip()]


def apply_tone(text: str, prefs: SagePrefs) -> str:
    lvl = prefs.experience_level.strip().lower()

    if lvl == "beginner":
        # Less jargon, more reassurance, shorter steps
        return (
            f"{text}\n\n"
            "Keep it simple: focus on good casts, steady retrieves, and covering water until you get a bite window."
        )

    if lvl == "intermediate":
        # Balanced coaching, a little more specificity
        return (
            f"{text}\n\n"
            "If you’re not getting feedback in 20–30 minutes, adjust one variable: depth, speed, or angle — not everything at once."
        )

    if lvl == "advanced":
        # Tighter, assumption-aware, more technical language (but still restrained)
        return (
            f"{text}\n\n"
            "Optimize efficiency: commit to the pattern long enough to confirm it, then tighten targets (angle + depth band) before changing techniques."
        )

    # general
    return text


def build_emphasis_lines(
    *,
    featured_lure: Optional[str],
    alternates: Sequence[str],
    prefs: SagePrefs,
) -> List[str]:
    """
    Adds 0–2 short lines that bias phrasing only.
    Never removes or reorders engine alternates.
    """
    high = set(_norm_list(prefs.high_confidence_baits))
    low = set(_norm_list(prefs.low_confidence_baits))
    pref_styles = _norm_list(prefs.preferred_styles)

    lines: List[str] = []

    # High-confidence cue
    if featured_lure and featured_lure.strip().lower() in high:
        lines.append("This stays inside your High-Confidence comfort zone — lean into it today.")

    # If alternates contain a high-confidence bait, lightly point it out (without reordering)
    for a in alternates:
        if a.strip().lower() in high:
            lines.append(f"If you want a familiar fallback, {a} is a strong High-Confidence option here.")
            break

    # Low-confidence cue (only if engine already suggested it; we do not introduce new suggestions)
    for a in alternates:
        if a.strip().lower() in low:
            lines.append(f"{a} is in your Low-Confidence zone — consider it only if conditions really call for it.")
            break

    # Preferred styles: mention as a framing line (no logic mutation)
    if pref_styles:
        lines.append("I’ll frame this in your preferred style where possible — but I won’t force it if conditions disagree.")

    # Keep it calm and short
    return lines[:2]


def render_sage_pattern_message(
    *,
    base_summary: str,
    featured_lure: Optional[str],
    alternates: Sequence[str],
    prefs: SagePrefs,
) -> str:
    lines = [base_summary]

    emphasis = build_emphasis_lines(featured_lure=featured_lure, alternates=alternates, prefs=prefs)
    if emphasis:
        lines.append("")
        lines.extend(emphasis)

    msg = "\n".join(lines).strip()
    return apply_tone(msg, prefs)