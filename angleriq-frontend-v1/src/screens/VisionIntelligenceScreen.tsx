import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTier } from "../hooks/useTier";
import { usePattern } from "../hooks/usePattern";
import ScreenContainer from "../components/layout/ScreenContainer";

const VisionIntelligenceScreen = () => {
  const { tier } = useTier();
  const navigate = useNavigate();

  const { pattern, loading, error } = usePattern(tier);

  // Hard gate: /vision must be Vision tier only
  useEffect(() => {
    if (tier !== "vision") {
      navigate("/", { replace: true });
    }
  }, [tier, navigate]);

  if (tier !== "vision") {
    // Safeguard render (should be immediately redirected)
    return null;
  }

  const vision = pattern?.vision;
  const surface = vision?.surface_enhanced;
  const sonar = vision?.sonar_enhanced;
  const fusedAnalysis = vision?.vision_enhanced_analysis;
  const fusedApproach = vision?.vision_enhanced_approach;

  const hasSurface = Boolean(surface);
  const hasSonar = Boolean(sonar);
  const hasAnyVisionInput = hasSurface || hasSonar;
  const hasFusion = hasSurface && hasSonar && Boolean(fusedAnalysis);

  // Simple confidence meter based on area_confidence text (Vision only)
  const deriveConfidenceLevel = (): "low" | "medium" | "high" => {
    const text = fusedAnalysis?.area_confidence?.toLowerCase() || "";
    if (text.includes("high")) return "high";
    if (text.includes("low")) return "low";
    return "medium";
  };

  const confidenceLevel = deriveConfidenceLevel();

  // Loading state (canonical tone)
  if (loading) {
    return (
      <ScreenContainer>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center text-xs text-gray-300">
          <p className="mb-2 animate-pulse">
            Interpreting today&apos;s conditions…
          </p>
        </div>
      </ScreenContainer>
    );
  }

  // Error state (canonical error copy)
  if (error) {
    return (
      <ScreenContainer>
        <div className="mt-6 rounded-2xl border border-red-500/40 bg-red-900/10 px-4 py-3 text-xs text-red-200">
          <p className="font-medium">
            Something went wrong while interpreting conditions. Try again.
          </p>
        </div>
      </ScreenContainer>
    );
  }

  // Empty state when no surface or sonar data (FAC)
  if (!hasAnyVisionInput) {
    return (
      <ScreenContainer>
        <header className="mb-4">
          <h1 className="text-lg font-semibold text-gray-100">
            Vision Intelligence Screen
          </h1>
          <p className="mt-1 text-xs text-gray-400">
            Environmental Understanding — Elevated.
          </p>
        </header>

        <main className="mt-8 space-y-3 text-xs text-gray-300">
          <p>No sonar or surface images yet.</p>
          <p>
            Upload a photo or sonar screenshot to activate Vision Enhanced
            interpretation.
          </p>
        </main>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      {/* Header + Tagline */}
      <header className="mb-4">
        <h1 className="text-lg font-semibold text-gray-100">
          Vision Intelligence Screen
        </h1>
        <p className="mt-1 text-xs text-gray-400">
          Environmental Understanding — Elevated.
        </p>
      </header>

      {/* Optional confidence meter (Vision only, subtle) */}
      {hasFusion && (
        <section className="mb-4 rounded-2xl border border-gray-700/70 bg-black/40 px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-gray-200">
              Area Confidence
            </p>
            <p className="text-[11px] text-gray-400">
              {fusedAnalysis?.area_confidence || "—"}
            </p>
          </div>
          <div className="mt-2 flex gap-1">
            <span
              className={
                "h-1.5 flex-1 rounded-full " +
                (confidenceLevel === "low" ||
                confidenceLevel === "medium" ||
                confidenceLevel === "high"
                  ? "bg-emerald-400/80"
                  : "bg-gray-700")
              }
            />
            <span
              className={
                "h-1.5 flex-1 rounded-full " +
                (confidenceLevel === "medium" || confidenceLevel === "high"
                  ? "bg-emerald-400/60"
                  : "bg-gray-800")
              }
            />
            <span
              className={
                "h-1.5 flex-1 rounded-full " +
                (confidenceLevel === "high"
                  ? "bg-emerald-400/40"
                  : "bg-gray-900")
              }
            />
          </div>
        </section>
      )}

      <main className="space-y-4 text-xs text-gray-200">
        {/* 1) Surface Enhanced */}
        {hasSurface && (
          <section className="rounded-2xl border border-gray-700/70 bg-black/40 px-4 py-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h2 className="text-[13px] font-semibold text-gray-100">
                Surface Enhanced
              </h2>
              <span className="rounded-full border border-emerald-500/60 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                Surface Enhanced
              </span>
            </div>
            <div className="space-y-1.5">
              <Row
                label="Visible Structure"
                value={surface?.visible_structure}
              />
              <Row label="Cover Density" value={surface?.cover_density} />
              <Row label="Clarity Cues" value={surface?.clarity_cues} />
              <Row label="Shade Lanes" value={surface?.shade_lanes} />
              <Row label="Vegetation Type" value={surface?.vegetation_type} />
            </div>
          </section>
        )}

        {/* 2) Sonar Enhanced */}
        {hasSonar && (
          <section className="rounded-2xl border border-gray-700/70 bg-black/40 px-4 py-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h2 className="text-[13px] font-semibold text-gray-100">
                Sonar Enhanced
              </h2>
              <span className="rounded-full border border-emerald-500/60 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                Sonar Enhanced
              </span>
            </div>
            <div className="space-y-1.5">
              <Row label="Depth Bands" value={sonar?.depth_bands} />
              <Row label="Bottom Hardness" value={sonar?.bottom_hardness} />
              <Row label="Bait Presence" value={sonar?.bait_presence} />
              <Row label="Arch Count" value={sonar?.arch_count} />
              <Row label="Activity Level" value={sonar?.activity_level} />
              <Row
                label="Should You Keep Moving?"
                value={sonar?.should_you_keep_moving}
              />
            </div>
          </section>
        )}

        {/* 3) Vision Enhanced Analysis (only when fused) */}
        {hasFusion && fusedAnalysis && (
          <section className="rounded-2xl border border-gray-700/70 bg-black/50 px-4 py-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h2 className="text-[13px] font-semibold text-gray-100">
                Vision Enhanced Analysis
              </h2>
              <span className="rounded-full border border-emerald-500/60 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                Vision Enhanced
              </span>
            </div>
            <div className="space-y-1.5">
              <Row
                label="Area Confidence"
                value={fusedAnalysis.area_confidence}
              />
              <Row label="Quality Zone" value={fusedAnalysis.quality_zone} />
              <Row
                label="Movement Logic"
                value={fusedAnalysis.movement_logic}
              />
              <Row
                label="Environmental Interpretation"
                value={fusedAnalysis.environmental_interpretation}
              />
            </div>
          </section>
        )}

        {/* 4) Vision Enhanced Approach (conditional) */}
        {hasFusion && fusedApproach && (
          <section className="rounded-2xl border border-gray-700/70 bg-black/50 px-4 py-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h2 className="text-[13px] font-semibold text-gray-100">
                Vision Enhanced Approach
              </h2>
              <span className="rounded-full border border-emerald-500/60 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                Vision Enhanced
              </span>
            </div>
            <div className="space-y-1.5">
              <Row
                label="Updated Technique Focus"
                value={fusedApproach.updated_technique_focus}
              />
              <Row
                label="Updated Depth Expectation"
                value={fusedApproach.updated_depth_expectation}
              />
              <Row
                label="Updated Movement Strategy"
                value={fusedApproach.updated_movement_strategy}
              />
              <Row
                label="Why Vision Adjusted the Approach"
                value={fusedApproach.why_vision_adjusted_the_approach}
              />
            </div>
          </section>
        )}
      </main>
    </ScreenContainer>
  );
};

type RowProps = {
  label: string;
  value?: string;
};

const Row = ({ label, value }: RowProps) => {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="w-[45%] text-[11px] font-medium text-gray-400">
        {label}
      </span>
      <span className="flex-1 text-[11px] text-gray-100">{value || "—"}</span>
    </div>
  );
};

export default VisionIntelligenceScreen;
