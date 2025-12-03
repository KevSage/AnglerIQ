// src/context/UserSettingsContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

export type Tier = "pro" | "elite" | "vision";

export type ExperienceLevel =
  | "general"
  | "beginner"
  | "intermediate"
  | "advanced";

export type CoachingStyleValue =
  | "calm_guide"
  | "old_school_pro"
  | "data_analyst"
  | "hype_coach"
  | "minimalist";

export type PreferredStyleValue =
  | "finesse"
  | "power"
  | "moving baits"
  | "bottom contact"
  | "topwater";

export interface UserSettings {
  tier: Tier;
  experienceLevel: ExperienceLevel;
  coachingStyle: CoachingStyleValue;
  preferredStyles: PreferredStyleValue[];
  highConfidenceBaits: string[];
  lowConfidenceBaits: string[];
  darkMode: boolean;
}

interface UserSettingsContextValue {
  settings: UserSettings;
  updateSettings: (next: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

const LOCAL_STORAGE_KEY = "aiqUserSettings";

const defaultSettings: UserSettings = {
  tier: "vision",
  experienceLevel: "general",
  coachingStyle: "calm_guide",
  preferredStyles: [],
  highConfidenceBaits: [],
  lowConfidenceBaits: [],
  darkMode: true,
};

const UserSettingsContext = createContext<UserSettingsContextValue | undefined>(
  undefined
);

export const UserSettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  // Load from localStorage once
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UserSettings;
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch {
      // If parsing fails, fall back to defaults
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore persistence errors
    }
  }, [settings]);

  const updateSettings = (next: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...next }));
  };

  const resetSettings = () => setSettings(defaultSettings);

  return (
    <UserSettingsContext.Provider
      value={{ settings, updateSettings, resetSettings }}
    >
      {children}
    </UserSettingsContext.Provider>
  );
};

export const useUserSettings = (): UserSettingsContextValue => {
  const ctx = useContext(UserSettingsContext);
  if (!ctx) {
    throw new Error("useUserSettings must be used within UserSettingsProvider");
  }
  return ctx;
};
