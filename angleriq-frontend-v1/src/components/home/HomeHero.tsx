import React from "react";

interface HomeHeroProps {
  src: string;
  alt?: string;
  tierLabel: string;
  primaryTechnique: string;
}

const HomeHero: React.FC<HomeHeroProps> = ({
  src,
  alt = "AnglerIQ Hero",
  tierLabel,
  primaryTechnique,
}) => {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-slate-800 bg-black shadow-[0_24px_70px_rgba(15,23,42,0.9)]">
      {/* Cinematic environmental gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.22),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.2),_transparent_60%)] opacity-70" />

      {/* Hero image container */}
      <div className="relative aspect-[16/9] w-full">
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_18px_50px_rgba(0,0,0,0.85)]"
        />
      </div>

      {/* Subtle bottom gradient for text legibility */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

      {/* Overlay content */}
      <div className="absolute inset-x-0 bottom-3 flex items-end justify-between px-4">
        <div className="space-y-1">
          <span className="inline-flex items-center rounded-full border border-slate-500/70 bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-100">
            {tierLabel}
          </span>
          <p className="text-[11px] text-slate-300">
            Environmental Understanding — Elevated and Interpreted.
          </p>
        </div>
        <div className="hidden max-w-[220px] text-right sm:block">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
            Pattern of the Day
          </p>
          <p className="mt-1 text-[11px] text-slate-50 line-clamp-2">
            {primaryTechnique || "Today’s pattern built from real conditions."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
