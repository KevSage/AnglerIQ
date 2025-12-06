// src/components/vision/SurfaceEnhancedBlock.tsx

import type { SurfaceBlock } from "../../hooks/usePattern";

type Props = { surface: SurfaceBlock };

const SurfaceEnhancedBlock = ({ surface }: Props) => {
  const renderRow = (label: string, value?: string) => {
    if (!value) return null;
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[10px] font-medium tracking-wide text-emerald-200/90">
          <span className="h-1 w-4 rounded-full bg-emerald-400/80" />
          <span className="uppercase">{label}</span>
        </div>
        <p className="text-[11px] leading-snug text-gray-100">{value}</p>
      </div>
    );
  };

  return (
    <section className="rounded-3xl border border-gray-700/70 bg-[#020805] px-4 py-5 shadow-sm">
      {/* Header (no pill) */}
      <h2 className="mb-4 text-[13px] font-semibold text-gray-50">
        Surface Enhanced
      </h2>

      <div className="space-y-4">
        {renderRow("Visible Structure", surface.visible_structure)}
        {renderRow("Cover Density", surface.cover_density)}
        {renderRow("Water Clarity", surface.clarity_cues)}
        {renderRow("Shade Lanes", surface.shade_lanes)}
        {renderRow("Vegetation Type", surface.vegetation_type)}
      </div>
    </section>
  );
};

export default SurfaceEnhancedBlock;
