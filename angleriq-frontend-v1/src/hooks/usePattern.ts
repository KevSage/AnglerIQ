import { useEffect, useState } from "react";
import type { Tier } from "./useTier";

// Vision block types (frontend shape)
export type SurfaceBlock = {
  visible_structure: string;
  cover_density: string;
  clarity_cues: string;
  shade_lanes: string;
  vegetation_type: string;
};

export type SonarBlock = {
  depth_bands: string;
  bottom_hardness: string;
  bait_presence: string;
  arch_count: string;
  activity_level: string;
  should_you_keep_moving: string;
};

export type VisionAnalysisBlock = {
  area_confidence: string;
  quality_zone: string;
  movement_logic: string;
  environmental_interpretation: string;
};

export type VisionApproachBlock = {
  updated_technique_focus: string;
  updated_depth_expectation: string;
  updated_movement_strategy: string;
  why_vision_adjusted_the_approach: string;
};

// Pattern types
export type GameplanBlock = {
  label: string;
  description: string;
};

export type AdjustmentBlock = {
  trigger: string;
  adjustment: string;
  why_it_works: string;
};

export type PatternResponse = {
  tier: Tier;
  pattern_of_the_moment: string;
  depth_zone: string;
  technique: string;
  supporting_lures: string[];
  gameplan?: GameplanBlock[]; // Elite + Vision
  adjustments?: AdjustmentBlock[]; // Elite + Vision
  conditions: {
    temp_f?: number;
    wind_mph?: number;
    pressure_trend?: string;
    cloud_cover?: string;
    clarity_estimate?: string;
    season_phase?: string;
  };
  vision?: {
    surface_enhanced?: SurfaceBlock;
    sonar_enhanced?: SonarBlock;
    vision_enhanced_analysis?: VisionAnalysisBlock;
    vision_enhanced_approach?: VisionApproachBlock;
  };
};

type PatternState = {
  pattern: PatternResponse | null;
  loading: boolean;
  error: string | null;
};

// TEMP: mocked pattern builder (will be replaced by real API call)
const buildMockPattern = (tier: Tier): PatternResponse => {
  const base: PatternResponse = {
    tier,
    pattern_of_the_moment: "Mock Pattern",
    depth_zone: "Mid-depth",
    technique: "Mock Technique",
    supporting_lures: ["Mock Lure 1", "Mock Lure 2", "Mock Lure 3"],
    conditions: {
      temp_f: 62,
      wind_mph: 8,
      pressure_trend: "steady",
      cloud_cover: "partly cloudy",
      clarity_estimate: "moderate",
      season_phase: "pre-spawn",
    },
  };

  if (tier === "pro") {
    return base;
  }

  // Elite: gameplan + adjustments, no Vision
  if (tier === "elite") {
    return {
      ...base,
      gameplan: [
        {
          label: "Morning Strategy",
          description: "Mock morning gameplan block.",
        },
        {
          label: "Midday Strategy",
          description: "Mock midday gameplan block.",
        },
        {
          label: "Afternoon Shift",
          description: "Mock afternoon gameplan block.",
        },
        {
          label: "Evening Window",
          description: "Mock evening gameplan block.",
        },
      ],
      adjustments: [
        {
          trigger: "Wind increases sharply",
          adjustment: "Switch to a heavier moving bait.",
          why_it_works: "Keeps contact and control in higher wind.",
        },
        {
          trigger: "Water clarity improves",
          adjustment: "Downsize line and consider more natural colors.",
          why_it_works: "More natural presentation in clear water.",
        },
      ],
    };
  }

  // Vision: everything in Elite + Vision blocks
  return {
    ...base,
    gameplan: [
      {
        label: "Morning Strategy",
        description: "Mock morning gameplan block (Vision tier).",
      },
      {
        label: "Midday Strategy",
        description: "Mock midday gameplan block (Vision tier).",
      },
      {
        label: "Afternoon Shift",
        description: "Mock afternoon gameplan block (Vision tier).",
      },
      {
        label: "Evening Window",
        description: "Mock evening gameplan block (Vision tier).",
      },
    ],
    adjustments: [
      {
        trigger: "Baitfish stack on mid-depth structure",
        adjustment: "Focus on mid-depth reaction baits over the structure.",
        why_it_works:
          "Targets active fish positioned around the strongest returns.",
      },
    ],
    vision: {
      surface_enhanced: {
        visible_structure: "Overhanging trees and dock posts along the bank.",
        cover_density: "Moderate to high near mid-bank stretches.",
        clarity_cues: "Slight surface stain with visible ripple lines.",
        shade_lanes: "Clean shade lanes along the north-facing bank.",
        vegetation_type: "Sparse shoreline grass with isolated patches.",
      },
      sonar_enhanced: {
        depth_bands: "Most baitfish appear between 8–14 ft.",
        bottom_hardness:
          "Transition from medium to harder bottom off the break.",
        bait_presence: "Consistent bait balls on the mid-depth ledge.",
        arch_count: "Moderate arch count around bait pods.",
        activity_level: "Medium activity with periodic flurries.",
        should_you_keep_moving:
          "Work through the stretch slowly, then move if no bites in 20–30 minutes.",
      },
      vision_enhanced_analysis: {
        area_confidence:
          "High confidence around the mid-depth break with visible surface cues.",
        quality_zone:
          "Best quality zone is the transition edge where grass ends and hard bottom begins.",
        movement_logic:
          "Slide along the contour, focusing on points and subtle inside turns.",
        environmental_interpretation:
          "Wind and light angle are positioning baitfish slightly off the main break.",
      },
      vision_enhanced_approach: {
        updated_technique_focus:
          "Prioritize mid-depth reaction baits that track the break cleanly.",
        updated_depth_expectation:
          "Target 8–14 ft as the primary strike window.",
        updated_movement_strategy:
          "Work the best-looking stretches thoroughly, then hop to similar structure.",
        why_vision_adjusted_the_approach:
          "Vision confirmed consistent bait and hard-bottom transitions at mid-depth.",
      },
    },
  };
};

export const usePattern = (tier: Tier): PatternState => {
  const [state, setState] = useState<PatternState>({
    pattern: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Later: replace with real API call to backend pattern endpoint.
    setState({
      pattern: buildMockPattern(tier),
      loading: false,
      error: null,
    });
  }, [tier]);

  return state;
};
