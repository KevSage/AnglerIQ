// app/api/home/route.ts
import { NextResponse } from "next/server";

export type Tier = "pro" | "elite" | "vision";

export interface HomeScreenData {
  tier: Tier;

  weather: {
    temperatureF: number;
    windDirection: string;
    windSpeedMph: number;
    skyCondition: string;
    pressureInHg: number;
    phase: string;
  };

  patternSummary: HomePatternSummary;

  conditionsDeepDive: ConditionsDeepDiveCard | null;
  sageTip: SageTipCard | null;
  lakeInfo: LakeInfoCard | null;
}

export interface HomePatternSummary {
  tier: Tier;
  depthZone: string;
  structure: string;
  iconKey: string;
  microPattern: string;
  confidence?: 0 | 1 | 2 | 3;
}

export interface ConditionsDeepDiveCard {
  tempTrend: "warming" | "cooling" | "stable";
  tempDeltaF: number;
  windSummary: string;
  pressureTrend: "rising" | "falling" | "steady";
  pressureNote: string;
  timesOfDay?: {
    label: string;
    iconKey?: string;
    note: string;
  }[];
}

export interface SageTipCard {
  title: string;
  body: string;
  iconKey?: string;
}

export interface LakeInfoCard {
  lakeName: string;
  waterTempF?: number;
  clarity?: string;
  levelOffsetFt?: number;
  seasonLabel?: string;
}

// Temporary hard-coded mock.
// Later we can replace this with a call to your FastAPI backend
// (e.g. fetch("http://localhost:8000/...")) without changing the UI.
const MOCK_HOME_DATA: HomeScreenData = {
  tier: "elite",

  weather: {
    temperatureF: 61,
    windDirection: "NW",
    windSpeedMph: 7,
    skyCondition: "Cloudy",
    pressureInHg: 30.14,
    phase: "Pre-Spawn",
  },

  patternSummary: {
    tier: "elite",
    depthZone: "Mid-Shallow",
    structure: "Grass Lines",
    iconKey: "chatterbait",
    microPattern:
      "Pre-spawn bass are sliding up around mid-depth grass edges as the water warms—start by covering water with a confident moving bait.",
    confidence: 2, // Vision-only, safe to leave set for now
  },

  conditionsDeepDive: {
    tempTrend: "warming",
    tempDeltaF: 2.5,
    windSummary: "Steady NW breeze pushing bait into the main-lake pockets.",
    pressureTrend: "falling",
    pressureNote:
      "Slightly looser, more active fish compared to a post-front day.",
    timesOfDay: [
      { label: "Morning", note: "Best window for roaming fish shallow." },
      { label: "Midday", note: "Focus on shade and thicker grass." },
      { label: "Late", note: "Wind-facing points can reload quickly." },
    ],
  },

  sageTip: {
    title: "Today’s SAGE Tip",
    body: "Start with a moving bait to locate active fish, then circle back with your favorite finesse presentation on the best stretches.",
  },

  lakeInfo: {
    lakeName: "Lake Lanier",
    waterTempF: 58,
    clarity: "2–3 ft clarity",
    levelOffsetFt: -1.2,
    seasonLabel: "Early Pre-Spawn",
  },
};

export async function GET() {
  return NextResponse.json(MOCK_HOME_DATA);
}
