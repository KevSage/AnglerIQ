// src/screens/LandingPage.tsx

import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => navigate("/onboarding");
  const handlePricing = () => navigate("/pricing");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* HERO SECTION — lake / environment */}
      <section
        className="relative overflow-hidden"
        style={{
          // TODO: replace with real hero image (wide lake at dawn / morning fog)
          backgroundImage: "url('/images/hero-lake-dawn.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/72 to-slate-950/95" />

        {/* Soft horizon mist */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[-40px] h-40 bg-[radial-gradient(circle_at_center,_rgba(148,163,184,0.25),_transparent)] blur-xl" />

        {/* Nav + hero */}
        <div className="relative mx-auto flex min-h-[520px] max-w-5xl flex-col px-4 py-4">
          {/* Top nav */}
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-600/80 bg-black/60 text-xs font-semibold tracking-[0.15em]">
                AIQ
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-slate-50">AnglerIQ</p>
                <p className="text-[10px] uppercase tracking-wide text-slate-400">
                  Environmental Understanding — Elevated and Interpreted.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePricing}
                className="hidden rounded-full border border-slate-600/80 bg-black/40 px-3 py-1.5 text-[11px] font-medium text-slate-100 backdrop-blur-sm sm:inline-flex"
              >
                Pricing
              </button>
              <button
                type="button"
                onClick={handleStart}
                className="rounded-full border border-emerald-400 bg-emerald-400 px-4 py-1.5 text-[11px] font-semibold text-black shadow-[0_0_24px_rgba(16,185,129,0.75)]"
              >
                Start with Vision
              </button>
            </div>
          </header>

          {/* Hero body */}
          <div className="mt-10 grid flex-1 gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2.2fr)] md:items-center">
            {/* Left: copy */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300/90">
                Bass Fishing · Pattern System · Vision Enhanced
              </p>

              <h1 className="mt-3 text-3xl font-semibold leading-tight text-slate-50 sm:text-4xl">
                Read your lake like a{" "}
                <span className="text-emerald-300">system</span>,
                <br className="hidden sm:block" /> not a mystery.
              </h1>

              <p className="mt-4 max-w-xl text-sm text-slate-200">
                AnglerIQ turns weather, season, and water clarity into a single
                Pattern of the Day — then uses Vision Enhanced interpretation to
                help you see what the environment is actually doing around your
                boat.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleStart}
                  className="w-full rounded-full border border-emerald-400 bg-emerald-400 px-4 py-2 text-sm font-semibold text-black sm:w-auto"
                >
                  Get started
                </button>
                <button
                  type="button"
                  onClick={handlePricing}
                  className="w-full rounded-full border border-slate-600/90 bg-black/40 px-4 py-2 text-sm font-semibold text-slate-100 backdrop-blur-sm sm:w-auto"
                >
                  View tiers
                </button>
              </div>

              <p className="mt-3 text-[11px] text-slate-400">
                No free tier. Built for anglers who take learning seriously.
              </p>
            </div>

            {/* Right: device over water */}
            <div className="flex justify-center md:justify-end">
              <div className="relative h-[430px] w-full max-w-[260px] rounded-[32px] border border-slate-700/80 bg-slate-950/95 p-3 shadow-[0_0_80px_rgba(15,23,42,0.9)] backdrop-blur">
                {/* Glow */}
                <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[40px] bg-[radial-gradient(circle_at_bottom,_rgba(34,197,94,0.35),_transparent)] opacity-80" />

                {/* Notch */}
                <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-slate-700/80" />

                {/* Conditions */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Today&apos;s Conditions
                    </p>
                    <span className="rounded-full border border-slate-700 bg-slate-950 px-2 py-0.5 text-[9px] uppercase tracking-wide text-slate-200">
                      Vision Tier
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-[9px]">
                    <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-slate-100">
                      Warming trend
                    </span>
                    <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-slate-100">
                      Light wind
                    </span>
                    <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-slate-100">
                      Stained water
                    </span>
                  </div>
                </div>

                {/* Pattern of the Day */}
                <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-900/90 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Pattern of the Day
                  </p>
                  <p className="mt-1 text-[13px] font-medium text-slate-50">
                    Slow-rolled chatterbait along wind-blown grass edges.
                  </p>
                  <p className="mt-2 text-[10px] text-slate-400">
                    Built from today&apos;s conditions, not a random lure list.
                  </p>
                </div>

                {/* Tacklebox + Vision */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {/* Tacklebox */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Tacklebox
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <div className="h-6 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300" />
                      <div className="h-6 w-10 rounded-full bg-gradient-to-r from-slate-200 to-slate-50" />
                      <div className="h-6 w-10 rounded-full bg-gradient-to-r from-amber-500 to-amber-300" />
                    </div>
                    <p className="mt-2 text-[9px] text-slate-400">
                      Patterns only use the lures you actually own.
                    </p>
                  </div>

                  {/* Vision Enhanced preview */}
                  <div className="rounded-2xl border border-emerald-500/70 bg-emerald-500/5 p-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                      Vision Enhanced
                    </p>
                    <div
                      className="mt-2 h-16 rounded-xl border border-emerald-500/40 bg-cover bg-center"
                      style={{
                        // TODO: replace with sonar / surface mock
                        backgroundImage: "url('/images/vision-sonar-mock.jpg')",
                      }}
                    />
                    <p className="mt-2 text-[9px] text-emerald-100">
                      Upload sonar or surface photos and see the local
                      environment interpreted for you.
                    </p>
                  </div>
                </div>

                {/* SAGE */}
                <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-900/90 p-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    SAGE
                  </p>
                  <p className="mt-1 text-[10px] text-slate-200">
                    “Given this pattern and your experience level, here&apos;s
                    how I&apos;d fish the next hour…”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Depth band divider */}
      <div className="h-10 w-full bg-[linear-gradient(to_right,_rgba(15,23,42,1)_0%,_rgba(15,23,42,0.9)_25%,_rgba(15,23,42,0.85)_50%,_rgba(15,23,42,0.9)_75%,_rgba(15,23,42,1)_100%),_repeating-linear-gradient(to_top,_rgba(30,64,175,0.18),_rgba(30,64,175,0.18)_2px,_transparent_2px,_transparent_6px)]" />

      <main className="mx-auto max-w-5xl px-4 pb-16 pt-10">
        {/* TIERS */}
        <section>
          <h2 className="text-sm font-semibold text-slate-100">
            Built around how real anglers improve.
          </h2>
          <p className="mt-1 text-[11px] text-slate-400">
            Learn the Pattern → Understand the Pattern → Interpret the
            Environment.
          </p>

          <div className="mt-6 grid gap-3 text-xs md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Pro
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-100">
                Learn the Pattern
              </p>
              <p className="mt-2 text-slate-300">
                A clear Pattern of the Day built from weather, season, and broad
                conditions — with offline-ready patterns.
              </p>
              <p className="mt-3 text-[11px] text-slate-400">
                From $9.99/mo or $49/yr.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Elite
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-100">
                Understand the Pattern
              </p>
              <p className="mt-2 text-slate-300">
                A gameplan timeline and structured adjustments as the day and
                conditions evolve.
              </p>
              <p className="mt-3 text-[11px] text-slate-400">
                From $19.99/mo or $99/yr.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-500/70 bg-emerald-500/5 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
                Vision
              </p>
              <p className="mt-1 text-sm font-semibold text-emerald-100">
                Interpret the Environment
              </p>
              <p className="mt-2 text-emerald-50/90">
                Vision Enhanced interpretation of sonar and surface photos,
                layered on top of your current pattern.
              </p>
              <p className="mt-3 text-[11px] text-emerald-200">
                From $29.99/mo or $149/yr.
              </p>
            </div>
          </div>
        </section>

        {/* Day on the water + shoreline image */}
        <section className="mt-12 grid gap-8 border-t border-slate-800 pt-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              A real day on your lake, structured.
            </h2>
            <ul className="mt-4 space-y-3 text-xs text-slate-300">
              <li>
                <span className="font-semibold text-slate-100">
                  1. Set up your Tacklebox.
                </span>{" "}
                Choose the baits you actually carry — patterns stay grounded in
                your real gear.
              </li>
              <li>
                <span className="font-semibold text-slate-100">
                  2. Generate your Pattern of the Day.
                </span>{" "}
                SAGE interprets today&apos;s conditions and gives you one
                disciplined approach instead of ten conflicting tips.
              </li>
              <li>
                <span className="font-semibold text-slate-100">
                  3. Fish the plan — and ask SAGE why.
                </span>{" "}
                Use SAGE to understand the reasoning, log catches, and adapt
                without throwing away the pattern.
              </li>
              <li>
                <span className="font-semibold text-slate-100">
                  4. Use Vision when you&apos;re on a specific spot.
                </span>{" "}
                Upload sonar or surface photos and let Vision interpret depth,
                cover, shade, and activity level where you&apos;re actually
                fishing.
              </li>
            </ul>
          </div>

          <div className="flex items-center justify-center">
            <div
              className="h-56 w-full max-w-sm overflow-hidden rounded-3xl border border-slate-800 bg-cover bg-center"
              style={{
                // TODO: replace with real shoreline photo
                backgroundImage: "url('/images/shorescape-evening.jpg')",
              }}
            >
              <div className="flex h-full w-full items-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4">
                <p className="text-[11px] text-slate-100">
                  Built for real lakes: wind, grass lines, shade, and the water
                  that&apos;s actually in front of you — not studio-perfect
                  screenshots.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Founders + CTA */}
        <section className="mt-12 border-t border-slate-800 pt-10">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div className="rounded-3xl border border-emerald-500/70 bg-emerald-500/5 px-4 py-6 sm:px-6">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
                Vision Founders Rate
              </p>
              <p className="mt-2 text-sm font-semibold text-emerald-50">
                $99/yr for life for the first 100 Vision Annual anglers.
              </p>
              <p className="mt-2 text-xs text-emerald-100">
                Once you lock it in, your Vision price never increases and
                always matches or beats future discounts. When the 100th spot is
                claimed, the Founders program closes permanently.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-6 text-center sm:px-6">
              <p className="text-sm font-semibold text-slate-100">
                Ready to fish with structure instead of chaos?
              </p>
              <p className="mt-2 text-xs text-slate-300">
                Start with Vision, set up your Tacklebox, and generate your
                first Pattern of the Day built for your lake, your gear, and
                your experience.
              </p>
              <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={handleStart}
                  className="w-full rounded-full border border-emerald-400 bg-emerald-400 px-4 py-2 text-sm font-semibold text-black sm:w-auto"
                >
                  Get started
                </button>
                <button
                  type="button"
                  onClick={handlePricing}
                  className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-100 sm:w-auto"
                >
                  See pricing
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 border-t border-slate-900 pb-4 pt-4 text-[10px] text-slate-500">
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <p>© {new Date().getFullYear()} AnglerIQ. All rights reserved.</p>
            <p>
              Built for anglers who care about understanding, not shortcuts.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
