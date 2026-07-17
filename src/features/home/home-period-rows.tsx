import { Text, View } from "react-native";

import { SectionCard } from "@/components/ui/section-card";
import type { HomeViewModel } from "@/features/home/home-selectors";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function HomePeriodRows({ data }: { data: HomeViewModel }) {
  return (
    <SectionCard eyebrow="Progress" title="By period">
      <View style={{ gap: spacing.xs }}>
        {data.periods.map((period) => (
          <View
            key={period.key}
            style={{
              flexDirection: "row",
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
              }}
            >
              {period.label}
            </Text>
            <View style={{ alignItems: "flex-end", gap: spacing.xxs }}>
              <Text
                selectable
                style={{
                  ...typography.bodyMedium,
                  color: colors.textPrimary,
                  fontVariant: ["tabular-nums"],
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
                {period.cigarettesAvoided} avoided
              </Text>
            </View>
          </View>
        ))}
      </View>
    </SectionCard>
  );
}
