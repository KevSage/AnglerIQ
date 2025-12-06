// src/components/vision/SonarEnhancedBlock.tsx

import type { SonarBlock } from "../../hooks/usePattern";

type Props = { sonar: SonarBlock };

const SonarEnhancedBlock = ({ sonar }: Props) => {
  const renderRow = (label: string, value?: string) => {
    if (!value) return null;
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[10px] font-medium tracking-wide text-blue-200/90">
          <span className="h-1 w-4 rounded-full bg-blue-400/80" />
          <span className="uppercase">{label}</span>
        </div>
        <p className="text-[11px] leading-snug text-gray-100">{value}</p>
      </div>
    );
  };

  return (
    <section className="rounded-3xl border border-gray-700/70 bg-[#020610] px-4 py-5 shadow-sm">
      {/* Header (no pill) */}
      <h2 className="mb-4 text-[13px] font-semibold text-gray-50">
        Sonar Enhanced
      </h2>

      <div className="space-y-4">
        {renderRow("Depth Bands", sonar.depth_bands)}
        {renderRow("Bottom Hardness", sonar.bottom_hardness)}
        {renderRow("Bait Presence", sonar.bait_presence)}
        {renderRow("Arch Count", sonar.arch_count)}
        {renderRow("Activity Level", sonar.activity_level)}
        {renderRow("Movement Recommendation", sonar.should_you_keep_moving)}
      </div>
    </section>
  );
};

export default SonarEnhancedBlock;
