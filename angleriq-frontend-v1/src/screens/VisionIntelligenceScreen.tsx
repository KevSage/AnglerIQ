import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTier } from "../hooks/useTier";
import { usePattern } from "../hooks/usePattern";
import ScreenContainer from "../components/layout/ScreenContainer";

const VisionIntelligenceScreen = () => {
  const { tier } = useTier();
  const navigate = useNavigate();
  const { pattern, loading, error } = usePattern(tier);

  useEffect(() => {
    if (tier !== "vision") navigate("/", { replace: true });
  }, [tier, navigate]);

  if (tier !== "vision") return null;

  const vision = pattern?.vision;
  const surface = vision?.surface_enhanced;
  const sonar = vision?.sonar_enhanced;
  const fusedAnalysis = vision?.vision_enhanced_analysis;
  const fusedApproach = vision?.vision_enhanced_approach;

  const hasSurface = Boolean(surface);
  const hasSonar = Boolean(sonar);
  const hasFusion = hasSurface && hasSonar && Boolean(fusedAnalysis);

  const getConfidence = () => {
    const text = fusedAnalysis?.area_confidence?.toLowerCase() || "";
    if (text.includes("high")) return "high";
    if (text.includes("low")) return "low";
    return "medium";
  };

  const confidence = getConfidence();

  if (loading) {
    return (
      <ScreenContainer>
        <div className="flex min-h-[60vh] items-center justify-center text-xs text-gray-300">
          <p className="animate-pulse">Interpreting today’s conditions…</p>
        </div>
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer>
        <div className="mt-6 rounded-xl border border-red-500/40 bg-red-900/10 px-4 py-3 text-xs text-red-200">
          Something went wrong while interpreting conditions. Try again.
        </div>
      </ScreenContainer>
    );
  }

  if (!hasSurface && !hasSonar) {
    return (
      <ScreenContainer>
        <header className="text-center">
          <h1 className="text-lg font-semibold">Vision Intelligence</h1>
          <p className="mt-1 text-xs text-gray-400">
            Environmental Understanding — Elevated.
          </p>
        </header>

        <div className="mt-8 text-xs text-gray-300 space-y-2 text-center">
          <p>No surface or sonar inputs yet.</p>
          <p>Upload imagery to activate Vision Enhanced analysis.</p>
        </div>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <header className="mb-5 text-center">
        <h1 className="text-lg font-semibold">Vision Intelligence</h1>
        <p className="mt-1 text-xs text-gray-400">
          Environmental Understanding — Elevated.
        </p>
      </header>

      <main className="space-y-6 pb-10">
        {hasFusion && (
          <VisionPanel>
            <PanelTitle title="Area Confidence" />
            <ConfidenceMeter level={confidence} />
            <p className="mt-2 text-[12px] text-gray-300 text-center">
              {fusedAnalysis?.area_confidence}
            </p>
          </VisionPanel>
        )}

        {hasSurface && (
          <VisionPanel>
            <PanelTitle title="Surface Enhanced" tag="Active" />
            <Detail
              label="Visible Structure"
              value={surface?.visible_structure}
            />
            <Detail label="Cover Density" value={surface?.cover_density} />
            <Detail label="Clarity Cues" value={surface?.clarity_cues} />
            <Detail label="Shade Lanes" value={surface?.shade_lanes} />
            <Detail label="Vegetation Type" value={surface?.vegetation_type} />
          </VisionPanel>
        )}

        {hasSonar && (
          <VisionPanel>
            <PanelTitle title="Sonar Enhanced" tag="Active" />
            <Detail label="Depth Bands" value={sonar?.depth_bands} />
            <Detail label="Bottom Hardness" value={sonar?.bottom_hardness} />
            <Detail label="Bait Presence" value={sonar?.bait_presence} />
            <Detail label="Arch Count" value={sonar?.arch_count} />
            <Detail label="Activity Level" value={sonar?.activity_level} />
            <Detail
              label="Should You Keep Moving?"
              value={sonar?.should_you_keep_moving}
            />
          </VisionPanel>
        )}

        {hasFusion && fusedAnalysis && (
          <VisionPanel>
            <PanelTitle title="Vision Enhanced Analysis" tag="Active" />
            <Detail label="Quality Zone" value={fusedAnalysis.quality_zone} />
            <Detail
              label="Movement Logic"
              value={fusedAnalysis.movement_logic}
            />
            <Detail
              label="Environmental Interpretation"
              value={fusedAnalysis.environmental_interpretation}
            />
          </VisionPanel>
        )}

        {hasFusion && fusedApproach && (
          <VisionPanel>
            <PanelTitle title="Vision Enhanced Approach" tag="Active" />
            <Detail
              label="Updated Technique Focus"
              value={fusedApproach.updated_technique_focus}
            />
            <Detail
              label="Updated Depth Expectation"
              value={fusedApproach.updated_depth_expectation}
            />
            <Detail
              label="Updated Movement Strategy"
              value={fusedApproach.updated_movement_strategy}
            />
            <Detail
              label="Why Vision Adjusted the Approach"
              value={fusedApproach.why_vision_adjusted_the_approach}
            />
          </VisionPanel>
        )}
      </main>
    </ScreenContainer>
  );
};

/* ---------------------------------------------------------------- */
/* SHARED COMPONENTS */
/* ---------------------------------------------------------------- */

const VisionPanel = ({ children }: { children: React.ReactNode }) => (
  <section className="rounded-xl border border-gray-700/40 bg-[#111]/40 px-4 py-4 space-y-4">
    {children}
  </section>
);

const PanelTitle = ({ title, tag }: { title: string; tag?: string }) => (
  <div className="mb-4 flex items-end justify-between">
    <div>
      <h2 className="inline-block text-[13px] font-semibold text-gray-50">
        <span className="border-b border-emerald-300/60 pb-[2px]">{title}</span>
      </h2>
    </div>
    {tag && (
      <span className="ml-2 rounded-full border border-emerald-500/50 px-2 py-0.5 text-[10px] text-emerald-300">
        {tag}
      </span>
    )}
  </div>
);

const ConfidenceMeter = ({ level }: { level: "low" | "medium" | "high" }) => (
  <div className="mt-2 flex gap-1">
    <span
      className={`h-1.5 flex-1 rounded-full ${
        level === "low" || level === "medium" || level === "high"
          ? "bg-emerald-400/80"
          : "bg-gray-700"
      }`}
    />
    <span
      className={`h-1.5 flex-1 rounded-full ${
        level === "medium" || level === "high"
          ? "bg-emerald-400/60"
          : "bg-gray-800"
      }`}
    />
    <span
      className={`h-1.5 flex-1 rounded-full ${
        level === "high" ? "bg-emerald-400/40" : "bg-gray-900"
      }`}
    />
  </div>
);

const Detail = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="space-y-1.5">
    <div className="flex items-center gap-2">
      <span className="h-3 w-[2px] rounded-full bg-emerald-400/80" />
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-200">
        {label}
      </p>
    </div>
    <p className="ml-[10px] text-[13px] leading-snug text-gray-100">
      {value || "—"}
    </p>
    <div className="mt-2 w-full border-b border-dotted border-gray-700/40" />
  </div>
);

export default VisionIntelligenceScreen;
