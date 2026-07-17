export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 22,
  xl: 28,
  xxl: 40,
  screen: 22,
} as const;

export type SpacingToken = keyof typeof spacing;
