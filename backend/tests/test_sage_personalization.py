# tests/test_sage_personalization.py

from app.api.sage import SagePreferences
from app.api.sage_personalization import (
    apply_personalization_lines,
    personalize_sage_answer,
)


def _contains_fragment(lines, fragment: str) -> bool:
    text = "\n".join(lines)
    return fragment in text


def test_apply_personalization_lines_adds_personalization_block():
    """
    When preferences are non-neutral, apply_personalization_lines should:
      - preserve the base lines
      - append a 'Personalization:' block
      - include experience, coaching, and confidence wording
    """
    base = ["Core line."]
    prefs = SagePreferences(
        experience_level="beginner",
        coaching_style="calm_guide",
        confidence_baits=["spinnerbait"],
        banned_techniques=["drop shot"],
    )

    lines = apply_personalization_lines(base, prefs)

    # Core content preserved
    assert lines[0] == "Core line."

    # Personalization section exists
    assert "Personalization:" in "\n".join(lines)

    # Experience-level wording present
    assert _contains_fragment(
        lines,
        "keep the language simple and focus on clear, practical steps",
    )

    # Coaching tone wording present
    assert _contains_fragment(
        lines,
        "keep the tone steady and reassuring, walking you through the pattern one step at a time.",
    )

    # High-confidence bait wording present
    assert _contains_fragment(
        lines,
        "high-confidence bait",
    )

    # Low-confidence / optional technique wording present
    assert _contains_fragment(
        lines,
        "low-confidence option",
    )


def test_apply_personalization_lines_neutral_preferences_no_changes():
    """
    With neutral / default preferences, apply_personalization_lines should
    just return the base lines unchanged.
    """
    base = ["Core line."]
    prefs = SagePreferences()  # defaults to general/agnostic-like behavior

    lines = apply_personalization_lines(base, prefs)

    assert lines == base
    assert "Personalization:" not in "\n".join(lines)


def test_personalize_sage_answer_adds_intro_and_personalization_section():
    """
    personalize_sage_answer should:
      - prepend a coaching-style intro when appropriate
      - append a 'Personalization:' paragraph
      - keep key_points unchanged
    """
    base_answer = "This is the base SAGE answer body."
    key_points = ["Fish the best structure first."]
    prefs = SagePreferences(
        experience_level="advanced",
        coaching_style="old_school_pro",
        confidence_baits=["jig", "spinnerbait"],
        banned_techniques=["ned rig"],
    )

    personalized_answer, out_key_points = personalize_sage_answer(
        base_answer, key_points, prefs
    )

    # Key points should be passed through unchanged
    assert out_key_points == key_points

    # Coaching-style intro should appear
    assert "straight-shot way I’d fish this pattern" in personalized_answer

    # Original base answer should still be present
    assert "This is the base SAGE answer body." in personalized_answer

    # Personalization section should be present
    assert "Personalization:" in personalized_answer
    assert "high-confidence baits" in personalized_answer
    # Low-confidence mapping should be reflected in the wording
    assert "low-confidence option" in personalized_answer
def test_personalize_sage_answer_neutral_preferences_returns_base_answer():
    """
    With neutral / default preferences, personalize_sage_answer should
    effectively behave like a pass-through (no intro, no personalization block).
    """
    base_answer = "Base answer only."
    key_points = ["Point 1"]

    prefs = SagePreferences()  # neutral

    personalized_answer, out_key_points = personalize_sage_answer(
        base_answer, key_points, prefs
    )

    # No changes to answer or key points
    assert personalized_answer == base_answer
    assert out_key_points == key_points
    assert "Personalization:" not in personalized_answer