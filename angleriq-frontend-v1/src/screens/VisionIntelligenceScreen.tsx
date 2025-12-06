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

  // Defensive tier gating
  if (tier !== "vision") {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <ScreenContainer
        title="Vision Intelligence Screen"
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
        title="Vision Intelligence Screen"
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
  const hasVisionFusion = !!(analysis || approach);

  const hasAnyVision = hasSurface || hasSonar || hasVisionFusion;

  if (!hasAnyVision) {
    return (
      <ScreenContainer
        title="Vision Intelligence Screen"
        tagline="Environmental Understanding — Elevated."
      >
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
      if (hasVisionFusion) return "vision";
    }
    if (mode === "sonar" && !hasSonar) {
      if (hasSurface) return "surface";
      if (hasVisionFusion) return "vision";
    }
    if (mode === "vision" && !hasVisionFusion) {
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
      title="Vision Intelligence Screen"
      tagline="Environmental Understanding — Elevated."
    >
      <div className="vision-intel-root">
        {" "}
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
              Sonar Enhanced
            </button>
            <button
              type="button"
              disabled={!hasVisionFusion}
              className={tabClasses("vision", hasVisionFusion)}
              onClick={() => hasVisionFusion && setMode("vision")}
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
      </div>
    </ScreenContainer>
  );
};

export default VisionIntelligenceScreen;
