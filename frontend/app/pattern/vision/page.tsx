import PatternDetailScreen, {
  PatternDetail,
} from "../components/PatternDetailScreen";

const MOCK_VISION_PATTERN: PatternDetail = {
  phase: "Pre-Spawn",
  depthZone: "Mid-Depth",
  structure: "Channel Swing + Timber",
  tier: "vision",
  technique: {
    name: "Swim Jig",
    style: "Power / Structure",
    iconKey: "swim_jig",
    bullets: [
      "Swim a 3/8–1/2 oz jig just above the tops of timber and breaks in 8–12 ft.",
      "Use a steady retrieve, then add slight rod twitches when you contact cover.",
      "Let the jig glide on slack line for a second after it clears each piece of wood.",
    ],
  },
  microPattern:
    "Your sonar is showing mid-depth bait and scattered fish around a channel swing with timber. A swim jig lets you cover that lane efficiently while still ticking the tops of key pieces.",
  timeline: [
    {
      window: "6–9 AM",
      action: "Start on the outside edge of the swing where bait is clustered.",
    },
    {
      window: "9–12 PM",
      action:
        "Slide shallower along the swing and hit isolated timber targets.",
    },
    {
      window: "12–3 PM",
      action:
        "Revisit the highest-confidence stretch and slow your retrieve slightly.",
    },
  ],
  adjustments: [
    {
      label: "If fish are pushing higher in the column…",
      guidance:
        "Raise your retrieve path and speed up slightly to keep the jig above them and trigger reaction bites.",
    },
    {
      label: "If activity drops off…",
      guidance:
        "Follow up with a slower bottom-contact presentation on the same pieces of cover you got bit on earlier.",
    },
  ],
  lures: [
    { name: "Swim Jig", iconKey: "swim_jig" },
    { name: "Chatterbait", iconKey: "chatterbait" },
    { name: "Crankbait", iconKey: "mid_crank" },
    { name: "Football Jig", iconKey: "jig" },
  ],
  colors: [
    { name: "Shad", hex: "#D7DFEA" },
    { name: "Bluegill", hex: "#4C6541" },
    { name: "Green Pumpkin", hex: "#4A5A30" },
  ],
};

export default function VisionPatternPage() {
  return <PatternDetailScreen pattern={MOCK_VISION_PATTERN} />;
}
