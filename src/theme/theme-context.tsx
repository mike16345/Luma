import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";

import { preferencesStorage } from "@/lib/storage/local-preferences";
import {
  colors,
  darkColors,
  lightColors,
  type ThemeColors,
} from "@/theme/colors";

export type ThemePreference = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

const THEME_PREFERENCE_KEY = "theme.preference";
const themePreferences = new Set<ThemePreference>(["system", "light", "dark"]);

interface ThemeContextValue {
  colors: ThemeColors;
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readInitialPreference(): ThemePreference {
  const value = preferencesStorage.getString(THEME_PREFERENCE_KEY, "system");
  return themePreferences.has(value as ThemePreference)
    ? (value as ThemePreference)
    : "system";
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemColorScheme = useColorScheme();
  const [preference, setPreferenceState] =
    useState<ThemePreference>(readInitialPreference);
  const resolvedTheme: ResolvedTheme =
    preference === "system"
      ? systemColorScheme === "dark"
        ? "dark"
        : "light"
      : preference;
  const activeColors = resolvedTheme === "dark" ? darkColors : lightColors;

  Object.assign(colors, activeColors);

  const setPreference = useCallback((nextPreference: ThemePreference) => {
    setPreferenceState(nextPreference);
    preferencesStorage.setString(THEME_PREFERENCE_KEY, nextPreference);
  }, []);

  const value = useMemo(
    () => ({
      colors: activeColors,
      preference,
      resolvedTheme,
      setPreference,
    }),
    [activeColors, preference, resolvedTheme, setPreference]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return value;
}

export function useThemeColors() {
  return useTheme().colors;
}
