"use client";

import { useRouter } from "next/navigation";

interface HomePatternSummary {
  tier: "pro" | "elite" | "vision";
  depthZone: string;
  structure: string;
  iconKey: string;
  microPattern: string;
  confidence?: 0 | 1 | 2 | 3;
}

interface HomePatternSummaryProps {
  summary: HomePatternSummary;
}

export function HomePatternSummaryCard({ summary }: HomePatternSummaryProps) {
  const router = useRouter();

  const { tier, depthZone, structure, iconKey, microPattern, confidence } =
    summary;

  const isVision = tier === "vision";

  function handleStartPattern() {
    const target =
      tier === "vision"
        ? "/pattern/vision"
        : tier === "elite"
        ? "/pattern/elite"
        : "/pattern/pro";

    router.push(target);
  }

  return (
    <section className="rounded-2xl bg-gradient-to-b from-[#181818] to-[#101010] border border-white/10 shadow-[0_6px_16px_rgba(0,0,0,0.45)] px-4 pt-4 pb-5 space-y-3">
      {/* Top row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-white/6 flex items-center justify-center">
            {/* TODO: replace with LureIcon */}
            <span className="text-xs text-white/60">🎣</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-white/85">
            <span>{depthZone}</span>
            <span className="text-white/40">•</span>
            <span>{structure}</span>
          </div>
        </div>

        {isVision && typeof confidence === "number" && (
          <ConfidenceBars level={confidence} />
        )}
      </div>

      {/* Micro-pattern */}
      <p className="text-[13px] leading-snug text-white/85">{microPattern}</p>

      {/* CTA */}
      <button
        type="button"
        onClick={handleStartPattern}
        className="w-full rounded-xl bg-[#4A7BA7]/90 hover:bg-[#4A7BA7] transition-colors text-[14px] font-semibold py-2.5"
      >
        Start Pattern Intelligence
      </button>
    </section>
  );
}

// Vision confidence bars
function ConfidenceBars({ level }: { level: 0 | 1 | 2 | 3 }) {
  const clamped = Math.max(0, Math.min(level, 3));

  return (
    <div
      className="flex gap-[2px] items-end"
      aria-label={`Pattern confidence: ${clamped} of 3`}
    >
      {[0, 1, 2].map((i) => {
        const active = i < clamped;
        const height = i === 0 ? "h-[6px]" : i === 1 ? "h-[10px]" : "h-[14px]";

        return (
          <div
            key={i}
            className={[
              "w-[4px] rounded-sm",
              height,
              active ? "bg-white/80" : "bg-white/25",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}
