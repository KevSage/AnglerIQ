import PatternDetailScreen, {
  PatternDetail,
} from "../components/PatternDetailScreen";

const MOCK_ELITE_PATTERN: PatternDetail = {
  phase: "Pre-Spawn",
  depthZone: "Mid-Shallow",
  structure: "Grass Lines",
  tier: "elite",
  technique: {
    name: "Chatterbait",
    style: "Power Fishing",
    iconKey: "chatterbait",
    bullets: [
      "Wind a 3/8 oz chatterbait along outside grass edges and irregularities.",
      "Tick the tops of grass and pop it free when you feel it load up.",
      "Use moderate retrieve speed and let the rod load before swinging.",
    ],
  },
  microPattern:
    "Warming pre-spawn conditions have fish sliding shallow around grass lines. A chatterbait lets you cover water while still triggering quality bites.",
  timeline: [
    { window: "6–9 AM", action: "Cover wind-blown grass edges in 4–8 ft." },
    {
      window: "9–12 PM",
      action: "Target irregularities: points, cuts, and drains in the grass.",
    },
    {
      window: "12–3 PM",
      action: "Slow down over the best stretches with more deliberate casts.",
    },
  ],
  adjustments: [
    {
      label: "If water is stained…",
      guidance:
        "Lean on brighter or high-contrast colors like chartreuse/white or black/blue with a bulkier trailer.",
    },
    {
      label: "If fish follow but don’t eat…",
      guidance:
        "Mix in a swim jig or follow-up soft plastic in the same lanes where you saw followers.",
    },
  ],
  lures: [
    { name: "Chatterbait", iconKey: "chatterbait" },
    { name: "Swim Jig", iconKey: "swim_jig" },
    { name: "Spinnerbait", iconKey: "spinnerbait" },
    { name: "Topwater Walker", iconKey: "topwater_walker" },
  ],
  colors: [
    { name: "White", hex: "#E5E5E5" },
    { name: "Chartreuse/White", hex: "#C4D943" },
    { name: "Green Pumpkin", hex: "#4A5A30" },
  ],
};

export default function ElitePatternPage() {
  return <PatternDetailScreen pattern={MOCK_ELITE_PATTERN} />;
}
