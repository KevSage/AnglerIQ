import { useTier } from "../hooks/useTier";
import { usePattern } from "../hooks/usePattern";

const PatternIntelScreen = () => {
  const { tier } = useTier();
  const { pattern, loading, error } = usePattern(tier);

  const hasGameplan = !!pattern?.gameplan && pattern.gameplan.length > 0;
  const hasAdjustments =
    !!pattern?.adjustments && pattern.adjustments.length > 0;

  return (
    <div className="min-h-screen px-4 py-4 text-gray-100">
      <header className="mb-4">
        <h1 className="text-lg font-semibold">Pattern Intelligence</h1>
      </header>

      <main className="space-y-4 text-xs">
        {/* Error */}
        {error && (
          <section className="rounded-xl border border-red-500 bg-red-900/30 p-3 text-red-200">
            Something went wrong while interpreting conditions. Try again.
          </section>
        )}

        {/* Gameplan Timeline (Elite + Vision only) */}
        {tier !== "pro" && hasGameplan && (
          <section className="space-y-2 rounded-xl border border-gray-700 bg-black/40 p-3">
            <h2 className="text-sm font-medium text-gray-100">
              Gameplan Timeline
            </h2>
            <div className="space-y-2">
              {pattern?.gameplan?.map((block) => (
                <div
                  key={block.label}
                  className="rounded-lg border border-gray-700 p-2"
                >
                  <div className="text-[11px] font-semibold text-gray-100">
                    {block.label}
                  </div>
                  <div className="mt-1 text-[11px] text-gray-300">
                    {block.description}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Adjustments (Elite + Vision only) */}
        {tier !== "pro" && hasAdjustments && (
          <section className="space-y-2 rounded-xl border border-gray-700 bg-black/40 p-3">
            <h2 className="text-sm font-medium text-gray-100">Adjustments</h2>
            <div className="space-y-2">
              {pattern?.adjustments?.map((adj) => (
                <div
                  key={adj.trigger}
                  className="rounded-lg border border-gray-700 p-2"
                >
                  <div className="text-[11px] font-semibold text-gray-100">
                    Trigger
                  </div>
                  <div className="text-[11px] text-gray-300">{adj.trigger}</div>
                  <div className="mt-1 text-[11px] font-semibold text-gray-100">
                    Adjustment
                  </div>
                  <div className="text-[11px] text-gray-300">
                    {adj.adjustment}
                  </div>
                  <div className="mt-1 text-[11px] font-semibold text-gray-100">
                    Why It Works
                  </div>
                  <div className="text-[11px] text-gray-300">
                    {adj.why_it_works}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Techniques Grid */}
        <section className="space-y-2 rounded-xl border border-gray-700 bg-black/40 p-3">
          <h2 className="text-sm font-medium text-gray-100">
            Techniques for Today
          </h2>
          <div className="space-y-1 text-[11px] text-gray-300">
            <div>
              <span className="font-semibold">Primary Technique: </span>
              {pattern?.technique || "—"}
            </div>
            {/* Later we can extend this with secondary options + color variations */}
          </div>
        </section>

        {/* Depth Zone Overview */}
        <section className="space-y-2 rounded-xl border border-gray-700 bg-black/40 p-3">
          <h2 className="text-sm font-medium text-gray-100">
            Depth Zone Overview
          </h2>
          <div className="text-[11px] text-gray-300">
            {pattern?.depth_zone || "—"}
          </div>
        </section>
      </main>
    </div>
  );
};

export default PatternIntelScreen;
