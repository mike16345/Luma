import { Text, View } from "react-native";

import { SectionCard } from "@/components/ui/section-card";
import type { HomeViewModel } from "@/features/home/home-selectors";
import { useLanguage } from "@/i18n/language-context";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function HomeWeeklySummary({ data }: { data: HomeViewModel }) {
  const { t, textAlign } = useLanguage();

  return (
    <SectionCard
      eyebrow={t("home.thisWeekEyebrow")}
      title={t("home.weeklySummary")}
    >
      <View style={{ flexDirection: "row", gap: spacing.sm }}>
        {data.weeklySummary.map((metric) => (
          <View
            key={metric.label}
            style={{
              flex: 1,
              minHeight: 86,
              justifyContent: "space-between",
              gap: spacing.xs,
              padding: spacing.sm,
              borderRadius: 8,
              borderCurve: "continuous",
              backgroundColor: colors.surfaceMuted,
            }}
          >
            <Text
              selectable
              style={{
                ...typography.caption,
                color: colors.textMuted,
                textAlign,
              }}
            >
              {metric.label}
            </Text>
            <Text
              selectable
              adjustsFontSizeToFit
              numberOfLines={1}
              style={{
                ...typography.section,
                color: colors.textPrimary,
                fontVariant: ["tabular-nums"],
                textAlign,
              }}
            >
              {metric.value}
            </Text>
          </View>
        ))}
      </View>
    </SectionCard>
  );
}
