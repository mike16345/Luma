import { Text, View } from "react-native";

import { getFlexDirection } from "@/i18n/languages";
import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

export function OnboardingIdentity() {
  const colors = useThemeColors();
  const { direction, t, textAlign } = useLanguage();
  const previewItems = [
    t("onboarding.previewSmokeFreeTime"),
    t("onboarding.previewCigarettesAvoided"),
    t("onboarding.previewMoneySaved"),
  ];

  return (
    <View
      style={{
        overflow: "hidden",
        gap: spacing.lg,
        padding: spacing.lg,
        borderRadius: 8,
        borderCurve: "continuous",
        backgroundColor: colors.heroSurface,
      }}
    >
      <View
        style={{
          flexDirection: getFlexDirection(direction),
          alignItems: "center",
          gap: spacing.sm,
        }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            borderCurve: "continuous",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.surface,
          }}
        >
          <Text
            style={{
              ...typography.title,
              color: colors.action,
            }}
          >
            L
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              ...typography.label,
              color: colors.heroTextMuted,
              textAlign,
              textTransform: "uppercase",
            }}
          >
            {t("common.appName")}
          </Text>
          <Text
            style={{
              ...typography.bodyMedium,
              color: colors.heroText,
              textAlign,
            }}
          >
            {t("onboarding.brandSubtitle")}
          </Text>
        </View>
      </View>

      <View style={{ gap: spacing.sm }}>
        <Text
          style={{
            ...typography.display,
            color: colors.heroText,
            textAlign,
          }}
        >
          {t("onboarding.title")}
        </Text>
        <Text
          style={{
            ...typography.body,
            color: colors.heroTextMuted,
            textAlign,
          }}
        >
          {t("onboarding.description")}
        </Text>
      </View>

      <View
        style={{
          flexDirection: getFlexDirection(direction),
          flexWrap: "wrap",
          gap: spacing.xs,
        }}
      >
        {previewItems.map((item) => (
          <View
            key={item}
            style={{
              paddingHorizontal: spacing.sm,
              paddingVertical: spacing.xs,
              borderRadius: 999,
              backgroundColor: colors.actionSoft,
            }}
          >
            <Text
              style={{
                ...typography.caption,
                color: colors.heroText,
                textAlign,
              }}
            >
              {item}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
