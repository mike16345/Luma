import { Text, View } from "react-native";

import { SectionCard } from "@/components/ui/section-card";
import type { HistoryChapterRow as HistoryChapterRowModel } from "@/features/history/history-selectors";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function HistoryChapterRow({ row }: { row: HistoryChapterRowModel }) {
  return (
    <SectionCard>
      <View style={{ gap: spacing.sm }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: spacing.md,
          }}
        >
          <View style={{ flex: 1, gap: spacing.xxs }}>
            <Text
              selectable
              style={{
                ...typography.section,
                color: colors.textPrimary,
              }}
            >
              {row.title}
            </Text>
            <Text
              selectable
              style={{
                ...typography.caption,
                color: colors.textMuted,
              }}
            >
              {row.dateLabel}
            </Text>
          </View>
          <Text
            selectable
            style={{
              ...typography.label,
              color: colors.action,
            }}
          >
            {row.statusLabel}
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: spacing.sm }}>
          <HistoryRowMetric label="Smoke-free time" value={row.durationLabel} />
          <HistoryRowMetric label="Estimated saved" value={row.savingsLabel} />
          <HistoryRowMetric
            label="Estimated avoided"
            value={row.cigarettesLabel}
          />
        </View>
      </View>
    </SectionCard>
  );
}

function HistoryRowMetric({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1, gap: spacing.xxs }}>
      <Text
        selectable
        style={{
          ...typography.caption,
          color: colors.textMuted,
        }}
      >
        {label}
      </Text>
      <Text
        selectable
        adjustsFontSizeToFit
        numberOfLines={1}
        style={{
          ...typography.bodyMedium,
          color: colors.textPrimary,
          fontVariant: ["tabular-nums"],
        }}
      >
        {value}
      </Text>
    </View>
  );
}
