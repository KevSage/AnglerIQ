import { useTier } from "../hooks/useTier";
import { usePattern } from "../hooks/usePattern";
import { useOnboardingGuard } from "../hooks/useOnboardingGuard";

const PatternIntelScreen = () => {
  useOnboardingGuard();
  const { tier } = useTier();
  const { pattern, loading, error } = usePattern(tier);

  if (loading) {
    return (
      <div className="p-4 text-xs text-gray-300">
        Loading Pattern Intelligence…
      </div>
    );
  }

  if (error || !pattern) {
    return (
      <div className="p-4 text-xs text-red-400">
        Something went wrong while interpreting conditions. Try again.
      </div>
    );
  }

  const isEliteOrVision = tier === "elite" || tier === "vision";

  return (
    <div className="min-h-screen px-4 py-4 text-gray-100">
      {/* Header */}
      <h1 className="text-lg font-semibold">Pattern Intelligence</h1>

      <div className="mt-6 space-y-10 text-xs">
        {/* GAMEPLAN TIMELINE — Elite + Vision only */}
        {isEliteOrVision && pattern.gameplan && (
          <section>
            <h2 className="text-sm font-semibold mb-3">Gameplan Timeline</h2>

            <div className="space-y-3">
              {pattern.gameplan.map((block, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-700 p-3 bg-gray-800/40"
                >
                  <p className="font-medium text-gray-200">{block.label}</p>
                  <p className="mt-1 text-gray-400">{block.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ADJUSTMENTS — Elite + Vision only */}
        {isEliteOrVision && pattern.adjustments && (
          <section>
            <h2 className="text-sm font-semibold mb-3">Adjustments</h2>

            <div className="space-y-3">
              {pattern.adjustments.map((adj, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-700 p-3 bg-gray-800/40"
                >
                  <p className="text-gray-300">
                    <span className="font-medium">Trigger: </span>
                    {adj.trigger}
                  </p>
                  <p className="text-gray-300 mt-1">
                    <span className="font-medium">Adjustment: </span>
                    {adj.adjustment}
                  </p>
                  <p className="text-gray-400 mt-1 italic">
                    {adj.why_it_works}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TECHNIQUES GRID (always shown) */}
        <section>
          <h2 className="text-sm font-semibold mb-3">Techniques for Today</h2>

          <div className="rounded-lg border border-gray-700 p-3 bg-gray-800/40">
            <p className="font-medium text-gray-200">
              Primary Technique: {pattern.technique}
            </p>

            {/* Optional secondary suggestions from pattern? */}
            {pattern.supporting_lures?.length > 0 && (
              <div className="mt-3">
                <p className="font-medium text-gray-300">Secondary Options:</p>
                <ul className="mt-1 space-y-1 list-disc pl-4 text-gray-400">
                  {pattern.supporting_lures.map((lure, index) => (
                    <li key={index}>{lure}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* DEPTH ZONE OVERVIEW */}
        <section>
          <h2 className="text-sm font-semibold mb-3">Depth Zone Overview</h2>

          <div className="rounded-lg border border-gray-700 p-3 bg-gray-800/40">
            <p className="text-gray-300">{pattern.depth_zone}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PatternIntelScreen;
