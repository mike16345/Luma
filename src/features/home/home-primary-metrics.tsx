import { View } from "react-native";

import { MetricCard } from "@/components/ui/metric-card";
import type { HomeMetricViewModel } from "@/features/home/home-selectors";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

export function HomePrimaryMetrics({
  metrics,
  isWide,
}: {
  metrics: HomeMetricViewModel[];
  isWide: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: isWide ? "row" : "column",
        gap: spacing.sm,
      }}
    >
      {metrics.map((metric, index) => (
        <MetricCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          supportingText={metric.supportingText}
          accentColor={index === 0 ? colors.accentTime : colors.accentSavings}
        />
      ))}
    </View>
  );
}
