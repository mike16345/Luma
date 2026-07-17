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
        gap: spacing.sm,
        padding: spacing.md,
        borderRadius: 8,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
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
