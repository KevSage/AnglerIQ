import { useState } from "react";
import { HomeMap } from "./components/map/HomeMap";
import { ConditionsSheet } from "./components/sheets/ConditionsSheet";
import "./App.css";

type PatternSummary = {
  lureName: string;
  target: string;
};

// Canon: 5-tab bottom nav only
type NavTab = "home" | "pattern" | "vision" | "tackle" | "library";

// Canon: Conditions is NOT a nav tab; it is opened from temp pill only
type ActiveView = NavTab | "conditions";

export default function App() {
  const [recenterKey, setRecenterKey] = useState(0);

  const [pattern] = useState<PatternSummary>({
    lureName: "Deep Crankbait",
    target: "First break off main points",
  });

  const [temperature] = useState<string>("48°F");

  const [activeView, setActiveView] = useState<ActiveView>("home");

  return (
    <div className="aiq-app">
      {/* Map Layer */}
      <div className="aiq-app__map-layer">
        <HomeMap recenterKey={recenterKey} />
      </div>

      {/* UI Layer */}
      <div className="aiq-app__ui-layer">
        {/* Top bar */}
        <div className="aiq-top-bar">
          {/* Temp pill opens Conditions (not a nav tab) */}
          <button
            className="aiq-temp-pill aiq-clickable"
            onClick={() => setActiveView("conditions")}
            aria-label="Open Conditions"
          >
            {temperature}
          </button>

          {/* Pattern chip opens Pattern sheet */}
          <button
            className="aiq-pattern-chip aiq-clickable"
            onClick={() => setActiveView("pattern")}
            aria-label="Open Pattern"
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

        {/* SAGE orb (stub action for now) */}
        <button
          className="aiq-sage-orb aiq-clickable"
          onClick={() => {
            console.log("SAGE orb tapped → SAGE overlay later");
            setActiveView("pattern");
          }}
          aria-label="Open SAGE"
        >
          S
        </button>

        {/* Bottom nav (5 tabs only) */}
        <nav className="aiq-bottom-nav aiq-clickable" aria-label="Bottom navigation">
          <button
            className={
              "aiq-nav-item aiq-clickable" +
              (activeView === "home" ? " aiq-nav-item--active" : "")
            }
            onClick={() => setActiveView("home")}
          >
            Home
          </button>

          <button
            className={
              "aiq-nav-item aiq-clickable" +
              (activeView === "pattern" ? " aiq-nav-item--active" : "")
            }
            onClick={() => setActiveView("pattern")}
          >
            Pattern
          </button>

          <button
            className={
              "aiq-nav-item aiq-clickable" +
              (activeView === "vision" ? " aiq-nav-item--active" : "")
            }
            onClick={() => setActiveView("vision")}
          >
            Vision
          </button>

          <button
            className={
              "aiq-nav-item aiq-clickable" +
              (activeView === "tackle" ? " aiq-nav-item--active" : "")
            }
            onClick={() => setActiveView("tackle")}
          >
            Tackle
          </button>

          <button
            className={
              "aiq-nav-item aiq-clickable" +
              (activeView === "library" ? " aiq-nav-item--active" : "")
            }
            onClick={() => setActiveView("library")}
          >
            Library
          </button>
        </nav>

        {/* ---------- Bottom Sheets by View ---------- */}

        {/* PATTERN */}
        {activeView === "pattern" && (
          <div className="aiq-sheet-backdrop" onClick={() => setActiveView("home")}>
            <div className="aiq-bottom-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="aiq-bottom-sheet__handle" />

              <div className="aiq-bottom-sheet__header">
                <div>
                  <div className="aiq-bottom-sheet__title">Pattern of the Day</div>
                  <div className="aiq-bottom-sheet__subtitle">
                    {pattern.lureName} · {pattern.target}
                  </div>
                </div>
                <button
                  className="aiq-bottom-sheet__close aiq-clickable"
                  onClick={() => setActiveView("home")}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="aiq-bottom-sheet__body">
                Today&apos;s pattern focuses on a <strong>{pattern.lureName}</strong>{" "}
                targeting <strong>{pattern.target}</strong>. This view will later show
                technique, gameplan, and adjustments in a calm, structured layout.
              </div>
            </div>
          </div>
        )}

        {/* CONDITIONS (temp-pill only) */}
        {activeView === "conditions" && (
          <div className="aiq-sheet-backdrop" onClick={() => setActiveView("home")}>
            <div className="aiq-bottom-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="aiq-bottom-sheet__handle" />

              <div className="aiq-bottom-sheet__header">
                <div>
                  <div className="aiq-bottom-sheet__title">Conditions</div>
                  <div className="aiq-bottom-sheet__subtitle">
                    Weather-only (Vision owns water clarity)
                  </div>
                </div>
                <button
                  className="aiq-bottom-sheet__close aiq-clickable"
                  onClick={() => setActiveView("home")}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="aiq-bottom-sheet__body">
                <ConditionsSheet />
              </div>
            </div>
          </div>
        )}

        {/* VISION (stub) */}
        {activeView === "vision" && (
          <div className="aiq-sheet-backdrop" onClick={() => setActiveView("home")}>
            <div className="aiq-bottom-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="aiq-bottom-sheet__handle" />

              <div className="aiq-bottom-sheet__header">
                <div>
                  <div className="aiq-bottom-sheet__title">Vision Intelligence</div>
                  <div className="aiq-bottom-sheet__subtitle">
                    Local clarity lab (uploads & analysis live here later)
                  </div>
                </div>
                <button
                  className="aiq-bottom-sheet__close aiq-clickable"
                  onClick={() => setActiveView("home")}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="aiq-bottom-sheet__body">
                This is the Vision Lab entry point. In V1, this will expand into a
                full-screen analysis view with Surface, Subsurface, and Vision tabs,
                driving pattern regeneration and dynamic lure color.
              </div>
            </div>
          </div>
        )}

        {/* TACKLE (stub) */}
        {activeView === "tackle" && (
          <div className="aiq-sheet-backdrop" onClick={() => setActiveView("home")}>
            <div className="aiq-bottom-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="aiq-bottom-sheet__handle" />

              <div className="aiq-bottom-sheet__header">
                <div>
                  <div className="aiq-bottom-sheet__title">Tacklebox</div>
                  <div className="aiq-bottom-sheet__subtitle">
                    Your core lure classes (no color variants clutter)
                  </div>
                </div>
                <button
                  className="aiq-bottom-sheet__close aiq-clickable"
                  onClick={() => setActiveView("home")}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="aiq-bottom-sheet__body">
                Long-press flows live here:
                <ul>
                  <li>Add to Tacklebox → pick color</li>
                  <li>View in Lure Library</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* LIBRARY (stub) */}
        {activeView === "library" && (
          <div className="aiq-sheet-backdrop" onClick={() => setActiveView("home")}>
            <div className="aiq-bottom-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="aiq-bottom-sheet__handle" />

              <div className="aiq-bottom-sheet__header">
                <div>
                  <div className="aiq-bottom-sheet__title">Library</div>
                  <div className="aiq-bottom-sheet__subtitle">
                    Lure Library · Technique Library
                  </div>
                </div>
                <button
                  className="aiq-bottom-sheet__close aiq-clickable"
                  onClick={() => setActiveView("home")}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="aiq-bottom-sheet__body">
                Two-way navigation is canon:
                <ul>
                  <li>Lure → open in Tacklebox</li>
                  <li>Tacklebox item → view in Library</li>
                  <li>Technique → shows applicable lures → jump to either</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}