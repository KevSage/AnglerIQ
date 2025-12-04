import React from "react";
import { useNavigate } from "react-router-dom";

const PricingScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-4 text-slate-100">
      {/* Header */}
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold">Choose Your Plan</h1>
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
          <p className="font-semibold">Save 50% with Annual Plans</p>
        </div>

        <div className="rounded-2xl border border-amber-400/70 bg-amber-400/10 px-4 py-3 text-xs text-amber-100">
          <p className="font-semibold">
            Vision Founders Rate — $199.95/yr for life (first 100 anglers)
          </p>
        </div>
      </section>

      {/* Tier cards */}
      <main className="mt-5 space-y-3">
        {/* Pro */}
        <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-100">Pro</h2>
            <div className="text-right text-xs text-slate-200">
              <p className="font-semibold">$14.99/mo</p>
              <p className="text-[11px] text-slate-400">$74.95/yr launch</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-300">Foundation clarity.</p>
        </section>

        {/* Elite */}
        <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-100">Elite</h2>
            <div className="text-right text-xs text-slate-200">
              <p className="font-semibold">$24.99/mo</p>
              <p className="text-[11px] text-slate-400">$124.95/yr launch</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-300">Tactical clarity.</p>
        </section>

        {/* Vision */}
        <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-100">Vision</h2>
            <div className="text-right text-xs text-slate-200">
              <p className="font-semibold">$39.99/mo</p>
              <p className="text-[11px] text-slate-400">$199.95/yr launch</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-300">
            Real-time interpretation.
          </p>
        </section>
      </main>
    </div>
  );
};

export default PricingScreen;
