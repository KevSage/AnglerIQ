// src/components/vision/VisionSummaryStrip.tsx

import type {
  SurfaceBlock,
  SonarBlock,
  VisionAnalysisBlock,
  VisionApproachBlock,
} from "../../hooks/usePattern";

type VisionMode = "surface" | "sonar" | "vision";

type Props = {
  mode: VisionMode;
  surface?: SurfaceBlock;
  sonar?: SonarBlock;
  analysis?: VisionAnalysisBlock;
  approach?: VisionApproachBlock;
};

const VisionSummaryStrip = ({
  mode,
  surface,
  sonar,
  analysis,
  approach,
}: Props) => {
  if (!surface && !sonar && !analysis && !approach) return null;

  const isFused = mode === "vision";

  const modeLabel =
    mode === "vision"
      ? "Vision Summary"
      : mode === "surface"
      ? "Surface Summary"
      : "Sonar Summary";

  // CONFIDENCE (vision only)
  let confidenceLevel: "low" | "medium" | "high" = "medium";

  if (isFused && analysis?.area_confidence) {
    const lower = analysis.area_confidence.toLowerCase();
    if (lower.includes("high")) confidenceLevel = "high";
    else if (lower.includes("low")) confidenceLevel = "low";
  }

  const confidenceText =
    confidenceLevel === "high"
      ? "Confidence: High"
      : confidenceLevel === "medium"
      ? "Confidence: Medium"
      : "Confidence: Low";

  // SUMMARY LINES
  const summaryLines: string[] = [];

  if (isFused && analysis) {
    if (analysis.area_confidence) summaryLines.push(analysis.area_confidence);
    if (analysis.quality_zone) summaryLines.push(analysis.quality_zone);

    const depthOrMove =
      approach?.updated_depth_expectation || analysis.movement_logic;
    if (depthOrMove) summaryLines.push(depthOrMove);

    if (approach?.updated_movement_strategy) {
      summaryLines.push(approach.updated_movement_strategy);
    }

    if (summaryLines.length > 4) summaryLines.splice(4);
  } else if (mode === "surface" && surface) {
    if (surface.clarity_cues || surface.visible_structure) {
      summaryLines.push(surface.clarity_cues || surface.visible_structure);
    }
    if (surface.shade_lanes) summaryLines.push(surface.shade_lanes);
    if (surface.vegetation_type) {
      summaryLines.push(`Cover: ${surface.vegetation_type}`);
    }
  } else if (mode === "sonar" && sonar) {
    if (sonar.depth_bands) summaryLines.push(sonar.depth_bands);
    if (sonar.bait_presence || sonar.activity_level) {
      summaryLines.push(sonar.bait_presence || sonar.activity_level);
    }
    if (sonar.should_you_keep_moving) {
      summaryLines.push(sonar.should_you_keep_moving);
    }
  }

  if (summaryLines.length === 0) return null;

  // THEME BY MODE
  const base = "mb-6 rounded-xl border px-4 py-4 shadow-sm transition-colors";

  let containerClasses = base;
  let headerColor = "text-emerald-300/90";
  let pillBorder = "border-emerald-400/80";
  let pillText = "text-emerald-100";
  let meterActive = "bg-indigo-300";
  let meterMid = "bg-indigo-300/70";
  let meterLow = "bg-indigo-300/40";

  if (mode === "surface") {
    containerClasses += " border-emerald-500/60 bg-[#020806]";
    headerColor = "text-emerald-300/90";
    pillBorder = "border-emerald-400/80";
    pillText = "text-emerald-100";
  } else if (mode === "sonar") {
    containerClasses += " border-sky-500/70 bg-[#020713]";
    headerColor = "text-sky-300/90";
    pillBorder = "border-sky-400/80";
    pillText = "text-sky-100";
  } else {
    // VISION — **violet / indigo theme**
    containerClasses += " border-indigo-500/70 bg-[#050314]";
    headerColor = "text-indigo-300/90";
    pillBorder = "border-indigo-400/80";
    pillText = "text-indigo-100";
  }

  return (
    <div className={containerClasses}>
      {/* Confidence meter (vision only) */}
      {isFused && analysis?.area_confidence && (
        <div className="mb-3 flex flex-col items-center">
          <p className="mb-1 text-[10px] text-gray-300">{confidenceText}</p>
          <div className="flex w-full max-w-[150px] gap-1">
            <span
              className={`h-1.5 flex-1 rounded-full ${
                confidenceLevel !== "low" ? meterActive : "bg-gray-700"
              }`}
            />
            <span
              className={`h-1.5 flex-1 rounded-full ${
                confidenceLevel === "medium" || confidenceLevel === "high"
                  ? meterMid
                  : "bg-gray-800"
              }`}
            />
            <span
              className={`h-1.5 flex-1 rounded-full ${
                confidenceLevel === "high" ? meterLow : "bg-gray-900"
              }`}
            />
          </div>
        </div>
      )}

      {/* Header row */}
      <div className="mb-3 flex items-center justify-between">
        <span className={`text-[10px] uppercase tracking-wide ${headerColor}`}>
          {modeLabel}
        </span>
        <span
          className={`rounded-full border px-2 py-0.5 text-[9px] font-medium ${pillBorder} ${pillText}`}
        >
          {mode === "vision"
            ? "Vision Enhanced Panel"
            : mode === "surface"
            ? "Surface Enhanced Panel"
            : "Sonar Enhanced Panel"}
        </span>
      </div>

      {/* Text */}
      <div className="space-y-1.5 text-[11px] leading-tight text-gray-200">
        {summaryLines.map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>
    </div>
  );
};

export default VisionSummaryStrip;
