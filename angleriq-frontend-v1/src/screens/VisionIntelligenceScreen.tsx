import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTier } from "../hooks/useTier";
import { usePattern } from "../hooks/usePattern";

const VisionIntelligenceScreen = () => {
  const { tier } = useTier();
  const { pattern, loading, error } = usePattern(tier);
  const navigate = useNavigate();

  // Tier gating: non-Vision tiers cannot access /vision
  useEffect(() => {
    if (tier !== "vision") {
      navigate("/", { replace: true });
    }
  }, [tier, navigate]);

  // If we got redirected, render nothing
  if (tier !== "vision") {
    return null;
  }

  const vision = pattern?.vision;
  const hasSurface = !!vision?.surface_enhanced;
  const hasSonar = !!vision?.sonar_enhanced;
  const hasAnalysis = !!vision?.vision_enhanced_analysis;
  const hasApproach = !!vision?.vision_enhanced_approach;

  const hasAnyVision = hasSurface || hasSonar || hasAnalysis || hasApproach;

  return (
    <div className="min-h-screen px-4 py-4 text-gray-100">
      <header className="mb-2">
        <h1 className="text-lg font-semibold">Vision Intelligence Screen</h1>
        <p className="text-xs text-gray-400">
          Environmental Understanding — Elevated.
        </p>
      </header>

      <main className="space-y-4 text-xs">
        {/* Error */}
        {error && (
          <section className="rounded-xl border border-red-500 bg-red-900/30 p-3 text-red-200">
            Something went wrong while interpreting conditions. Try again.
          </section>
        )}

        {/* Empty state when no sonar or surface data */}
        {!loading && !hasAnyVision && (
          <section className="rounded-xl border border-gray-700 bg-black/40 p-3">
            <p className="text-xs text-gray-200">
              No sonar or surface images yet.
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Upload a photo or sonar screenshot to activate Vision Enhanced
              interpretation.
            </p>
          </section>
        )}

        {/* Surface Enhanced */}
        {hasSurface && (
          <section className="space-y-2 rounded-xl border border-gray-700 bg-black/40 p-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-100">
                Surface Enhanced
              </h2>
              <span className="rounded-full border border-gray-600 px-2 py-0.5 text-[10px] text-gray-300">
                Surface Enhanced
              </span>
            </div>
            <div className="space-y-1 text-[11px] text-gray-300">
              <div>
                <span className="font-semibold">Visible Structure: </span>
                {vision?.surface_enhanced?.visible_structure}
              </div>
              <div>
                <span className="font-semibold">Cover Density: </span>
                {vision?.surface_enhanced?.cover_density}
              </div>
              <div>
                <span className="font-semibold">Clarity Cues: </span>
                {vision?.surface_enhanced?.clarity_cues}
              </div>
              <div>
                <span className="font-semibold">Shade Lanes: </span>
                {vision?.surface_enhanced?.shade_lanes}
              </div>
              <div>
                <span className="font-semibold">Vegetation Type: </span>
                {vision?.surface_enhanced?.vegetation_type}
              </div>
            </div>
          </section>
        )}

        {/* Sonar Enhanced */}
        {hasSonar && (
          <section className="space-y-2 rounded-xl border border-gray-700 bg-black/40 p-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-100">
                Sonar Enhanced
              </h2>
              <span className="rounded-full border border-gray-600 px-2 py-0.5 text-[10px] text-gray-300">
                Sonar Enhanced
              </span>
            </div>
            <div className="space-y-1 text-[11px] text-gray-300">
              <div>
                <span className="font-semibold">Depth Bands: </span>
                {vision?.sonar_enhanced?.depth_bands}
              </div>
              <div>
                <span className="font-semibold">Bottom Hardness: </span>
                {vision?.sonar_enhanced?.bottom_hardness}
              </div>
              <div>
                <span className="font-semibold">Bait Presence: </span>
                {vision?.sonar_enhanced?.bait_presence}
              </div>
              <div>
                <span className="font-semibold">Arch Count: </span>
                {vision?.sonar_enhanced?.arch_count}
              </div>
              <div>
                <span className="font-semibold">Activity Level: </span>
                {vision?.sonar_enhanced?.activity_level}
              </div>
              <div>
                <span className="font-semibold">Should You Keep Moving?: </span>
                {vision?.sonar_enhanced?.should_you_keep_moving}
              </div>
            </div>
          </section>
        )}

        {/* Vision Enhanced Analysis */}
        {hasAnalysis && (
          <section className="space-y-2 rounded-xl border border-gray-700 bg-black/40 p-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-100">
                Vision Enhanced Analysis
              </h2>
              <span className="rounded-full border border-gray-600 px-2 py-0.5 text-[10px] text-gray-300">
                Vision Enhanced
              </span>
            </div>
            <div className="space-y-1 text-[11px] text-gray-300">
              <div>
                <span className="font-semibold">Area Confidence: </span>
                {vision?.vision_enhanced_analysis?.area_confidence}
              </div>
              <div>
                <span className="font-semibold">Quality Zone: </span>
                {vision?.vision_enhanced_analysis?.quality_zone}
              </div>
              <div>
                <span className="font-semibold">Movement Logic: </span>
                {vision?.vision_enhanced_analysis?.movement_logic}
              </div>
              <div>
                <span className="font-semibold">
                  Environmental Interpretation:{" "}
                </span>
                {vision?.vision_enhanced_analysis?.environmental_interpretation}
              </div>
            </div>
          </section>
        )}

        {/* Vision Enhanced Approach (conditional) */}
        {hasApproach && (
          <section className="space-y-2 rounded-xl border border-gray-700 bg-black/40 p-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-100">
                Vision Enhanced Approach
              </h2>
              <span className="rounded-full border border-gray-600 px-2 py-0.5 text-[10px] text-gray-300">
                Vision Enhanced
              </span>
            </div>
            <div className="space-y-1 text-[11px] text-gray-300">
              <div>
                <span className="font-semibold">Updated Technique Focus: </span>
                {vision?.vision_enhanced_approach?.updated_technique_focus}
              </div>
              <div>
                <span className="font-semibold">
                  Updated Depth Expectation:{" "}
                </span>
                {vision?.vision_enhanced_approach?.updated_depth_expectation}
              </div>
              <div>
                <span className="font-semibold">
                  Updated Movement Strategy:{" "}
                </span>
                {vision?.vision_enhanced_approach?.updated_movement_strategy}
              </div>
              <div>
                <span className="font-semibold">
                  Why Vision Adjusted the Approach:{" "}
                </span>
                {
                  vision?.vision_enhanced_approach
                    ?.why_vision_adjusted_the_approach
                }
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default VisionIntelligenceScreen;
