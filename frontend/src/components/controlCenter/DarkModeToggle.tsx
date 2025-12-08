// src/components/controlCenter/DarkModeToggle.tsx
import React, { useEffect } from "react";
import { useUserSettings } from "@/context/UserSettingsContext";

export const DarkModeToggle: React.FC = () => {
  const { settings, updateSettings } = useUserSettings();

  // Apply dark/light theme class
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add("aiq-dark");
    } else {
      document.documentElement.classList.remove("aiq-dark");
    }
  }, [settings.darkMode]);

  const toggle = () => {
    updateSettings({ darkMode: !settings.darkMode });
  };

  return (
    <section className="space-y-2">
      <h2 className="text-sm font-medium text-gray-100">Dark Mode</h2>
      <button
        type="button"
        onClick={toggle}
        className={[
          "inline-flex items-center rounded-full border px-3 py-1 text-xs",
          settings.darkMode
            ? "border-accent bg-accent text-black"
            : "border-outline-subtle text-gray-300",
        ].join(" ")}
      >
        {settings.darkMode ? "On" : "Off"}
      </button>
    </section>
  );
};
