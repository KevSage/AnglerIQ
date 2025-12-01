"use client";

import * as React from "react";

// ---- Types from spec ----

export type Tier = "pro" | "elite" | "vision";

export interface HomeScreenData {
  tier: Tier;
  weather: {
    temperatureF: number;
    windDirection: string;
    windSpeedMph: number;
    skyCondition: string;
    pressureInHg: number;
    phase: string;
  };
  patternSummary: HomePatternSummary;
  conditionsDeepDive: ConditionsDeepDiveCard | null;
  sageTip: SageTipCard | null;
  lakeInfo: LakeInfoCard | null;
}

export interface HomePatternSummary {
  tier: Tier;
  depthZone: string;
  structure: string;
  iconKey: string;
  microPattern: string;
  confidence?: 0 | 1 | 2 | 3;
}

export interface ConditionsDeepDiveCard {
  tempTrend: "warming" | "cooling" | "stable";
  tempDeltaF: number;
  windSummary: string;
  pressureTrend: "rising" | "falling" | "steady";
  pressureNote: string;
  timesOfDay?: {
    label: string;
    iconKey?: string;
    note: string;
  }[];
}

export interface SageTipCard {
  title: string;
  body: string;
  iconKey?: string;
}

export interface LakeInfoCard {
  lakeName: string;
  waterTempF?: number;
  clarity?: string;
  levelOffsetFt?: number;
  seasonLabel?: string;
}

// ---- Demo data (stub) ----
// We can later swap this for a real /pattern/pro|elite|vision API hydrate.

const demoHomeData: HomeScreenData = {
  tier: "vision",
  weather: {
    temperatureF: 58,
    windDirection: "NW",
    windSpeedMph: 7,
    skyCondition: "Cloudy",
    pressureInHg: 30.14,
    phase: "Pre-Spawn",
  },
  patternSummary: {
    tier: "vision",
    depthZone: "Mid-Shallow",
    structure: "Grass Lines",
    iconKey: "chatterbait",
    microPattern:
      "Pre-spawn bass are sliding up around mid-shallow grass edges — a perfect lane to start leaning on your power baits.",
    confidence: 3,
  },
  conditionsDeepDive: {
    tempTrend: "warming",
    tempDeltaF: 2.8,
    windSummary: "Stable NW wind with soft chop on the main-lake pockets.",
    pressureTrend: "rising",
    pressureNote:
      "Post-front feel — bite may tighten but quality fish still set up.",
  },
  sageTip: {
    title: "Today’s SAGE Tip",
    body: "Cover water early with a chatterbait along outside grass, then slow down with a jig once you mark consistent bait.",
  },
  lakeInfo: {
    lakeName: "Lake Lanier",
    waterTempF: 58,
    clarity: "2–3 ft clarity",
    levelOffsetFt: -1.2,
    seasonLabel: "Early Pre-Spawn",
  },
};

// ---- Root page ----

export default function HomePage() {
  return <HomeScreen data={demoHomeData} />;
}

// ---- Home Screen root ----

interface HomeScreenProps {
  data: HomeScreenData;
}

export function HomeScreen({ data }: HomeScreenProps) {
  const {
    tier,
    weather,
    patternSummary,
    conditionsDeepDive,
    sageTip,
    lakeInfo,
  } = data;

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col">
      <div className="flex-1 px-4 pt-4 pb-8">
        {/* Tier badge */}
        <TierBadge tier={tier} />

        {/* Weather + Phase */}
        <WeatherStrip weather={weather} />

        {/* Divider */}
        <div className="mt-2 mb-4 h-px bg-white/10" />

        {/* Main content block with contour background */}
        <div className="relative">
          <LakeContourBackground />

          <div className="relative space-y-4">
            <HomePatternSummaryCard summary={patternSummary} />
            <ModularGrid
              tier={tier}
              conditions={conditionsDeepDive}
              sageTip={sageTip}
              lakeInfo={lakeInfo}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Tier Badge ----

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
    <div className="mb-2 flex justify-center">
      <div
        className={`rounded-full px-3 py-1 text-[11px] font-medium ${bgClass}`}
      >
        {label} Tier
      </div>
    </div>
  );
}

// ---- Weather Strip ----

function WeatherStrip({ weather }: { weather: HomeScreenData["weather"] }) {
  const {
    temperatureF,
    windDirection,
    windSpeedMph,
    skyCondition,
    pressureInHg,
    phase,
  } = weather;

  return (
    <section className="flex flex-wrap justify-center gap-2 text-[12px] text-white/80">
      <span>{Math.round(temperatureF)}°F</span>
      <Dot />
      <span>
        {windDirection} {windSpeedMph} mph
      </span>
      <Dot />
      <span>{skyCondition}</span>
      <Dot />
      <span>{pressureInHg.toFixed(2)} inHg</span>
      <Dot />
      <span className="font-medium text-[#8FAF8F]">Phase: {phase}</span>
    </section>
  );
}

const Dot = () => <span className="text-white/35">•</span>;

// ---- Pattern Summary Card ----

interface HomePatternSummaryProps {
  summary: HomePatternSummary;
}

export function HomePatternSummaryCard({ summary }: HomePatternSummaryProps) {
  const { tier, depthZone, structure, iconKey, microPattern, confidence } =
    summary;
  const isVision = tier === "vision";

  return (
    <section className="space-y-3 rounded-2xl border border-white/10 bg-gradient-to-b from-[#181818] to-[#101010] px-4 pt-4 pb-5 shadow-[0_6px_16px_rgba(0,0,0,0.45)]">
      {/* Top row: icon + depth/structure + optional confidence */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
            {/* Hook this to your lure icon system later */}
            {/* <LureIcon iconKey={iconKey} className="h-5 w-5 text-white/80" /> */}
            <span className="text-xs text-white/70">🎣</span>
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
      <button className="w-full rounded-xl bg-[#4A7BA7]/90 py-2.5 text-[14px] font-semibold transition-colors hover:bg-[#4A7BA7]">
        Start Pattern Intelligence
      </button>
    </section>
  );
}

// ---- Vision-only Confidence Bars ----

function ConfidenceBars({ level }: { level: 0 | 1 | 2 | 3 }) {
  const clamped = Math.max(0, Math.min(level, 3));

  return (
    <div
      className="flex items-end gap-[2px]"
      aria-label={`Pattern confidence: ${clamped} of 3`}
    >
      {[0, 1, 2].map((i) => {
        const active = i < clamped;
        const heightClass =
          i === 0 ? "h-[6px]" : i === 1 ? "h-[10px]" : "h-[14px]";

        return (
          <div
            key={i}
            className={[
              "w-[4px] rounded-sm",
              heightClass,
              active ? "bg-white/80" : "bg-white/25",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}

// ---- Lake Contour Background (placeholder) ----

function LakeContourBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Main contour stroke */}
      <svg
        className="absolute -left-10 top-0 h-64 w-72 -rotate-6 opacity-25"
        viewBox="0 0 200 160"
        fill="none"
      >
        <path
          d="M10 140 C 30 110, 50 120, 70 95 C 90 70, 110 75, 135 55 C 160 35, 185 40, 195 20"
          stroke="#4A7BA7"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18 150 C 40 120, 58 128, 80 100 C 102 72, 120 78, 145 60 C 168 44, 188 46, 198 30"
          stroke="#8FAF8F"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
        />
      </svg>

      {/* Secondary contour on the right */}
      <svg
        className="absolute right-[-40px] top-40 h-52 w-64 rotate-8 opacity-18"
        viewBox="0 0 200 160"
        fill="none"
      >
        <path
          d="M0 120 C 20 110, 40 90, 60 80 C 80 70, 100 65, 130 50 C 160 35, 185 30, 200 20"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// ---- Modular Grid ----

interface ModularGridProps {
  tier: Tier;
  conditions: ConditionsDeepDiveCard | null;
  sageTip: SageTipCard | null;
  lakeInfo: LakeInfoCard | null;
}

function ModularGrid({
  tier,
  conditions,
  sageTip,
  lakeInfo,
}: ModularGridProps) {
  return (
    <div className="mt-4 space-y-3">
      {/* Wide Conditions card */}
      {conditions && <ConditionsDeepDive conditions={conditions} />}

      {/* Two square cards */}
      <div className="grid grid-cols-2 gap-3">
        {sageTip && <SageTipCardView tip={sageTip} />}
        {lakeInfo && <LakeInfoCardView info={lakeInfo} />}
      </div>
    </div>
  );
}

// ---- Conditions Deep Dive ----

function ConditionsDeepDive({
  conditions,
}: {
  conditions: ConditionsDeepDiveCard;
}) {
  const { tempTrend, tempDeltaF, windSummary, pressureTrend, pressureNote } =
    conditions;

  const tempTrendLabel =
    tempTrend === "warming"
      ? `Warming (+${tempDeltaF.toFixed(1)}°F)`
      : tempTrend === "cooling"
      ? `Cooling (${tempDeltaF.toFixed(1)}°F)`
      : "Stable temps";

  const pressureLabel =
    pressureTrend === "rising"
      ? "Rising pressure"
      : pressureTrend === "falling"
      ? "Falling pressure"
      : "Steady pressure";

  return (
    <section className="animate-fade-up rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-[12px] text-white/85">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wide text-white/60">
          CONDITIONS DEEP DIVE
        </span>
      </div>
      <div className="space-y-1">
        <div>{tempTrendLabel}</div>
        <div>{windSummary}</div>
        <div>
          {pressureLabel} — {pressureNote}
        </div>
      </div>
    </section>
  );
}

// ---- SAGE Tip Card ----

function SageTipCardView({ tip }: { tip: SageTipCard }) {
  const { title, body } = tip;

  return (
    <section className="animate-fade-up rounded-2xl border border-white/8 bg-[#151515] px-3 py-3 text-[12px] text-white/85">
      <div className="mb-1.5 flex items-center gap-2">
        <span className="text-[11px] font-semibold tracking-wide text-white/60">
          {title}
        </span>
      </div>
      <p className="text-[12px] leading-snug text-white/80">{body}</p>
    </section>
  );
}

// ---- Lake Info Card ----

function LakeInfoCardView({ info }: { info: LakeInfoCard }) {
  const { lakeName, waterTempF, clarity, levelOffsetFt, seasonLabel } = info;

  return (
    <section className="animate-fade-up rounded-2xl border border-white/8 bg-[#151515] px-3 py-3 text-[12px] text-white/85">
      <div className="mb-1 text-[11px] font-semibold tracking-wide text-white/60">
        LAKE INFO
      </div>
      <div className="mb-1 text-[12px] font-medium">{lakeName}</div>
      <div className="space-y-0.5 text-white/80">
        {waterTempF != null && <div>Water: {Math.round(waterTempF)}°F</div>}
        {clarity && <div>Clarity: {clarity}</div>}
        {typeof levelOffsetFt === "number" && (
          <div>
            Level: {levelOffsetFt > 0 ? "+" : ""}
            {levelOffsetFt.toFixed(1)} ft
          </div>
        )}
        {seasonLabel && <div>Season: {seasonLabel}</div>}
      </div>
    </section>
  );
}
