import { Text, View } from "react-native";

import { SectionCard } from "@/components/ui/section-card";
import type {
  ChapterTimelineEvent,
  ChapterTimelineViewModel,
} from "@/features/history/chapter-timeline-selectors";
import { getFlexDirection } from "@/i18n/languages";
import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

export function ChapterTimelineSection({
  timeline,
}: {
  timeline: ChapterTimelineViewModel;
}) {
  const { t, textAlign } = useLanguage();
  const colors = useThemeColors();

  return (
    <SectionCard eyebrow={t("history.timelineEyebrow")} title={timeline.title}>
      <Text
        selectable
        style={{
          ...typography.caption,
          color: colors.textSecondary,
          textAlign,
        }}
      >
        {timeline.note}
      </Text>
      <View style={{ gap: spacing.sm }}>
        {timeline.events.map((event, index) => (
          <ChapterTimelineItem
            event={event}
            isLast={index === timeline.events.length - 1}
            key={event.id}
          />
        ))}
      </View>
    </SectionCard>
  );
}

function ChapterTimelineItem({
  event,
  isLast,
}: {
  event: ChapterTimelineEvent;
  isLast: boolean;
}) {
  const { direction, t, textAlign } = useLanguage();
  const colors = useThemeColors();
  const toneColor = getTimelineToneColor(event.tone, colors);
  const timeLabel = event.isEstimated
    ? `${event.timeLabel} - ${t("history.timelineEstimatedLabel")}`
    : event.timeLabel;

  return (
    <View
      style={{
        flexDirection: getFlexDirection(direction),
        alignItems: "stretch",
        gap: spacing.sm,
      }}
    >
      <View
        style={{
          alignItems: "center",
          width: 18,
        }}
      >
        <View
          style={{
            width: 12,
            height: 12,
            borderRadius: 999,
            backgroundColor: toneColor,
            marginTop: 4,
          }}
        />
        {!isLast ? (
          <View
            style={{
              flex: 1,
              width: 2,
              minHeight: 44,
              marginTop: spacing.xs,
              borderRadius: 999,
              backgroundColor: colors.border,
            }}
          />
        ) : null}
      </View>
      <View style={{ flex: 1, gap: spacing.xxs, paddingBottom: spacing.sm }}>
        <Text
          selectable
          style={{
            ...typography.bodyMedium,
            color: colors.textPrimary,
            textAlign,
          }}
        >
          {event.title}
        </Text>
        <Text
          selectable
          style={{
            ...typography.caption,
            color: colors.textSecondary,
            textAlign,
          }}
        >
          {event.description}
        </Text>
        <Text
          selectable
          style={{
            ...typography.caption,
            color: toneColor,
            fontVariant: ["tabular-nums"],
            textAlign,
          }}
        >
          {timeLabel}
        </Text>
      </View>
    </View>
  );
}

function getTimelineToneColor(
  tone: ChapterTimelineEvent["tone"],
  colors: ReturnType<typeof useThemeColors>
) {
  switch (tone) {
    case "badge":
      return colors.accentWarm;
    case "chapter":
      return colors.action;
    case "goal":
      return colors.accentSavings;
    case "slipUp":
      return colors.slip;
  }
}
