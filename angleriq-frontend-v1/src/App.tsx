// src/App.tsx
import { useEffect, useMemo, useState } from "react";
import { HomeMap } from "./components/map/HomeMap";
import { ConditionsSheet } from "./components/sheets/ConditionsSheet";
import "./App.css";
import { LakeSearchSheet } from "./components/sheets/LakeSearchSheet";
import type { HomeLake } from "./types/Lake";
import { LakeSoftLockPrompt } from "./components/LakeSoftLockPrompt";
import { API_BASE_URL } from "./lib/api";

type PatternSummary = {
  lureName: string;
  target: string;
};

type NavTab =
  | "home"
  | "pattern"
  | "vision"
  | "tackle"
  | "library"
  | "conditions"
  | "lakeSearch";

const DEFAULT_HOME_LAKE: HomeLake = {
  name: "Home Lake (Dev)",
  lat: 33.75,
  lon: -84.39,
  zoom: 11,
};

const LS_HOME_LAKE_KEY = "aiq.homeLake.v1";

function safeParseHomeLake(raw: string | null): HomeLake | null {
  if (!raw) return null;
  try {
    const obj = JSON.parse(raw) as Partial<HomeLake>;
    if (
      typeof obj?.name === "string" &&
      typeof obj?.lat === "number" &&
      typeof obj?.lon === "number" &&
      typeof obj?.zoom === "number"
    ) {
      return { name: obj.name, lat: obj.lat, lon: obj.lon, zoom: obj.zoom };
    }
    return null;
  } catch {
    return null;
  }
}

// ────────────────────────────────────────────────────────────────────────────────
// D-031 — Contracts (typed, minimal; transport-only, no derived logic)
// Canonical calls:
//   GET  /debug/weather?location_name=Test Lake
//   POST /pattern/pro  (payload may be {})
// No retries, no caching, no UI logic here.
// ────────────────────────────────────────────────────────────────────────────────
type WeatherContext = {
  temp_f?: number | null;
  wind_speed?: number | null;
  sky_condition?: string | null;
  timestamp?: string | null; // informational only (Last updated)
};

type ProPatternRequest = {
  // D-033 hints (non-authoritative). Empty payload must succeed.
  clarity?: string | null;
  bottom_composition?: string | null;
  depth_ft?: number | null;
  forage?: string | null;
};

type ProPatternResponse = {
  featured_lure_name: string;
  primary_technique: string;
  pattern_summary: string;
  // Conditions row (weather-only)
  conditions?: WeatherContext;
};

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const msg = text ? `Request failed (${res.status}): ${text}` : `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return (await res.json()) as T;
}

function toOptionalString(value: string): string | null {
  const v = value.trim();
  return v.length ? v : null;
}

function formatLastUpdated(ts?: string | null) {
  if (!ts) return null;
  // Keep literal: informational only; no derived categories.
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString();
}

function App() {
  const [recenterKey, setRecenterKey] = useState(0);

  const [homeLake, setHomeLake] = useState<HomeLake>(() => {
    const saved = safeParseHomeLake(localStorage.getItem(LS_HOME_LAKE_KEY));
    return saved ?? DEFAULT_HOME_LAKE;
  });

  useEffect(() => {
    localStorage.setItem(LS_HOME_LAKE_KEY, JSON.stringify(homeLake));
  }, [homeLake]);

  // Pattern chip (will be hydrated by /pattern/pro; still safe defaults)
  const [pattern, setPattern] = useState<PatternSummary>({
    lureName: "Generate Pattern",
    target: "Tap to generate your plan",
  });

  // still stubbed (no promise of “live” here)
  const [temperature] = useState<string>("48°F");

  const [activeTab, setActiveTab] = useState<NavTab>("home");

  const lakeLat = homeLake.lat;
  const lakeLon = homeLake.lon;
  const lakeName = homeLake.name;
  const lakeZoom = homeLake.zoom;

  // ────────────────────────────────────────────────────────────────────────────
  // D-021 — Soft-lock state (UI-only, inert)
  // ────────────────────────────────────────────────────────────────────────────
  const [softLockLakeName, setSoftLockLakeName] = useState<string | null>(null);
  const [softLockVisible, setSoftLockVisible] = useState<boolean>(false);

  // ────────────────────────────────────────────────────────────────────────────
  // D-023 — Pin system skeleton (UI shell only)
  // ────────────────────────────────────────────────────────────────────────────
  const [pinsSheetOpen, setPinsSheetOpen] = useState<boolean>(false);
  const [showCatchPins, setShowCatchPins] = useState<boolean>(true);
  const [showProductiveSpots, setShowProductiveSpots] = useState<boolean>(true);
  const [showStructuralNotes, setShowStructuralNotes] = useState<boolean>(true);

  // ────────────────────────────────────────────────────────────────────────────
  // D-032 / D-033 / D-034 / D-035 — Pro Pattern + optional hints + debug weather + safety states
  // ────────────────────────────────────────────────────────────────────────────
  const [proPatternLoading, setProPatternLoading] = useState<boolean>(false);
  const [proPatternError, setProPatternError] = useState<string | null>(null);
  const [proPatternResp, setProPatternResp] = useState<ProPatternResponse | null>(null);

  const [hintClarity, setHintClarity] = useState<string>("");
  const [hintBottom, setHintBottom] = useState<string>("");
  const [hintDepthFt, setHintDepthFt] = useState<string>(""); // string input; parsed on submit
  const [hintForage, setHintForage] = useState<string>("");

  const proLastUpdated = useMemo(() => {
    const ts = proPatternResp?.conditions?.timestamp ?? null;
    return formatLastUpdated(ts);
  }, [proPatternResp?.conditions?.timestamp]);

  const [debugWeatherLoading, setDebugWeatherLoading] = useState<boolean>(false);
  const [debugWeatherError, setDebugWeatherError] = useState<string | null>(null);
  const [debugWeather, setDebugWeather] = useState<WeatherContext | null>(null);

  async function handleGenerateProPattern() {
    setProPatternError(null);
    setProPatternLoading(true);

    try {
      // Build optional hints (non-authoritative). Empty payload must still succeed.
      const clarity = toOptionalString(hintClarity);
      const bottom = toOptionalString(hintBottom);
      const forage = toOptionalString(hintForage);

      let depth_ft: number | null = null;
      const depthRaw = hintDepthFt.trim();
      if (depthRaw.length) {
        const n = Number(depthRaw);
        depth_ft = Number.isFinite(n) ? n : null;
      }

      const payload: ProPatternRequest = {};
      if (clarity !== null) payload.clarity = clarity;
      if (bottom !== null) payload.bottom_composition = bottom;
      if (forage !== null) payload.forage = forage;
      if (depthRaw.length) payload.depth_ft = depth_ft;

      const resp = await apiRequest<ProPatternResponse>("/pattern/pro", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setProPatternResp(resp);

      // Update chip (minimal, no extra inference)
      const lureName = resp.featured_lure_name || "Pattern";
      const target = resp.pattern_summary || "Pattern summary unavailable";
      setPattern({ lureName, target });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Pattern request failed";
      setProPatternError(msg);
    } finally {
      setProPatternLoading(false);
    }
  }

  async function handleFetchDebugWeather() {
    setDebugWeatherError(null);
    setDebugWeatherLoading(true);

    try {
      const resp = await apiRequest<WeatherContext>(
        `/debug/weather?location_name=${encodeURIComponent("Test Lake")}`
      );
      setDebugWeather(resp);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Debug weather request failed";
      setDebugWeatherError(msg);
    } finally {
      setDebugWeatherLoading(false);
    }
  }

  return (
    <div className="aiq-app">
      {/* Map Layer */}
      <div className="aiq-app__map-layer">
        <HomeMap
          recenterKey={recenterKey}
          centerLat={lakeLat}
          centerLon={lakeLon}
          zoom={lakeZoom}
        />
      </div>

      {/* UI Layer */}
      <div className="aiq-app__ui-layer">
        {/* D-021: Soft-lock prompt (UI-only, inert by default) */}
        <LakeSoftLockPrompt
          isVisible={softLockVisible}
          lakeName={softLockLakeName}
          onConfirm={() => {
            // D-021: NO mutation allowed. Keep inert.
            setSoftLockVisible(false);
            setSoftLockLakeName(null);
          }}
          onDismiss={() => {
            setSoftLockVisible(false);
            setSoftLockLakeName(null);
          }}
        />

        {/* D-023: Pins button (temporary entry point; UI-only) */}
        <button
          className="aiq-dev-btn aiq-clickable"
          onClick={() => setPinsSheetOpen(true)}
          aria-label="Open pin layer toggles"
          title="Pins (UI shell)"
        >
          Pins
        </button>

        {/* Lake pill (opens Lake Search) */}
        <button
          className="aiq-lake-pill aiq-clickable"
          onClick={() => setActiveTab("lakeSearch")}
          aria-label="Open lake search"
          title="Change home lake"
        >
          {lakeName}
        </button>

        {/* Top bar */}
        <div className="aiq-top-bar">
          <button
            className="aiq-temp-pill aiq-clickable"
            onClick={() => setActiveTab("conditions")}
            aria-label="Open conditions"
          >
            {temperature}
          </button>

          <button
            className="aiq-pattern-chip aiq-clickable"
            onClick={() => setActiveTab("pattern")}
            aria-label="Open pattern"
          >
            <div className="aiq-pattern-chip__lure">{pattern.lureName}</div>
            <div className="aiq-pattern-chip__target">{pattern.target}</div>
          </button>
        </div>

        {/* Recenter */}
        <button
          className="aiq-recenter-btn aiq-clickable"
          onClick={() => setRecenterKey((k) => k + 1)}
          aria-label="Recenter map"
        >
          ⟳
        </button>

        {/* SAGE orb */}
        <button
          className="aiq-sage-orb aiq-clickable"
          onClick={() => {
            console.log("SAGE orb tapped → SAGE overlay later");
            setActiveTab("pattern");
          }}
          aria-label="Open SAGE"
        >
          S
        </button>

        {/* Bottom nav (5 tabs only) */}
        <nav className="aiq-bottom-nav aiq-clickable" aria-label="Primary navigation">
          <button
            className={
              "aiq-nav-item aiq-clickable" +
              (activeTab === "home" ? " aiq-nav-item--active" : "")
            }
            onClick={() => setActiveTab("home")}
          >
            Home
          </button>
          <button
            className={
              "aiq-nav-item aiq-clickable" +
              (activeTab === "pattern" ? " aiq-nav-item--active" : "")
            }
            onClick={() => setActiveTab("pattern")}
          >
            Pattern
          </button>
          <button
            className={
              "aiq-nav-item aiq-clickable" +
              (activeTab === "vision" ? " aiq-nav-item--active" : "")
            }
            onClick={() => setActiveTab("vision")}
          >
            Vision
          </button>
          <button
            className={
              "aiq-nav-item aiq-clickable" +
              (activeTab === "tackle" ? " aiq-nav-item--active" : "")
            }
            onClick={() => setActiveTab("tackle")}
          >
            Tackle
          </button>
          <button
            className={
              "aiq-nav-item aiq-clickable" +
              (activeTab === "library" ? " aiq-nav-item--active" : "")
            }
            onClick={() => setActiveTab("library")}
          >
            Library
          </button>
        </nav>

        {/* ───────────────────────────────────────────────────────────────────── */}
        {/* D-023: Pins Sheet (UI-only) */}
        {pinsSheetOpen && (
          <div className="aiq-sheet-backdrop" onClick={() => setPinsSheetOpen(false)}>
            <div className="aiq-bottom-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="aiq-bottom-sheet__handle" />
              <div className="aiq-bottom-sheet__header">
                <div>
                  <div className="aiq-bottom-sheet__title">Pins</div>
                  <div className="aiq-bottom-sheet__subtitle">
                    Toggle layers (V1 shell — no pins rendered yet)
                  </div>
                </div>
                <button
                  className="aiq-bottom-sheet__close aiq-clickable"
                  onClick={() => setPinsSheetOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="aiq-bottom-sheet__body" style={{ display: "grid", gap: 12 }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 650 }}>Catch</div>
                    <div style={{ opacity: 0.75, fontSize: 12 }}>
                      Private memory pins (future)
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={showCatchPins}
                    onChange={(e) => setShowCatchPins(e.target.checked)}
                    aria-label="Toggle catch pins"
                  />
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 650 }}>Productive Spot</div>
                    <div style={{ opacity: 0.75, fontSize: 12 }}>
                      Quiet dots for your water (future)
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={showProductiveSpots}
                    onChange={(e) => setShowProductiveSpots(e.target.checked)}
                    aria-label="Toggle productive spot pins"
                  />
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 650 }}>Structural Note</div>
                    <div style={{ opacity: 0.75, fontSize: 12 }}>
                      Points, drop-offs, edges (future)
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={showStructuralNotes}
                    onChange={(e) => setShowStructuralNotes(e.target.checked)}
                    aria-label="Toggle structural note pins"
                  />
                </label>

                {/* D-023: No rendering yet. This line is just to confirm state changes during dev. */}
                <div style={{ opacity: 0.65, fontSize: 11 }}>
                  Enabled:{" "}
                  {[
                    showCatchPins && "Catch",
                    showProductiveSpots && "Productive Spot",
                    showStructuralNotes && "Structural Note",
                  ]
                    .filter(Boolean)
                    .join(" · ") || "None"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- Bottom Sheets by Tab --- */}

        {/* LAKE SEARCH */}
        {activeTab === "lakeSearch" && (
          <div className="aiq-sheet-backdrop" onClick={() => setActiveTab("home")}>
            <div className="aiq-bottom-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="aiq-bottom-sheet__handle" />
              <div className="aiq-bottom-sheet__header">
                <div>
                  <div className="aiq-bottom-sheet__title">Lake Search</div>
                  <div className="aiq-bottom-sheet__subtitle">
                    Set Home Lake (V1 stub list)
                  </div>
                </div>
                <button
                  className="aiq-bottom-sheet__close aiq-clickable"
                  onClick={() => setActiveTab("home")}
                >
                  ✕
                </button>
              </div>
              <div className="aiq-bottom-sheet__body">
                <LakeSearchSheet
                  current={homeLake}
                  onClose={() => setActiveTab("home")}
                  onSelectHomeLake={(lake) => {
                    setHomeLake(lake);
                    setRecenterKey((k) => k + 1);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* CONDITIONS */}
        {activeTab === "conditions" && (
          <div className="aiq-sheet-backdrop" onClick={() => setActiveTab("home")}>
            <div className="aiq-bottom-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="aiq-bottom-sheet__handle" />
              <div className="aiq-bottom-sheet__header">
                <div>
                  <div className="aiq-bottom-sheet__title">Conditions</div>
                  <div className="aiq-bottom-sheet__subtitle">
                    {lakeName} · Weather-only (Vision owns water clarity)
                  </div>
                </div>
                <button
                  className="aiq-bottom-sheet__close aiq-clickable"
                  onClick={() => setActiveTab("home")}
                >
                  ✕
                </button>
              </div>
              <div className="aiq-bottom-sheet__body">
                <ConditionsSheet lat={lakeLat} lon={lakeLon} lakeName={lakeName} />
              </div>
            </div>
          </div>
        )}

        {/* PATTERN (now minimal Pro flow) */}
        {activeTab === "pattern" && (
          <div className="aiq-sheet-backdrop" onClick={() => setActiveTab("home")}>
            <div className="aiq-bottom-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="aiq-bottom-sheet__handle" />
              <div className="aiq-bottom-sheet__header">
                <div>
                  <div className="aiq-bottom-sheet__title">Pattern of the Day</div>
                  <div className="aiq-bottom-sheet__subtitle">
                    {lakeName} · User-initiated generation
                  </div>
                </div>
                <button
                  className="aiq-bottom-sheet__close aiq-clickable"
                  onClick={() => setActiveTab("home")}
                >
                  ✕
                </button>
              </div>

              <div className="aiq-bottom-sheet__body" style={{ display: "grid", gap: 12 }}>
                {/* D-033 — Optional hint inputs (non-authoritative) */}
                <div style={{ display: "grid", gap: 8 }}>
                  <div style={{ opacity: 0.85, fontSize: 12 }}>
                    Optional hints (non-authoritative; empty payload still succeeds)
                  </div>

                  <div style={{ display: "grid", gap: 8 }}>
                    <input
                      value={hintClarity}
                      onChange={(e) => setHintClarity(e.target.value)}
                      placeholder="clarity (e.g. clear / stained / muddy)"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: 12,
                        border: "1px solid rgba(148, 163, 184, 0.35)",
                        background: "rgba(10, 12, 18, 0.6)",
                        color: "#e5e7eb",
                        outline: "none",
                      }}
                    />
                    <input
                      value={hintBottom}
                      onChange={(e) => setHintBottom(e.target.value)}
                      placeholder="bottom_composition (e.g. rock / sand / grass)"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: 12,
                        border: "1px solid rgba(148, 163, 184, 0.35)",
                        background: "rgba(10, 12, 18, 0.6)",
                        color: "#e5e7eb",
                        outline: "none",
                      }}
                    />
                    <input
                      value={hintDepthFt}
                      onChange={(e) => setHintDepthFt(e.target.value)}
                      placeholder="depth_ft (number; optional)"
                      inputMode="decimal"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: 12,
                        border: "1px solid rgba(148, 163, 184, 0.35)",
                        background: "rgba(10, 12, 18, 0.6)",
                        color: "#e5e7eb",
                        outline: "none",
                      }}
                    />
                    <input
                      value={hintForage}
                      onChange={(e) => setHintForage(e.target.value)}
                      placeholder="forage (e.g. shad / bluegill / craw)"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: 12,
                        border: "1px solid rgba(148, 163, 184, 0.35)",
                        background: "rgba(10, 12, 18, 0.6)",
                        color: "#e5e7eb",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                {/* D-032 — Generate Pattern (user initiated) */}
                <button
                  className="aiq-clickable"
                  onClick={handleGenerateProPattern}
                  disabled={proPatternLoading}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 12,
                    border: "1px solid rgba(148, 163, 184, 0.25)",
                    background: proPatternLoading
                      ? "rgba(56, 189, 248, 0.12)"
                      : "rgba(56, 189, 248, 0.18)",
                    color: "#e5e7eb",
                    fontWeight: 650,
                    cursor: proPatternLoading ? "not-allowed" : "pointer",
                  }}
                >
                  {proPatternLoading ? "Generating…" : "Generate Pattern"}
                </button>

                {/* D-035 — Safety states (loading handled above; error here) */}
                {proPatternError && (
                  <div
                    style={{
                      border: "1px solid rgba(248, 113, 113, 0.35)",
                      background: "rgba(127, 29, 29, 0.25)",
                      padding: "10px 12px",
                      borderRadius: 12,
                      color: "#fecaca",
                      fontSize: 12,
                      lineHeight: 1.4,
                    }}
                  >
                    <div style={{ fontWeight: 650 }}>Pattern error</div>
                    <div style={{ opacity: 0.9 }}>{proPatternError}</div>
                  </div>
                )}

                {/* D-032 — Minimal pattern card */}
                {proPatternResp && (
                  <div
                    style={{
                      border: "1px solid rgba(148, 163, 184, 0.25)",
                      background: "rgba(15, 23, 42, 0.55)",
                      padding: "12px 12px",
                      borderRadius: 14,
                      display: "grid",
                      gap: 8,
                    }}
                  >
                    <div style={{ fontSize: 12, opacity: 0.8 }}>
                      {proLastUpdated ? `Last updated: ${proLastUpdated}` : "Last updated: —"}
                    </div>

                    <div style={{ fontWeight: 750, fontSize: 14 }}>
                      {proPatternResp.featured_lure_name}
                    </div>
                    <div style={{ opacity: 0.9, fontSize: 12 }}>
                      <span style={{ fontWeight: 650 }}>Technique:</span>{" "}
                      {proPatternResp.primary_technique}
                    </div>
                    <div style={{ opacity: 0.92, fontSize: 12, lineHeight: 1.45 }}>
                      {proPatternResp.pattern_summary}
                    </div>

                    {/* Conditions row (render literal values; no reinterpretation) */}
                    <div
                      style={{
                        borderTop: "1px solid rgba(148, 163, 184, 0.18)",
                        paddingTop: 10,
                        display: "flex",
                        gap: 10,
                        flexWrap: "wrap",
                        fontSize: 12,
                        opacity: 0.9,
                      }}
                    >
                      <div>
                        <span style={{ opacity: 0.75 }}>temp_f:</span>{" "}
                        {proPatternResp.conditions?.temp_f ?? "—"}
                      </div>
                      <div>
                        <span style={{ opacity: 0.75 }}>wind_speed:</span>{" "}
                        {proPatternResp.conditions?.wind_speed ?? "—"}
                      </div>
                      <div>
                        <span style={{ opacity: 0.75 }}>sky_condition:</span>{" "}
                        {proPatternResp.conditions?.sky_condition ?? "—"}
                      </div>
                    </div>
                  </div>
                )}

                {/* D-034 — Debug Weather Panel (dev-only; literal rendering) */}
                <div
                  style={{
                    border: "1px solid rgba(148, 163, 184, 0.18)",
                    background: "rgba(10, 12, 18, 0.35)",
                    padding: "12px 12px",
                    borderRadius: 14,
                    display: "grid",
                    gap: 10,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 650 }}>Debug Weather (Dev)</div>
                      <div style={{ opacity: 0.75, fontSize: 12 }}>
                        GET /debug/weather?location_name=Test Lake
                      </div>
                    </div>
                    <button
                      className="aiq-clickable"
                      onClick={handleFetchDebugWeather}
                      disabled={debugWeatherLoading}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 12,
                        border: "1px solid rgba(148, 163, 184, 0.25)",
                        background: "rgba(15, 23, 42, 0.6)",
                        color: "#e5e7eb",
                        cursor: debugWeatherLoading ? "not-allowed" : "pointer",
                      }}
                    >
                      {debugWeatherLoading ? "Loading…" : "Refresh"}
                    </button>
                  </div>

                  {debugWeatherError && (
                    <div
                      style={{
                        border: "1px solid rgba(248, 113, 113, 0.35)",
                        background: "rgba(127, 29, 29, 0.25)",
                        padding: "10px 12px",
                        borderRadius: 12,
                        color: "#fecaca",
                        fontSize: 12,
                        lineHeight: 1.4,
                      }}
                    >
                      <div style={{ fontWeight: 650 }}>Debug weather error</div>
                      <div style={{ opacity: 0.9 }}>{debugWeatherError}</div>
                    </div>
                  )}

                  <div style={{ display: "grid", gap: 6, fontSize: 12, opacity: 0.9 }}>
                    <div>
                      <span style={{ opacity: 0.75 }}>temp_f:</span> {debugWeather?.temp_f ?? "—"}
                    </div>
                    <div>
                      <span style={{ opacity: 0.75 }}>wind_speed:</span> {debugWeather?.wind_speed ?? "—"}
                    </div>
                    <div>
                      <span style={{ opacity: 0.75 }}>sky_condition:</span> {debugWeather?.sky_condition ?? "—"}
                    </div>
                    <div>
                      <span style={{ opacity: 0.75 }}>timestamp:</span>{" "}
                      {debugWeather?.timestamp ?? "—"}
                    </div>
                  </div>
                </div>

                {/* NOTE: No /pattern/generate usage here. */}
              </div>
            </div>
          </div>
        )}

        {/* VISION/TACKLE/LIBRARY stubs remain as-is */}
      </div>
    </div>
  );
}

export default App;