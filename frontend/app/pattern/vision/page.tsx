"use client";

import React from "react";

// ---------- Data model from your spec ----------

export interface PatternDetail {
  phase: string;
  depthZone: string;
  structure: string;

  tier: "pro" | "elite" | "vision";

  technique: {
    name: string;
    style: string;
    bullets: string[];
    iconKey: string;
  };

  microPattern: string;

  timeline: {
    window: string;
    action: string;
  }[];

  adjustments: {
    label: string;
    guidance: string;
  }[];

  lures: {
    name: string;
    iconKey: string;
  }[];

  colors: {
    name: string;
    hex: string;
  }[];
}

interface PatternDetailProps {
  pattern: PatternDetail;
}

// ---------- Inline SVG icons (minimal, tactical) ----------

// Chatterbait inline icon (24x24, currentColor)
const ChatterbaitIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Blade */}
    <polygon points="6,10 10,8 12,12 8,14" />

    {/* Line tie */}
    <line x1="4" y1="9" x2="6" y2="10" />

    {/* Jig head */}
    <circle cx="16" cy="16" r="2.2" />

    {/* Hook */}
    <path d="M18 16 L23 14 C25 13.5 27 14.5 27.5 16.5 C28 18.5 26.8 20.5 24.8 21 L21 22.2" />

    {/* Skirt */}
    <path d="M14 17 L9 19" />
    <path d="M14 18.5 L9.5 21" />
    <path d="M14 20 L10 22.5" />
  </svg>
);

// Swim jig inline icon
const SwimJigIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Head / body */}
    <path d="M10 18 C12.5 16.5 15 16.5 17.5 17.4 C18.6 17.8 19.5 18.4 20.3 19.1" />
    {/* Line tie */}
    <circle cx="11" cy="16" r="0.9" />
    {/* Hook */}
    <path d="M18 17.5 C20 17 22 18 22.5 20 C23 22 21.8 24 19.8 24.5 L17.2 25.1" />
    {/* Skirt lines */}
    <path d="M12 18.5 L7.5 21" />
    <path d="M12.5 19.8 L8 22.4" />
    <path d="M13 21 L9 23.7" />
  </svg>
);

// Simple map from iconKey → icon component
const lureIconMap: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  chatterbait: ChatterbaitIcon,
  swim_jig: SwimJigIcon,
  // you can add more keys: lipless_crank, swimbait_soft, etc
};

const LureIcon: React.FC<{ iconKey: string; className?: string }> = ({
  iconKey,
  className,
}) => {
  const Icon = lureIconMap[iconKey] ?? ChatterbaitIcon;
  return <Icon className={className} />;
};

// Vision hero silhouette for chatterbait (gradient filled)
const ChatterbaitHeroSilhouette: React.FC<React.SVGProps<SVGSVGElement>> = (
  props
) => (
  <svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMid slice" {...props}>
    <defs>
      <linearGradient
        id="chatterbaitHeroGrad"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <stop offset="0%" stopColor="#4A7BA7" />
        <stop offset="100%" stopColor="#1B314A" />
      </linearGradient>
    </defs>
    <g fill="url(#chatterbaitHeroGrad)" opacity={0.16}>
      {/* Blade */}
      <polygon points="8,16 24,10 28,18 12,22" />
      {/* Head */}
      <circle cx="40" cy="28" r="5" />
      {/* Hook / body sweep */}
      <path d="M44 28 Q60 22 76 26 Q84 28 88 32 Q92 36 90 40 Q88 44 82 46 L68 49" />
      {/* Skirt */}
      <path d="M36 30 L22 38" />
      <path d="M38 34 L24 42" />
      <path d="M40 38 L26 46" />
    </g>
  </svg>
);

// ---------- Pattern Detail Screen ----------

export function PatternDetailScreen({ pattern }: PatternDetailProps) {
  const {
    phase,
    depthZone,
    structure,
    technique,
    microPattern,
    timeline,
    adjustments,
    lures,
    colors,
    tier,
  } = pattern;

  const isVision = tier === "vision";

  return (
    <div className="min-h-screen bg-[#111111] px-4 py-6 text-white">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        {/* PATTERN HEADER */}
        <section className="space-y-1 border-b border-white/10 pb-4">
          <div className="text-[13px] text-white/90">
            <span className="font-semibold">Phase: </span>
            <span>{phase}</span>
          </div>
          <div className="text-[13px] text-white/90">
            <span className="font-semibold">Depth Zone: </span>
            <span>{depthZone}</span>
          </div>
          <div className="text-[13px] text-white/90">
            <span className="font-semibold">Structure: </span>
            <span>{structure}</span>
          </div>
        </section>

        {/* TECHNIQUE HERO CARD */}
        {/* TECHNIQUE HERO CARD */}
        <section className="relative w-full overflow-hidden rounded-2xl">
          <div
            className={`relative p-5 shadow-[0_18px_40px_rgba(0,0,0,0.45)] ${
              isVision
                ? "bg-gradient-to-b from-[#101623] via-[#0c1018] to-[#1B314A]"
                : "bg-gradient-to-b from-[#151515] to-[#1f2933]"
            }`}
          >
            {isVision && (
              <div className="pointer-events-none absolute -right-6 -top-6 h-40 w-56 rotate-[14deg]">
                <ChatterbaitHeroSilhouette className="h-full w-full" />
              </div>
            )}

            {/* Pro / Elite compact hero */}
            {!isVision && (
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/80">
                  <LureIcon iconKey={technique.iconKey} className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <div className="text-sm font-semibold">
                    {technique.name} — {technique.style}
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.14em] text-white/50">
                    {tier.toUpperCase()} TIER
                  </div>
                </div>
              </div>
            )}

            {/* Vision hero text */}
            {isVision && (
              <div className="relative mb-3">
                {" "}
                {/* relative so text sits above silhouette */}
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300/80">
                  Vision Tier • Technique Hero
                </div>
                <div className="mt-1 text-lg font-semibold text-white drop-shadow">
                  {technique.name} — {technique.style}
                </div>
              </div>
            )}

            <ul className="relative space-y-1 text-[14px]">
              {technique.bullets.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="mt-[6px] h-1 w-1 rounded-full bg-white/70" />
                  <span className="text-white/90">{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* MICRO-PATTERN SENTENCE */}
        <section className="pt-1">
          <p className="text-[13px] text-white/85">{microPattern}</p>
        </section>

        {/* GAMEPLAN TIMELINE */}
        <section>
          <h2 className="mb-2 text-sm font-medium text-white">
            Gameplan timeline
          </h2>
          <div className="space-y-1">
            {timeline.map((slot) => (
              <div
                key={slot.window + slot.action}
                className="flex gap-3 text-sm"
              >
                <span className="w-20 text-[13px] text-white/60">
                  {slot.window}
                </span>
                <span className="text-[14px] text-white/95">{slot.action}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ADJUSTMENTS PANEL */}
        <section>
          <h2 className="mb-2 text-sm font-medium text-white">Adjustments</h2>
          <div className="space-y-2">
            {adjustments.map((adj) => (
              <details
                key={adj.label}
                className="group rounded-xl bg-white/5 p-3 text-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2">
                  <span className="font-medium text-white">{adj.label}</span>
                  <span className="text-[11px] text-white/50 group-open:hidden">
                    Show
                  </span>
                  <span className="hidden text-[11px] text-white/50 group-open:inline">
                    Hide
                  </span>
                </summary>
                <p className="mt-2 text-[14px] text-white/85">{adj.guidance}</p>
              </details>
            ))}
          </div>
        </section>

        {/* LURE GRID */}
        <section>
          <h2 className="mb-2 text-sm font-medium text-white">Lure set</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {lures.map((lure) => (
              <div
                key={lure.name}
                className="flex items-center gap-3 rounded-xl bg-[#1B314A]/60 p-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/30 text-white/90">
                  <LureIcon
                    iconKey={lure.iconKey}
                    className="h-8 w-8 text-white"
                  />
                </div>
                <span className="text-[13px]">{lure.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* COLOR SWATCHES */}
        <section>
          <h2 className="mb-2 text-sm font-medium text-white">
            Color priorities
          </h2>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <div
                key={c.name}
                className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1"
              >
                <span
                  className="h-4 w-4 rounded-full border border-white/20"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-[12px] text-white/80">{c.name}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

// ---------- Temporary Vision demo data ----------

const visionPatternDemo: PatternDetail = {
  phase: "Early Pre-Spawn",
  depthZone: "Mid-Shallow (4–8 ft)",
  structure: "Wind-blown grass lines with scattered wood",
  tier: "vision",
  technique: {
    name: "Chatterbait",
    style: "Power Fishing",
    iconKey: "chatterbait",
    bullets: [
      "Slow-roll along outside grass edges, ticking the tops when you can.",
      "Change retrieve speed to find the cadence that keeps the blade thumping clean.",
      "Cast at angles across the grass line to cover more water each pass.",
    ],
  },
  microPattern:
    "Early pre-spawn bass are holding shallow around grass edges — a great place to start with a moving bait that hunts.",
  timeline: [
    {
      window: "6–9 AM",
      action: "Cover wind-blown shallow grass with a chatterbait.",
    },
    {
      window: "9–11 AM",
      action:
        "Slide to the outside grass edge and first break (6–8 ft) and keep fan-casting.",
    },
    {
      window: "11–2 PM",
      action:
        "Target shade pockets, isolated wood, or docks in the same productive stretches.",
    },
    {
      window: "2–5 PM",
      action:
        "Revisit high-confidence banks, adjusting angle and retrieve speed to trigger followers.",
    },
  ],
  adjustments: [
    {
      label: "If water clarity improves…",
      guidance:
        "Go more natural on color (green pumpkin, bluegill, translucent shad) and consider downsizing the profile.",
    },
    {
      label: "If wind dies completely…",
      guidance:
        "Mix in a swim jig or finesse swimbait to keep the same targets honest without overpowering flat water.",
    },
    {
      label: "If you see followers but no commits…",
      guidance:
        "Speed up the retrieve or add a couple of sharp rod pops mid-cast to create a change-up trigger.",
    },
  ],
  lures: [
    { name: "Chatterbait", iconKey: "chatterbait" },
    { name: "Swim Jig", iconKey: "swim_jig" },
    { name: "Lipless Crank", iconKey: "lipless_crank" }, // falls back to ChatterbaitIcon
    { name: "Finesse Swimbait", iconKey: "swimbait_soft" }, // falls back as well
  ],
  colors: [
    { name: "Green Pumpkin", hex: "#2f4f2f" },
    { name: "Black / Blue", hex: "#060814" },
    { name: "White / Shad", hex: "#e5e7eb" },
    { name: "Chartreuse Accent", hex: "#e5ff3b" },
  ],
};

// ---------- Next.js page wrapper ----------

export default function VisionPatternPage() {
  return <PatternDetailScreen pattern={visionPatternDemo} />;
}
