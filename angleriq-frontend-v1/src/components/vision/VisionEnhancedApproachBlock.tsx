// src/components/vision/VisionEnhancedApproachBlock.tsx

import type { VisionApproachBlock } from "../../hooks/usePattern";

type Props = {
  approach?: VisionApproachBlock;
};

type ApproachRowProps = {
  label: string;
  value?: string;
};

const ApproachRow = ({ label, value }: ApproachRowProps) => {
  if (!value) return null;

  return (
    <div className="space-y-0.5">
      <p className="text-[10px] font-medium uppercase tracking-wide text-teal-200/90">
        {label}
      </p>
      <p className="text-[11px] leading-snug text-gray-200">{value}</p>
    </div>
  );
};

const VisionEnhancedApproachBlock = ({ approach }: Props) => {
  if (!approach) return null;

  return (
    <section className="rounded-2xl border border-teal-500/45 bg-[#081012] px-4 py-4 shadow-sm">
      {/* Panel header */}
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-[12px] font-semibold tracking-wide text-teal-100">
          Vision Enhanced Approach
        </h2>
        <span className="rounded-full border border-teal-500/70 px-2 py-0.5 text-[9px] uppercase tracking-wide text-teal-200">
          Vision Enhanced
        </span>
      </header>

      <div className="space-y-3">
        <ApproachRow
          label="Updated Technique Focus"
          value={approach.updated_technique_focus}
        />
        <ApproachRow
          label="Updated Depth Expectation"
          value={approach.updated_depth_expectation}
        />
        <ApproachRow
          label="Updated Movement Strategy"
          value={approach.updated_movement_strategy}
        />
        <ApproachRow
          label="Why Vision Adjusted the Approach"
          value={approach.why_vision_adjusted_the_approach}
        />
      </div>
    </section>
  );
};

export default VisionEnhancedApproachBlock;
