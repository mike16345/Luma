import { calculateChapterMetrics } from "@/lib/calculations/chapter-metrics";
import type { ChapterRecord } from "@/types/domain";

export function calculateLongestStreakMs(
  chapters: ChapterRecord[],
  nowIso: string
) {
  return chapters.reduce((longest, chapter) => {
    const metrics = calculateChapterMetrics(chapter, nowIso);
    return Math.max(longest, metrics.elapsedMs);
  }, 0);
}

export function calculateCumulativeSavingsMinor(
  chapters: ChapterRecord[],
  nowIso: string
) {
  return chapters.reduce((total, chapter) => {
    const metrics = calculateChapterMetrics(chapter, nowIso);
    return total + metrics.moneySavedMinor;
  }, 0);
}
