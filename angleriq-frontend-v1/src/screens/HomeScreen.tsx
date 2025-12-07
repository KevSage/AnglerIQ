// src/screens/HomeScreen.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { useTier } from "../hooks/useTier";
import { usePattern, type PatternResponse } from "../hooks/usePattern";
import { useOnboardingGuard } from "../hooks/useOnboardingGuard";
import ScreenContainer from "../components/layout/ScreenContainer";
import ConditionsPanel from "../components/home/ConditionsPanel";

const FEATURED_LURE_IMAGE =
  "../../public/assets/images/featured-chatterbait.png";

const HomeScreen: React.FC = () => {
  useOnboardingGuard();
  const navigate = useNavigate();
  const { tier } = useTier();
  const { pattern, loading, error } = usePattern(tier);

  const isEliteOrVision = tier === "elite" || tier === "vision";
  const isVision = tier === "vision";

  // ---------------------------------------------------------------------------
  // LOADING / ERROR / NO-PATTERN STATES
  // ---------------------------------------------------------------------------

  if (loading) {
    return (
      <ScreenContainer>
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
            Interpreting today’s conditions…
          </div>
        </div>
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer>
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="space-y-3 rounded-xl border border-red-800/60 bg-slate-900/80 p-4 text-sm text-slate-200">
            <p>
              Something went wrong while interpreting conditions. Try again.
            </p>
          </div>
        </div>
      </ScreenContainer>
    );
  }

  if (!pattern) {
    return (
      <ScreenContainer>
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
            Pattern of the Day is not available right now.
          </div>
        </div>
      </ScreenContainer>
    );
  }

  // ---------------------------------------------------------------------------
  // NORMAL STATE
  // ---------------------------------------------------------------------------

  const p = pattern as PatternResponse;

  const primaryTechnique = p.technique || p.pattern_of_the_moment || "—";
  const depthZoneLabel = p.depth_zone ?? "—";

  const conditions = p.conditions ?? {};

  const supportingLures = p.supporting_lures ?? [];

  const normalizedDepth = depthZoneLabel.toLowerCase();
  const isShallowActive = normalizedDepth.includes("shallow");
  const isMidActive = normalizedDepth.includes("mid");
  const isDeepActive = normalizedDepth.includes("deep");

  // NAV HANDLERS
  const handleViewGameplan = () => {
    if (isEliteOrVision) navigate("/intel");
  };

  const handleOpenSAGE = () => navigate("/sage");

  const handleVisionIntelligence = () => {
    if (isVision) navigate("/vision");
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <ScreenContainer>
      {/* CONDITIONS PANEL — ALWAYS AT TOP */}
      <ConditionsPanel conditions={conditions} />

      {/* MAIN GRID */}
      <div className="grid gap-4 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.1fr)] md:items-start mt-4">
        {/* LEFT COLUMN — PATTERN + DEPTH + TOOLS */}
        <div className="space-y-4">
          {/* PATTERN OF THE DAY */}
          <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/90 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.7)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* TEXT BLOCK */}
              <div className="flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  Today’s Approach
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-50">
                  {primaryTechnique !== "—"
                    ? primaryTechnique
                    : "Structured pattern based on today’s environment."}
                </p>

                <p className="mt-2 text-[11px] text-slate-400">
                  Built from today’s conditions — not a random lure list. Adjust
                  as the day evolves, without losing the core pattern.
                </p>

                {/* SUPPORTING LURES */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {supportingLures.length === 0 ? (
                    <span className="rounded-full border border-slate-700/70 bg-slate-950 px-3 py-1 text-[11px] text-slate-400">
                      No secondary options listed — fish the primary approach
                      with confidence.
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

              {/* LURE HERO */}
              <div className="relative flex w-full justify-center sm:w-auto">
                <div className="relative h-28 w-44 sm:h-36 sm:w-56">
                  {/* Glow */}
                  <div className="pointer-events-none absolute -inset-6 rounded-[32px] bg-[radial-gradient(circle_at_center,_rgba(45,212,191,0.22),_transparent_65%)] blur-2xl" />

                  {/* Image */}
                  <div className="relative flex h-full w-full items-center justify-center">
                    <img
                      src={FEATURED_LURE_IMAGE}
                      alt="Featured lure for today’s pattern"
                      className="max-h-full max-w-full object-contain drop-shadow-[0_14px_40px_rgba(15,23,42,0.9)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* DEPTH ZONE + TOOLS */}
          <section className="space-y-3 rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Depth Zone Focus
              </p>
              <p className="mt-1 text-sm font-medium text-slate-100">
                {depthZoneLabel}
              </p>

              <div className="mt-3 flex gap-2">
                <span
                  className={[
                    "rounded-full border px-3 py-1 text-[11px]",
                    isShallowActive
                      ? "border-emerald-400 bg-slate-900 text-slate-100"
                      : "border-slate-700 bg-slate-900/30 text-slate-400",
                  ].join(" ")}
                >
                  Shallow
                </span>

                <span
                  className={[
                    "rounded-full border px-3 py-1 text-[11px]",
                    isMidActive
                      ? "border-emerald-400 bg-slate-900 text-slate-100"
                      : "border-slate-700 bg-slate-900/30 text-slate-400",
                  ].join(" ")}
                >
                  Mid-depth
                </span>

                <span
                  className={[
                    "rounded-full border px-3 py-1 text-[11px]",
                    isDeepActive
                      ? "border-emerald-400 bg-slate-900 text-slate-100"
                      : "border-slate-700 bg-slate-900/30 text-slate-400",
                  ].join(" ")}
                >
                  Deep
                </span>
              </div>
            </div>

            {/* TOOLS */}
            <div className="pt-2">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                On-Water Tools
              </p>

              <div className="flex flex-col gap-2 sm:flex-row">
                {isEliteOrVision && (
                  <button
                    type="button"
                    onClick={handleViewGameplan}
                    className="w-full rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900"
                  >
                    View Gameplan
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleOpenSAGE}
                  className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-100"
                >
                  Open SAGE
                </button>

                {isVision && (
                  <button
                    type="button"
                    onClick={handleVisionIntelligence}
                    className="w-full rounded-full border border-emerald-500/70 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200"
                  >
                    Vision Intelligence
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN — CATCHES PANEL */}
        <div className="space-y-4">
          <section className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Catches Today
                </p>
                <p className="mt-1 text-xs text-slate-300">
                  Log catches with SAGE to see your day take shape.
                </p>
              </div>

              <div className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-center">
                <p className="text-xs font-semibold text-slate-100">0</p>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-slate-400">
              Voice-first logging is coming online soon. For now, you can still
              ask SAGE to capture details about your pattern and approach.
            </p>
          </section>
        </div>
      </div>
    </ScreenContainer>
  );
};

export default HomeScreen;
