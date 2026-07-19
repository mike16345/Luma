import { badgeDefinitions, type BadgeCategory } from "@/features/badges/badge-definitions";
import {
  buildBadgeForCurrentValue,
  type BadgeMetricInput,
} from "@/features/badges/badge-selectors";
import type { Translator } from "@/i18n/translations";
import {
  calculateChapterMetrics,
} from "@/lib/calculations/chapter-metrics";
import { formatDateTimeShort } from "@/lib/formatting/date-time";
import type { ChapterRecord, SlipUpRecord } from "@/types/domain";

export type ChapterTimelineEventTone =
  | "badge"
  | "chapter"
  | "goal"
  | "slipUp";

export type ChapterTimelineEvent = {
  description: string;
  id: string;
  isEstimated: boolean;
  occurredAtIso: string;
  timeLabel: string;
  title: string;
  tone: ChapterTimelineEventTone;
};

export type ChapterTimelineViewModel = {
  events: ChapterTimelineEvent[];
  note: string;
  title: string;
};

export type ChapterTimelineInput = {
  chapter: ChapterRecord;
  chapterNumber: number;
  nowIso: string;
  slipUp?: SlipUpRecord;
  t: Translator;
};

type SortableTimelineEvent = ChapterTimelineEvent & {
  sortOrder: number;
};

const eventSortOrder = {
  start: 0,
  chapterBadge: 1,
  progressBadge: 2,
  goal: 3,
  end: 4,
} as const;

function getCurrentValue(category: BadgeCategory, input: BadgeMetricInput) {
  switch (category) {
    case "chapter":
      return input.chapterCount;
    case "cigarettes":
      return input.cigarettesAvoided;
    case "goal":
      return input.goalProgress ?? 0;
    case "money":
      return input.moneySavedMinor;
    case "time":
      return input.smokeFreeMs;
  }
}

function clampRatio(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

function toIsoAtRatio(startMs: number, elapsedMs: number, ratio: number) {
  return new Date(startMs + elapsedMs * clampRatio(ratio)).toISOString();
}

function buildEvent(
  event: Omit<ChapterTimelineEvent, "timeLabel"> & { sortOrder: number }
): SortableTimelineEvent {
  return {
    ...event,
    timeLabel: formatDateTimeShort(event.occurredAtIso),
  };
}

function buildMetricInput(
  input: ChapterTimelineInput,
  metrics: ReturnType<typeof calculateChapterMetrics>,
  goalProgress: number | null
): BadgeMetricInput {
  return {
    chapterCount: input.chapterNumber,
    cigarettesAvoided: metrics.cigarettesAvoided,
    currencyCode: input.chapter.currencyCode,
    goalProgress,
    moneySavedMinor: metrics.moneySavedMinor,
    smokeFreeMs: metrics.elapsedMs,
    t: input.t,
  };
}

function calculateTimelineGoalProgress(
  chapter: ChapterRecord,
  moneySavedMinor: number
) {
  if (!chapter.goalAmountMinor || chapter.goalAmountMinor <= 0) {
    return null;
  }

  return moneySavedMinor / chapter.goalAmountMinor;
}

function getBadgeOccurredAtIso(
  category: BadgeCategory,
  target: number,
  current: number,
  startMs: number,
  elapsedMs: number
) {
  if (category === "chapter") {
    return new Date(startMs).toISOString();
  }

  if (category === "time") {
    return new Date(startMs + target).toISOString();
  }

  if (current <= 0) {
    return null;
  }

  return toIsoAtRatio(startMs, elapsedMs, target / current);
}

function buildBadgeEvents(
  input: ChapterTimelineInput,
  metricInput: BadgeMetricInput,
  startMs: number,
  elapsedMs: number
): SortableTimelineEvent[] {
  return badgeDefinitions
    .filter((definition) => definition.category !== "goal")
    .flatMap((definition) => {
      const current =
        definition.category === "chapter" &&
        input.chapterNumber !== definition.target
          ? 0
          : getCurrentValue(definition.category, metricInput);

      const badge = buildBadgeForCurrentValue(definition, current, metricInput);

      if (!badge.isUnlocked) {
        return [];
      }

      const occurredAtIso = getBadgeOccurredAtIso(
        definition.category,
        definition.target,
        current,
        startMs,
        elapsedMs
      );

      if (!occurredAtIso) {
        return [];
      }

      return [
        buildEvent({
          description:
            definition.category === "time" || definition.category === "chapter"
              ? input.t("history.timelineBadgeDescription")
              : input.t("history.timelineEstimatedDescription"),
          id: `badge-${definition.id}`,
          isEstimated:
            definition.category === "cigarettes" ||
            definition.category === "money",
          occurredAtIso,
          sortOrder:
            definition.category === "chapter"
              ? eventSortOrder.chapterBadge
              : eventSortOrder.progressBadge,
          title: badge.title,
          tone: "badge",
        }),
      ];
    });
}

function buildGoalEvents(
  input: ChapterTimelineInput,
  metricInput: BadgeMetricInput,
  startMs: number,
  elapsedMs: number
): SortableTimelineEvent[] {
  if (!metricInput.goalProgress || metricInput.goalProgress <= 0) {
    return [];
  }

  const totalGoalProgress = metricInput.goalProgress;

  return badgeDefinitions
    .filter((definition) => definition.category === "goal")
    .flatMap((definition) => {
      const badge = buildBadgeForCurrentValue(
        definition,
        totalGoalProgress,
        metricInput
      );

      if (!badge.isUnlocked) {
        return [];
      }

      return [
        buildEvent({
          description: input.t("history.timelineGoalDescription"),
          id: definition.id,
          isEstimated: true,
          occurredAtIso: toIsoAtRatio(
            startMs,
            elapsedMs,
            definition.target / totalGoalProgress
          ),
          sortOrder: eventSortOrder.goal,
          title: badge.title,
          tone: "goal",
        }),
      ];
    });
}

function sortEvents(events: SortableTimelineEvent[]): ChapterTimelineEvent[] {
  return events
    .sort((left, right) => {
      const timeDelta =
        new Date(left.occurredAtIso).getTime() -
        new Date(right.occurredAtIso).getTime();

      if (timeDelta !== 0) {
        return timeDelta;
      }

      return left.sortOrder - right.sortOrder;
    })
    .map(({ sortOrder: _sortOrder, ...event }) => event);
}

export function buildChapterTimeline(
  input: ChapterTimelineInput
): ChapterTimelineViewModel {
  const metrics = calculateChapterMetrics(input.chapter, input.nowIso);
  const goalProgress = calculateTimelineGoalProgress(
    input.chapter,
    metrics.moneySavedMinor
  );
  const metricInput = buildMetricInput(input, metrics, goalProgress);
  const startMs = new Date(input.chapter.startedAt).getTime();
  const events: SortableTimelineEvent[] = [
    buildEvent({
      description: input.t("history.timelineStartedDescription"),
      id: "chapter-start",
      isEstimated: false,
      occurredAtIso: input.chapter.startedAt,
      sortOrder: eventSortOrder.start,
      title: input.t("history.timelineStartedTitle"),
      tone: "chapter",
    }),
    ...buildBadgeEvents(input, metricInput, startMs, metrics.elapsedMs),
    ...buildGoalEvents(input, metricInput, startMs, metrics.elapsedMs),
  ];

  if (input.slipUp) {
    events.push(
      buildEvent({
        description: input.t("history.timelineSlipUpDescription"),
        id: "slip-up",
        isEstimated: false,
        occurredAtIso: input.slipUp.occurredAt,
        sortOrder: eventSortOrder.end,
        title: input.t("history.timelineSlipUpTitle"),
        tone: "slipUp",
      })
    );
  } else if (input.chapter.endedAt) {
    events.push(
      buildEvent({
        description: input.t("history.timelineEndedDescription"),
        id: "chapter-ended",
        isEstimated: false,
        occurredAtIso: input.chapter.endedAt,
        sortOrder: eventSortOrder.end,
        title: input.t("history.timelineEndedTitle"),
        tone: "chapter",
      })
    );
  }

  return {
    events: sortEvents(events),
    note: input.t("history.timelineNote"),
    title: input.t("history.timelineTitle"),
  };
}
