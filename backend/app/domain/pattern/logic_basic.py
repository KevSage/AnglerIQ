from .schemas import BasicPatternRequest, BasicPatternResponse
from .logic_common import classify_phase, infer_depth_zone, build_targets_and_tips

def build_basic_pattern(req: BasicPatternRequest) -> BasicPatternResponse:
    phase = classify_phase(req.temp_f, req.month)
    depth_zone = infer_depth_zone(phase, None)

    techniques = []

    if phase == "pre-spawn":
        techniques = ["spinnerbait", "lipless crankbait", "jig"]
    elif phase == "spawn/post-spawn":
        techniques = ["weightless fluke", "texas rig", "wacky rig"]
    elif phase == "summer":
        techniques = ["deep crankbait", "carolina rig", "big worm"]
    elif phase == "winter":
        techniques = ["jerkbait", "finesse jig", "blade bait"]
    else:
        techniques = ["moving bait (swimbait, crankbait)", "spinnerbait"]

    tips_targets = build_targets_and_tips(
        phase=phase,
        depth_zone=depth_zone,
        clarity=req.clarity,
        wind_speed=req.wind_speed,
        bottom_composition=None,
    )

    targets = tips_targets["recommended_targets"]

    return BasicPatternResponse(
        phase=phase,
        depth_zone=depth_zone,
        recommended_techniques=techniques,
        targets=targets,
        notes=(
            "This is a simplified SAGE Basic pattern: use these techniques and targets "
            "as a starting point, and upgrade to SAGE Pro for exact lures and detailed gear."
        ),
    )
