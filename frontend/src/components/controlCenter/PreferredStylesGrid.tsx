// src/components/controlCenter/PreferredStylesGrid.tsx
import React from "react";
import {
  useUserSettings,
  PreferredStyleValue,
} from "@/context/UserSettingsContext";

const PREFERRED_OPTIONS: PreferredStyleValue[] = [
  "finesse",
  "power",
  "moving baits",
  "bottom contact",
  "topwater",
];

export const PreferredStylesGrid: React.FC = () => {
  const { settings, updateSettings } = useUserSettings();

  const toggleStyle = (style: PreferredStyleValue) => {
    const exists = settings.preferredStyles.includes(style);
    const next = exists
      ? settings.preferredStyles.filter((s) => s !== style)
      : [...settings.preferredStyles, style];

    updateSettings({ preferredStyles: next });
  };

  return (
    <section className="space-y-2">
      <h2 className="text-sm font-medium text-gray-100">Preferred Styles</h2>
      <div className="flex flex-wrap gap-2">
        {PREFERRED_OPTIONS.map((style) => {
          const selected = settings.preferredStyles.includes(style);
          return (
            <button
              key={style}
              type="button"
              onClick={() => toggleStyle(style)}
              className={[
                "rounded-full border px-3 py-1 text-xs",
                selected
                  ? "border-accent bg-accent text-black"
                  : "border-outline-subtle text-gray-300",
              ].join(" ")}
            >
              {style}
            </button>
          );
        })}
      </div>
    </section>
  );
};
