// src/screens/LandingPage.tsx

import React from "react";
import { Link } from "react-router-dom";
import MarketingVisionOverview from "../marketing/MarketingVisionOverview";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0b0b0b] text-gray-100">
      {/* HEADER */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-gradient-to-b from-black/80 via-black/60 to-transparent backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16">
          {/* Left: Brand */}
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold tracking-[0.14em] text-gray-100 sm:text-base">
              Angler<span className="font-bold">IQ</span>
            </span>
            <span className="hidden text-[10px] text-gray-400 sm:inline">
              Powered by SAGE
            </span>
          </div>

          {/* Right: Nav */}
          <nav className="flex items-center gap-3 text-xs sm:gap-4 sm:text-sm">
            <a
              href="#vision"
              className="hidden text-gray-300 hover:text-white sm:inline"
            >
              Vision
            </a>
            <a
              href="#pricing"
              className="hidden text-gray-300 hover:text-white sm:inline"
            >
              Pricing
            </a>
            <button
              type="button"
              className="hidden rounded-full border border-gray-600 px-3 py-1 text-xs text-gray-200 hover:border-gray-400 sm:inline"
            >
              Sign In
            </button>
            <Link
              to="/onboarding"
              className="rounded-full bg-[#8FAF8F] px-3 py-1.5 text-[11px] font-medium text-black hover:bg-[#9dc19d] sm:px-4 sm:text-xs"
            >
              Start with Vision
            </Link>
          </nav>
        </div>
      </header>

      <main className="pt-20 sm:pt-24">
        {/* 2. HERO SECTION */}
        <section
          id="hero"
          className="relative border-b border-white/5 bg-gradient-to-b from-[#050505] via-[#070909] to-black"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(143,175,143,0.18),_transparent_55%)]" />
          <div className="relative mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center px-4 pb-16 pt-8 text-center sm:min-h-[70vh] sm:pt-10">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#8FAF8F]/80">
              Environmental Understanding
            </p>
            <h1 className="max-w-3xl text-[28px] font-semibold leading-tight text-gray-50 sm:text-[40px] md:text-[48px]">
              Environmental Understanding — Elevated and Interpreted.
            </h1>
            <p className="mt-4 max-w-xl text-[13px] text-gray-300 sm:text-[15px]">
              AnglerIQ is the premium bass-fishing intelligence system built for
              clarity, confidence, and structure.
            </p>
            <p className="mt-2 max-w-xl text-[12px] text-gray-400 sm:text-[13px]">
              Powered by environmental logic, real-time Vision Enhanced
              interpretation, and SAGE.
            </p>

            <div className="mt-6 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/onboarding"
                className="flex-1 rounded-full bg-[#8FAF8F] px-4 py-2.5 text-center text-[13px] font-medium text-black hover:bg-[#9dc19d]"
              >
                Start with Vision
              </Link>
              <a
                href="#pricing"
                className="flex-1 rounded-full border border-gray-600 px-4 py-2.5 text-center text-[13px] text-gray-100 hover:border-gray-400"
              >
                See Pricing
              </a>
            </div>

            {/* Subtle visual area hint */}
            <div className="mt-10 flex w-full max-w-xl flex-col items-center gap-2 text-[11px] text-gray-500">
              <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
              <p>Pattern-of-the-Moment · Vision Enhanced · SAGE Guidance</p>
            </div>
          </div>
        </section>
        {/* 3. WHAT ANGLERIQ DOES */}
        <section id="what" className="border-b border-white/5 bg-[#050505]">
          <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
            <h2 className="text-center text-[20px] font-semibold text-gray-50 sm:text-[24px]">
              What AnglerIQ Does
            </h2>
            <p className="mt-5 max-w-2xl text-[14px] leading-relaxed text-gray-300 sm:text-[15px]">
              AnglerIQ cuts through noise by analyzing today&apos;s conditions
              to produce a Pattern-of-the-Moment — a single, disciplined
              approach grounded in seasonal behavior, structure, clarity, and
              biological cues.
            </p>
            {/* If you want more body copy from the V1.4 landing doc, paste it here */}
          </div>
        </section>
        {/* 4. THREE LAYERS OF ANGLERIQ */}
        <section className="border-b border-white/5 bg-black/95">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
            <h2 className="text-center text-[20px] font-semibold text-gray-50 sm:text-[24px]">
              Three Layers of AnglerIQ
            </h2>
            <p className="mt-3 text-center text-[13px] text-gray-400 sm:text-[14px]">
              Learn the pattern, understand the pattern, then interpret the
              environment.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {/* PRO */}
              <div className="rounded-2xl border border-white/7 bg-[#101010] p-5 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
                <h3 className="text-[18px] font-semibold text-gray-50">
                  Pro — Learn the Pattern
                </h3>
                <p className="mt-2 text-[13px] text-gray-400">
                  Clear, disciplined guidance when you want one proven way to
                  fish today.
                </p>
                <ul className="mt-4 space-y-1.5 text-[13px] text-gray-300">
                  <li>• Pattern-of-the-Moment</li>
                  <li>• Recommended lure + supporting options</li>
                  <li>• Offline mode</li>
                  <li>• Depth zone guidance</li>
                  <li>• Seasonal environmental logic</li>
                </ul>
              </div>

              {/* ELITE */}
              <div className="rounded-2xl border border-white/7 bg-[#101010] p-5 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
                <h3 className="text-[18px] font-semibold text-gray-50">
                  Elite — Understand the Pattern
                </h3>
                <p className="mt-2 text-[13px] text-gray-400">
                  See how the pattern evolves through the day with adjustments
                  and nuance.
                </p>
                <ul className="mt-4 space-y-1.5 text-[13px] text-gray-300">
                  <li>• Gameplan Timeline</li>
                  <li>• Adjustment Cards</li>
                  <li>• Supporting lures</li>
                  <li>• Color recommendations</li>
                  <li>• Personalized SAGE coaching</li>
                  <li>• Offline fallback</li>
                </ul>
              </div>

              {/* VISION */}
              <div className="rounded-2xl border border-white/7 bg-[#101010] p-5 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
                <h3 className="text-[18px] font-semibold text-gray-50">
                  Vision — Interpret the Environment
                </h3>
                <p className="mt-2 text-[13px] text-gray-400">
                  Real-time interpretation for anglers who want to see what the
                  environment is really doing.
                </p>
                <ul className="mt-4 space-y-1.5 text-[13px] text-gray-300">
                  <li>• Surface Enhanced cues</li>
                  <li>• Sonar Enhanced cues</li>
                  <li>• Vision Enhanced (Combined Interpretation)</li>
                  <li>• Vision Enhanced Approach (conditional)</li>
                  <li>• Area confidence scoring</li>
                  <li>• Movement logic</li>
                  <li>• SAGE Vision Mode</li>
                  <li>• Premium Confidence Meter</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        {/* 5. SAGE SECTION */}
        <section id="sage" className="border-b border-white/5 bg-[#050505]">
          <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-center sm:py-16">
            {/* Text */}
            <div className="flex-1">
              <h2 className="text-[20px] font-semibold text-gray-50 sm:text-[24px]">
                SAGE — Your On-Water Guide
              </h2>
              <p className="mt-3 max-w-xl text-[14px] text-gray-300 sm:text-[15px]">
                SAGE is not a chatbot. It&apos;s the Seasonal Adaptive Guidance
                Engine that explains your Pattern-of-the-Moment, adapts its tone
                to your experience level, and helps you stay disciplined on a
                single, well-reasoned approach.
              </p>
              <ul className="mt-4 space-y-1.5 text-[13px] text-gray-300">
                <li>
                  • Experience Level, Coaching Style, Preferred Styles,
                  Confidence Spectrum
                </li>
                <li>
                  • Tone-only personalization — pattern and Vision logic stay
                  untouched
                </li>
                <li>
                  • Calm, premium guidance that reduces screen time and keeps
                  you fishing
                </li>
              </ul>

              {/* Offline banner */}
              <div className="mt-5 inline-flex items-center rounded-xl border border-gray-700 bg-[#1C1C1C] px-3 py-2 text-[11px] text-gray-200">
                <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[#8FAF8F]" />
                <span>
                  SAGE Offline: fundamentals only — reconnect for full guidance.
                </span>
              </div>
            </div>

            {/* Simple visual placeholder */}
            <div className="flex flex-1 items-center justify-center">
              <div className="relative w-full max-w-xs rounded-2xl border border-white/8 bg-gradient-to-br from-[#111] via-[#141a14] to-black p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] font-medium tracking-[0.18em] text-gray-400">
                    SAGE
                  </span>
                  <span className="rounded-full border border-gray-600 px-2 py-0.5 text-[10px] text-gray-300">
                    Guidance
                  </span>
                </div>
                <div className="space-y-2.5 text-[11px] text-gray-200">
                  <div className="rounded-xl bg-black/60 px-3 py-2">
                    Today&apos;s Pattern-of-the-Moment is locked in. Let&apos;s
                    focus on working this approach cleanly before we change
                    anything.
                  </div>
                  <div className="flex justify-end">
                    <div className="rounded-xl border border-[#8FAF8F] px-3 py-1.5 text-[11px] text-gray-100">
                      How should I fish it here?
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        6. VISION ENHANCED INTERPRETATION
        <MarketingVisionOverview />
        {/* 7. LURE LIBRARY */}
        <section className="border-b border-white/5 bg-[#050505]">
          <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
            <h2 className="text-center text-[20px] font-semibold text-gray-50 sm:text-[24px]">
              Lure Library
            </h2>
            <p className="mt-3 text-center text-[13px] text-gray-400 sm:text-[14px]">
              A static reference for techniques, depth ranges, and seasonal
              roles — ready whenever you want to learn, not just when
              you&apos;re on a pattern.
            </p>

            {/* Placeholder for icons / categories */}
            <div className="mt-7 grid grid-cols-3 gap-4 sm:grid-cols-6">
              {[
                "Jigs",
                "Crankbaits",
                "Topwater",
                "Finesse",
                "Swimbaits",
                "Spinnerbaits",
              ].map((label) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center rounded-xl border border-white/7 bg-[#101010] px-2 py-3"
                >
                  <div className="mb-1 h-7 w-7 rounded-full border border-gray-600" />
                  <span className="text-[11px] text-gray-200">{label}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                type="button"
                className="rounded-full border border-gray-600 px-4 py-2 text-[13px] text-gray-100 hover:border-gray-400"
              >
                View All Techniques
              </button>
            </div>
          </div>
        </section>
        {/* 8. PRICING */}
        <section id="pricing" className="border-b border-white/5 bg-black">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
            <h2 className="text-center text-[20px] font-semibold text-gray-50 sm:text-[24px]">
              Choose Your Plan
            </h2>
            <p className="mt-3 text-center text-[13px] text-gray-400 sm:text-[14px]">
              Start where you are. Upgrade when you&apos;re ready.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {/* PRO */}
              <div className="flex flex-col rounded-2xl border border-white/7 bg-[#101010] p-5">
                <h3 className="text-[16px] font-semibold text-gray-50">Pro</h3>
                <p className="mt-2 text-[13px] text-gray-400">
                  Learn the Pattern.
                </p>
                <div className="mt-4 text-[13px] text-gray-100">
                  <p>
                    <span className="text-[18px] font-semibold">$9.99</span>/mo
                  </p>
                  <p className="mt-1 text-gray-400">$49/yr</p>
                </div>
                <ul className="mt-4 space-y-1.5 text-[13px] text-gray-300">
                  <li>• Pattern-of-the-Moment</li>
                  <li>• Depth zone and seasonal logic</li>
                  <li>• Offline-ready guidance</li>
                </ul>
                <button
                  type="button"
                  className="mt-5 rounded-full border border-gray-600 px-4 py-2 text-[13px] text-gray-100 hover:border-gray-400"
                >
                  Start with Pro
                </button>
              </div>

              {/* ELITE */}
              <div className="flex flex-col rounded-2xl border border-white/7 bg-[#101010] p-5">
                <h3 className="text-[16px] font-semibold text-gray-50">
                  Elite
                </h3>
                <p className="mt-2 text-[13px] text-gray-400">
                  Understand the Pattern.
                </p>
                <div className="mt-4 text-[13px] text-gray-100">
                  <p>
                    <span className="text-[18px] font-semibold">$19.99</span>/mo
                  </p>
                  <p className="mt-1 text-gray-400">$99/yr</p>
                </div>
                <ul className="mt-4 space-y-1.5 text-[13px] text-gray-300">
                  <li>• Everything in Pro</li>
                  <li>• Gameplan Timeline</li>
                  <li>• Adjustment Cards</li>
                  <li>• SAGE coaching</li>
                </ul>
                <button
                  type="button"
                  className="mt-5 rounded-full border border-gray-600 px-4 py-2 text-[13px] text-gray-100 hover:border-gray-400"
                >
                  Start with Elite
                </button>
              </div>

              {/* VISION */}
              <div className="flex flex-col rounded-2xl border border-[#8FAF8F]/70 bg-[#101010] p-5 shadow-[0_0_60px_rgba(143,175,143,0.25)]">
                <h3 className="text-[16px] font-semibold text-gray-50">
                  Vision
                </h3>
                <p className="mt-2 text-[13px] text-gray-300">
                  Interpret the Environment.
                </p>
                <div className="mt-4 text-[13px] text-gray-100">
                  <p>
                    <span className="text-[18px] font-semibold">$29.99</span>/mo
                  </p>
                  <p className="mt-1 text-gray-300">$149/yr</p>
                </div>
                <ul className="mt-4 space-y-1.5 text-[13px] text-gray-200">
                  <li>• Everything in Elite</li>
                  <li>• Surface Enhanced + Sonar Enhanced</li>
                  <li>• Vision Enhanced Analysis &amp; Approach</li>
                  <li>• Area confidence scoring</li>
                </ul>
                <button
                  type="button"
                  className="mt-5 rounded-full bg-[#8FAF8F] px-4 py-2 text-[13px] font-medium text-black hover:bg-[#9dc19d]"
                >
                  Start with Vision
                </button>
              </div>
            </div>

            {/* Founders Rate card */}
            <div className="mt-8 flex justify-center">
              <div className="w-full max-w-xl rounded-2xl border border-[#8FAF8F]/60 bg-gradient-to-r from-[#0b120d] via-[#111] to-[#151b14] px-4 py-4 sm:px-6 sm:py-5">
                <div className="mb-1 flex items-center justify-between">
                  <span className="rounded-full border border-[#8FAF8F]/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-[#8FAF8F]">
                    Founders
                  </span>
                  <span className="text-[11px] text-gray-400">
                    Limited to first 100 Vision annual
                  </span>
                </div>
                <p className="text-[14px] font-medium text-gray-50 sm:text-[15px]">
                  Vision Founders Rate — $99/yr for life
                </p>
                <p className="mt-1 text-[12px] text-gray-300">
                  Your rate never increases and always matches or beats future
                  discounts.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* 9. WHY ANGLERIQ */}
        <section className="border-b border-white/5 bg-[#050505]">
          <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
            <h2 className="text-center text-[20px] font-semibold text-gray-50 sm:text-[24px]">
              Why AnglerIQ
            </h2>
            <div className="mt-6 space-y-2 text-center text-[15px] text-gray-200">
              <p>Discipline over randomness.</p>
              <p>Interpretation over luck.</p>
              <p>Confidence through clarity.</p>
              <p>A single, well-reasoned approach.</p>
            </div>
            <div className="mt-8 flex justify-center">
              <Link
                to="/onboarding"
                className="rounded-full bg-[#8FAF8F] px-5 py-2.5 text-[13px] font-medium text-black hover:bg-[#9dc19d]"
              >
                Begin with Vision
              </Link>
            </div>
          </div>
        </section>
        {/* 10. TRUST THE PROCESS */}
        <section className="border-b border-white/5 bg-black/95">
          <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
            <h2 className="text-[20px] font-semibold text-gray-50 sm:text-[24px]">
              Trust the Process
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-gray-300 sm:text-[15px]">
              AnglerIQ is built around a simple idea: pick one disciplined
              approach for today, understand why it works, and commit long
              enough for the pattern to teach you something real. You can still
              experiment, change baits, and fish your way — but when it matters,
              you have a clear, stable anchor to come back to.
            </p>
          </div>
        </section>
        {/* 11. FINAL CTA */}
        <section className="border-b border-white/5 bg-[#050505]">
          <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16 text-center">
            <h2 className="text-[22px] font-semibold text-gray-50 sm:text-[26px]">
              Start Interpreting the Environment
            </h2>
            <p className="mt-3 text-[13px] text-gray-300 sm:text-[14px]">
              Lock in your tier, set your preferences, and let AnglerIQ handle
              the environmental interpretation.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                to="/onboarding"
                className="w-full max-w-xs rounded-full bg-[#8FAF8F] px-5 py-2.5 text-center text-[13px] font-medium text-black hover:bg-[#9dc19d]"
              >
                Begin with Vision
              </Link>
              <a
                href="#pricing"
                className="w-full max-w-xs rounded-full border border-gray-600 px-5 py-2.5 text-center text-[13px] text-gray-100 hover:border-gray-400"
              >
                Explore Tiers
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* 12. FOOTER */}
      <footer className="border-t border-white/5 bg-[#050505]">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-6 text-[11px] text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:text-[12px]">
          <div className="space-y-1">
            <p>© 2025 AnglerIQ — Powered by SAGE</p>
            <p>Environmental Understanding — Elevated and Interpreted.</p>
          </div>
          <div className="space-y-1 sm:text-right">
            <p>Support: sage@angleriq.io</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
