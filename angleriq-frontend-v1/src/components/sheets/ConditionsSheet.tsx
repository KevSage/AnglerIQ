import { useEffect, useState } from "react";
import type { ConditionsDTO } from "../../core/api/conditions";
import { fetchConditionsByLakeCenter } from "../../core/api/conditions";
export type ConditionsSheetProps = {
  lat: number;
  lon: number;
  lakeName?: string;
};

export function ConditionsSheet({ lat, lon, lakeName }: ConditionsSheetProps) {
  const [data, setData] = useState<ConditionsDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchConditionsByLakeCenter(lat, lon);
        if (!cancelled) setData(result);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load conditions");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [lat, lon]);

  if (loading) return <div>Loading conditions…</div>;
  if (error) return <div>Conditions unavailable: {error}</div>;
  if (!data) return <div>No conditions returned.</div>;

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div style={{ opacity: 0.8 }}>
        {lakeName ? `${lakeName} · ` : ""}
        lake-centered conditions
      </div>

      <div>Temp: {data.temp_f ?? "—"}°F</div>
      <div>Wind: {data.wind_mph ?? "—"} mph</div>
      <div>Clouds: {data.cloud_cover ?? "—"}</div>
      <div>Pressure: {data.pressure_trend ?? "—"}</div>

      <div style={{ opacity: 0.7 }}>Water clarity: Vision-only</div>
    </div>
  );
}