// src/screens/VisionIntelligenceScreen.tsx

import React, {
  useState,
  useEffect,
  useRef,
  type ReactElement,
} from "react";
import { Navigate } from "react-router-dom";
import ScreenContainer from "../components/layout/ScreenContainer";
import { useTier } from "../hooks/useTier";
import { usePattern, type PatternResponse } from "../hooks/usePattern";

import VisionSummaryStrip from "../components/vision/VisionSummaryStrip";
import SurfaceEnhancedBlock from "../components/vision/SurfaceEnhancedBlock";
import SonarEnhancedBlock from "../components/vision/SonarEnhancedBlock";
import VisionFusionPanel from "../components/vision/VisionFusionPanel";

type VisionMode = "surface" | "sonar" | "vision";

const VisionIntelligenceScreen: React.FC = (): ReactElement => {
  const { tier } = useTier();
  const { pattern, loading, error } = usePattern(tier);

  // All hooks live up here so the order never changes
  const [mode, setMode] = useState<VisionMode>("vision");
  const [hasPatternChanged, setHasPatternChanged] = useState(false);
  const prevKeyRef = useRef<string | null>(null);

  const p = pattern as PatternResponse | null;

  const patternTitle =
    p?.primary_technique ||
    p?.technique ||
    p?.pattern_of_the_moment ||
    "—";

  const depthZoneLabel = p?.depth_zone || "—";

  // Track whether pattern changed (e.g., Vision adjustments)
  useEffect(() => {
    const key = `${patternTitle}|${depthZoneLabel}`;

    if (prevKeyRef.current && prevKeyRef.current !== key) {
      setHasPatternChanged(true);
      const timer = setTimeout(() => setHasPatternChanged(false), 4000);
      return () => clearTimeout(timer);
    }

    prevKeyRef.current = key;
  }, [patternTitle, depthZoneLabel]);

  // Vision blocks (guarded via optional chaining)
  const surface = p?.vision?.surface_enhanced;
  const sonar = p?.vision?.sonar_enhanced;
  const analysis = p?.vision?.vision_enhanced_analysis;
  const approach = p?.vision?.vision_enhanced_approach;

  const hasSurface = !!surface;
  const hasSonar = !!sonar;
  const hasVisionCore = !!(analysis || approach);
  const hasAnyVision = hasSurface || hasSonar || hasVisionCore;
  const hasLocalVision = !!p && hasAnyVision;

  const globalLine =
    "Global: Today’s overall weather and seasonal cues are shaping the current pattern.";
  const localLine = hasLocalVision
    ? "Local: Vision is interpreting this specific area from your latest surface and/or sonar inputs."
    : "Local: No images yet. Upload a surface photo or sonar screenshot to see how this exact spot behaves.";

  const safeMode: VisionMode = mode;

  const tabBase =
    "flex-1 px-3 py-1.5 text-[10px] font-medium rounded-full transition-colors";

  const tabClasses = (target: VisionMode) => {
    const active = safeMode === target;

    if (!active) {
      return [tabBase, "text-gray-300 hover:text-white"].join(" ");
    }

    if (target === "surface") {
      return [tabBase, "bg-emerald-500/90 text-black"].join(" ");
    }
    if (target === "sonar") {
      return [tabBase, "bg-sky-500/90 text-black"].join(" ");
    }
    // vision
    return [tabBase, "bg-indigo-500/90 text-black"].join(" ");
  };

  // ---------- Conditional returns (after ALL hooks) ----------

  // Vision tier gating
  if (tier !== "vision") {
    return (
      <ScreenContainer
        title="Vision Intelligence"
        tagline="Environmental Understanding — Elevated."
      >
        <div className="mt-6 rounded-2xl border border-gray-700/70 bg-[#050608] px-4 py-4 text-xs text-gray-200">
          Vision Intelligence is available only for the Vision tier. Switch
          tiers in Control Center to unlock Vision Enhanced analysis.
        </div>
      </ScreenContainer>
    );
  }

  if (loading) {
    return (
      <ScreenContainer
        title="Vision Intelligence"
        tagline="Environmental Understanding — Elevated."
      >
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-xs text-gray-400">
            Interpreting today&apos;s conditions…
          </p>
        </div>
      </ScreenContainer>
    );
  }

  if (error || !p) {
    return (
      <ScreenContainer
        title="Vision Intelligence"
        tagline="Environmental Understanding — Elevated."
      >
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-xs text-red-400">
            Something went wrong while interpreting conditions. Try again.
          </p>
        </div>
      </ScreenContainer>
    );
  }

  // ---------- Main render ----------

  return (
    <ScreenContainer
      title="Vision Intelligence"
      tagline="Environmental Understanding — Elevated."
    >
      {/* Hybrid conditions + environment panel */}
      <section className="mb-3 mt-1 rounded-2xl border border-gray-700/70 bg-[#050608] px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
          Conditions + Environment
        </p>
        <p className="mt-1 text-xs text-gray-400">{globalLine}</p>
        <p className="mt-1 text-xs text-gray-400">{localLine}</p>
      </section>

      {/* Pattern Snapshot strip */}
      <section className="mb-3 rounded-2xl border border-gray-700/70 bg-[#050608] px-4 py-3 text-[11px] text-gray-200">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                Pattern Snapshot
              </p>
              {hasPatternChanged && (
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-300">
                  Updated from Vision
                </span>
              )}
            </div>
            <p className="mt-1 text-[12px] text-gray-100">{patternTitle}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
              Depth Zone
            </p>
            <p className="mt-1 text-[12px] text-gray-100">{depthZoneLabel}</p>
          </div>
        </div>

        <p className="mt-2 text-[10px] text-gray-400">
          Vision interprets this exact area in the context of today&apos;s
          pattern, not as a separate guess.
        </p>
      </section>

      <div className="vision-intel-root">
        {/* Mode selector */}
        <div className="mb-4 rounded-full bg-[#050608] p-1">
          <div className="flex items-center gap-1">
            <button
              type="button"
              className={tabClasses("surface")}
              onClick={() => setMode("surface")}
            >
              Surface Enhanced
            </button>
            <button
              type="button"
              className={tabClasses("sonar")}
              onClick={() => setMode("sonar")}
            >
              Subsurface Enhanced
            </button>
            <button
              type="button"
              className={tabClasses("vision")}
              onClick={() => setMode("vision")}
            >
              Vision Enhanced
            </button>
          </div>
        </div>

        {/* Summary strip */}
        <VisionSummaryStrip
          mode={safeMode}
          surface={surface}
          sonar={sonar}
          analysis={analysis}
          approach={approach}
        />

        {/* Mode-specific content */}
        <div className="mt-2 space-y-5">
          {safeMode === "surface" && (
            <>
              {surface ? (
                <SurfaceEnhancedBlock surface={surface} />
              ) : (
                <div className="rounded-2xl border border-emerald-500/40 bg-[#050608] px-4 py-3 text-xs text-gray-300">
                  No surface photos yet. Upload a bank, boat, or shoreline
                  photo to see how this exact stretch behaves.
                </div>
              )}
            </>
          )}

          {safeMode === "sonar" && (
            <>
              {sonar ? (
                <SonarEnhancedBlock sonar={sonar} />
              ) : (
                <div className="rounded-2xl border border-sky-500/40 bg-[#050608] px-4 py-3 text-xs text-gray-300">
                  No sonar screenshots yet. Upload a fishfinder screenshot to
                  see how bait, arches, and bottom transitions line up with your
                  pattern.
                </div>
              )}
            </>
          )}

          {safeMode === "vision" && (
            <>
              {analysis || approach ? (
                <VisionFusionPanel analysis={analysis} approach={approach} />
              ) : (
                <div className="rounded-2xl border border-indigo-500/40 bg-[#050608] px-4 py-3 text-xs text-gray-300">
                  Vision hasn&apos;t interpreted this area yet. Upload a surface
                  photo and/or sonar screenshot and refresh to see a Vision
                  Enhanced view that ties directly back to your pattern.
                </div>
              )}
            </>
          )}
        </div>

        {/* Upload actions (stubs) */}
        <div className="mt-5 space-y-2 text-center">
          {safeMode === "surface" && (
            <button
              type="button"
              className="w-full rounded-full border border-emerald-500/60 bg-emerald-500/5 px-4 py-2 text-xs font-semibold text-emerald-100"
            >
              Upload new surface photo
            </button>
          )}
          {safeMode === "sonar" && (
            <button
              type="button"
              className="w-full rounded-full border border-sky-500/60 bg-sky-500/5 px-4 py-2 text-xs font-semibold text-sky-100"
            >
              Upload new sonar screenshot
            </button>
          )}
          {safeMode === "vision" && (
            <button
              type="button"
              className="w-full rounded-full border border-indigo-500/60 bg-indigo-500/5 px-4 py-2 text-xs font-semibold text-indigo-100"
            >
              Upload images to refresh Vision Enhanced analysis
            </button>
          )}
        </div>
      </div>
    </ScreenContainer>
  );
};

export default VisionIntelligenceScreen;