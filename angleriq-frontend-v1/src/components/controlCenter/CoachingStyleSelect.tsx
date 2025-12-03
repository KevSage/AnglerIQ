import type { CoachingStyleValue } from "../../context/UserSettingsContext";
import { useUserSettings } from "../../context/UserSettingsContext";

const options: { value: CoachingStyleValue; label: string }[] = [
  { value: "calm_guide", label: "Calm Guide" },
  { value: "old_school_pro", label: "Old School Pro" },
  { value: "data_analyst", label: "Data Analyst" },
  { value: "hype_coach", label: "Hype Coach" },
  { value: "minimalist", label: "Minimalist" },
];

const CoachingStyleSelect = () => {
  const { settings, updateSettings } = useUserSettings();

  const handleSelect = (value: CoachingStyleValue) => {
    updateSettings({ coachingStyle: value });
  };

  return (
    <section className="space-y-2">
      <h2 className="text-sm font-medium text-gray-100">Coaching Style</h2>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = settings.coachingStyle === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={[
                "rounded-full border px-3 py-1 text-xs",
                selected
                  ? "border-green-400 bg-green-400 text-black"
                  : "border-gray-600 text-gray-300",
              ].join(" ")}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default CoachingStyleSelect;
