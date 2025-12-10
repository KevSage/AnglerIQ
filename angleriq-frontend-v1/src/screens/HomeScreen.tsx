import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTier } from "../hooks/useTier";
import { usePattern, type PatternResponse } from "../hooks/usePattern";
import { useOnboardingGuard } from "../hooks/useOnboardingGuard";
import ScreenContainer from "../components/layout/ScreenContainer";
import ConditionsPanel from "../components/home/ConditionsPanel";
import PatternHeroCard from "../components/home/PatternHeroCard";

const HomeScreen: React.FC = () => {
  useOnboardingGuard();
  const navigate = useNavigate();
  const { tier } = useTier(); // "pro" | "elite" | "vision"

  const [hasGeneratedPattern, setHasGeneratedPattern] = useState(
    typeof window !== "undefined" &&
      window.localStorage.getItem("aiq_pattern_generated") === "1"
  );

  const { pattern, loading, error } = usePattern(tier, {
    enabled: hasGeneratedPattern,
  });

  const isEliteOrVision = tier === "elite" || tier === "vision";
  const isVision = tier === "vision";

  const handleGeneratePattern = () => {
    // Clear old snapshot for this tier & mark generated
    try {
      window.localStorage.removeItem(`aiq_pattern_snapshot_${tier}`);
      window.localStorage.setItem("aiq_pattern_generated", "1");
    } catch {
      // fail-safe: UI will still behave correctly in-memory
    }
    setHasGeneratedPattern(true);
  };

  const handleViewGameplan = () => {
    if (isEliteOrVision) {
      navigate("/intel");
    }
  };

  const handleOpenSage = () => {
    navigate("/sage");
  };

  const handleVisionIntelligence = () => {
    if (isVision) {
      navigate("/vision");
    }
  };

  const p = (pattern as PatternResponse | null) ?? null;

  // Derive labels only when we actually have a pattern
  const primaryTechnique = p?.technique || p?.pattern_of_the_moment || "—";
  const depthZoneLabel = p?.depth_zone ?? "—";
  const conditions = p?.conditions ?? {};

  const techniqueLabel =
    p?.primary_technique || p?.technique || "Environment-matched technique";

  const featuredLureName =
    p?.featured_lure_name ||
    p?.pattern_of_the_moment ||
    "Featured lure for today’s pattern";

  const patternSummary =
    p?.pattern_blurb ||
    p?.pattern_summary ||
    "Built from today’s conditions — not a random lure list. Adjust as the day evolves without losing the core pattern.";

  const supportingLures =
    (p?.supporting_lures && p.supporting_lures.length > 0
      ? p.supporting_lures
      : ["Mock Lure 1", "Mock Lure 2", "Mock Lure 3"]) ?? [];

  return (
    <ScreenContainer>
      {/* BEFORE PATTERN EXISTS — CTA ONLY */}
      {!hasGeneratedPattern && (
        <section className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-100">
          <h1 className="text-base font-semibold text-slate-100">
            Generate your Pattern of the Day
          </h1>
          <p className="mt-2 text-xs text-slate-400">
            AnglerIQ will read today&apos;s environment and build a structured
            technique for you — one clear starting point instead of a random
            lure list. You can always adjust as the day evolves.
          </p>
          <button
            type="button"
            onClick={handleGeneratePattern}
            disabled={loading}
            className={[
              "mt-4 inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold",
              loading
                ? "border border-slate-700 bg-slate-900 text-slate-500"
                : "border border-emerald-400 bg-emerald-400 text-black hover:bg-emerald-300",
            ].join(" ")}
          >
            {loading ? "Building pattern…" : "Generate Pattern"}
          </button>
        </section>
      )}

      {/* AFTER PATTERN EXISTS AND USER HAS GENERATED IT */}
      {hasGeneratedPattern && (
        <>
          {/* Loading state *after* generation */}
          {loading && (
            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
              Interpreting today&apos;s conditions…
            </div>
          )}

          {/* Error state *after* generation */}
          {!loading && error && (
            <div className="mt-6 flex items-center justify-center px-4">
              <div className="space-y-3 rounded-xl border border-red-800/60 bg-slate-900/80 p-4 text-sm text-slate-200">
                <p>
                  Something went wrong while interpreting conditions. Try again
                  in a few minutes.
                </p>
              </div>
            </div>
          )}

          {/* Happy path: we have a pattern */}
          {!loading && !error && p && (
            <>
              {/* CONDITIONS PANEL — climate-level view */}
              <ConditionsPanel conditions={conditions} />

              {/* PATTERN HERO — technique-first Pattern of the Day */}
              <PatternHeroCard
                techniqueLabel={
                  primaryTechnique !== "—"
                    ? primaryTechnique
                    : "Structured technique based on today’s environment."
                }
                featuredLureName={featuredLureName}
                patternSummary={patternSummary}
                supportingLures={supportingLures}
                // If your PatternHeroCard supports glow/image props,
                // you can add them back here as needed.
              />

              {/* ACTION BUTTONS */}
              <div className="mt-4 flex flex-col gap-2">
                {/* View Gameplan — Elite & Vision only */}
                {isEliteOrVision && (
                  <button
                    type="button"
                    onClick={handleViewGameplan}
                    className="w-full rounded-xl border border-emerald-500 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/20"
                  >
                    View Gameplan
                  </button>
                )}

                {/* Ask SAGE — all tiers */}
                <button
                  type="button"
                  onClick={handleOpenSage}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800"
                >
                  Ask SAGE
                </button>

                {/* Vision Intelligence — Vision only */}
                {isVision && (
                  <button
                    type="button"
                    onClick={handleVisionIntelligence}
                    className="w-full rounded-xl border border-indigo-500 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-300 hover:bg-indigo-500/20"
                  >
                    Vision Intelligence
                  </button>
                )}
              </div>
            </>
          )}

          {/* Edge case: generated but no pattern & no explicit error payload */}
          {!loading && !error && !p && (
            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
              Pattern of the Day is not available right now. Try again in a few
              minutes.
            </div>
          )}
        </>
      )}
    </ScreenContainer>
  );
};

export default HomeScreen;