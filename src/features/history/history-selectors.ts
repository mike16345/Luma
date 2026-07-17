import { calculateChapterMetrics } from "@/lib/calculations/chapter-metrics";
import {
  calculateCumulativeSavingsMinor,
  calculateLongestStreakMs,
} from "@/lib/calculations/streaks";
import { formatCurrencyFromMinorUnits } from "@/lib/formatting/currency";
import {
  formatDateShort,
  formatDateTimeShort,
} from "@/lib/formatting/date-time";
import { formatDurationCompact } from "@/lib/formatting/duration";
import {
  buildEstimateLabel,
  formatEstimatedCount,
} from "@/lib/formatting/estimates";
import type { Translator } from "@/i18n/translations";
import type { ChapterRecord, SlipUpRecord } from "@/types/domain";

export interface HistorySummaryMetric {
  label: string;
  value: string;
}

export interface HistoryChapterRow {
  id: string;
  title: string;
  statusLabel: string;
  dateLabel: string;
  durationLabel: string;
  savingsLabel: string;
  cigarettesLabel: string;
}

export interface HistoryViewModel {
  hasChapters: boolean;
  summary: HistorySummaryMetric[];
  rows: HistoryChapterRow[];
}

function resolveCurrency(chapters: ChapterRecord[]) {
  return chapters[0]?.currencyCode ?? "USD";
}

function countSlipUpsByChapter(slipUps: SlipUpRecord[]) {
  return slipUps.reduce<Record<string, number>>((counts, slipUp) => {
    counts[slipUp.chapterId] = (counts[slipUp.chapterId] ?? 0) + 1;
    return counts;
  }, {});
}

export function buildHistoryViewModel(
  chapters: ChapterRecord[],
  slipUps: SlipUpRecord[],
  nowIso: string,
  t: Translator
): HistoryViewModel {
  const currencyCode = resolveCurrency(chapters);
  const completedCount = chapters.filter((chapter) => chapter.endedAt).length;
  const slipUpsByChapter = countSlipUpsByChapter(slipUps);
  const longestStreakMs = calculateLongestStreakMs(chapters, nowIso);
  const cumulativeSavingsMinor = calculateCumulativeSavingsMinor(chapters, nowIso);

  return {
    hasChapters: chapters.length > 0,
    summary: [
      {
        label: t("history.chapters"),
        value: String(chapters.length),
      },
      {
        label: t("history.completed"),
        value: String(completedCount),
      },
      {
        label: t("common.longestSmokeFreeTime"),
        value: formatDurationCompact(longestStreakMs),
      },
      {
        label: buildEstimateLabel(
          t("common.cumulativeSavings"),
          t("common.estimatedSuffix")
        ),
        value: formatCurrencyFromMinorUnits(cumulativeSavingsMinor, currencyCode),
      },
    ],
    rows: chapters.map((chapter, index) => {
      const metrics = calculateChapterMetrics(chapter, nowIso);
      const isActive = chapter.endedAt === null;
      const slipUpCount = slipUpsByChapter[chapter.id] ?? 0;
      const statusLabel = isActive
        ? t("history.activeChapter")
        : slipUpCount > 0
          ? t("history.endedWithSlipUp")
          : t("history.completedChapter");
      const endedLabel = chapter.endedAt
        ? t("history.endedDate", { date: formatDateTimeShort(chapter.endedAt) })
        : t("history.stillInProgress");

      return {
        id: chapter.id,
        title: isActive
          ? t("common.currentChapter")
          : t("history.chapterNumber", { number: chapters.length - index }),
        statusLabel,
        dateLabel: `${formatDateShort(chapter.startedAt)} - ${endedLabel}`,
        durationLabel: formatDurationCompact(metrics.elapsedMs),
        savingsLabel: formatCurrencyFromMinorUnits(
          metrics.moneySavedMinor,
          chapter.currencyCode
        ),
        cigarettesLabel: `${formatEstimatedCount(metrics.cigarettesAvoided)} ${t(
          "common.avoidedSuffix"
        )}`,
      };
    }),
  };
}
