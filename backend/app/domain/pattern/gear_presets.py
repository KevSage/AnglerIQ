from typing import List
from .schemas import LureSetup


def build_pro_setups_for_lures(lures: List[str]) -> List[LureSetup]:
    setups: List[LureSetup] = []

    for lure in lures:
        key = lure.lower()

        if "jerkbait" in key:
            setups.append(
                LureSetup(
                    lure=lure,
                    technique="suspending jerkbait over points and channel swings",
                    rod="6'8\"–7'0\" medium or medium-light, fast action",
                    reel="6.3:1 casting reel",
                    line="8–12 lb fluorocarbon",
                    hook_or_leader="stock trebles; consider one size up for stronger hooks",
                    lure_size="3.5–4.5 inch, shad pattern",
                )
            )
        elif "spinnerbait" in key:
            setups.append(
                LureSetup(
                    lure=lure,
                    technique="slow-roll or burn around cover and wind-blown banks",
                    rod="7'0\"–7'2\" medium-heavy, moderate-fast",
                    reel="6.3–7.1:1 casting reel",
                    line="14–17 lb fluorocarbon or mono",
                    hook_or_leader="built-in hook; optional trailer hook in open water",
                    lure_size="3/8–1/2 oz",
                )
            )
        # ...add your existing mappings here...
        else:
            setups.append(
                LureSetup(
                    lure=lure,
                    technique="use as your confidence presentation around high-percentage cover",
                    rod="7'0\" medium-heavy, fast",
                    reel="7.1:1 casting reel",
                    line="12–17 lb fluorocarbon",
                    hook_or_leader="appropriate for lure category",
                    lure_size="standard size for that bait category",
                )
            )

    return setups
