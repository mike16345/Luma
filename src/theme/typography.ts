export const typography = {
  display: {
    fontSize: 42,
    lineHeight: 48,
    fontWeight: "700",
  },
  title: {
    fontSize: 29,
    lineHeight: 35,
    fontWeight: "700",
  },
  section: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "700",
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
  },
  bodyMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400",
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
  },
} as const;

export type TypographyToken = keyof typeof typography;
