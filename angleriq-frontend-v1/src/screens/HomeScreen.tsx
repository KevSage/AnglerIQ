import { useNavigate } from "react-router-dom";
import { useTier } from "../hooks/useTier";
import { usePattern } from "../hooks/usePattern";

const HomeScreen = () => {
  const { tier } = useTier();
  const navigate = useNavigate();

  const { pattern, loading, error } = usePattern(tier);

  const tierLabel =
    tier === "pro"
      ? "Pro Tier"
      : tier === "elite"
      ? "Elite Tier"
      : "Vision Tier";

  const conditions = pattern?.conditions;

  return (
    <div className="min-h-screen px-4 py-4 text-gray-100">
      {/* Tier Badge */}
      <header className="mb-4 flex items-center justify-between">
        <div className="inline-flex items-center rounded-full border border-gray-600 px-3 py-1 text-xs">
          {tierLabel}
        </div>
      </header>

      <main className="space-y-4">
        {/* Error (canon copy) */}
        {error && (
          <section className="rounded-xl border border-red-500 bg-red-900/30 p-3 text-xs text-red-200">
            Something went wrong while interpreting conditions. Try again.
          </section>
        )}

        {/* Today’s Conditions */}
        <section className="rounded-xl border border-gray-700 bg-black/40 p-3">
          <h2 className="text-sm font-medium text-gray-100">
            Today’s Conditions
          </h2>
          <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-gray-300">
            <span className="rounded-full border border-gray-700 px-2 py-1">
              {conditions?.wind_mph != null
                ? `Wind ${conditions.wind_mph} mph`
                : "Wind"}
            </span>
            <span className="rounded-full border border-gray-700 px-2 py-1">
              {conditions?.temp_f != null
                ? `Temp ${conditions.temp_f}°F`
                : "Temp"}
            </span>
            <span className="rounded-full border border-gray-700 px-2 py-1">
              {conditions?.pressure_trend
                ? `Pressure ${conditions.pressure_trend}`
                : "Pressure"}
            </span>
            <span className="rounded-full border border-gray-700 px-2 py-1">
              {conditions?.cloud_cover
                ? `Cloud Cover ${conditions.cloud_cover}`
                : "Cloud Cover"}
            </span>
            <span className="rounded-full border border-gray-700 px-2 py-1">
              {conditions?.clarity_estimate
                ? `Clarity ${conditions.clarity_estimate}`
                : "Clarity Estimate"}
            </span>
            <span className="rounded-full border border-gray-700 px-2 py-1">
              {conditions?.season_phase
                ? `Season Phase ${conditions.season_phase}`
                : "Season Phase"}
            </span>
          </div>
        </section>

        {/* Pattern-of-the-Moment */}
        <section className="space-y-3 rounded-xl border border-gray-700 bg-black/40 p-3">
          <div>
            <h2 className="text-sm font-medium text-gray-100">
              Pattern-of-the-Moment
            </h2>
            <p className="mt-1 text-[11px] text-gray-400">
              Based on today’s conditions
            </p>
            {pattern && (
              <p className="mt-1 text-xs text-gray-200">
                {pattern.pattern_of_the_moment}
              </p>
            )}
          </div>

          {/* Technique Card */}
          <div className="space-y-2 rounded-lg border border-gray-700 p-3 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-100">
                Technique
              </span>
              <span className="rounded-full border border-gray-700 px-2 py-0.5 text-[10px] text-gray-300">
                {pattern?.depth_zone || "Depth Zone"}
              </span>
            </div>

            {/* Technique name or loading bar */}
            {loading ? (
              <div className="h-4 rounded bg-gray-800/80" />
            ) : (
              <div className="text-sm text-gray-100">
                {pattern?.technique || "—"}
              </div>
            )}

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div>
                <div className="text-[10px] uppercase text-gray-500">
                  Why it Works
                </div>
                <div className="mt-1 h-6 rounded bg-gray-800/60" />
              </div>
              <div>
                <div className="text-[10px] uppercase text-gray-500">
                  Recommended Setup
                </div>
                <div className="mt-1 h-6 rounded bg-gray-800/60" />
              </div>
              <div>
                <div className="text-[10px] uppercase text-gray-500">
                  Depth Zone
                </div>
                <div className="mt-1 h-6 rounded bg-gray-800/60" />
              </div>
            </div>
          </div>

          {/* Supporting Lures */}
          <div className="space-y-2">
            <h3 className="text-xs font-medium text-gray-100">
              Supporting Lures
            </h3>
            <div className="flex flex-wrap gap-2 text-[11px]">
              {(pattern?.supporting_lures && pattern.supporting_lures.length > 0
                ? pattern.supporting_lures
                : [
                    "Placeholder Lure 1",
                    "Placeholder Lure 2",
                    "Placeholder Lure 3",
                  ]
              ).map((lure) => (
                <span
                  key={lure}
                  className="rounded-full border border-gray-700 px-2 py-1 text-gray-300"
                >
                  {lure}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Action buttons (tier-gated) */}
        <section className="flex flex-col gap-2 text-xs">
          {/* View Gameplan (Elite + Vision only) */}
          {tier !== "pro" && (
            <button
              type="button"
              onClick={() => navigate("/intel")}
              className="w-full rounded-full border border-gray-600 px-3 py-2 text-gray-100"
            >
              View Gameplan
            </button>
          )}

          {/* Vision Intelligence (Vision only) */}
          {tier === "vision" && (
            <button
              type="button"
              onClick={() => navigate("/vision")}
              className="w-full rounded-full border border-gray-600 px-3 py-2 text-gray-100"
            >
              Vision Intelligence
            </button>
          )}

          {/* Open SAGE (all tiers) */}
          <button
            type="button"
            onClick={() => navigate("/sage")}
            className="w-full rounded-full border border-green-400 bg-green-400 px-3 py-2 text-black"
          >
            Open SAGE
          </button>
        </section>
      </main>
    </div>
  );
};

export default HomeScreen;
