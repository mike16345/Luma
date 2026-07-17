import { Text, View } from "react-native";

import { SectionCard } from "@/components/ui/section-card";
import type { HomeViewModel } from "@/features/home/home-selectors";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function HomeWeeklySummary({ data }: { data: HomeViewModel }) {
  return (
    <SectionCard eyebrow="This week" title="Weekly summary">
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
