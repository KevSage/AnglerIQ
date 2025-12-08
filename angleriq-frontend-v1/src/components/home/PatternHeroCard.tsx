// src/components/home/PatternHeroCard.tsx

import React from "react";

const FALLBACK_LURE_IMAGE =
  "../../public/assets/images/featured-chatterbait.png";

type PatternHeroCardProps = {
  // technique: string;
  // lureName?: string;
  // blurb: string;
  supportingLures: string[];
  imageSrc?: string;
  techniqueLabel: string;
  featuredLureName: string;
  patternSummary: string;
  /**
   * e.g. "rgba(45,212,191,0.7)" or "rgba(56,189,248,0.7)"
   * This should match the lure's primary color for Dynamic Lure Color Canon.
   */
  primaryGlowColor: string;
};

const PatternHeroCard: React.FC<PatternHeroCardProps> = ({
  techniqueLabel,
  // lureName,
  featuredLureName,
  supportingLures,
  imageSrc,
  primaryGlowColor,
  patternSummary,
}) => {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/90 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.7)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Text block */}
        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
            Today’s Technique
          </p>

          <p className="mt-1 text-xs font-medium text-slate-300">
            {techniqueLabel}
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-50">
            {featuredLureName}
          </p>

          <p className="mt-2 text-[11px] text-slate-400">{patternSummary}</p>

          {/* Supporting lures */}
          <div className="mt-3 flex flex-wrap gap-2">
            {supportingLures.length === 0 ? (
              <span className="rounded-full border border-slate-700/70 bg-slate-950 px-3 py-1 text-[11px] text-slate-400">
                No secondary options listed — fish this technique with
                confidence.
              </span>
            ) : (
              supportingLures.map((lure) => (
                <span
                  key={lure}
                  className="rounded-full border border-slate-700/70 bg-slate-950 px-3 py-1 text-[11px] text-slate-100"
                >
                  {lure}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Floating lure hero with medium glow, no box */}
        <div className="relative flex w-full justify-center sm:w-auto">
          <div
            className="relative h-24 w-32 sm:h-28 sm:w-40"
            style={{
              // Medium glow, color driven by lure's primary color
              boxShadow: `0 0 40px 0 ${primaryGlowColor}`,
              borderRadius: 9999,
            }}
          >
            {/* soft radial glow behind lure */}
            <div
              className="pointer-events-none absolute -inset-6 blur-2xl"
              style={{
                background: `radial-gradient(circle at center, ${primaryGlowColor}, transparent 60%)`,
              }}
            />

            {/* Transparent background area so silhouette feels "in the environment" */}
            <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-tr from-slate-900/80 via-slate-900/10 to-transparent" />

            <div className="relative flex h-full w-full items-center justify-center">
              <img
                src={imageSrc || FALLBACK_LURE_IMAGE}
                alt="Featured lure for today’s technique"
                className="max-h-[85%] max-w-[85%] object-contain drop-shadow-[0_14px_40px_rgba(15,23,42,0.9)]"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PatternHeroCard;
