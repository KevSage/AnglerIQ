import React from "react";
import { useNavigate } from "react-router-dom";
import { useTier } from "../hooks/useTier";
import { usePattern, type PatternResponse } from "../hooks/usePattern";
import { useOnboardingGuard } from "../hooks/useOnboardingGuard";

const HomeScreen: React.FC = () => {
  useOnboardingGuard();
  const navigate = useNavigate();
  const { tier } = useTier(); // "pro" | "elite" | "vision"
  const { pattern, loading, error } = usePattern(tier);

  const isEliteOrVision = tier === "elite" || tier === "vision";
  const isVision = tier === "vision";

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
          Interpreting today’s conditions…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="space-y-3 rounded-xl border border-red-800/60 bg-slate-900/80 p-4 text-sm text-slate-200">
          <p>Something went wrong while interpreting conditions. Try again.</p>
        </div>
      </div>
    );
  }

  if (!pattern) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
          Pattern-of-the-Moment is not available right now.
        </div>
      </div>
    );
  }

  const p = pattern as PatternResponse;

  const primaryTechnique = p.technique || p.pattern_of_the_moment || "—";
  const depthZoneLabel = p.depth_zone ?? "—";

  const conditions = p.conditions ?? {};
  const weatherPills = [
    {
      label: "Wind",
      value: conditions.wind_mph != null ? `${conditions.wind_mph} mph` : "—",
    },
    {
      label: "Temp",
      value: conditions.temp_f != null ? `${conditions.temp_f}°F` : "—",
    },
    {
      label: "Pressure",
      value: conditions.pressure_trend ?? "—",
    },
    {
      label: "Cloud Cover",
      value: conditions.cloud_cover ?? "—",
    },
    {
      label: "Clarity Estimate",
      value: conditions.clarity_estimate ?? "—",
    },
    {
      label: "Season Phase",
      value: conditions.season_phase ?? "—",
    },
  ];

  const supportingLures = p.supporting_lures ?? [];

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
    <div className="min-h-[calc(100vh-4rem)] px-4 py-4">
      {/* Tier Badge */}
      <header className="mb-4 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
            {tier === "pro" && "Pro Tier"}
            {tier === "elite" && "Elite Tier"}
            {tier === "vision" && "Vision Tier"}
          </div>
        </div>
      </header>

      {/* Today’s Conditions */}
      <section className="mb-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-100">
            Today’s Conditions
          </h2>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {weatherPills.map((pill) => (
            <div
              key={pill.label}
              className="rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-1"
            >
              <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                {pill.label}
              </span>
              <span className="ml-1 text-xs text-slate-100">{pill.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Pattern-of-the-Moment */}
      <section className="mb-4 space-y-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Pattern-of-the-Moment
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Based on today’s conditions
            </p>
          </div>
        </div>

        {/* Technique Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Technique
          </p>
          <p className="mt-1 text-sm font-medium text-slate-100">
            {primaryTechnique}
          </p>
        </div>

        {/* Supporting Lures */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Supporting Lures
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {supportingLures.length === 0 ? (
              <span className="text-xs text-slate-400">
                No supporting lures.
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
      </section>

      {/* Depth Zone */}
      <section className="mb-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Depth Zone
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
      </section>

      {/* Actions */}
      <section className="mt-4 flex flex-col gap-2">
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
          onClick={handleOpenSage}
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
      </section>
    </div>
  );
};

export default HomeScreen;
