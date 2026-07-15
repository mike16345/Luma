export const colors = {
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

export type ColorToken = keyof typeof colors;
