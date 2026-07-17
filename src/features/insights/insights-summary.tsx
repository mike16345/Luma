import { View } from "react-native";

import { MetricCard } from "@/components/ui/metric-card";
import type { InsightsMetric } from "@/features/insights/insights-selectors";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

export function InsightsSummary({
  summary,
}: {
  summary: InsightsMetric[];
}) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
      {summary.map((metric, index) => (
        <MetricCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          supportingText={metric.supportingText}
          accentColor={index < 2 ? colors.accentWarm : colors.action}
          style={{ flexBasis: "47%" }}
        />
      ))}
    </View>
  );
}
