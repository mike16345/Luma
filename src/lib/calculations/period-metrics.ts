import { calculateChapterMetrics } from "@/lib/calculations/chapter-metrics";
import { getCalendarPeriodRanges } from "@/lib/dates/calendar-periods";
import type { ChapterRecord, ProgressPeriod } from "@/types/domain";

export interface PeriodMetric {
  key: ProgressPeriod;
  label: string;
  elapsedMs: number;
  cigarettesAvoided: number;
  moneySavedMinor: number;
}

export function buildPeriodMetrics(
  chapters: ChapterRecord[],
  nowIso: string
): PeriodMetric[] {
  return getCalendarPeriodRanges(nowIso).map((period) => {
    const totals = chapters.reduce(
      (accumulator, chapter) => {
        const metrics = calculateChapterMetrics(chapter, nowIso, {
          startAt: period.startAt,
          endAt: period.endAt,
        });

        return {
          elapsedMs: accumulator.elapsedMs + metrics.elapsedMs,
          cigarettesAvoided:
            accumulator.cigarettesAvoided + metrics.cigarettesAvoided,
          moneySavedMinor:
            accumulator.moneySavedMinor + metrics.moneySavedMinor,
        };
      },
      {
        elapsedMs: 0,
        cigarettesAvoided: 0,
        moneySavedMinor: 0,
      }
    );

    return {
      key: period.key,
      label: period.label,
      ...totals,
    };
  });
}
