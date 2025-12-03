// src/components/controlCenter/ExperienceLevelSelect.tsx
import React from "react";
import {
  useUserSettings,
  ExperienceLevel,
} from "@/context/UserSettingsContext";

export const ExperienceLevelSelect: React.FC = () => {
  const { settings, updateSettings } = useUserSettings();

  const handleChange = (value: ExperienceLevel) => {
    updateSettings({ experienceLevel: value });
  };

  const options: ExperienceLevel[] = [
    "general",
    "beginner",
    "intermediate",
    "advanced",
  ];

  return (
    <section className="space-y-2">
      <h2 className="text-sm font-medium text-gray-100">Experience Level</h2>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = settings.experienceLevel === option;
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
              {option}
            </button>
          );
        })}
      </div>
    </section>
  );
};
