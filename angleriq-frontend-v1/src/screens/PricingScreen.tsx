import React from "react";
import { useNavigate } from "react-router-dom";
import ScreenContainer from "../components/layout/ScreenContainer";

const PricingScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ScreenContainer>
      {/* Header */}
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-slate-100">
            Choose Your Plan
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            All tiers include offline capability and SAGE guidance.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-medium text-slate-200"
        >
          Back to Home
        </button>
      </header>

      {/* Annual / Founders banners */}
      <section className="space-y-2">
        <div className="rounded-2xl border border-emerald-500/50 bg-emerald-500/5 px-4 py-3 text-xs text-emerald-100">
          <p className="font-semibold">Annual plans offer the best value.</p>
          <p className="mt-1 text-[11px] text-emerald-200/90">
            Lock in a full season of clarity at a lower yearly rate.
          </p>
        </div>

        <div className="rounded-2xl border border-amber-400/70 bg-amber-400/10 px-4 py-3 text-xs text-amber-100">
          <p className="font-semibold">
            Vision Founders Rate — $99/yr for life
          </p>
          <p className="mt-1 text-[11px] text-amber-100/90">
            Available for the first 100 Vision Annual anglers. Once you lock it
            in, your Vision price never increases.
          </p>
        </div>
      </section>

      {/* Tier cards */}
      <main className="mt-5 space-y-3">
        {/* Pro */}
        <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Pro</h2>
              <p className="mt-1 text-[11px] text-slate-400">
                Learn the Pattern.
              </p>
            </div>
            <div className="text-right text-xs text-slate-200">
              <p className="font-semibold">$9.99/mo</p>
              <p className="text-[11px] text-slate-400">$49/yr</p>
            </div>
          </div>
          <ul className="mt-3 space-y-1 text-[11px] text-slate-300">
            <li>• Daily Pattern of the Day</li>
            <li>• Core environmental logic</li>
            <li>• Offline patterns and basic SAGE help</li>
          </ul>
        </section>

        {/* Elite */}
        <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Elite</h2>
              <p className="mt-1 text-[11px] text-slate-400">
                Understand the Pattern.
              </p>
            </div>
            <div className="text-right text-xs text-slate-200">
              <p className="font-semibold">$19.99/mo</p>
              <p className="text-[11px] text-slate-400">$99/yr</p>
            </div>
          </div>
          <ul className="mt-3 space-y-1 text-[11px] text-slate-300">
            <li>• Everything in Pro</li>
            <li>• Deeper pattern breakdowns and adjustments</li>
            <li>• Expanded SAGE interpretation of your day</li>
          </ul>
        </section>

        {/* Vision */}
        <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Vision</h2>
              <p className="mt-1 text-[11px] text-slate-400">
                Interpret the Environment.
              </p>
            </div>
            <div className="text-right text-xs text-slate-200">
              <p className="font-semibold">$29.99/mo</p>
              <p className="text-[11px] text-slate-400">$149/yr</p>
            </div>
          </div>
          <ul className="mt-3 space-y-1 text-[11px] text-slate-300">
            <li>• Everything in Elite</li>
            <li>
              • Vision Enhanced interpretation from sonar and surface images
            </li>
            <li>
              • On-the-water environmental insight built around your pattern
            </li>
          </ul>
        </section>
      </main>
    </ScreenContainer>
  );
};

export default PricingScreen;
