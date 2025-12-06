// src/components/vision/VisionFusionPanel.tsx

import type {
  VisionAnalysisBlock,
  VisionApproachBlock,
} from "../../hooks/usePattern";

type Props = {
  analysis?: VisionAnalysisBlock;
  approach?: VisionApproachBlock;
};

const VisionFusionPanel = ({ analysis, approach }: Props) => {
  if (!analysis && !approach) return null;

  const renderRow = (label: string, value?: string) => {
    if (!value) return null;
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[10px] font-medium tracking-wide text-indigo-200/90">
          <span className="h-1 w-4 rounded-full bg-indigo-400/80" />
          <span className="uppercase">{label}</span>
        </div>
        <p className="text-[11px] leading-snug text-gray-100">{value}</p>
      </div>
    );
  };

  return (
    <section className="rounded-3xl border border-gray-700/70 bg-[#050314] px-4 py-5 shadow-sm">
      {/* Header (NO pill) */}
      <h2 className="mb-4 text-[13px] font-semibold text-gray-50">
        Vision Enhanced
      </h2>

      {/* Enhanced Analysis */}
      {analysis && (
        <div className="space-y-3 mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-indigo-300/90">
            Enhanced Analysis
          </p>

          <div className="space-y-3">
            {renderRow("Area Confidence", analysis.area_confidence)}
            {renderRow("Quality Zone", analysis.quality_zone)}
            {renderRow("Movement Logic", analysis.movement_logic)}
            {renderRow(
              "Environmental Interpretation",
              analysis.environmental_interpretation
            )}
          </div>
        </div>
      )}

      {/* Enhanced Approach (NO divider in between) */}
      {approach && (
        <div className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-indigo-300/90">
            Enhanced Approach
          </p>

          <div className="space-y-3">
            {renderRow(
              "Updated Technique Focus",
              approach.updated_technique_focus
            )}
            {renderRow(
              "Updated Depth Expectation",
              approach.updated_depth_expectation
            )}
            {renderRow(
              "Updated Movement Strategy",
              approach.updated_movement_strategy
            )}
            {renderRow(
              "Why Vision Adjusted the Approach",
              approach.why_vision_adjusted_the_approach
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default VisionFusionPanel;
