const PricingScreen = () => {
  return (
    <div className="min-h-screen px-4 py-4 text-gray-100">
      {/* Header */}
      <header className="mb-4">
        <h1 className="text-lg font-semibold">Choose Your Plan</h1>
      </header>

      <main className="space-y-4 text-xs">
        {/* Tier cards */}
        <section className="space-y-3">
          {/* Pro */}
          <div className="rounded-xl border border-gray-700 bg-black/40 p-4">
            <div className="flex items-baseline justify-between">
              <div>
                <h2 className="text-sm font-semibold">Pro</h2>
                <p className="mt-1 text-[11px] text-gray-400">
                  Foundation clarity.
                </p>
              </div>
              <div className="text-right">
                <div className="text-base font-semibold">$14.99/mo</div>
                <div className="text-[11px] text-gray-400">$74.95/yr</div>
              </div>
            </div>
          </div>

          {/* Elite */}
          <div className="rounded-xl border border-gray-700 bg-black/40 p-4">
            <div className="flex items-baseline justify-between">
              <div>
                <h2 className="text-sm font-semibold">Elite</h2>
                <p className="mt-1 text-[11px] text-gray-400">
                  Tactical clarity.
                </p>
              </div>
              <div className="text-right">
                <div className="text-base font-semibold">$24.99/mo</div>
                <div className="text-[11px] text-gray-400">$124.95/yr</div>
              </div>
            </div>
          </div>

          {/* Vision */}
          <div className="rounded-xl border border-gray-700 bg-black/40 p-4">
            <div className="flex items-baseline justify-between">
              <div>
                <h2 className="text-sm font-semibold">Vision</h2>
                <p className="mt-1 text-[11px] text-gray-400">
                  Real-time interpretation.
                </p>
              </div>
              <div className="text-right">
                <div className="text-base font-semibold">$39.99/mo</div>
                <div className="text-[11px] text-gray-400">$199.95/yr</div>
              </div>
            </div>
          </div>
        </section>

        {/* Annual pricing banner */}
        <section className="rounded-xl border border-gray-700 bg-black/40 p-3">
          <p className="text-[11px] text-gray-200">
            Save 50% with Annual Plans
          </p>
        </section>

        {/* Founders sale banner */}
        <section className="rounded-xl border border-green-500 bg-green-500/10 p-3">
          <p className="text-[11px] text-green-100">
            Vision Founders Rate — $199.95 for life (first 100 anglers)
          </p>
        </section>
      </main>
    </div>
  );
};

export default PricingScreen;
