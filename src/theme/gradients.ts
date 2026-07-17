import type { ViewStyle } from "react-native";

export const gradients = {
  appBackground:
    "linear-gradient(180deg, rgba(231,245,239,1) 0%, rgba(243,248,244,1) 42%, rgba(255,247,236,1) 100%)",
  appBackgroundDark:
    "linear-gradient(180deg, rgba(16,44,42,1) 0%, rgba(8,25,24,1) 48%, rgba(23,22,19,1) 100%)",
  hero:
    "linear-gradient(135deg, rgba(206,240,230,1) 0%, rgba(236,250,244,1) 48%, rgba(255,231,203,1) 100%)",
  heroDark:
    "linear-gradient(135deg, rgba(18,60,55,1) 0%, rgba(19,41,38,1) 56%, rgba(63,45,28,1) 100%)",
  action:
    "linear-gradient(135deg, rgba(23,124,104,1) 0%, rgba(32,163,116,1) 100%)",
  actionDark:
    "linear-gradient(135deg, rgba(120,221,190,1) 0%, rgba(140,202,243,1) 100%)",
  warm:
    "linear-gradient(135deg, rgba(255,247,236,1) 0%, rgba(255,230,199,1) 100%)",
  warmDark:
    "linear-gradient(135deg, rgba(45,39,30,1) 0%, rgba(67,49,30,1) 100%)",
} as const;

export function gradientStyle(gradient: string): ViewStyle {
  return { experimental_backgroundImage: gradient } as ViewStyle;
}
