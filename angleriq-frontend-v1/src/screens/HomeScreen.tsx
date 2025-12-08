import React from "react";
import { useNavigate } from "react-router-dom";
import { useTier } from "../hooks/useTier";
import { usePattern, type PatternResponse } from "../hooks/usePattern";
import { useOnboardingGuard } from "../hooks/useOnboardingGuard";
import ScreenContainer from "../components/layout/ScreenContainer";
import ConditionsPanel from "../components/home/ConditionsPanel";
import PatternHeroCard from "../components/home/PatternHeroCard";
const FEATURED_LURE_IMAGE =
  "../../public/assets/images/featured-chatterbait.png"; // transparent PNG

const HomeScreen: React.FC = () => {
  useOnboardingGuard();
  const navigate = useNavigate();
  const { tier } = useTier(); // "pro" | "elite" | "vision"
  const { pattern, loading, error } = usePattern(tier);

  const isEliteOrVision = tier === "elite" || tier === "vision";
  const isVision = tier === "vision";

  if (loading) {
    return (
      <ScreenContainer>
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
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
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
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
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
            Pattern of the Day is not available right now.
          </div>
        </div>
      </ScreenContainer>
    );
  }

  const p = pattern as PatternResponse;

  const primaryTechnique = p.technique || p.pattern_of_the_moment || "—";
  const depthZoneLabel = p.depth_zone ?? "—";
  const conditions = p.conditions ?? {};
  const techniqueLabel =
    p.primary_technique || p.technique || "Environment-matched technique";

  const featuredLureName =
    p.featured_lure_name ||
    p.pattern_of_the_moment ||
    "Featured lure for today’s pattern";

  const patternSummary =
    p.pattern_summary ||
    "Built from today’s conditions — not a random lure list. Adjust as the day evolves, without losing the core pattern.";
  const supportingLures =
    (p.supporting_lures && p.supporting_lures.length > 0
      ? p.supporting_lures
      : ["Mock Lure 1", "Mock Lure 2", "Mock Lure 3"]) ?? [];

  const normalizedDepth = depthZoneLabel.toLowerCase();
  const isShallowActive = normalizedDepth.includes("shallow");
  const isMidActive = normalizedDepth.includes("mid");
  const isDeepActive = normalizedDepth.includes("deep");

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

  return (
    <ScreenContainer>
      {/* 1. CONDITIONS — top of Home Screen */}
      <ConditionsPanel conditions={conditions} />

      {/* MAIN GRID: TODAY'S APPROACH + DEPTH/ACTIONS vs CATCHES */}
      {/* 2. PATTERN OF THE DAY — Technique-first hero with floating silhouette */}
      <PatternHeroCard
        techniqueLabel={
          primaryTechnique !== "—"
            ? primaryTechnique
            : "Structured technique based on today’s environment."
        }
        featuredLureName={p.featured_lure_name ?? "Featured Lure"}
        patternSummary={
          p.pattern_blurb ??
          "Built from today’s conditions — not a random lure list. Adjust as the day evolves without losing the core technique."
        }
        supportingLures={supportingLures}
        imageSrc={FEATURED_LURE_IMAGE}
        // For now, hard-code a brand-safe glow; later this will come
        // directly from Dynamic Lure Color Canon (primary color token)
        primaryGlowColor="rgba(45,212,191,0.75)" // emerald-ish medium glow
      />
    </ScreenContainer>
  );
};

export default HomeScreen;
