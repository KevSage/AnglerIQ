import React from "react";
import { useTier } from "../hooks/useTier";
import { usePattern, type PatternResponse } from "../hooks/usePattern";
import { useOnboardingGuard } from "../hooks/useOnboardingGuard";
import ScreenContainer from "../components/layout/ScreenContainer";

const PatternIntelScreen: React.FC = () => {
  useOnboardingGuard();
  const { tier } = useTier();
  const { pattern, loading, error } = usePattern(tier);

  const isEliteOrVision = tier === "elite" || tier === "vision";

  if (loading) {
    return (
      <ScreenContainer>
        <div className="flex min-h-[40vh] items-center justify-center px-4">
          <p className="text-xs text-slate-300">
            Loading Pattern Intelligence…
          </p>
        </div>
      </ScreenContainer>
    );
  }

  if (error || !pattern) {
    return (
      <ScreenContainer>
        <div className="flex min-h-[40vh] items-center justify-center px-4">
          <p className="text-xs text-red-400">
            Something went wrong while interpreting conditions. Try again.
          </p>
        </div>
      </ScreenContainer>
    );
  }

  const p = pattern as PatternResponse;
  const primaryTechnique = p.technique || p.pattern_of_the_moment || "—";
  const depthZoneLabel = p.depth_zone ?? "—";

  return (
    <ScreenContainer>
      {/* Header */}
      <header className="mb-4">
        <h1 className="text-base font-semibold text-slate-100">
          Pattern Intelligence
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          A deeper look at today&apos;s Pattern of the Day, how it unfolds, and
          when to adjust.
        </p>
      </header>

      <div className="mt-2 space-y-8 text-xs">
        {/* GAMEPLAN TIMELINE — Elite + Vision only */}
        {isEliteOrVision && p.gameplan && p.gameplan.length > 0 && (
          <section>
            <h2 className="mb-3 text-sm font-semibold text-slate-100">
              Gameplan Timeline
            </h2>

            <div className="space-y-3">
              {p.gameplan.map((block, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-slate-800 bg-slate-950/80 p-3"
                >
                  <p className="font-medium text-slate-100">{block.label}</p>
                  <p className="mt-1 text-slate-300">{block.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ADJUSTMENTS — Elite + Vision only */}
        {isEliteOrVision && p.adjustments && p.adjustments.length > 0 && (
          <section>
            <h2 className="mb-3 text-sm font-semibold text-slate-100">
              Adjustments
            </h2>

            <div className="space-y-3">
              {p.adjustments.map((adj, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-slate-800 bg-slate-950/80 p-3"
                >
                  <p className="text-slate-200">
                    <span className="font-medium">Trigger: </span>
                    {adj.trigger}
                  </p>
                  <p className="mt-1 text-slate-200">
                    <span className="font-medium">Adjustment: </span>
                    {adj.adjustment}
                  </p>
                  <p className="mt-1 italic text-slate-400">
                    {adj.why_it_works}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TECHNIQUES GRID (always shown) */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-slate-100">
            Techniques for Today
          </h2>

          <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-3">
            <p className="font-medium text-slate-100">
              Primary Technique: {primaryTechnique}
            </p>

            {p.supporting_lures && p.supporting_lures.length > 0 && (
              <div className="mt-3">
                <p className="font-medium text-slate-200">Secondary Options:</p>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-slate-300">
                  {p.supporting_lures.map((lure, index) => (
                    <li key={index}>{lure}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* DEPTH ZONE OVERVIEW */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-slate-100">
            Depth Zone Overview
          </h2>

          <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-3">
            <p className="text-slate-300">{depthZoneLabel}</p>
          </div>
        </section>
      </div>
    </ScreenContainer>
  );
};

export default PatternIntelScreen;
