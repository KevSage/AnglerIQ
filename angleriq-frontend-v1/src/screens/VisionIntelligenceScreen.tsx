// src/screens/VisionIntelligenceScreen.tsx

import { useState } from "react";
import { Navigate } from "react-router-dom";
import ScreenContainer from "../components/layout/ScreenContainer";
import { useTier } from "../hooks/useTier";
import { usePattern } from "../hooks/usePattern";

import VisionSummaryStrip from "../components/vision/VisionSummaryStrip";
import SurfaceEnhancedBlock from "../components/vision/SurfaceEnhancedBlock";
import SonarEnhancedBlock from "../components/vision/SonarEnhancedBlock";
import VisionFusionPanel from "../components/vision/VisionFusionPanel";

type VisionMode = "surface" | "sonar" | "vision";

const VisionIntelligenceScreen = () => {
  const { tier } = useTier();
  const { pattern, loading, error } = usePattern(tier);
  const [mode, setMode] = useState<VisionMode>("vision");

  // Defensive tier gating — Vision tier only
  if (tier !== "vision") {
    return <Navigate to="/" replace />;
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

  if (error || !pattern) {
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

  const surface = pattern.vision?.surface_enhanced;
  const sonar = pattern.vision?.sonar_enhanced;
  const analysis = pattern.vision?.vision_enhanced_analysis;
  const approach = pattern.vision?.vision_enhanced_approach;

  const hasSurface = !!surface;
  const hasSonar = !!sonar;
  const hasVisionCore = !!(analysis || approach);
  const hasAnyVision = hasSurface || hasSonar || hasVisionCore;

  // Hybrid global + local panel copy (no numbers, no contradictions)
  const hasLocalVision = hasAnyVision;
  const localLine = hasLocalVision
    ? "Local: Vision is interpreting this specific area from your latest surface and/or sonar inputs."
    : "Local: No images yet. Upload a surface photo or sonar screenshot to see how this exact spot behaves.";

  if (!hasAnyVision) {
    return (
      <ScreenContainer
        title="Vision Intelligence"
        tagline="Environmental Understanding — Elevated."
      >
        {/* Hybrid conditions + environment panel */}
        <section className="mt-4 rounded-2xl border border-gray-700/70 bg-[#050608] px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-300">
            Conditions + Environment
          </p>
          <p className="mt-1 text-xs text-gray-200">
            Global: Today&apos;s overall weather and seasonal cues are shaping
            the current pattern.
          </p>
          <p className="mt-1 text-xs text-gray-400">{localLine}</p>
        </section>

        <div className="mt-8 rounded-2xl border border-gray-700/70 bg-[#101010] px-4 py-6 text-center">
          <p className="text-xs text-gray-200">
            No sonar or surface images yet.
          </p>
          <p className="mt-2 text-[11px] text-gray-400">
            Upload a photo or sonar screenshot to activate Vision Enhanced
            interpretation.
          </p>
        </div>
      </ScreenContainer>
    );
  }

  // Auto-correct mode if selected one has no data
  const safeMode: VisionMode = (() => {
    if (mode === "surface" && !hasSurface) {
      if (hasSonar) return "sonar";
      if (hasVisionCore) return "vision";
    }
    if (mode === "sonar" && !hasSonar) {
      if (hasSurface) return "surface";
      if (hasVisionCore) return "vision";
    }
    if (mode === "vision" && !hasVisionCore) {
      if (hasSurface) return "surface";
      if (hasSonar) return "sonar";
    }
    return mode;
  })();

  const tabBase =
    "flex-1 px-3 py-1.5 text-[10px] font-medium rounded-full transition-colors";

  const tabClasses = (target: VisionMode, enabled: boolean) => {
    const active = safeMode === target;

    if (!enabled) {
      return [tabBase, "cursor-not-allowed opacity-40 text-gray-500"].join(" ");
    }

    if (!active) {
      return [tabBase, "text-gray-300 hover:text-white"].join(" ");
    }

    // Active color by mode
    if (target === "surface") {
      return [tabBase, "bg-emerald-500/90 text-black"].join(" ");
    }
    if (target === "sonar") {
      return [tabBase, "bg-sky-500/90 text-black"].join(" ");
    }
    // vision
    return [tabBase, "bg-indigo-500/90 text-black"].join(" ");
  };

  return (
    <ScreenContainer
      title="Vision Intelligence"
      tagline="Environmental Understanding — Elevated."
    >
      {/* Hybrid conditions + environment panel */}
      <section className="mb-4 mt-1 rounded-2xl border border-gray-700/70 bg-[#050608] px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-300">
          Conditions + Environment
        </p>
        <p className="mt-1 text-xs text-gray-200">
          Global: Today&apos;s overall weather and seasonal cues are shaping the
          current pattern.
        </p>
        <p className="mt-1 text-xs text-gray-400">{localLine}</p>
      </section>

      <div className="vision-intel-root">
        {/* Mode selector */}
        <div className="mb-4 rounded-full bg-[#050608] p-1">
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={!hasSurface}
              className={tabClasses("surface", hasSurface)}
              onClick={() => hasSurface && setMode("surface")}
            >
              Surface Enhanced
            </button>
            <button
              type="button"
              disabled={!hasSonar}
              className={tabClasses("sonar", hasSonar)}
              onClick={() => hasSonar && setMode("sonar")}
            >
              Subsurface Enhanced
            </button>
            <button
              type="button"
              disabled={!hasVisionCore}
              className={tabClasses("vision", hasVisionCore)}
              onClick={() => hasVisionCore && setMode("vision")}
            >
              Vision Enhanced
            </button>
          </div>
        </div>

        {/* Summary strip (works for all modes) */}
        <VisionSummaryStrip
          mode={safeMode}
          surface={surface}
          sonar={sonar}
          analysis={analysis}
          approach={approach}
        />

        {/* Mode-specific content */}
        <div className="mt-2 space-y-5">
          {safeMode === "surface" && surface && (
            <SurfaceEnhancedBlock surface={surface} />
          )}

          {safeMode === "sonar" && sonar && (
            <SonarEnhancedBlock sonar={sonar} />
          )}

          {safeMode === "vision" && (
            <VisionFusionPanel analysis={analysis} approach={approach} />
          )}
        </div>

        {/* Upload actions per tab (V1: simple, non-intrusive stubs) */}
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
