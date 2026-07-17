import { View } from "react-native";

import { MetricCard } from "@/components/ui/metric-card";
import type { HistorySummaryMetric } from "@/features/history/history-selectors";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

export function HistorySummary({
  summary,
}: {
  summary: HistorySummaryMetric[];
}) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
      {summary.map((metric, index) => (
        <MetricCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          accentColor={index === 2 ? colors.accentWarm : colors.action}
          style={{ flexBasis: "47%" }}
        />
      ))}
    </View>
  );
}
