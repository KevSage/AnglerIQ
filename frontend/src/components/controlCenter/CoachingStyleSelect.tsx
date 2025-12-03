// src/components/controlCenter/CoachingStyleSelect.tsx
import React from "react";
import {
  useUserSettings,
  CoachingStyleValue,
} from "@/context/UserSettingsContext";

const COACHING_STYLE_LABELS: Record<CoachingStyleValue, string> = {
  calm_guide: "Calm Guide",
  old_school_pro: "Old School Pro",
  data_analyst: "Data Analyst",
  hype_coach: "Hype Coach",
  minimalist: "Minimalist",
};

export const CoachingStyleSelect: React.FC = () => {
  const { settings, updateSettings } = useUserSettings();

  const handleChange = (value: CoachingStyleValue) => {
    updateSettings({ coachingStyle: value });
  };

  const options: CoachingStyleValue[] = [
    "calm_guide",
    "old_school_pro",
    "data_analyst",
    "hype_coach",
    "minimalist",
  ];

  return (
    <section className="space-y-2">
      <h2 className="text-sm font-medium text-gray-100">Coaching Style</h2>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = settings.coachingStyle === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleChange(option)}
              className={[
                "rounded-full border px-3 py-1 text-xs",
                selected
                  ? "border-accent bg-accent text-black"
                  : "border-outline-subtle text-gray-300",
              ].join(" ")}
            >
              {COACHING_STYLE_LABELS[option]}
            </button>
          );
        })}
      </div>
    </section>
  );
};
