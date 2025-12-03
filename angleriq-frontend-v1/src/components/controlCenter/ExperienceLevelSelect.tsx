import type { ExperienceLevel } from "../../context/UserSettingsContext";
import { useUserSettings } from "../../context/UserSettingsContext";

const ExperienceLevelSelect = () => {
  const { settings, updateSettings } = useUserSettings();

  const options: ExperienceLevel[] = [
    "general",
    "beginner",
    "intermediate",
    "advanced",
  ];

  const handleSelect = (value: ExperienceLevel) => {
    updateSettings({ experienceLevel: value });
  };

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
              onClick={() => handleSelect(option)}
              className={[
                "rounded-full border px-3 py-1 text-xs",
                selected
                  ? "border-green-400 bg-green-400 text-black"
                  : "border-gray-600 text-gray-300",
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

export default ExperienceLevelSelect;
