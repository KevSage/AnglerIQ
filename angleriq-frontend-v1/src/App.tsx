// src/App.tsx
import { useEffect, useState } from "react";
import { HomeMap } from "./components/map/HomeMap";
import { ConditionsSheet } from "./components/sheets/ConditionsSheet";
import "./App.css";
import { LakeSearchSheet } from "./components/sheets/LakeSearchSheet";
import type { HomeLake } from "./types/Lake";
import { LakeSoftLockPrompt } from "./components/LakeSoftLockPrompt";

type PatternSummary = {
  lureName: string;
  target: string;
};

type NavTab = "home" | "pattern" | "vision" | "tackle" | "library" | "conditions" | "lakeSearch";

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

function App() {
  const [recenterKey, setRecenterKey] = useState(0);

  const [homeLake, setHomeLake] = useState<HomeLake>(() => {
    const saved = safeParseHomeLake(localStorage.getItem(LS_HOME_LAKE_KEY));
    return saved ?? DEFAULT_HOME_LAKE;
  });

  useEffect(() => {
    localStorage.setItem(LS_HOME_LAKE_KEY, JSON.stringify(homeLake));
  }, [homeLake]);

  const [pattern] = useState<PatternSummary>({
    lureName: "Deep Crankbait",
    target: "First break off main points",
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
  // - Visible toggle UI
  // - No markers rendered
  // - No persistence
  // - No creation/edit flows
  // - No backend wiring
  // ────────────────────────────────────────────────────────────────────────────
  const [pinsSheetOpen, setPinsSheetOpen] = useState<boolean>(false);
  const [showCatchPins, setShowCatchPins] = useState<boolean>(true);
  const [showProductiveSpots, setShowProductiveSpots] = useState<boolean>(true);
  const [showStructuralNotes, setShowStructuralNotes] = useState<boolean>(true);

  return (
    <div className="aiq-app">
      {/* Map Layer */}
      <div className="aiq-app__map-layer">
        <HomeMap recenterKey={recenterKey} centerLat={lakeLat} centerLon={lakeLon} zoom={lakeZoom} />
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
            className={"aiq-nav-item aiq-clickable" + (activeTab === "home" ? " aiq-nav-item--active" : "")}
            onClick={() => setActiveTab("home")}
          >
            Home
          </button>
          <button
            className={"aiq-nav-item aiq-clickable" + (activeTab === "pattern" ? " aiq-nav-item--active" : "")}
            onClick={() => setActiveTab("pattern")}
          >
            Pattern
          </button>
          <button
            className={"aiq-nav-item aiq-clickable" + (activeTab === "vision" ? " aiq-nav-item--active" : "")}
            onClick={() => setActiveTab("vision")}
          >
            Vision
          </button>
          <button
            className={"aiq-nav-item aiq-clickable" + (activeTab === "tackle" ? " aiq-nav-item--active" : "")}
            onClick={() => setActiveTab("tackle")}
          >
            Tackle
          </button>
          <button
            className={"aiq-nav-item aiq-clickable" + (activeTab === "library" ? " aiq-nav-item--active" : "")}
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
                  <div className="aiq-bottom-sheet__subtitle">Toggle layers (V1 shell — no pins rendered yet)</div>
                </div>
                <button className="aiq-bottom-sheet__close aiq-clickable" onClick={() => setPinsSheetOpen(false)}>
                  ✕
                </button>
              </div>

              <div className="aiq-bottom-sheet__body" style={{ display: "grid", gap: 12 }}>
                <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 650 }}>Catch</div>
                    <div style={{ opacity: 0.75, fontSize: 12 }}>Private memory pins (future)</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={showCatchPins}
                    onChange={(e) => setShowCatchPins(e.target.checked)}
                    aria-label="Toggle catch pins"
                  />
                </label>

                <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 650 }}>Productive Spot</div>
                    <div style={{ opacity: 0.75, fontSize: 12 }}>Quiet dots for your water (future)</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={showProductiveSpots}
                    onChange={(e) => setShowProductiveSpots(e.target.checked)}
                    aria-label="Toggle productive spot pins"
                  />
                </label>

                <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 650 }}>Structural Note</div>
                    <div style={{ opacity: 0.75, fontSize: 12 }}>Points, drop-offs, edges (future)</div>
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
                  {[showCatchPins && "Catch", showProductiveSpots && "Productive Spot", showStructuralNotes && "Structural Note"]
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
                  <div className="aiq-bottom-sheet__subtitle">Set Home Lake (V1 stub list)</div>
                </div>
                <button className="aiq-bottom-sheet__close aiq-clickable" onClick={() => setActiveTab("home")}>
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
                <button className="aiq-bottom-sheet__close aiq-clickable" onClick={() => setActiveTab("home")}>
                  ✕
                </button>
              </div>
              <div className="aiq-bottom-sheet__body">
                <ConditionsSheet lat={lakeLat} lon={lakeLon} lakeName={lakeName} />
              </div>
            </div>
          </div>
        )}

        {/* PATTERN (stub) */}
        {activeTab === "pattern" && (
          <div className="aiq-sheet-backdrop" onClick={() => setActiveTab("home")}>
            <div className="aiq-bottom-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="aiq-bottom-sheet__handle" />
              <div className="aiq-bottom-sheet__header">
                <div>
                  <div className="aiq-bottom-sheet__title">Pattern of the Day</div>
                  <div className="aiq-bottom-sheet__subtitle">
                    {pattern.lureName} · {pattern.target}
                  </div>
                </div>
                <button className="aiq-bottom-sheet__close aiq-clickable" onClick={() => setActiveTab("home")}>
                  ✕
                </button>
              </div>
              <div className="aiq-bottom-sheet__body">Pattern view stub (gameplan + adjustments later).</div>
            </div>
          </div>
        )}

        {/* VISION/TACKLE/LIBRARY stubs remain as-is */}
      </div>
    </div>
  );
}

export default App;