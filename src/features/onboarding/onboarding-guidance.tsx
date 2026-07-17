import { Text, View } from "react-native";

import { getFlexDirection } from "@/i18n/languages";
import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

const GUIDANCE_ITEMS = [
  {
    label: "Private by default",
    text: "Your chapter data stays on this device.",
  },
  {
    label: "Estimates are enough",
    text: "Use practical numbers. You can correct the active chapter later.",
  },
  {
    label: "Honest progress",
    text: "One chapter runs at a time, and history stays intact.",
  },
];

export function OnboardingGuidance() {
  const colors = useThemeColors();
  const { direction, textAlign } = useLanguage();

  return (
    <View
      style={{
        gap: spacing.sm,
        padding: spacing.md,
        borderRadius: 8,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
      }}
    >
      {GUIDANCE_ITEMS.map((item) => (
        <View
          key={item.label}
          style={{
            flexDirection: getFlexDirection(direction),
            gap: spacing.sm,
          }}
        >
          <View
            style={{
              width: 8,
              height: 8,
              marginTop: 7,
              borderRadius: 999,
              backgroundColor: colors.action,
            }}
          />
          <View style={{ flex: 1, gap: 2 }}>
            <Text
              style={{
                ...typography.bodyMedium,
                color: colors.textPrimary,
                textAlign,
              }}
            >
              {item.label}
            </Text>
            <Text
              style={{
                ...typography.caption,
                color: colors.textSecondary,
                textAlign,
              }}
            >
              {item.text}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
