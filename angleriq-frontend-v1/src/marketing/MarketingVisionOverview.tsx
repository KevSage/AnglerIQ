// src/components/marketing/MarketingVisionOverview.tsx

const MarketingVisionOverview = () => (
  <section className="mt-16">
    <h2 className="text-center text-xl font-semibold md:text-2xl">
      Vision Enhanced Interpretation
    </h2>
    <p className="mt-2 text-center text-sm text-gray-400 md:text-[15px]">
      Vision combines surface cues, sonar data, and area confidence to help you
      decide where to spend your time.
    </p>

    <div className="mt-8 grid gap-4 md:grid-cols-2">
      {/* Surface Enhanced */}
      <div className="rounded-2xl border border-gray-800 bg-[#121212] p-5">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-emerald-300">
          SURFACE ENHANCED
        </p>
        <ul className="mt-3 space-y-1.5 text-xs text-gray-200">
          <li>Shade lanes and light angle</li>
          <li>Visible structure and cover density</li>
          <li>Water clarity and surface texture</li>
        </ul>
      </div>

      {/* Sonar Enhanced */}
      <div className="rounded-2xl border border-gray-800 bg-[#121212] p-5">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-sky-300">
          SONAR ENHANCED
        </p>
        <ul className="mt-3 space-y-1.5 text-xs text-gray-200">
          <li>Depth bands and bottom hardness</li>
          <li>Bait presence and arch count</li>
          <li>Activity level and stay-or-move logic</li>
        </ul>
      </div>
    </div>

    {/* Vision Enhanced combined card */}
    <div className="mt-4 rounded-2xl border border-violet-600/40 bg-gradient-to-r from-[#080818] to-[#05010B] p-5">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-violet-200">
        VISION ENHANCED
      </p>
      <p className="mt-3 text-xs text-gray-200">
        Vision Enhanced Analysis combines surface and sonar cues to judge area
        quality, suggest whether to stay or move, and highlight the depth zone
        most likely to reward your time.
      </p>
      <ul className="mt-3 space-y-1.5 text-xs text-gray-300">
        <li>Area confidence and quality zone</li>
        <li>Movement logic and transition calls</li>
        <li>
          Vision Enhanced Approach when the environment justifies a change
        </li>
      </ul>
    </div>
  </section>
);

export default MarketingVisionOverview;
