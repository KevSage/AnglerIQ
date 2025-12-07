// src/components/home/ConditionsPanel.tsx

import React from "react";
import {
  ThermometerSun,
  SunMedium,
  Wind,
  Cloud,
  Droplet,
  Gauge,
  Sprout,
} from "lucide-react";

type Conditions = {
  temp_f?: number | null;
  feels_like_f?: number | null;
  wind_mph?: number | null;
  pressure_trend?: string | null;
  cloud_cover?: string | null;
  clarity_estimate?: string | null;
  season_phase?: string | null;
};

type Props = {
  conditions: Conditions;
};

const ConditionsPanel: React.FC<Props> = ({ conditions }) => {
  const temp = conditions?.temp_f ?? null;
  const feelsLike =
    conditions?.feels_like_f != null
      ? conditions.feels_like_f
      : conditions?.temp_f != null
      ? conditions.temp_f
      : null;
  const windMph = conditions?.wind_mph ?? null;
  const pressure = conditions?.pressure_trend ?? null;
  const cloudCover = conditions?.cloud_cover ?? null;
  const clarity = conditions?.clarity_estimate ?? null;
  const season = conditions?.season_phase ?? null;

  const pieces: string[] = [];
  if (temp != null) pieces.push(`${temp}°F`);
  if (windMph != null) pieces.push(`${windMph} mph wind`);
  if (cloudCover) pieces.push(cloudCover.toLowerCase());
  if (clarity) pieces.push(`${clarity.toLowerCase()} water`);

  const blurbPrefix =
    pieces.length > 0
      ? `${pieces.join(", ")}.`
      : "Today’s conditions are stable.";
  const blurb =
    blurbPrefix +
    " All of this is already built into today’s pattern so you don’t have to chase the weather app.";

  const items = [
    {
      key: "feels_like",
      label: "Feels Like",
      icon: SunMedium,
      value: feelsLike != null ? `${feelsLike}°F` : "—",
      circleClass: "bg-[#140915]",
      iconClass: "text-[#ff89c0]",
    },
    {
      key: "pressure",
      label: "Pressure",
      icon: Gauge,
      value: pressure ?? "—",
      circleClass: "bg-[#051713]",
      iconClass: "text-[#4ade80]",
    },
    {
      key: "clarity",
      label: "Clarity",
      icon: Droplet,
      value: clarity ?? "—",
      circleClass: "bg-[#041623]",
      iconClass: "text-[#38bdf8]",
    },
    {
      key: "wind",
      label: "Wind",
      icon: Wind,
      value: windMph != null ? `${windMph} mph` : "—",
      circleClass: "bg-[#021622]",
      iconClass: "text-[#22d3ee]",
    },
    {
      key: "cloud_cover",
      label: "Cloud Cover",
      icon: Cloud,
      value: cloudCover ?? "—",
      circleClass: "bg-[#05091c]",
      iconClass: "text-slate-100",
    },
    {
      key: "season_phase",
      label: "Season Phase",
      icon: Sprout,
      value: season ?? "—",
      circleClass: "bg-[#041706]",
      iconClass: "text-[#a3e635]",
    },
  ];

  return (
    <section className="mb-4 rounded-[28px] border border-slate-800/80 bg-[radial-gradient(circle_at_top,_#050814,_#020308)] px-4 py-4 sm:px-6 sm:py-5 shadow-[0_18px_80px_rgba(15,23,42,0.85)]">
      <div className="rounded-[24px] border border-slate-800/80 bg-gradient-to-br from-slate-950/80 via-slate-950/40 to-slate-950/90 px-4 py-4 sm:px-6 sm:py-5">
        {/* Header */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          Today&apos;s Conditions
        </p>

        {/* Top row: temp hero + outlook */}
        <div className="mt-3 flex flex-col gap-4 min-[540px]:flex-row min-[540px]:items-start">
          {/* Temperature */}
          <div className="flex w-full max-w-sm flex-row items-center gap-3 min-[540px]:w-1/3 min-[540px]:items-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#06081e]">
              <ThermometerSun className="h-6 w-6 text-amber-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Temperature
              </span>
              <span className="text-3xl font-semibold leading-tight text-slate-50 sm:text-4xl">
                {temp != null ? `${temp}°F` : "—"}
              </span>
            </div>
          </div>

          {/* Outlook */}
          <div className="w-full min-[540px]:w-2/3 min-[540px]:pl-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Conditions Outlook
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-slate-300">
              {blurb}
            </p>
          </div>
        </div>

        {/* Bottom metrics grid */}
        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 min-[600px]:grid-cols-3">
          {items.map(
            ({ key, label, icon: Icon, value, circleClass, iconClass }) => (
              <div key={key} className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${circleClass}`}
                >
                  <Icon className={`h-5 w-5 ${iconClass}`} />
                </div>
                <div className="leading-tight">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    {label}
                  </p>
                  <p className="mt-0.5 text-[13px] text-slate-100">{value}</p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default ConditionsPanel;
