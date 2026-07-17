import { Text, View } from "react-native";

import { SectionCard } from "@/components/ui/section-card";
import type { HomeViewModel } from "@/features/home/home-selectors";
import { getFlexDirection } from "@/i18n/languages";
import { useLanguage } from "@/i18n/language-context";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function HomePeriodRows({ data }: { data: HomeViewModel }) {
  const { direction, t, textAlign } = useLanguage();

  return (
    <SectionCard eyebrow={t("home.progressEyebrow")} title={t("home.byPeriod")}>
      <View style={{ gap: spacing.xs }}>
        {data.periods.map((period) => (
          <View
            key={period.key}
            style={{
              flexDirection: getFlexDirection(direction),
              alignItems: "center",
              justifyContent: "space-between",
              gap: spacing.md,
              paddingVertical: spacing.sm,
              borderBottomWidth: period.key === "allTime" ? 0 : 1,
              borderBottomColor: colors.border,
            }}
          >
            <Text
              selectable
              style={{
                ...typography.bodyMedium,
                flex: 1,
                color: colors.textPrimary,
                textAlign,
              }}
            >
              {period.label}
            </Text>
            <View
              style={{
                alignItems: direction === "rtl" ? "flex-start" : "flex-end",
                gap: spacing.xxs,
              }}
            >
              <Text
                selectable
                style={{
                  ...typography.bodyMedium,
                  color: colors.textPrimary,
                  fontVariant: ["tabular-nums"],
                  textAlign,
                }}
              >
                {period.moneySaved}
              </Text>
              <Text
                selectable
                style={{
                  ...typography.caption,
                  color: colors.textMuted,
                  fontVariant: ["tabular-nums"],
                }}
              >
                {period.cigarettesAvoided} {t("common.avoidedSuffix")}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </SectionCard>
  );
}
