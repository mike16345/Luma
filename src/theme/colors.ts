export const lightColors = {
  background: "#F7F5F0",
  surface: "#FFFFFF",
  surfaceMuted: "#EFECE4",
  textPrimary: "#1F2A2E",
  textSecondary: "#425157",
  textMuted: "#6C7A80",
  action: "#4E7468",
  actionSoft: "#DDE9E3",
  accentTime: "#4E6E8E",
  accentSavings: "#4E7468",
  accentWarm: "#B7773A",
  slip: "#AA5B64",
  border: "#DDD8CC",
} as const;

export const darkColors = {
  background: "#111715",
  surface: "#1A211F",
  surfaceMuted: "#24302C",
  textPrimary: "#F2F0EA",
  textSecondary: "#CDD6D1",
  textMuted: "#9BA9A3",
  action: "#8DB9A9",
  actionSoft: "#263D35",
  accentTime: "#90AFCF",
  accentSavings: "#8DB9A9",
  accentWarm: "#D1A06A",
  slip: "#D1848D",
  border: "#34423D",
} as const;

export type ColorToken = keyof typeof lightColors;
export type ThemeColors = Record<ColorToken, string>;

export const colors: ThemeColors = { ...lightColors };
