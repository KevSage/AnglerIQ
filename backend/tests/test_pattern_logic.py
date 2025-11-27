# tests/test_pattern_logic.py

from app.engines.pattern.logic import (
    classify_phase,
    recommend_lures,
    infer_depth_zone,
    adjust_lures_for_clarity_and_bottom,
    build_targets_and_tips,
    recommend_color_palettes,
    recommend_techniques,
    build_pro_setups,
    build_pattern_summary,
    build_basic_pattern_summary,
)



def test_classify_phase_winter():
    assert classify_phase(42.0, 1) == "winter"


def test_classify_phase_pre_spawn():
    assert classify_phase(55.0, 3) == "pre-spawn"


def test_classify_phase_spawn_post_spawn():
    assert classify_phase(65.0, 4) == "spawn/post-spawn"


def test_classify_phase_summer():
    assert classify_phase(75.0, 7) == "summer"


def test_classify_phase_fall():
    assert classify_phase(82.0, 10) == "fall"


def test_recommend_lures_varies_by_phase():
    winter_lures = recommend_lures("winter")
    summer_lures = recommend_lures("summer")

    assert "suspending jerkbait" in winter_lures
    assert "deep-diving crankbait" in summer_lures
    assert winter_lures != summer_lures


def test_infer_depth_zone_with_explicit_depth():
    assert infer_depth_zone("pre-spawn", 5.0) == "shallow"
    assert infer_depth_zone("pre-spawn", 12.0) == "mid-depth"
    assert infer_depth_zone("pre-spawn", 25.0) == "offshore"


def test_infer_depth_zone_without_depth_uses_phase():
    assert infer_depth_zone("winter", None) == "offshore"
    assert infer_depth_zone("pre-spawn", None) == "shallow"
    assert infer_depth_zone("fall", None) == "mid-depth"


def test_adjust_lures_for_clarity_and_bottom_muddy_grass_windy():
    base = ["spinnerbait"]
    lures = adjust_lures_for_clarity_and_bottom(
        base_lures=base,
        clarity="muddy",
        bottom_composition="rock and grass",
        wind_speed=15.0,
    )

    lower = " ".join(lures).lower()
    assert "chatterbait" in lower
    assert "jig" in lower
    assert "grass" in lower or "rock" in lower


def test_build_targets_and_tips_pre_spawn_muddy_grass_windy():
    data = build_targets_and_tips(
        phase="pre-spawn",
        depth_zone="shallow",
        clarity="muddy",
        wind_speed=12.0,
        bottom_composition="grass and rock",
    )

    targets = " ".join(data["recommended_targets"]).lower()
    tips = " ".join(data["strategy_tips"]).lower()

    assert "secondary points" in targets or "channel swings" in targets
    assert "wind-blown" in targets or "wind-blown" in tips


def test_recommend_color_palettes_varies_by_clarity_and_sky():
    clear_sun = " ".join(recommend_color_palettes("clear", "sunny")).lower()
    muddy_cloud = " ".join(recommend_color_palettes("muddy", "overcast")).lower()

    assert "translucent" in clear_sun or "natural" in clear_sun
    assert "black/blue" in muddy_cloud or "silhouette" in muddy_cloud
    assert clear_sun != muddy_cloud


def test_recommend_techniques_changes_with_depth_zone():
    shallow = recommend_techniques("pre-spawn", "shallow")
    offshore = recommend_techniques("summer", "offshore")

    assert "dropshot" in [t.lower() for t in offshore]
    assert any("fluke" in t.lower() or "wacky" in t.lower() for t in shallow)


def test_build_pro_setups_includes_detailed_fields():
    lures = [
        "lipless crankbait",
        "texas-rigged creature bait",
        "dropshot finesse worm",
    ]

    setups = build_pro_setups(
        lures=lures,
        phase="pre-spawn",
        depth_zone="mid-depth",
        clarity="stained",
        wind_speed=10.0,
        bottom_composition="rock",
        sky_condition="cloudy",
    )

    assert isinstance(setups, list)
    assert len(setups) == len(lures)

    # Ensure each setup is tied to a specific lure and has gear detail
    for setup, lure in zip(setups, lures):
        assert setup["lure"] == lure
        for key in ["technique", "rod", "reel", "line", "hook_or_leader", "lure_size"]:
            assert key in setup



def test_build_pattern_summary_structure_and_content():
    summary = build_pattern_summary(
        temp_f=55.0,
        month=3,
        clarity="stained",
        wind_speed=8.0,
        sky_condition="cloudy",
        depth_ft=10.0,
        bottom_composition="rock",
    )

    assert "phase" in summary
    assert "depth_zone" in summary
    assert "recommended_lures" in summary
    assert "recommended_targets" in summary
    assert "strategy_tips" in summary
    assert "color_recommendations" in summary
    assert "lure_setups" in summary
    assert "conditions" in summary
    assert "notes" in summary

    lures = summary["recommended_lures"]
    setups = summary["lure_setups"]
    assert isinstance(lures, list)
    assert isinstance(setups, list)
    assert len(setups) == len(lures)

    # Each setup should correspond to a lure
    lure_names_in_setups = [s["lure"] for s in setups]
    for lure in lures:
        assert lure in lure_names_in_setups


def test_build_basic_pattern_summary_is_simpler_and_uses_techniques():
    basic = build_basic_pattern_summary(
        temp_f=55.0,
        month=3,
        clarity="stained",
        wind_speed=8.0,
    )

    assert "phase" in basic
    assert "depth_zone" in basic
    assert "recommended_techniques" in basic
    assert "notes" in basic

    assert "recommended_lures" not in basic
    assert isinstance(basic["recommended_techniques"], list)
    assert len(basic["recommended_techniques"]) > 0
