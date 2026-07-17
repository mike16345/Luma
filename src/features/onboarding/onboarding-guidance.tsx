import { Text, View } from "react-native";

import { getFlexDirection } from "@/i18n/languages";
import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

export function OnboardingGuidance() {
  const colors = useThemeColors();
  const { direction, t, textAlign } = useLanguage();
  const guidanceItems = [
    {
      label: t("onboarding.guidancePrivateTitle"),
      text: t("onboarding.guidancePrivateText"),
    },
    {
      label: t("onboarding.guidanceEstimatesTitle"),
      text: t("onboarding.guidanceEstimatesText"),
    },
    {
      label: t("onboarding.guidanceHonestTitle"),
      text: t("onboarding.guidanceHonestText"),
    },
  ];

  return (
    <View
      style={{
        gap: spacing.md,
        padding: spacing.lg,
        borderRadius: 22,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surfaceElevated,
        boxShadow: `0 14px 32px ${colors.shadow}`,
      }}
    >
      {guidanceItems.map((item) => (
        <View
          key={item.label}
          style={{
            flexDirection: getFlexDirection(direction),
            gap: spacing.sm,
          }}
        >
          <View
            style={{
              width: 10,
              height: 10,
              marginTop: 8,
              borderRadius: 999,
              backgroundColor: colors.accentSavings,
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
