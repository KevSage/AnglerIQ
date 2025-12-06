// src/components/vision/VisionEnhancedAnalysisBlock.tsx

import type { VisionAnalysisBlock } from "../../hooks/usePattern";

type Props = {
  analysis?: VisionAnalysisBlock;
};

type AnalysisRowProps = {
  label: string;
  value?: string;
};

const AnalysisRow = ({ label, value }: AnalysisRowProps) => {
  if (!value) return null;

  return (
    <div className="space-y-0.5">
      <p className="text-[10px] font-medium uppercase tracking-wide text-emerald-200/90">
        {label}
      </p>
      <p className="text-[11px] leading-snug text-gray-200">{value}</p>
    </div>
  );
};

const VisionEnhancedAnalysisBlock = ({ analysis }: Props) => {
  if (!analysis) return null;

  return (
    <section className="rounded-2xl border border-emerald-500/45 bg-[#07100D] px-4 py-4 shadow-sm">
      {/* Panel header */}
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-[12px] font-semibold tracking-wide text-emerald-100">
          Vision Enhanced Analysis
        </h2>
        <span className="rounded-full border border-emerald-500/70 px-2 py-0.5 text-[9px] uppercase tracking-wide text-emerald-200">
          Vision Enhanced
        </span>
      </header>

      <div className="space-y-3">
        <AnalysisRow label="Area Confidence" value={analysis.area_confidence} />
        <AnalysisRow label="Quality Zone" value={analysis.quality_zone} />
        <AnalysisRow label="Movement Logic" value={analysis.movement_logic} />
        <AnalysisRow
          label="Environmental Interpretation"
          value={analysis.environmental_interpretation}
        />
      </div>
    </section>
  );
};

export default VisionEnhancedAnalysisBlock;
