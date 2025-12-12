import { TemperaturePill } from "./components/TemperaturePill";
import { PatternChip } from "./components/PatternChip";
import { SageOrb } from "./components/SageOrb";
import { CatchPinsToggle } from "./components/CatchPinsToggle";
import { RecenterButton } from "./components/RecenterButton";
import { BottomNav } from "../../core/navigation/BottomNav";
import { useState, useMemo } from "react";
import Map, { ViewState } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string;

export function HomeMapPage() {
  const [homeLake, setHomeLake] = useState<HomeLake | null>(null);
  const [hasPattern, setHasPattern] = useState(false);
  const [catchPinsEnabled, setCatchPinsEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("home");

  const [viewState, setViewState] = useState<ViewState>({
    longitude: homeLake?.center[0] ?? INITIAL_REGION_CENTER[0],
    latitude: homeLake?.center[1] ?? INITIAL_REGION_CENTER[1],
    zoom: homeLake?.defaultZoom ?? INITIAL_REGION_ZOOM,
    bearing: 0,
    pitch: 0,
  });

  const [hasDriftedFromLake, setHasDriftedFromLake] = useState(false);

  const homeLakeView = useMemo(() => {
    if (!homeLake) return null;
    return {
      longitude: homeLake.center[0],
      latitude: homeLake.center[1],
      zoom: homeLake.defaultZoom,
    };
  }, [homeLake]);

  const handleMove = (evt: { viewState: ViewState }) => {
    const next = evt.viewState;
    setViewState(next);

    if (homeLakeView) {
      const dx = Math.abs(next.longitude - homeLakeView.longitude);
      const dy = Math.abs(next.latitude - homeLakeView.latitude);
      const dz = Math.abs(next.zoom - homeLakeView.zoom);
      const DRIFT_THRESHOLD = 0.1;
      setHasDriftedFromLake(dx + dy + dz > DRIFT_THRESHOLD);
    }
  };

  const recenterOnLake = () => {
    if (!homeLakeView) return;
    setViewState(prev => ({
      ...prev,
      longitude: homeLakeView.longitude,
      latitude: homeLakeView.latitude,
      zoom: homeLakeView.zoom,
      bearing: 0,
      pitch: 0,
    }));
    setHasDriftedFromLake(false);
  };

  return (
    <div className="relative h-screen w-screen bg-black">
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={viewState}
        {...viewState}
        onMove={handleMove}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        dragRotate={false}
        touchZoomRotate={false}
        pitchWithRotate={false}
        attributionControl={false}
        style={{ width: "100%", height: "100%" }}
      />

      {/* Top row: temp pill, pattern chip, pins toggle */}
      <div className="pointer-events-none absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
        <div className="pointer-events-auto">
          <TemperaturePill />
        </div>

        <div className="pointer-events-auto flex-1 flex justify-center">
          <PatternChip hasPattern={hasPattern} />
        </div>

        <div className="pointer-events-auto flex flex-col items-end gap-2">
          <CatchPinsToggle
            enabled={catchPinsEnabled}
            onToggle={() => setCatchPinsEnabled(v => !v)}
          />
          <RecenterButton visible={hasDriftedFromLake && !!homeLake} onPress={recenterOnLake} />
        </div>
      </div>

      {/* SAGE Orb */}
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <div className="pointer-events-auto">
          <SageOrb onQuickOpen={() => setActiveTab("sage" as any)} />
        </div>
      </div>

      {/* Bottom nav */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="pointer-events-auto">
          <BottomNav active={activeTab as any} onChange={setActiveTab as any} />
        </div>
      </div>
    </div>
  );
}