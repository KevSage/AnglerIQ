"use client";

import { useState } from "react";

type BasicPatternResponse = {
  phase: string;
  depth_zone: string;
  recommended_techniques: string[];
  notes: string;
};

export default function PatternPage() {
  const [tempF, setTempF] = useState("55");
  const [month, setMonth] = useState("3");
  const [clarity, setClarity] = useState("stained");
  const [windSpeed, setWindSpeed] = useState("8");

  const [result, setResult] = useState<BasicPatternResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const payload = {
        temp_f: parseFloat(tempF),
        month: parseInt(month, 10),
        clarity,
        wind_speed: parseFloat(windSpeed),
      };

      const resp = await fetch("http://localhost:8000/pattern/basic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const text = await resp.text();
        console.error("Pattern BASIC error:", text);
        setErrorMsg("Something went wrong talking to SAGE. Try again.");
        setResult(null);
        return;
      }

      const data = (await resp.json()) as BasicPatternResponse;
      setResult(data);
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error. Is the backend running on :8000?");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-4 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-100">
          SAGE Basic Pattern Assistant
        </h1>
        <p className="text-sm text-slate-400">
          Quick seasonal pattern and technique guidance using water temp, month,
          clarity, and wind. Pro features (targets, colors, gear, chat, sonar)
          live in the higher tiers.
        </p>
      </header>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 space-y-4"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {/* Water temp */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-200">Water Temp (°F)</label>
            <input
              type="number"
              value={tempF}
              onChange={(e) => setTempF(e.target.value)}
              className="rounded-md bg-slate-950 border border-slate-700 px-2 py-1 text-slate-50 text-sm"
            />
            <p className="text-[11px] text-slate-500">
              Surface temp where you&apos;re fishing.
            </p>
          </div>

          {/* Month */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-200">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="rounded-md bg-slate-950 border border-slate-700 px-2 py-1 text-slate-50 text-sm"
            >
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
            <p className="text-[11px] text-slate-500">
              Rough seasonal context for the pattern.
            </p>
          </div>

          {/* Clarity */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-200">Water Clarity</label>
            <select
              value={clarity}
              onChange={(e) => setClarity(e.target.value)}
              className="rounded-md bg-slate-950 border border-slate-700 px-2 py-1 text-slate-50 text-sm"
            >
              <option value="clear">Clear</option>
              <option value="stained">Stained</option>
              <option value="muddy">Muddy</option>
            </select>
            <p className="text-[11px] text-slate-500">
              Your best guess is fine—this just steers the technique.
            </p>
          </div>

          {/* Wind */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-200">Wind Speed (mph)</label>
            <input
              type="number"
              value={windSpeed}
              onChange={(e) => setWindSpeed(e.target.value)}
              className="rounded-md bg-slate-950 border border-slate-700 px-2 py-1 text-slate-50 text-sm"
            />
            <p className="text-[11px] text-slate-500">
              Approximate sustained wind where you&apos;re fishing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Calculating..." : "Get Pattern"}
          </button>
          {errorMsg && <p className="text-xs text-rose-400">{errorMsg}</p>}
        </div>
      </form>

      {/* Result */}
      {result && (
        <section className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 space-y-4">
          <div className="flex flex-wrap gap-4 items-baseline">
            <p className="text-sm uppercase tracking-wide text-slate-400">
              Phase:
            </p>
            <p className="text-lg font-semibold text-sky-300">{result.phase}</p>
            <p className="text-sm uppercase tracking-wide text-slate-400">
              Depth Zone:
            </p>
            <p className="text-lg font-semibold text-emerald-300">
              {result.depth_zone}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-200 mb-1">
              Recommended Techniques:
            </p>
            <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
              {result.recommended_techniques.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-slate-400">{result.notes}</p>

          <p className="text-[11px] text-slate-500">
            For more detailed lure, color, and gear guidance, upgrade to the
            SAGE Pro Pattern Engine.
          </p>
        </section>
      )}
    </main>
  );
}
