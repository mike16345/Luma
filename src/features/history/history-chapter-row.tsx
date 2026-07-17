import { Text, View } from "react-native";

import { SectionCard } from "@/components/ui/section-card";
import type { HistoryChapterRow as HistoryChapterRowModel } from "@/features/history/history-selectors";
import { getFlexDirection } from "@/i18n/languages";
import { useLanguage } from "@/i18n/language-context";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function HistoryChapterRow({ row }: { row: HistoryChapterRowModel }) {
  const { direction, t, textAlign } = useLanguage();

  return (
    <SectionCard>
      <View style={{ gap: spacing.sm }}>
        <View
          style={{
            flexDirection: getFlexDirection(direction),
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
                textAlign,
              }}
            >
              {row.title}
            </Text>
            <Text
              selectable
              style={{
                ...typography.caption,
                color: colors.textMuted,
                textAlign,
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
              textAlign,
            }}
          >
            {row.statusLabel}
          </Text>
        </View>

        <View style={{ flexDirection: getFlexDirection(direction), gap: spacing.sm }}>
          <HistoryRowMetric
            label={t("common.smokeFreeTime")}
            value={row.durationLabel}
          />
          <HistoryRowMetric label={t("history.estimatedSaved")} value={row.savingsLabel} />
          <HistoryRowMetric
            label={t("history.estimatedAvoided")}
            value={row.cigarettesLabel}
          />
        </View>
      </View>
    </SectionCard>
  );
}

function HistoryRowMetric({ label, value }: { label: string; value: string }) {
  const { textAlign } = useLanguage();

  return (
    <View style={{ flex: 1, gap: spacing.xxs }}>
      <Text
        selectable
        style={{
          ...typography.caption,
          color: colors.textMuted,
          textAlign,
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
          textAlign,
        }}
      >
        {value}
      </Text>
    </View>
  );
}
