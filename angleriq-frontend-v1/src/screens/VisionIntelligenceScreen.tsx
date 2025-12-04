import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTier } from "../hooks/useTier";
import {
  usePattern,
  type PatternResponse,
  type SurfaceBlock,
  type SonarBlock,
  type VisionAnalysisBlock,
  type VisionApproachBlock,
} from "../hooks/usePattern";
import { useOnboardingGuard } from "../hooks/useOnboardingGuard";
import ScreenContainer from "../components/layout/ScreenContainer";

const VisionIntelligenceScreen: React.FC = () => {
  useOnboardingGuard();
  const navigate = useNavigate();
  const { tier } = useTier(); // "pro" | "elite" | "vision"
  const { pattern, loading, error } = usePattern(tier);

  const isVision = tier === "vision";

  // Hard gate: non-Vision tiers should not see this screen
  useEffect(() => {
    if (!isVision) {
      navigate("/", { replace: true });
    }
  }, [isVision, navigate]);

  if (!isVision) {
    // Prevent flicker for Pro/Elite while redirecting
    return null;
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
          Interpreting today’s conditions…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="space-y-3 rounded-xl border border-red-800/60 bg-slate-900/80 p-4 text-sm text-slate-200">
          <p>Something went wrong while interpreting conditions. Try again.</p>
        </div>
      </div>
    );
  }

  if (!pattern) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
          Pattern-of-the-Moment is not available right now.
        </div>
      </div>
    );
  }

  const p = pattern as PatternResponse;
  const vision = p.vision;

  const surface: SurfaceBlock | undefined = vision?.surface_enhanced;
  const sonar: SonarBlock | undefined = vision?.sonar_enhanced;
  const analysis: VisionAnalysisBlock | undefined =
    vision?.vision_enhanced_analysis;
  const approach: VisionApproachBlock | undefined =
    vision?.vision_enhanced_approach;

  const hasSurface = !!surface;
  const hasSonar = !!sonar;
  const hasAnalysis = !!analysis;
  const hasApproach = !!approach;

  const hasAnyVisionBlocks =
    hasSurface || hasSonar || hasAnalysis || hasApproach;

  // Canon empty state when no surface/sonar
  if (!hasAnyVisionBlocks || (!hasSurface && !hasSonar)) {
    return (
      <div className="min-h-[calc(100vh-4rem)] px-4 py-4">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-slate-100">
              Vision Intelligence Screen
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Environmental Understanding — Elevated.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-medium text-slate-200"
          >
            Back to Home
          </button>
        </header>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-200">
          <p>No sonar or surface images yet.</p>
          <p className="mt-1 text-xs text-slate-400">
            Upload a photo or sonar screenshot to activate Vision Enhanced
            interpretation.
          </p>
        </section>
      </div>
    );
  }

  return (
    <ScreenContainer>
      {/* Header */}
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-slate-100">
            Vision Intelligence Screen
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Environmental Understanding — Elevated.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-medium text-slate-200"
        >
          Back to Home
        </button>
      </header>

      <div className="space-y-4">
        {/* 1) Surface Enhanced */}
        {hasSurface && (
          <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-100">
                Surface Enhanced
              </p>
              <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-300">
                Surface Enhanced
              </span>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2 text-xs text-slate-200">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Visible Structure
                </p>
                <p className="mt-1">{surface?.visible_structure}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Cover Density
                </p>
                <p className="mt-1">{surface?.cover_density}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Clarity Cues
                </p>
                <p className="mt-1">{surface?.clarity_cues}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Shade Lanes
                </p>
                <p className="mt-1">{surface?.shade_lanes}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Vegetation Type
                </p>
                <p className="mt-1">{surface?.vegetation_type}</p>
              </div>
            </div>
          </section>
        )}

        {/* 2) Sonar Enhanced */}
        {hasSonar && (
          <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-100">
                Sonar Enhanced
              </p>
              <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-300">
                Sonar Enhanced
              </span>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2 text-xs text-slate-200">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Depth Bands
                </p>
                <p className="mt-1">{sonar?.depth_bands}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Bottom Hardness
                </p>
                <p className="mt-1">{sonar?.bottom_hardness}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Bait Presence
                </p>
                <p className="mt-1">{sonar?.bait_presence}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Arch Count
                </p>
                <p className="mt-1">{sonar?.arch_count}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Activity Level
                </p>
                <p className="mt-1">{sonar?.activity_level}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Should You Keep Moving?
                </p>
                <p className="mt-1">{sonar?.should_you_keep_moving}</p>
              </div>
            </div>
          </section>
        )}

        {/* 3) Vision Enhanced Analysis */}
        {hasAnalysis && (
          <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-100">
                Vision Enhanced Analysis
              </p>
              <span className="rounded-full border border-emerald-500/70 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-200">
                Vision Enhanced
              </span>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2 text-xs text-slate-200">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Area Confidence
                </p>
                <p className="mt-1">{analysis?.area_confidence}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Quality Zone
                </p>
                <p className="mt-1">{analysis?.quality_zone}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Movement Logic
                </p>
                <p className="mt-1">{analysis?.movement_logic}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Environmental Interpretation
                </p>
                <p className="mt-1">{analysis?.environmental_interpretation}</p>
              </div>
            </div>
          </section>
        )}

        {/* 4) Vision Enhanced Approach (conditional) */}
        {hasApproach && (
          <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-100">
                Vision Enhanced Approach
              </p>
              <span className="rounded-full border border-emerald-500/70 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-200">
                Vision Enhanced
              </span>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2 text-xs text-slate-200">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Updated Technique Focus
                </p>
                <p className="mt-1">{approach?.updated_technique_focus}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Updated Depth Expectation
                </p>
                <p className="mt-1">{approach?.updated_depth_expectation}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Updated Movement Strategy
                </p>
                <p className="mt-1">{approach?.updated_movement_strategy}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Why Vision Adjusted the Approach
                </p>
                <p className="mt-1">
                  {approach?.why_vision_adjusted_the_approach}
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </ScreenContainer>
  );
};

export default VisionIntelligenceScreen;
