import type { ChapterRecord } from "@/types/domain";

const MS_PER_HOUR = 60 * 60 * 1000;
const HOURS_PER_DAY = 24;

export interface ChapterMetrics {
  elapsedMs: number;
  cigarettesAvoided: number;
  moneySavedMinor: number;
  costPerCigaretteMinor: number;
}

export interface MetricWindow {
  startAt: string;
  endAt: string;
}

export function calculateCostPerCigaretteMinor(chapter: ChapterRecord) {
  return (
    chapter.purchasePriceMinor / chapter.estimatedCigarettesPerPurchase
  );
}

export function calculateChapterMetrics(
  chapter: ChapterRecord,
  nowIso: string,
  window?: MetricWindow
): ChapterMetrics {
  const chapterStartMs = new Date(chapter.startedAt).getTime();
  const chapterEndMs = new Date(chapter.endedAt ?? nowIso).getTime();
  const windowStartMs = window
    ? new Date(window.startAt).getTime()
    : chapterStartMs;
  const windowEndMs = window ? new Date(window.endAt).getTime() : chapterEndMs;
  const effectiveStartMs = Math.max(chapterStartMs, windowStartMs);
  const effectiveEndMs = Math.min(chapterEndMs, windowEndMs);
  const elapsedMs = Math.max(0, effectiveEndMs - effectiveStartMs);
  const cigarettesPerHour = chapter.averageCigarettesPerDay / HOURS_PER_DAY;
  const cigarettesAvoided = (elapsedMs / MS_PER_HOUR) * cigarettesPerHour;
  const costPerCigaretteMinor = calculateCostPerCigaretteMinor(chapter);
  const moneySavedMinor = cigarettesAvoided * costPerCigaretteMinor;

  return {
    elapsedMs,
    cigarettesAvoided,
    moneySavedMinor,
    costPerCigaretteMinor,
  };
}

export function calculateGoalProgress(
  chapter: ChapterRecord,
  moneySavedMinor: number
) {
  if (!chapter.goalAmountMinor) {
    return null;
  }

  return Math.min(moneySavedMinor / chapter.goalAmountMinor, 1);
}
