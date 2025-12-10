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
  };
  // 🔹 NEW FIELDS (match backend)
  primary_technique?: string | null;
  featured_lure_name?: string | null;
  featured_lure_family?: string | null;
  pattern_summary?: string | null;
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
  /**
   * If false, the hook stays idle (no request).
   * Default: true (backward compatible).
   */
  enabled?: boolean;
};

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

// Small helper to keep keys consistent
const patternCacheKey = (tier: Tier) => `aiq_pattern_snapshot_${tier}`;

// -----------------------------------------------------------------------------
// Real pattern loader with:
// - optional gating (enabled)
// - localStorage snapshot (persisted Pattern of the Day)
// -----------------------------------------------------------------------------

export const usePattern = (
  tier: Tier,
  { enabled = true }: UsePatternOptions = {}
): PatternState => {
  const [state, setState] = useState<PatternState>({
    pattern: null,
    loading: enabled,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    // If not enabled, sit idle with no pattern and no loading spinner.
    if (!enabled) {
      setState({
        pattern: null,
        loading: false,
        error: null,
      });
      return () => {
        cancelled = true;
      };
    }

    async function loadPattern() {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      // 1) Try to hydrate from localStorage first
      const cacheKey = patternCacheKey(tier);
      const cached = typeof window !== "undefined"
        ? window.localStorage.getItem(cacheKey)
        : null;

      if (cached) {
        try {
          const parsed = JSON.parse(cached) as PatternResponse;
          if (!cancelled) {
            setState({
              pattern: parsed,
              loading: false,
              error: null,
            });
            return; // ✅ Short-circuit: use cached pattern, no network hit.
          }
        } catch {
          // Bad cache → ignore and fall through to API
        }
      }

      // 2) No cache (or invalid) → hit backend
      try {
        // Map tier → backend endpoint
        const endpoint =
          tier === "pro"
            ? "/pattern/pro"
            : tier === "elite"
            ? "/pattern/elite"
            : "/pattern/vision-tier"; // Vision-specific endpoint

        // Minimal canonical payload; backend infers the rest.
        // (We can later wire real location/time-of-day from Control Center or device.)
        const storedLocation =
          localStorage.getItem("aiq_last_location") || "Atlanta, GA";

        const payload: Record<string, any> =
          tier === "pro"
            ? { location_name: storedLocation }
            : {
                location_name: storedLocation,
                time_of_day: "day",
                pressure_trend: "stable",
                water_level_trend: "stable",
                tournament_mode: false,
              };

        const resp = await fetch(`${API_BASE}${endpoint}`, {
          method: "POST",
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
          },

          primary_technique:
            raw.primary_technique ??
            raw.technique ??
            null,
          featured_lure_name: raw.featured_lure_name ?? null,
          featured_lure_family: raw.featured_lure_family ?? null,
          pattern_summary: raw.pattern_summary ?? null,

          // Vision blocks: only present if backend sends them.
          vision: raw.vision ?? undefined,
        };

        // Cache snapshot for this tier
        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem(cacheKey, JSON.stringify(mapped));
            window.localStorage.setItem("aiq_pattern_generated", "1");
          } catch {
            // ignore storage errors
          }
        }

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
  }, [tier, enabled]);

  return state;
};