// src/core/api/conditions.ts

// Frontend invariant:
// - "Conditions" is weather-only.
// - Do NOT model clarity here (clarity is Vision/local truth elsewhere).

export type ConditionsDTO = {
  temp_f?: number | null;
  wind_mph?: number | null;
  pressure_trend?: string | null;
  cloud_cover?: string | null;
  // clarity_estimate intentionally omitted to prevent drift
  season_phase?: string | null;
};

export type ConditionsViewModel = {
  temp_f: number | null;
  wind_speed: number | null; // normalized name for UI alignment
  cloud_cover: string | null;
  pressure_trend: string | null;
  season_phase: string | null;
};

import { API_BASE_URL } from "../../lib/api";

const API_BASE = API_BASE_URL;

export async function fetchConditionsByLakeCenter(
  lat: number,
  lon: number
): Promise<ConditionsDTO> {
  const url = `${API_BASE}/conditions?lat=${encodeURIComponent(
    lat
  )}&lon=${encodeURIComponent(lon)}`;

  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Conditions fetch failed (${resp.status})`);
  return (await resp.json()) as ConditionsDTO;
}

// Optional helper for UI consumers that want consistent naming.
// Does NOT infer anything; pure field rename/defaulting.
export function toConditionsViewModel(dto: ConditionsDTO): ConditionsViewModel {
  return {
    temp_f: dto.temp_f ?? null,
    wind_speed: dto.wind_mph ?? null,
    cloud_cover: dto.cloud_cover ?? null,
    pressure_trend: dto.pressure_trend ?? null,
    season_phase: dto.season_phase ?? null,
  };
}