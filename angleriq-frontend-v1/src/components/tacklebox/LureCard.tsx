// src/components/tacklebox/LureCard.tsx

import type { LureDefinition } from "../../data/lures";

type Props = {
  lure: LureDefinition;
  selected: boolean;
  onToggle: () => void;
};

const categoryLabel: Record<LureDefinition["category"], string> = {
  moving: "Moving bait",
  bottom: "Bottom-contact",
  finesse: "Finesse",
  topwater: "Topwater",
  utility: "Utility",
};

const LureCard = ({ lure, selected, onToggle }: Props) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={[
        "flex flex-col items-start rounded-xl border px-3 py-3 text-left transition",
        selected
          ? "border-emerald-400/80 bg-emerald-500/5 shadow-md shadow-emerald-500/10"
          : "border-gray-700/70 bg-[#111111] hover:border-emerald-400/40 hover:bg-[#141414]",
      ].join(" ")}
    >
      {/* Placeholder for LUR icon – swap to real component later */}
      <div className="mb-2 flex h-10 w-full items-center justify-center rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 text-[11px] uppercase tracking-wide text-gray-300">
        {/* Replace with e.g. <LureIcon slug={lure.iconKey} /> when ready */}
        {lure.name}
      </div>

      <div className="mb-1 flex w-full items-center justify-between gap-2">
        <span className="text-[11px] font-medium text-gray-100">
          {lure.name}
        </span>
        <span className="rounded-full border border-gray-600/70 px-2 py-0.5 text-[9px] text-gray-300">
          {categoryLabel[lure.category]}
        </span>
      </div>

      <p className="line-clamp-2 text-[11px] leading-snug text-gray-400">
        {lure.shortDescription}
      </p>

      {selected && (
        <div className="mt-2 inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300">
          <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
          In your tacklebox
        </div>
      )}
    </button>
  );
};

export default LureCard;