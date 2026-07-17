import { Text, View } from "react-native";

import type { HomeViewModel } from "@/features/home/home-selectors";
import { HomeActionButtons } from "@/features/home/home-action-buttons";
import { useLanguage } from "@/i18n/language-context";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function HomeHero({ data }: { data: HomeViewModel }) {
  const { t, textAlign } = useLanguage();

  return (
    <View
      style={{
        gap: spacing.lg,
        padding: spacing.lg,
        borderRadius: 8,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.heroSurface,
      }}
    >
      <View style={{ gap: spacing.xs }}>
        <View
          style={{
            width: 42,
            height: 4,
            borderRadius: 999,
            backgroundColor: colors.action,
          }}
        />
        <Text
          selectable
          style={{
            ...typography.label,
            color: colors.heroTextMuted,
            textTransform: "uppercase",
            textAlign,
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
