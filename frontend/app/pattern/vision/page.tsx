"use client";

import React from "react";

type GameplanRow = {
  timeWindow: string;
  action: string;
};

type Adjustment = {
  label: string;
  body: string;
};

type LureChip = {
  name: string;
  role?: string;
};

type ColorPill = {
  name: string;
  swatchClass: string; // tailwind bg class
};

export default function VisionPatternDetailPage() {
  // ⚠️ Demo data only – later replace with real pattern response from backend
  const phase = "Early Pre-Spawn";
  const depthZone = "Mid-shallow (4–8 ft)";
  const structure = "Wind-blown grass edges with scattered wood";

  const techniqueName = "Chatterbait — Power Fishing";
  const techniqueBullets = [
    "Slow-roll along outside grass edges, ticking the tops when possible.",
    "Vary retrieve speed to find the cadence that keeps the blade thumping but not blowing out.",
    "Make angled casts across the grass line to cover more water per pass.",
  ];

  const microPatternSentence =
    "Early pre-spawn bass are holding shallow around grass edges — a great place to start with a moving bait that hunts.";

  const gameplan: GameplanRow[] = [
    {
      timeWindow: "6–9 AM",
      action:
        "Cover wind-blown shallow grass with a chatterbait, focusing on points and irregularities.",
    },
    {
      timeWindow: "9–11 AM",
      action:
        "Slide slightly deeper (6–8 ft) and trace the outside grass edge or first break.",
    },
    {
      timeWindow: "Midday",
      action:
        "Target shade pockets, isolated wood, or docks in the same grass-lined stretches.",
    },
    {
      timeWindow: "Late Afternoon",
      action:
        "Revisit productive banks, adjusting angle and retrieve speed to trigger followers.",
    },
  ];

  const adjustments: Adjustment[] = [
    {
      label: "If water clarity improves…",
      body: "Downsize your chatterbait profile and go more natural on color (green pumpkin, bluegill, or translucent shad).",
    },
    {
      label: "If wind dies completely…",
      body: "Mix in a swim jig or finesse swimbait to keep the same targets honest without overpowering flat water.",
    },
    {
      label: "If you’re seeing followers but no commits…",
      body: "Speed up the retrieve or add a couple of sharp rod pops mid-cast to create a change-up trigger.",
    },
  ];

  const lureChips: LureChip[] = [
    { name: "Chatterbait", role: "Primary" },
    { name: "Swim Jig", role: "Backup" },
    { name: "Lipless Crank", role: "Search" },
    { name: "Finesse Swimbait", role: "Clean-up" },
  ];

  const colorPills: ColorPill[] = [
    { name: "Green Pumpkin", swatchClass: "bg-green-700" },
    { name: "Black / Blue", swatchClass: "bg-slate-900" },
    { name: "White / Shad", swatchClass: "bg-slate-100" },
    { name: "Chartreuse Accent", swatchClass: "bg-lime-400" },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f14] px-4 py-6 text-zinc-50">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        {/* Pattern Header */}
        <section className="flex flex-col gap-1">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300/80">
            Vision Tier • Pattern Detail
          </div>
          <h1 className="text-xl font-semibold text-zinc-50">{phase}</h1>
          <p className="text-xs text-zinc-400">
            Depth zone:{" "}
            <span className="font-medium text-zinc-200">{depthZone}</span>
          </p>
          <p className="text-xs text-zinc-400">
            Structure focus:{" "}
            <span className="font-medium text-zinc-200">{structure}</span>
          </p>
        </section>

        {/* Vision Technique Hero Card */}
        <section className="relative overflow-hidden rounded-2xl border border-[#1b314a] bg-gradient-to-br from-[#122233] via-[#0f1822] to-[#05070b] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
          {/* Ghosted silhouette – fake with gradient blob */}
          <div
            className="pointer-events-none absolute -right-16 -top-24 h-56 w-64 rotate-[14deg] bg-gradient-to-br from-[#4A7BA7] to-[#1B314A] opacity-[0.18]"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300/80">
              Vision Technique
              <span className="h-[1px] w-10 bg-emerald-300/50" />
            </div>

            <h2 className="text-lg font-semibold text-zinc-50">
              {techniqueName}
            </h2>

            <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-zinc-200/90">
              {techniqueBullets.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>

            <p className="mt-3 rounded-xl bg-black/40 px-3 py-2 text-xs text-emerald-100/90 ring-1 ring-emerald-400/20">
              {microPatternSentence}
            </p>
          </div>
        </section>

        {/* Gameplan Timeline */}
        <section className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-[#111827] to-[#05070b] p-4">
          <h3 className="text-sm font-medium text-zinc-50">
            Gameplan timeline
          </h3>
          <p className="mt-1 text-[11px] text-zinc-400">
            A simple on-water flow. Move through these windows and adjust based
            on how the fish respond.
          </p>

          <div className="mt-3 flex flex-col gap-2">
            {gameplan.map((row) => (
              <div
                key={row.timeWindow + row.action}
                className="flex gap-3 rounded-xl bg-black/40 px-3 py-2 text-xs ring-1 ring-zinc-800/80"
              >
                <div className="mt-[1px] min-w-[72px] text-[11px] font-semibold uppercase tracking-wide text-emerald-300/80">
                  {row.timeWindow}
                </div>
                <div className="text-zinc-200">{row.action}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Adjustments Panel (simple accordion-like list) */}
        <section className="rounded-2xl border border-zinc-800 bg-[#080b11] p-4">
          <h3 className="text-sm font-medium text-zinc-50">Adjustments</h3>
          <p className="mt-1 text-[11px] text-zinc-400">
            Quick pivots if the conditions shift while you&apos;re on this
            stretch.
          </p>

          <div className="mt-3 flex flex-col gap-2">
            {adjustments.map((adj) => (
              <details
                key={adj.label}
                className="group rounded-xl bg-black/40 px-3 py-2 text-xs ring-1 ring-zinc-800/80"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-emerald-100">
                  <span className="font-semibold text-[11px] uppercase tracking-wide">
                    {adj.label}
                  </span>
                  <span className="text-[10px] text-zinc-400 group-open:hidden">
                    Show
                  </span>
                  <span className="hidden text-[10px] text-zinc-400 group-open:inline">
                    Hide
                  </span>
                </summary>
                <p className="mt-2 text-zinc-200">{adj.body}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Lure Grid + Color Swatches */}
        <section className="grid gap-4 md:grid-cols-[2fr_1.3fr]">
          {/* Lure Grid */}
          <div className="rounded-2xl border border-zinc-800 bg-[#080b11] p-4">
            <h3 className="text-sm font-medium text-zinc-50">Lure set</h3>
            <p className="mt-1 text-[11px] text-zinc-400">
              Core baits that match this pattern. SAGE won&apos;t force all of
              them — it&apos;s your rotation.
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
              {lureChips.map((lure) => (
                <div
                  key={lure.name}
                  className="flex flex-col gap-1 rounded-xl bg-black/40 px-3 py-2 ring-1 ring-zinc-800/80"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-200">
                    {lure.name}
                  </div>
                  {lure.role && (
                    <div className="text-[10px] text-zinc-400">{lure.role}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Color Swatches */}
          <div className="rounded-2xl border border-zinc-800 bg-[#080b11] p-4">
            <h3 className="text-sm font-medium text-zinc-50">
              Color priorities
            </h3>
            <p className="mt-1 text-[11px] text-zinc-400">
              Start here based on today&apos;s water color and light.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {colorPills.map((c) => (
                <div
                  key={c.name}
                  className="inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-[11px] text-zinc-100 ring-1 ring-zinc-700/80"
                >
                  <span
                    className={`h-3 w-3 rounded-full border border-zinc-900/60 ${c.swatchClass}`}
                  />
                  <span>{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
