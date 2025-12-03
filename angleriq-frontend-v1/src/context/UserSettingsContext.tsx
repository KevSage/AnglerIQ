import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

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

export const UserSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  // Load once from localStorage (if available)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<UserSettings>;
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch {
      // If anything goes wrong, fall back to defaults
    }
  }, []);

  // Persist anytime settings change
  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // If persistence fails, ignore
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
