import { Text, View } from "react-native";

import { SectionCard } from "@/components/ui/section-card";
import type { ChapterDetailMetric } from "@/features/history/chapter-detail-selectors";
import { getFlexDirection } from "@/i18n/languages";
import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

export function ChapterDetailMetrics({
  metrics,
  title,
}: {
  metrics: ChapterDetailMetric[];
  title: string;
}) {
  return (
    <SectionCard title={title}>
      <View style={{ gap: spacing.md }}>
        {metrics.map((metric) => (
          <ChapterDetailMetricRow key={metric.label} metric={metric} />
        ))}
      </View>
    </SectionCard>
  );
}

function ChapterDetailMetricRow({ metric }: { metric: ChapterDetailMetric }) {
  const colors = useThemeColors();
  const { direction, textAlign } = useLanguage();

  return (
    <View
      style={{
        flexDirection: getFlexDirection(direction),
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: spacing.md,
      }}
    >
      <Text
        selectable
        style={{
          ...typography.caption,
          flex: 1,
          color: colors.textMuted,
          textAlign,
        }}
      >
        {metric.label}
      </Text>
      <Text
        selectable
        style={{
          ...typography.bodyMedium,
          flex: 1.25,
          color: colors.textPrimary,
          fontVariant: ["tabular-nums"],
          textAlign: direction === "rtl" ? "left" : "right",
        }}
      >
        {metric.value}
      </Text>
    </View>
  );
}
