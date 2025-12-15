// src/lib/api.ts
// Canonical API client (D-031)
// - One base URL
// - One request helper
// - Typed contracts for tonight’s endpoints
// - Keeps Vision upload using same base URL (no drift)

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

/**
 * Minimal fetch wrapper for JSON endpoints.
 * - Always sends/accepts JSON
 * - Throws on non-2xx with status
 */
async function requestJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  return (await res.json()) as T;
}

// --------------------
// Contracts (D-031)
// --------------------

export type WeatherContext = {
  temp_f: number;
  wind_speed: number;
  sky_condition: string;
  timestamp: string; // ISO string
};

export type ProPatternRequest = {
  latitude?: number | null;
  longitude?: number | null;
  location_name?: string | null;

  clarity?: string | null;
  bottom_composition?: string | null;
  depth_ft?: number | null;
  forage?: string[] | null;
};

// NOTE: Do NOT model clarity_estimate here (weather-only invariant).
export type ProPatternResponse = {
  phase: string;
  depth_zone: string;

  recommended_lures: string[];
  recommended_targets: string[];
  strategy_tips: string[];
  color_recommendations: string[];

  lure_setups: unknown[]; // can type later if needed

  notes: string;

  // UI-friendly summary fields
  primary_technique: string;
  featured_lure_name: string;
  featured_lure_family: string;
  pattern_summary: string;

  conditions: Record<string, unknown> & {
    tier: string;
    temp_f?: number;
    wind_speed?: number;
    sky_condition?: string;
    timestamp?: string;

    // If present, FE can use this as identity (display-only tonight)
    snapshot_hash?: string;
  };
};

// --------------------
// Canonical calls
// --------------------

export function getDebugWeather(location_name: string) {
  const q = encodeURIComponent(location_name);
  return requestJson<WeatherContext>(`/debug/weather?location_name=${q}`);
}

export function postProPattern(payload: ProPatternRequest = {}) {
  return requestJson<ProPatternResponse>("/pattern/pro", {
    method: "POST",
    body: JSON.stringify(payload ?? {}),
  });
}

// --------------------
// Vision upload (kept, but unifies base URL)
// --------------------

export type VisionAnalysis = {
  depth_ft: number | null;
  bottom_hardness: string | null;
  bait_present: boolean | null;
  fish_present: boolean | null;
  arch_count: number | null;
  activity_level: string | null;
  worth_fishing: boolean | null;
  stop_or_keep_moving: "stop" | "keep_moving" | null;
  raw_attributes: Record<string, unknown>;
};

export async function uploadVisionImage(file: File): Promise<VisionAnalysis> {
  const formData = new FormData();
  formData.append("file", file);

  const resp = await fetch(`${API_BASE_URL}/vision/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!resp.ok) {
    throw new Error(`Vision analyze failed: ${resp.status}`);
  }

  return (await resp.json()) as VisionAnalysis;
}