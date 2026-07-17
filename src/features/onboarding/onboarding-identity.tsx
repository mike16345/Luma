import { Text, View } from "react-native";

import { getFlexDirection } from "@/i18n/languages";
import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

const PREVIEW_ITEMS = [
  "Smoke-free time",
  "Cigarettes avoided",
  "Money saved",
];

export function OnboardingIdentity() {
  const colors = useThemeColors();
  const { direction, textAlign } = useLanguage();

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
            Luma
          </Text>
          <Text
            style={{
              ...typography.bodyMedium,
              color: colors.heroText,
              textAlign,
            }}
          >
            Calm, private progress.
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
          Start the chapter you want to protect.
        </Text>
        <Text
          style={{
            ...typography.body,
            color: colors.heroTextMuted,
            textAlign,
          }}
        >
          Enter a few practical details so Luma can turn smoke-free time into
          clear, honest estimates.
        </Text>
      </View>

      <View
        style={{
          flexDirection: getFlexDirection(direction),
          flexWrap: "wrap",
          gap: spacing.xs,
        }}
      >
        {PREVIEW_ITEMS.map((item) => (
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
