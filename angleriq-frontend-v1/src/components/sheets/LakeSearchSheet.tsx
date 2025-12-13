import { useMemo, useState } from "react";
import type { HomeLake } from "../../types/Lake";

type Props = {
  current?: HomeLake;
  onSelectHomeLake: (lake: HomeLake) => void;
  onClose: () => void;
};

const DEFAULT_VIEW_ZOOM = 11;

// V1 stub list (replace later with real search + map select)
const DEV_LAKES: HomeLake[] = [
  { name: "Lake Lanier (Dev)", lat: 34.1986, lon: -84.0167, zoom: DEFAULT_VIEW_ZOOM },
  { name: "Allatoona (Dev)", lat: 34.1626, lon: -84.7066, zoom: DEFAULT_VIEW_ZOOM },
  { name: "Hartwell (Dev)", lat: 34.4758, lon: -82.8899, zoom: DEFAULT_VIEW_ZOOM },
  { name: "Home Lake (Dev)", lat: 33.75, lon: -84.39, zoom: DEFAULT_VIEW_ZOOM },
];

export function LakeSearchSheet({ current, onSelectHomeLake, onClose }: Props) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DEV_LAKES;
    return DEV_LAKES.filter((l) => l.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ opacity: 0.85 }}>Search saved waters (V1 stub)</div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name…"
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

      <div style={{ display: "grid", gap: 8 }}>
        {results.map((lake) => {
          const isCurrent =
            current &&
            lake.name === current.name &&
            lake.lat === current.lat &&
            lake.lon === current.lon &&
            lake.zoom === current.zoom;

          return (
            <button
              key={`${lake.name}-${lake.lat}-${lake.lon}-${lake.zoom}`}
              onClick={() => {
                onSelectHomeLake(lake);
                onClose();
              }}
              style={{
                textAlign: "left",
                padding: "12px 12px",
                borderRadius: 14,
                border: "1px solid rgba(148, 163, 184, 0.25)",
                background: isCurrent
                  ? "rgba(56, 189, 248, 0.18)"
                  : "rgba(15, 23, 42, 0.55)",
                color: "#e5e7eb",
              }}
            >
              <div style={{ fontWeight: 650 }}>{lake.name}</div>
              <div style={{ opacity: 0.75, fontSize: 12 }}>
                {lake.lat.toFixed(4)}, {lake.lon.toFixed(4)} · z{lake.zoom.toFixed(1)}
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={onClose}
        style={{
          padding: "10px 12px",
          borderRadius: 12,
          border: "1px solid rgba(148, 163, 184, 0.25)",
          background: "rgba(15, 23, 42, 0.6)",
          color: "#e5e7eb",
        }}
      >
        Close
      </button>
    </div>
  );
}