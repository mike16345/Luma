export const lightColors = {
  background: "#FAF3E8",
  surface: "#FFFDF8",
  surfaceMuted: "#F0E4D1",
  heroSurface: "#E7F6EF",
  heroText: "#14362E",
  heroTextMuted: "#486B61",
  textPrimary: "#162923",
  textSecondary: "#344C44",
  textMuted: "#5E7169",
  action: "#1F7A62",
  actionSoft: "#D9F1E7",
  accentTime: "#2F6FA8",
  accentSavings: "#16805F",
  accentWarm: "#B86624",
  slip: "#B94352",
  border: "#D8C9B4",
} as const;

export const darkColors = {
  background: "#101817",
  surface: "#18231F",
  surfaceMuted: "#26372F",
  heroSurface: "#16392F",
  heroText: "#ECFFF7",
  heroTextMuted: "#B9D8CE",
  textPrimary: "#F4F7F1",
  textSecondary: "#D5E1DA",
  textMuted: "#AEC1B8",
  action: "#78D6B6",
  actionSoft: "#254F42",
  accentTime: "#8FC8FF",
  accentSavings: "#74D8B3",
  accentWarm: "#F0B468",
  slip: "#F08A98",
  border: "#385247",
} as const;

export type ColorToken = keyof typeof lightColors;
export type ThemeColors = Record<ColorToken, string>;

export const colors: ThemeColors = { ...lightColors };
