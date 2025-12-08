// app/pattern/pro/page.tsx
"use client";

import React from "react";
import PatternDetailScreen, {
  PatternDetail,
} from "../components/PatternDetailScreen";

const MOCK_PRO_PATTERN: PatternDetail = {
  phase: "Pre-Spawn",
  depthZone: "Mid-Shallow",
  structure: "Grass Lines",
  tier: "pro",
  technique: {
    name: "Chatterbait",
    style: "Power fishing around shallow grass",
    iconKey: "chatterbait",
    bullets: [
      "Make long casts paralleling the outside grass edge.",
      "Keep the bait ticking the tops of the grass, snapping it free when it hangs.",
      "Focus on wind-blown stretches where bait naturally stacks up.",
    ],
  },
  microPattern:
    "Pre-spawn bass are sliding up into mid-shallow grass lines — perfect for a power chatterbait pattern that covers water and triggers reaction bites.",
  timeline: [
    {
      window: "6–9 AM",
      action: "Cover shallow grass flats with a steady chatterbait retrieve.",
    },
    {
      window: "9–12 PM",
      action: "Target outside grass edges and small points with slower passes.",
    },
    {
      window: "12–3 PM",
      action: "Pick apart high-percentage stretches with repeated casts.",
    },
    {
      window: "3–Dark",
      action: "Revisit windy banks and any areas you’ve had bites earlier.",
    },
  ],
  adjustments: [
    {
      label: "If the wind dies",
      guidance:
        "Slow your retrieve slightly and add more rod twitches to keep the blade pulsing. If it gets slick-calm, be ready to follow up with a jig or Texas rig in the same grass lanes.",
    },
    {
      label: "If water gets dirtier",
      guidance:
        "Bump up to a slightly heavier chatterbait, choose a louder blade style if you have it, and lean into bold colors like black/blue or chartreuse/white.",
    },
    {
      label: "If bites are short-striking",
      guidance:
        "Add a trailers with more bulk or switch to a slightly smaller profile chatterbait and make more precise casts to obvious grass clumps and edges.",
    },
  ],
  lures: [
    { name: "Chatterbait (primary)", iconKey: "chatterbait" },
    { name: "Swim Jig (backup)", iconKey: "swim_jig" },
    { name: "Squarebill Crank", iconKey: "squarebill_crank" },
    { name: "Texas-Rig Worm", iconKey: "texas_rig" },
  ],
  colors: [
    { name: "Green Pumpkin", hex: "#3F5A2A" },
    { name: "Black/Blue", hex: "#101522" },
    { name: "White", hex: "#F5F5F5" },
    { name: "Chartreuse/White", hex: "#D4E861" },
  ],
};

export default function ProPatternPage() {
  // Later we’ll replace MOCK_PRO_PATTERN with a real fetch/adapter from the Pro engine.
  return <PatternDetailScreen pattern={MOCK_PRO_PATTERN} />;
}
