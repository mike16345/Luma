import { Text, View } from "react-native";

import { SectionCard } from "@/components/ui/section-card";
import type { InsightsRow } from "@/features/insights/insights-selectors";
import { getFlexDirection } from "@/i18n/languages";
import { useLanguage } from "@/i18n/language-context";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function InsightsListSection({
  rows,
  title,
}: {
  rows: InsightsRow[];
  title: string;
}) {
  const { direction, t, textAlign } = useLanguage();

  return (
    <SectionCard eyebrow={t("insights.loggedData")} title={title}>
      <View style={{ gap: spacing.sm }}>
        {rows.map((row) => (
          <View
            key={row.label}
            style={{
              flexDirection: getFlexDirection(direction),
              alignItems: "center",
              justifyContent: "space-between",
              gap: spacing.md,
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
              {row.label}
            </Text>
            <Text
              selectable
              style={{
                ...typography.label,
                color: colors.textSecondary,
                fontVariant: ["tabular-nums"],
                textAlign,
              }}
            >
              {row.value}
            </Text>
          </View>
        ))}
      </View>
    </SectionCard>
  );
}
