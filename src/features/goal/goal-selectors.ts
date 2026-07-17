import {
  calculateChapterMetrics,
  calculateGoalProgress,
} from "@/lib/calculations/chapter-metrics";
import { formatCurrencyFromMinorUnits } from "@/lib/formatting/currency";
import type { ChapterRecord } from "@/types/domain";

export interface GoalViewModel {
  hasActiveChapter: boolean;
  hasGoal: boolean;
  currencyCode: string;
  savedLabel: string;
  targetLabel: string | null;
  remainingLabel: string | null;
  progressPercentLabel: string | null;
  progress: number | null;
  currentGoalAmountMinor: number | null;
}

export function buildGoalViewModel(
  activeChapter: ChapterRecord | null,
  nowIso: string
): GoalViewModel {
  if (!activeChapter) {
    return {
      hasActiveChapter: false,
      hasGoal: false,
      currencyCode: "USD",
      savedLabel: formatCurrencyFromMinorUnits(0, "USD"),
      targetLabel: null,
      remainingLabel: null,
      progressPercentLabel: null,
      progress: null,
      currentGoalAmountMinor: null,
    };
  }

  const metrics = calculateChapterMetrics(activeChapter, nowIso);
  const progress = calculateGoalProgress(activeChapter, metrics.moneySavedMinor);
  const remainingMinor = activeChapter.goalAmountMinor
    ? Math.max(0, activeChapter.goalAmountMinor - metrics.moneySavedMinor)
    : null;

  return {
    hasActiveChapter: true,
    hasGoal: Boolean(activeChapter.goalAmountMinor),
    currencyCode: activeChapter.currencyCode,
    savedLabel: formatCurrencyFromMinorUnits(
      metrics.moneySavedMinor,
      activeChapter.currencyCode
    ),
    targetLabel: activeChapter.goalAmountMinor
      ? formatCurrencyFromMinorUnits(
          activeChapter.goalAmountMinor,
          activeChapter.currencyCode
        )
      : null,
    remainingLabel:
      remainingMinor === null
        ? null
        : formatCurrencyFromMinorUnits(remainingMinor, activeChapter.currencyCode),
    progressPercentLabel:
      progress === null ? null : `${Math.round(progress * 100)}%`,
    progress,
    currentGoalAmountMinor: activeChapter.goalAmountMinor,
  };
}
