"use client";

import { useEffect, useState } from "react";

type LureSetup = {
  lure: string;
  technique: string;
  rod: string;
  reel: string;
  line: string;
  hook_or_leader: string;
  lure_size: string;
};

type ProPatternResponse = {
  phase: string;
  depth_zone: string;
  recommended_lures: string[];
  recommended_targets: string[];
  strategy_tips: string[];
  color_recommendations: string[];
  lure_setups: LureSetup[];
  conditions: {
    temp_f: number;
    month: number;
    clarity: string;
    wind_speed: number;
    sky_condition: string;
    depth_ft: number | null;
    bottom_composition: string | null;
  };
  notes: string;
};

export default function ProClient() {
  const [tempF, setTempF] = useState("55");
  const [month, setMonth] = useState("3");
  const [clarity, setClarity] = useState("stained");
  const [windSpeed, setWindSpeed] = useState("8");
  const [skyCondition, setSkyCondition] = useState("cloudy");
  const [depthFt, setDepthFt] = useState("");
  const [bottom, setBottom] = useState("");

  const [result, setResult] = useState<ProPatternResponse | null>(null);
  const [selectedLure, setSelectedLure] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [autoLoading, setAutoLoading] = useState(false);
  const [autoError, setAutoError] = useState<string | null>(null);

  const [locationWater, setLocationWater] = useState<string | null>(null);
  const [locationCity, setLocationCity] = useState<string | null>(null);
  const [locationState, setLocationState] = useState<string | null>(null);
  const [currentTemp, setCurrentTemp] = useState<number | null>(null);
  const [localTime, setLocalTime] = useState<string | null>(null);
  const [conditionSummary, setConditionSummary] = useState<string | null>(null);

  // Auto month + geolocation + weather
  useEffect(() => {
    const now = new Date();
    setMonth(String(now.getMonth() + 1)); // 1–12

    async function loadWeatherAndLocation(latitude: number, longitude: number) {
      try {
        const [weatherResp, geoResp] = await Promise.all([
          fetch(`/api/current-conditions?lat=${latitude}&lon=${longitude}`),
          fetch(`/api/reverse-geocode?lat=${latitude}&lon=${longitude}`),
        ]);

        // Weather handling
        if (weatherResp.ok) {
          const w = await weatherResp.json();

          if (typeof w.temp_f === "number") {
            const rounded = Math.round(w.temp_f);
            setTempF(String(rounded)); // form field
            setCurrentTemp(rounded); // widget
          }
          let windMph: number | null = null;
          if (typeof w.wind_speed === "number") {
            windMph = Math.round(w.wind_speed);
            setWindSpeed(String(windMph));
          }
          if (w.sky_condition) {
            setSkyCondition(w.sky_condition);
          }
          // Build condition summary: "Sunny · Breezy", etc.
          const sky =
            (w.sky_condition as string | undefined)?.toLowerCase() ?? "";
          let skyLabel = "Mixed";
          if (sky.includes("sun")) skyLabel = "Sunny";
          else if (sky.includes("clear")) skyLabel = "Clear";
          else if (sky.includes("cloud")) skyLabel = "Cloudy";
          else if (sky.includes("rain") || sky.includes("drizzle"))
            skyLabel = "Rainy";
          else if (sky.includes("storm") || sky.includes("thunder"))
            skyLabel = "Stormy";

          let windLabel = "";
          if (windMph !== null) {
            if (windMph < 3) windLabel = "Calm";
            else if (windMph < 10) windLabel = "Light breeze";
            else if (windMph < 18) windLabel = "Breezy";
            else windLabel = "Windy";
          }

          const summary =
            windLabel && skyLabel ? `${skyLabel} · ${windLabel}` : skyLabel;
          setConditionSummary(summary);

          // Local time – we’ll use device local time as a proxy for “local lake time”
          // Local date + time (device local as proxy for lake local)
          const now = new Date();
          const dateString = now.toLocaleDateString([], {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          const timeString = now.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          });
          setLocalTime(`${dateString} · ${timeString}`);
        } else {
          const t = await weatherResp.text();
          console.log("Weather fetch failed:", t);
          setAutoError((prev) =>
            prev
              ? prev
              : "Could not auto-detect weather; fill conditions manually."
          );
        }

        // Reverse geocode handling
        if (geoResp.ok) {
          const g = await geoResp.json();
          console.log("Reverse geocode result:", g);

          const water_name = (g.water_name as string | null) || null;

          // Prefer city, fall back to county
          const cityOrCounty =
            (g.city as string | null) || (g.county as string | null) || null;

          const stateRaw = (g.state as string | null) || null;

          // Simple normalization: if it's a long name, keep it; if it's already "GA", great.
          const state =
            stateRaw && stateRaw.length > 3
              ? stateRaw // "Georgia"
              : stateRaw; // "GA"

          setLocationWater(water_name);
          setLocationCity(cityOrCounty);
          setLocationState(state);
        } else {
          const t = await geoResp.text();
          console.log("Reverse geocode failed:", t);
        }
      } catch (err) {
        console.log("Weather/geo exception:", err);
        setAutoError("Failed to auto-load conditions; fill manually.");
      } finally {
        setAutoLoading(false);
      }
    }

    if (!("geolocation" in navigator)) {
      setAutoError("Geolocation not available; fill manually.");
      return;
    }

    setAutoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        loadWeatherAndLocation(latitude, longitude);
      },
      (err) => {
        console.log("Geolocation error:", err);
        setAutoError("Location access denied; fill manually.");
        setAutoLoading(false);
      }
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSelectedLure(null);

    try {
      const payload = {
        temp_f: parseFloat(tempF),
        month: parseInt(month, 10),
        clarity,
        wind_speed: parseFloat(windSpeed),
        sky_condition: skyCondition,
        depth_ft: depthFt ? parseFloat(depthFt) : null,
        bottom_composition: bottom || null,
      };

      const resp = await fetch("http://localhost:8000/pattern/pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const text = await resp.text();
        console.log("Pattern PRO error:", text);
        setErrorMsg(
          "Something went wrong talking to SAGE Pro. Check the backend logs."
        );
        setResult(null);
        return;
      }

      const data = (await resp.json()) as ProPatternResponse;
      setResult(data);
    } catch (err) {
      console.log("Pattern PRO exception:", err);
      setErrorMsg("Network error. Is the backend running on :8000?");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const selectedSetup: LureSetup | null =
    result && selectedLure
      ? result.lure_setups.find((s) => s.lure === selectedLure) || null
      : null;

  return (
    <main className="max-w-5xl mx-auto p-4 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-100">
          SAGE Pro Pattern Engine
        </h1>
        <p className="text-sm text-slate-400">
          Advanced seasonal patterning with lure, color, target, and gear
          recommendations tuned to your conditions. Basic fields are
          auto-populated from your local weather when possible.
        </p>
      </header>

      {/* Lake conditions widget */}
      {(locationWater || locationCity || currentTemp !== null || localTime) && (
        <section className="mt-2 bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wide text-slate-500">
                Location
              </span>
              {/* Line 1: Water if available, otherwise City/County, ST */}
              <span className="text-sm font-semibold text-emerald-300">
                {locationWater
                  ? locationWater
                  : locationCity && locationState
                  ? `${locationCity}, ${locationState}`
                  : locationCity
                  ? locationCity
                  : "Location detected"}
              </span>
              {/* Line 2: City/County, ST if we had a water name */}
              {locationWater && (locationCity || locationState) && (
                <span className="text-xs text-slate-400">
                  {locationCity}
                  {locationCity && locationState ? ", " : ""}
                  {locationState}
                </span>
              )}
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs uppercase tracking-wide text-slate-500">
                Temp (°F)
              </span>
              <span className="text-lg font-semibold text-sky-300">
                {currentTemp !== null ? `${currentTemp}°` : "—"}
              </span>
              {conditionSummary && (
                <span className="text-[11px] text-slate-400">
                  {conditionSummary}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wide text-slate-500">
                Local Time
              </span>
              <span className="text-sm text-slate-200">
                {localTime ?? "Detecting…"}
              </span>
            </div>
            {autoLoading && (
              <span className="text-[11px] text-slate-400">
                Detecting your local conditions…
              </span>
            )}
            {autoError && !autoLoading && (
              <span className="text-[11px] text-amber-400">{autoError}</span>
            )}
          </div>
        </section>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 space-y-4"
      >
        <div className="grid gap-4 md:grid-cols-3">
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
              Auto-filled from local weather; adjust if your lake is different.
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
              Defaults to the current month.
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
              Your best guess is fine—this steers bait style and colors.
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
              Auto-filled from local weather; tweak if your lake is unique.
            </p>
          </div>

          {/* Sky condition */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-200">Sky Conditions</label>
            <select
              value={skyCondition}
              onChange={(e) => setSkyCondition(e.target.value)}
              className="rounded-md bg-slate-950 border border-slate-700 px-2 py-1 text-slate-50 text-sm"
            >
              <option value="sunny">Sunny / Bluebird</option>
              <option value="partly cloudy">Partly Cloudy</option>
              <option value="cloudy">Cloudy / Overcast</option>
            </select>
            <p className="text-[11px] text-slate-500">
              Auto-filled from local weather description; adjust if needed.
            </p>
          </div>

          {/* Depth (optional) */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-200">
              Target Depth (ft, optional)
            </label>
            <input
              type="number"
              value={depthFt}
              onChange={(e) => setDepthFt(e.target.value)}
              className="rounded-md bg-slate-950 border border-slate-700 px-2 py-1 text-slate-50 text-sm"
            />
            <p className="text-[11px] text-slate-500">
              If left blank, SAGE will infer depth from season.
            </p>
          </div>

          {/* Bottom composition (optional) */}
          <div className="flex flex-col gap-1 md:col-span-3">
            <label className="text-sm text-slate-200">
              Bottom Composition (optional)
            </label>
            <input
              type="text"
              value={bottom}
              onChange={(e) => setBottom(e.target.value)}
              placeholder="rock, grass, clay, sand, mixed, etc."
              className="rounded-md bg-slate-950 border border-slate-700 px-2 py-1 text-slate-50 text-sm"
            />
            <p className="text-[11px] text-slate-500">
              Helps SAGE refine targets and bait style (rock transitions, grass
              edges, etc.).
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Calculating..." : "Get Pro Pattern"}
            </button>
            {errorMsg && <p className="text-xs text-rose-400">{errorMsg}</p>}
          </div>

          {autoLoading && (
            <p className="text-xs text-slate-400">
              Detecting your local conditions…
            </p>
          )}
          {autoError && <p className="text-xs text-amber-400">{autoError}</p>}
        </div>
      </form>

      {/* Results */}
      {result && (
        <section className="space-y-4">
          {/* Summary + pattern info */}
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 space-y-4">
            <div className="flex flex-wrap gap-4 items-baseline">
              <p className="text-sm uppercase tracking-wide text-slate-400">
                Phase:
              </p>
              <p className="text-lg font-semibold text-sky-300">
                {result.phase}
              </p>
              <p className="text-sm uppercase tracking-wide text-slate-400">
                Depth Zone:
              </p>
              <p className="text-lg font-semibold text-emerald-300">
                {result.depth_zone}
              </p>
            </div>

            {/* Lures */}
            <div>
              <p className="text-sm font-semibold text-slate-200 mb-1">
                Recommended Lures:
              </p>
              <div className="flex flex-wrap gap-2">
                {result.recommended_lures.map((lure) => (
                  <button
                    key={lure}
                    type="button"
                    onClick={() =>
                      setSelectedLure((prev) => (prev === lure ? null : lure))
                    }
                    className={`px-3 py-1 rounded-full text-xs border ${
                      selectedLure === lure
                        ? "bg-emerald-500 text-slate-900 border-emerald-400"
                        : "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
                    }`}
                  >
                    {lure}
                  </button>
                ))}
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Tap a lure to see an exact rod / reel / line setup for that
                bait.
              </p>
            </div>

            {/* Targets */}
            <div>
              <p className="text-sm font-semibold text-slate-200 mb-1">
                Recommended Targets:
              </p>
              <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                {result.recommended_targets.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>

            {/* Strategy tips */}
            <div>
              <p className="text-sm font-semibold text-slate-200 mb-1">
                Strategy Tips:
              </p>
              <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                {result.strategy_tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>

            {/* Color recommendations */}
            <div>
              <p className="text-sm font-semibold text-slate-200 mb-1">
                Color Recommendations:
              </p>
              <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                {result.color_recommendations.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-slate-400">{result.notes}</p>
          </div>

          {/* Gear for selected lure */}
          {selectedSetup && (
            <div className="bg-slate-900/80 rounded-xl p-4 border border-emerald-500/60">
              <h2 className="text-sm font-semibold text-emerald-300 mb-2">
                Gear for: {selectedSetup.lure}
              </h2>
              <ul className="text-sm text-slate-200 space-y-1">
                <li>
                  <span className="font-semibold text-slate-300">
                    Technique:
                  </span>{" "}
                  {selectedSetup.technique}
                </li>
                <li>
                  <span className="font-semibold text-slate-300">Rod:</span>{" "}
                  {selectedSetup.rod}
                </li>
                <li>
                  <span className="font-semibold text-slate-300">Reel:</span>{" "}
                  {selectedSetup.reel}
                </li>
                <li>
                  <span className="font-semibold text-slate-300">Line:</span>{" "}
                  {selectedSetup.line}
                </li>
                <li>
                  <span className="font-semibold text-slate-300">
                    Hook / Leader:
                  </span>{" "}
                  {selectedSetup.hook_or_leader}
                </li>
                <li>
                  <span className="font-semibold text-slate-300">
                    Lure Size:
                  </span>{" "}
                  {selectedSetup.lure_size}
                </li>
              </ul>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
