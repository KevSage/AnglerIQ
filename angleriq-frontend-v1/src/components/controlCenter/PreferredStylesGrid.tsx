import type { PreferredStyleValue } from "../../context/UserSettingsContext";
import { useUserSettings } from "../../context/UserSettingsContext";

const options: PreferredStyleValue[] = [
  "finesse",
  "power",
  "moving baits",
  "bottom contact",
  "topwater",
];

const PreferredStylesGrid = () => {
  const { settings, updateSettings } = useUserSettings();

  const toggleStyle = (value: PreferredStyleValue) => {
    const current = settings.preferredStyles || [];
    const exists = current.includes(value);
    const next = exists
      ? current.filter((style) => style !== value)
      : [...current, value];

    updateSettings({ preferredStyles: next });
  };

  return (
    <section className="space-y-2">
      <h2 className="text-sm font-medium text-gray-100">Preferred Styles</h2>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = settings.preferredStyles?.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleStyle(option)}
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

export default PreferredStylesGrid;
