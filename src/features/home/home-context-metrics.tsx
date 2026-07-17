import { View } from "react-native";

import { MetricCard } from "@/components/ui/metric-card";
import type { HomeViewModel } from "@/features/home/home-selectors";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

export function HomeContextMetrics({ data }: { data: HomeViewModel }) {
  return (
    <View style={{ flexDirection: "row", gap: spacing.sm }}>
      <MetricCard
        label={data.longestStreak.label}
        value={data.longestStreak.value}
        accentColor={colors.accentWarm}
      />
      <MetricCard
        label={data.cumulativeSavings.label}
        value={data.cumulativeSavings.value}
        accentColor={colors.accentSavings}
      />
    </View>
  );
}
