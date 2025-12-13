export type ConditionsDTO = {
  temp_f?: number | null;
  wind_mph?: number | null;
  pressure_trend?: string | null;
  cloud_cover?: string | null;
  clarity_estimate?: string | null;
  season_phase?: string | null;
};

const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.toString() || "http://localhost:8000";

export async function fetchConditionsByLakeCenter(lat: number, lon: number) {
  const url = `${API_BASE}/conditions?lat=${encodeURIComponent(
    lat
  )}&lon=${encodeURIComponent(lon)}`;

  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Conditions fetch failed (${resp.status})`);
  return (await resp.json()) as ConditionsDTO;
}
