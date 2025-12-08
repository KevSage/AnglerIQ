"use client";

import React from "react";

export type Tier = "pro" | "elite" | "vision";

export interface PatternDetail {
  phase: string;
  depthZone: string;
  structure: string;
  tier: Tier;
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

/* ------- Shared small bits ------- */

function TierBadge({ tier }: { tier: Tier }) {
  const label =
    tier === "vision" ? "Vision" : tier === "elite" ? "Elite" : "Pro";

  const bgClass =
    tier === "vision"
      ? "bg-[#4A7BA7]/20 text-[#4A7BA7]"
      : tier === "elite"
      ? "bg-[#8FAF8F]/20 text-[#8FAF8F]"
      : "bg-white/10 text-white/80";

  return (
    <div
      className={`px-3 py-1 rounded-full text-[11px] font-medium ${bgClass}`}
    >
      {label} Tier
    </div>
  );
}

export default function PatternDetailScreen({ pattern }: PatternDetailProps) {
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
    <div className="min-h-screen bg-[#111111] text-white flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/8">
        <div className="text-[14px] font-semibold tracking-tight">AnglerIQ</div>
        <TierBadge tier={tier} />
      </header>

      <main className="flex-1 px-4 pt-4 pb-8 space-y-5">
        {/* Header: Phase / Depth / Structure – 3-up row */}
        <section className="pb-3 border-b border-white/10">
          <div className="grid grid-cols-3 gap-3">
            {/* Phase */}
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold tracking-wide text-white/55 uppercase">
                Phase
              </span>
              <span className="mt-0.5 inline-block rounded-md bg-white/5 px-2 py-1 text-[12px] text-white/90 truncate">
                {phase}
              </span>
            </div>

            {/* Depth zone */}
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold tracking-wide text-white/55 uppercase">
                Depth zone
              </span>
              <span className="mt-0.5 inline-block rounded-md bg-white/5 px-2 py-1 text-[12px] text-white/90 truncate">
                {depthZone}
              </span>
            </div>

            {/* Structure */}
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold tracking-wide text-white/55 uppercase">
                Primary structure
              </span>
              <span className="mt-0.5 inline-block rounded-md bg-white/5 px-2 py-1 text-[12px] text-white/90 truncate">
                {structure}
              </span>
            </div>
          </div>
        </section>

        {/* Micro-pattern sentence – centered, above hero */}
        <section className="px-6 py-3 text-center">
          <p className="text-[14px] leading-snug text-white/85 mx-auto max-w-[90%]">
            {microPattern}
          </p>
        </section>

        {/* Technique hero – shared layout, tier-aware styling */}
        <section className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#181818] to-[#101010] shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
          {/* Vision cinematic layer */}
          {isVision && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Hero gradient / silhouette placeholder.
                 Later you can add <HeroSilhouette iconKey={technique.iconKey} /> here. */}
              <div className="absolute -inset-x-10 -bottom-10 -top-4 rotate-[14deg] bg-gradient-to-br from-[#4A7BA7]/22 to-[#1B314A]/22" />
            </div>
          )}

          <div className="relative p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                {/* TODO: hook to icon system: <LureIcon iconKey={technique.iconKey} className="h-6 w-6 text-white/85" /> */}
                <span className="text-[13px] text-white/80">🎣</span>
              </div>
              <div>
                <div
                  className={`font-semibold ${
                    isVision ? "text-[16px]" : "text-[14px]"
                  }`}
                >
                  {technique.name}
                </div>
                <div className="text-[12px] text-white/70">
                  {technique.style}
                </div>
              </div>
            </div>

            <ul className="space-y-1 text-[13px] text-white/85">
              {technique.bullets.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="mt-[6px] h-1 w-1 rounded-full bg-white/70" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Timeline */}
        <section>
          <div className="mb-2 text-[11px] font-semibold tracking-wide text-white/60">
            GAMEPLAN
          </div>
          <div className="space-y-1.5">
            {timeline.map((slot) => (
              <div
                key={`${slot.window}-${slot.action}`}
                className="flex text-[13px] text-white/85"
              >
                <span className="w-24 text-white/55">{slot.window}</span>
                <span>{slot.action}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Adjustments */}
        <section>
          <div className="mb-2 text-[11px] font-semibold tracking-wide text-white/60">
            ADJUSTMENTS
          </div>
          <div className="space-y-2">
            {adjustments.map((adj) => (
              <div
                key={adj.label}
                className="rounded-2xl bg-white/4 border border-white/10 px-3 py-3"
              >
                <div className="text-[13px] font-medium mb-1">{adj.label}</div>
                <div className="text-[12px] text-white/80 leading-snug">
                  {adj.guidance}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Lure grid */}
        <section>
          <div className="mb-2 text-[11px] font-semibold tracking-wide text-white/60">
            LURE SET
          </div>
          <div className="grid grid-cols-2 gap-2">
            {lures.map((lure) => (
              <div
                key={lure.name}
                className="bg-[#1B314A]/60 rounded-2xl px-3 py-3 flex items-center gap-2"
              >
                <div className="h-9 w-9 rounded-full bg-black/30 flex items-center justify-center">
                  {/* TODO: <LureIcon iconKey={lure.iconKey} className="h-5 w-5 text-white/85" /> */}
                  <span className="text-[13px] text-white/75">🎣</span>
                </div>
                <span className="text-[13px]">{lure.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Colors */}
        <section>
          <div className="mb-2 text-[11px] font-semibold tracking-wide text-white/60">
            COLOR RECOMMENDATIONS
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <div
                key={c.name}
                className="flex items-center gap-2 rounded-full border border-white/12 px-3 py-1"
              >
                <span
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-[11px] text-white/85">{c.name}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
