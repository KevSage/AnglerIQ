# app/api/sage_personalization.py

from __future__ import annotations

from typing import List, Tuple, TYPE_CHECKING, Optional, Any

if TYPE_CHECKING:
    from app.api.sage import SagePreferences


# ---------- Normalizers / helpers ----------


def _norm_experience(prefs: "SagePreferences") -> str:
    """
    Normalize experience level so we can gracefully handle legacy values.
    Canonical set: general, beginner, intermediate, advanced.
    Legacy 'agnostic' is treated as 'general'.
    """
    raw = getattr(prefs, "experience_level", "general") or "general"
    if raw == "agnostic":
        return "general"
    return raw


def _norm_high_confidence_baits(prefs: "SagePreferences") -> List[str]:
    """
    Treat confidence_baits as the source of high-confidence baits for now.
    (Future: can add dedicated high_confidence_baits field and merge.)
    """
    raw = getattr(prefs, "confidence_baits", None)
    if not raw:
        return []
    return [b.strip() for b in raw if isinstance(b, str) and b.strip()]


def _norm_low_confidence_items(prefs: "SagePreferences") -> List[str]:
    """
    Treat banned_techniques as low-confidence / optional techniques for wording only.
    We DO NOT actually ban or filter anything in the engines.
    """
    raw = getattr(prefs, "banned_techniques", None)
    if not raw:
        return []
    return [b.strip() for b in raw if isinstance(b, str) and b.strip()]


def _norm_coaching_style(prefs: "SagePreferences") -> str:
    """
    Normalize coaching style. Legacy 'agnostic' == canonical 'general'.
    """
    raw = getattr(prefs, "coaching_style", "general") or "general"
    if raw == "agnostic":
        return "general"
    return raw


# ---------- Line builders (shared) ----------


def _build_experience_line(prefs: "SagePreferences") -> Optional[str]:
    exp = _norm_experience(prefs)

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

    # general → no explicit line
    return None


def _build_coaching_line(prefs: "SagePreferences") -> Optional[str]:
    style = _norm_coaching_style(prefs)

    if style == "calm_guide":
        return "I'll keep the tone steady and reassuring, walking you through the pattern one step at a time."
    if style == "old_school_pro":
        return "I'll be a bit more blunt and direct so you always know the next move."
    if style == "data_analyst":
        return "I'll lean into the signals—conditions, structure, and trends—to explain why each move makes sense."
    if style == "hype_coach":
        return "I'll keep the energy up while still staying disciplined about what actually matters."
    if style == "minimalist":
        return "I'll keep things tight and to the point, focusing only on what actually matters out there."

    # general → no explicit line
    return None


def _build_high_confidence_line(prefs: "SagePreferences") -> Optional[str]:
    baits = _norm_high_confidence_baits(prefs)
    if not baits:
        return None

    if len(baits) == 1:
        return f"If the bite feels off, we can lean on your high-confidence bait: {baits[0]}."
    if len(baits) == 2:
        return (
            f"If things get weird, we can fall back on your high-confidence baits like "
            f"{baits[0]} and {baits[1]}."
        )

    head = ", ".join(baits[:2])
    tail = baits[2]
    return (
        f"If conditions shift, we can rotate through your high-confidence baits like "
        f"{head}, and {tail} so you stay grounded in what you fish best."
    )


def _build_low_confidence_line(prefs: "SagePreferences") -> Optional[str]:
    """
    Reframe 'banned techniques' as low-confidence / optional tools.
    We never remove them from the plan; we only frame them differently.
    """
    items = _norm_low_confidence_items(prefs)
    if not items:
        return None

    if len(items) == 1:
        return (
            f"I'll treat {items[0]} as a low-confidence option—something we can reach for "
            f"only if conditions really point that direction."
        )
    if len(items) == 2:
        return (
            f"I'll treat techniques like {items[0]} and {items[1]} as optional, "
            f"so the plan stays centered on what you actually like to fish."
        )

    head = ", ".join(items[:2])
    tail = items[2]
    return (
        f"I'll frame techniques like {head}, and {tail} as optional growth tools "
        f"rather than core pieces of the plan."
    )


# ---------- Line-based personalization (for /sage/chat, etc.) ----------


def apply_personalization_lines(
    base_lines: list[str],
    prefs: "SagePreferences",
) -> list[str]:
    """
    Hybrid B/C intensity for line-based replies (like /sage/chat):
    - Always preserves the core lines.
    - Adds 1–4 short lines describing how SAGE will talk and what it will emphasize.
    - TEXT ONLY. No engine, tier, or pattern changes.
    """
    extra: list[str] = []

    exp_line = _build_experience_line(prefs)
    if exp_line:
        extra.append(exp_line)

    coach_line = _build_coaching_line(prefs)
    if coach_line:
        extra.append(coach_line)

    high_conf_line = _build_high_confidence_line(prefs)
    if high_conf_line:
        extra.append(high_conf_line)

    low_conf_line = _build_low_confidence_line(prefs)
    if low_conf_line:
        extra.append(low_conf_line)

    if not extra:
        return base_lines

    return base_lines + ["", "Personalization:", *extra]


# ---------- Pattern-based personalization (for /assistant/ask) ----------


def _build_coaching_intro(prefs: "SagePreferences") -> Optional[str]:
    """
    Short one-liner that can sit in front of the main pattern advice
    to set the coaching tone.
    """
    style = _norm_coaching_style(prefs)
    exp = _norm_experience(prefs)

    # We keep this subtle and consistent with AnglerIQ's premium tone.
    if style == "calm_guide":
        return "Let’s keep this simple and steady—here’s how I’d run this pattern."
    if style == "old_school_pro":
        return "Here’s the straight-shot way I’d fish this pattern."
    if style == "data_analyst":
        return "Based on how the conditions stack up, here’s the cleanest way to run this pattern."
    if style == "hype_coach":
        return "Good news—this setup has real bite potential. Here’s how I’d give it a fair run."
    if style == "minimalist":
        return "Here’s the essential way to test this pattern without overcomplicating it."

    # Fall back to a very light experience-level aware intro.
    if exp == "beginner":
        return "Here’s a clear, step-by-step way to fish this pattern without overthinking it."
    if exp == "advanced":
        return "Here’s how I’d treat this pattern if we were fishing it like a short derby window."

    # general/intermediate → no special intro
    return None


def _build_personalization_summary(prefs: "SagePreferences") -> Optional[str]:
    """
    Build a compact personalization summary paragraph that describes:
      - how SAGE will talk
      - how it will treat high- and low-confidence tools

    This sits in a 'Personalization:' section at the end of the answer.
    """
    pieces: list[str] = []

    exp_line = _build_experience_line(prefs)
    if exp_line:
        pieces.append(exp_line)

    coach_line = _build_coaching_line(prefs)
    if coach_line:
        pieces.append(coach_line)

    high_conf_line = _build_high_confidence_line(prefs)
    if high_conf_line:
        pieces.append(high_conf_line)

    low_conf_line = _build_low_confidence_line(prefs)
    if low_conf_line:
        pieces.append(low_conf_line)

    if not pieces:
        return None

    # Join into 1–2 compact sentences.
    return " ".join(pieces)


def personalize_sage_answer(
    answer: str,
    key_points: List[str],
    prefs: "SagePreferences",
) -> Tuple[str, List[str]]:
    """
    Step 2 personalization for pattern-based SAGE answers (/assistant/ask):

    - Keeps the core SAGE paragraphs from generate_advice intact.
    - Optionally adds a short coaching-style intro line.
    - Optionally appends a 'Personalization' section describing how SAGE will
      bias tone and confidence framing.
    - Key points stay the same for now (we may extend later if needed).

    TEXT ONLY. This MUST NOT change:
    - pattern engines,
    - depth logic,
    - tiers,
    - pricing,
    - or Vision behavior.
    """
    paragraphs: list[str] = []

    # 1) Optional coaching intro
    intro = _build_coaching_intro(prefs)
    if intro:
        paragraphs.append(intro)

    # 2) Core SAGE answer from the rules engine
    paragraphs.append(answer)

    # 3) Optional Personalization summary
    personalization_summary = _build_personalization_summary(prefs)
    if personalization_summary:
        paragraphs.append("Personalization:\n" + personalization_summary)

    personalized_answer = "\n\n".join(paragraphs)

    # Key points remain unchanged in Step 2.
    return personalized_answer, key_points