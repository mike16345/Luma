import { Text, View } from "react-native";

import type { HomeViewModel } from "@/features/home/home-selectors";
import { HomeActionButtons } from "@/features/home/home-action-buttons";
import { useLanguage } from "@/i18n/language-context";
import { gradientStyle, gradients } from "@/theme/gradients";
import { spacing } from "@/theme/spacing";
import { useTheme } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

export function HomeHero({ data }: { data: HomeViewModel }) {
  const { t, textAlign } = useLanguage();
  const { colors, resolvedTheme } = useTheme();

  return (
    <View
      style={{
        overflow: "hidden",
        gap: spacing.xl,
        padding: spacing.xl,
        borderRadius: 28,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.heroSurface,
        boxShadow: `0 22px 54px ${colors.shadow}`,
        ...gradientStyle(
          resolvedTheme === "dark" ? gradients.heroDark : gradients.hero
        ),
      }}
    >
      <View style={{ gap: spacing.xs }}>
        <View
          style={{
            width: 52,
            height: 4,
            borderRadius: 999,
            backgroundColor: colors.accentWarm,
          }}
        />
        <Text
          selectable
          style={{
            ...typography.label,
            color: colors.heroTextMuted,
            textAlign,
            letterSpacing: 0,
          }}
        >
          {data.headline.supportingText}
        </Text>
        <Text
          selectable
          adjustsFontSizeToFit
          numberOfLines={2}
          style={{
            ...typography.display,
            color: colors.heroText,
            fontVariant: ["tabular-nums"],
            textAlign,
          }}
        >
          {data.headline.value}
        </Text>
        <Text
          selectable
          style={{
            ...typography.body,
            color: colors.heroTextMuted,
            textAlign,
          }}
        >
          {data.hasActiveChapter
            ? t("home.activeHeroDescription")
            : t("home.inactiveHeroDescription")}
        </Text>
      </View>
      <HomeActionButtons hasActiveChapter={data.hasActiveChapter} />
    </View>
  );
}
