import { useUserSettings } from "../../context/UserSettingsContext";

const DarkModeToggle = () => {
  const { settings, updateSettings } = useUserSettings();

  const isDark = settings.darkMode ?? true;

  const handleToggle = () => {
    updateSettings({ darkMode: !isDark });
  };

  return (
    <section className="space-y-2">
      <h2 className="text-sm font-medium text-gray-100">Dark Mode</h2>
      <button
        type="button"
        onClick={handleToggle}
        className={[
          "inline-flex items-center rounded-full border px-3 py-1 text-xs",
          isDark
            ? "border-green-400 bg-green-400 text-black"
            : "border-gray-600 text-gray-300",
        ].join(" ")}
      >
        <span className="mr-2">Dark Mode</span>
        <span className="rounded-full bg-black px-2 py-0.5 text-[10px] text-gray-100">
          {isDark ? "On" : "Off"}
        </span>
      </button>
    </section>
  );
};

export default DarkModeToggle;
