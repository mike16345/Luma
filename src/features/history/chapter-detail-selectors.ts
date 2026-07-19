import { buildChapterBadgeUnlocks } from "@/features/badges/chapter-badge-unlocks";
import type { BadgeViewModel } from "@/features/badges/badge-selectors";
import {
  buildChapterTimeline,
  type ChapterTimelineViewModel,
} from "@/features/history/chapter-timeline-selectors";
import type { Translator } from "@/i18n/translations";
import { calculateChapterMetrics } from "@/lib/calculations/chapter-metrics";
import { formatCurrencyFromMinorUnits } from "@/lib/formatting/currency";
import { formatDateTimeShort } from "@/lib/formatting/date-time";
import { formatDurationCompact } from "@/lib/formatting/duration";
import {
  buildEstimateLabel,
  formatEstimatedCount,
} from "@/lib/formatting/estimates";
import type { ChapterRecord, SlipUpRecord } from "@/types/domain";

export type ChapterDetailMetric = {
  label: string;
  value: string;
};

export type ChapterSlipUpDetail = {
  rows: ChapterDetailMetric[];
  title: string;
};

export type ChapterDetailViewModel = {
  badgesUnlockedDuringChapter: BadgeViewModel[];
  id: string;
  metrics: ChapterDetailMetric[];
  slipUp: ChapterSlipUpDetail | null;
  statusLabel: string;
  subtitle: string;
  timeline: ChapterTimelineViewModel;
  title: string;
};

function sortChaptersOldestFirst(chapters: ChapterRecord[]) {
  return [...chapters].sort(
    (left, right) =>
      new Date(left.startedAt).getTime() - new Date(right.startedAt).getTime()
  );
}

function findChapterNumber(chapters: ChapterRecord[], chapterId: string) {
  const oldestFirst = sortChaptersOldestFirst(chapters);
  const index = oldestFirst.findIndex((chapter) => chapter.id === chapterId);

  return index >= 0 ? index + 1 : null;
}

function findChapterSlipUp(slipUps: SlipUpRecord[], chapterId: string) {
  return [...slipUps]
    .filter((slipUp) => slipUp.chapterId === chapterId)
    .sort(
      (left, right) =>
        new Date(right.occurredAt).getTime() -
        new Date(left.occurredAt).getTime()
    )[0];
}

function buildSlipUpDetail(
  slipUp: SlipUpRecord | undefined,
  t: Translator
): ChapterSlipUpDetail | null {
  if (!slipUp) {
    return null;
  }

  return {
    title: t("history.slipUpContext"),
    rows: [
      {
        label: t("history.slipUpLoggedAt"),
        value: formatDateTimeShort(slipUp.occurredAt),
      },
      {
        label: t("slipUp.mood"),
        value: slipUp.mood || t("insights.notSpecified"),
      },
      {
        label: t("slipUp.trigger"),
        value: slipUp.trigger || t("insights.notSpecified"),
      },
      {
        label: t("slipUp.alcoholQuestion"),
        value: slipUp.alcoholInvolved ? t("common.yes") : t("common.no"),
      },
      ...(slipUp.note
        ? [
            {
              label: t("slipUp.note"),
              value: slipUp.note,
            },
          ]
        : []),
    ],
  };
}

export function buildChapterDetailViewModel(
  chapters: ChapterRecord[],
  slipUps: SlipUpRecord[],
  chapterId: string,
  nowIso: string,
  t: Translator
): ChapterDetailViewModel | null {
  const chapter = chapters.find((item) => item.id === chapterId);
  const chapterNumber = findChapterNumber(chapters, chapterId);

  if (!chapter || !chapterNumber) {
    return null;
  }

  const metrics = calculateChapterMetrics(chapter, nowIso);
  const isActive = chapter.endedAt === null;
  const slipUp = findChapterSlipUp(slipUps, chapter.id);
  const statusLabel = isActive
    ? t("history.activeChapter")
    : slipUp
      ? t("history.endedWithSlipUp")
      : t("history.completedChapter");

  return {
    badgesUnlockedDuringChapter: buildChapterBadgeUnlocks({
      chapter,
      chapterNumber,
      nowIso,
      t,
    }).unlockedBadges,
    id: chapter.id,
    metrics: [
      {
        label: t("history.started"),
        value: formatDateTimeShort(chapter.startedAt),
      },
      {
        label: t("history.ended"),
        value: chapter.endedAt
          ? formatDateTimeShort(chapter.endedAt)
          : t("history.stillInProgress"),
      },
      {
        label: t("common.smokeFreeTime"),
        value: formatDurationCompact(metrics.elapsedMs),
      },
      {
        label: buildEstimateLabel(
          t("history.estimatedSaved"),
          t("common.estimatedSuffix")
        ),
        value: formatCurrencyFromMinorUnits(
          metrics.moneySavedMinor,
          chapter.currencyCode
        ),
      },
      {
        label: buildEstimateLabel(
          t("history.estimatedAvoided"),
          t("common.estimatedSuffix")
        ),
        value: `${formatEstimatedCount(metrics.cigarettesAvoided)} ${t(
          "common.avoidedSuffix"
        )}`,
      },
    ],
    slipUp: buildSlipUpDetail(slipUp, t),
    statusLabel,
    subtitle: t("history.detailSubtitle"),
    timeline: buildChapterTimeline({
      chapter,
      chapterNumber,
      nowIso,
      slipUp,
      t,
    }),
    title: isActive
      ? t("common.currentChapter")
      : t("history.chapterNumber", { number: chapterNumber }),
  };
}
