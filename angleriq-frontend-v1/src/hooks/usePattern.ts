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
  pattern_blurb?: string;
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
    // optional extra fields from backend are fine; TS will ignore them
    [key: string]: unknown;
  };
  // 🔹 NEW FIELDS (match backend)
  primary_technique?: string | null;
  featured_lure_name?: string | null;
  featured_lure_family?: string | null;
  pattern_summary?: string | null;
  phase?: string | null;
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

type UsePatternOptions = {
  enabled?: boolean;
};

// -----------------------------------------------------------------------------
// Real pattern loader with POST for all tiers (incl. Vision)
// -----------------------------------------------------------------------------

export const usePattern = (
  tier: Tier,
  options?: UsePatternOptions
): PatternState => {
  const { enabled = true } = options ?? {};

  const [state, setState] = useState<PatternState>({
    pattern: null,
    loading: enabled,
    error: null,
  });

  const API_BASE =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

  useEffect(() => {
    let cancelled = false;

    if (!enabled) {
      // Pattern generation not requested yet (pre "Generate Pattern" tap)
      setState({
        pattern: null,
        loading: false,
        error: null,
      });
      return;
    }

    async function loadPattern() {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        // Map tier → backend endpoint
        let endpoint: string;
        let payload: Record<string, unknown>;

        if (tier === "pro") {
          endpoint = "/pattern/pro";
          payload = {
            location_name: "Test Lake",
          };
        } else {
          // Shared Elite / Vision pattern payload
          const eliteLikePattern = {
            location_name: "Test Lake",
            time_of_day: "day",
            pressure_trend: "stable",
            water_level_trend: "stable",
            tournament_mode: false,
          };

          if (tier === "elite") {
            endpoint = "/pattern/elite";
            payload = eliteLikePattern;
          } else {
            // ✅ Vision: its own endpoint, same core pattern payload for now
            endpoint = "/pattern/vision-tier";

            // V1 behavior:
            // Backend treats this like Elite when no Vision context is present.
            // Later, VisionContext will be added here when we wire image upload.
            payload = {
              pattern: eliteLikePattern,
              // vision is intentionally omitted or left for future wiring.
              // The backend's VisionContext is optional in our latest version.
            };
          }
        }

        const resp = await fetch(`${API_BASE}${endpoint}`, {
          method: "POST", // ✅ force POST for every tier
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!resp.ok) {
          const text = await resp.text();
          if (!cancelled) {
            setState({
              pattern: null,
              loading: false,
              error:
                text ||
                `Pattern request failed with status ${resp.status.toString()}`,
            });
          }
          return;
        }

        const raw: any = await resp.json();
        if (cancelled) return;

        const conditions = raw.conditions || {};

        const mapped: PatternResponse = {
          tier,
          pattern_of_the_moment:
            raw.pattern_of_the_moment ??
            raw.technique ??
            raw.phase ??
            "Pattern of the Day",
          depth_zone:
            raw.depth_zone ??
            conditions.depth_zone ??
            conditions.vision_depth_zone ??
            "mixed_depths",
          technique: raw.technique ?? raw.pattern_of_the_moment ?? "Technique",
          pattern_blurb: raw.pattern_blurb ?? raw.pattern_summary ?? undefined,
          supporting_lures:
            raw.supporting_lures ?? raw.recommended_lures ?? [],

          gameplan: raw.gameplan ?? undefined,
          adjustments: raw.adjustments ?? undefined,

          conditions: {
            temp_f:
              conditions.temp_f ??
              conditions.air_temp_f ??
              undefined,
            wind_mph:
              conditions.wind_speed ??
              conditions.wind_mph ??
              undefined,
            pressure_trend: conditions.pressure_trend,
            cloud_cover:
              conditions.sky_condition ??
              conditions.cloud_cover ??
              undefined,
            clarity_estimate:
              conditions.clarity ??
              conditions.clarity_estimate ??
              undefined,
            season_phase:
              raw.phase ??
              conditions.phase ??
              undefined,
            ...conditions,
          },

          primary_technique:
            raw.primary_technique ?? raw.technique ?? null,
          featured_lure_name: raw.featured_lure_name ?? null,
          featured_lure_family: raw.featured_lure_family ?? null,
          pattern_summary: raw.pattern_summary ?? null,
          phase: raw.phase ?? null,

          // Vision payload (if present)
          vision: raw.vision ?? undefined,
        };

        setState({
          pattern: mapped,
          loading: false,
          error: null,
        });
      } catch (err: any) {
        if (cancelled) return;
        setState({
          pattern: null,
          loading: false,
          error:
            err?.message ??
            "Unexpected error while loading Pattern of the Day.",
        });
      }
    }

    void loadPattern();

    return () => {
      cancelled = true;
    };
  }, [tier, enabled, API_BASE]);

  return state;
};