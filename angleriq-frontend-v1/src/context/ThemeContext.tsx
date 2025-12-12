import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "dark" | "light";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>("dark");

  // Load from localStorage on first mount
  useEffect(() => {
    const stored = localStorage.getItem("aiq_theme") as Theme | null;
    if (stored === "light" || stored === "dark") {
      setThemeState(stored);
    }
  }, []);

  // Persist + add a data-theme attribute to <html>
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("aiq_theme", theme);
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);

  const toggleTheme = () =>
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
};