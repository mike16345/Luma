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
  nowIso: string
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
        label: "Chapters",
        value: String(chapters.length),
      },
      {
        label: "Completed",
        value: String(completedCount),
      },
      {
        label: "Longest smoke-free time",
        value: formatDurationCompact(longestStreakMs),
      },
      {
        label: buildEstimateLabel("Cumulative savings"),
        value: formatCurrencyFromMinorUnits(cumulativeSavingsMinor, currencyCode),
      },
    ],
    rows: chapters.map((chapter, index) => {
      const metrics = calculateChapterMetrics(chapter, nowIso);
      const isActive = chapter.endedAt === null;
      const slipUpCount = slipUpsByChapter[chapter.id] ?? 0;
      const statusLabel = isActive
        ? "Active chapter"
        : slipUpCount > 0
          ? "Ended with slip-up"
          : "Completed chapter";
      const endedLabel = chapter.endedAt
        ? `Ended ${formatDateTimeShort(chapter.endedAt)}`
        : "Still in progress";

      return {
        id: chapter.id,
        title: isActive ? "Current chapter" : `Chapter ${chapters.length - index}`,
        statusLabel,
        dateLabel: `${formatDateShort(chapter.startedAt)} - ${endedLabel}`,
        durationLabel: formatDurationCompact(metrics.elapsedMs),
        savingsLabel: formatCurrencyFromMinorUnits(
          metrics.moneySavedMinor,
          chapter.currencyCode
        ),
        cigarettesLabel: `${formatEstimatedCount(
          metrics.cigarettesAvoided
        )} avoided`,
      };
    }),
  };
}
