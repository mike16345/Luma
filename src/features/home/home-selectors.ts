import { calculateGoalProgress } from "@/lib/calculations/chapter-metrics";
import { buildPeriodMetrics } from "@/lib/calculations/period-metrics";
import {
  calculateCumulativeSavingsMinor,
  calculateLongestStreakMs,
} from "@/lib/calculations/streaks";
import { formatCurrencyFromMinorUnits } from "@/lib/formatting/currency";
import {
  buildEstimateLabel,
  formatEstimatedCount,
} from "@/lib/formatting/estimates";
import {
  formatDurationCompact,
  formatDurationLong,
} from "@/lib/formatting/duration";
import type { ChapterRecord } from "@/types/domain";

export interface HomeMetricViewModel {
  label: string;
  value: string;
  supportingText?: string;
}

export interface HomePeriodViewModel {
  key: string;
  label: string;
  cigarettesAvoided: string;
  moneySaved: string;
}

export interface HomeGoalViewModel {
  hasGoal: boolean;
  progress: number | null;
  savedLabel: string | null;
  targetLabel: string | null;
}

export interface HomeViewModel {
  hasActiveChapter: boolean;
  activeChapterId: string | null;
  currencyCode: string;
  headline: HomeMetricViewModel;
  primaryMetrics: HomeMetricViewModel[];
  periods: HomePeriodViewModel[];
  weeklySummary: HomeMetricViewModel[];
  longestStreak: HomeMetricViewModel;
  cumulativeSavings: HomeMetricViewModel;
  goal: HomeGoalViewModel;
}

function resolveDisplayCurrency(
  activeChapter: ChapterRecord | null,
  chapters: ChapterRecord[]
) {
  return activeChapter?.currencyCode ?? chapters[0]?.currencyCode ?? "USD";
}

export function buildHomeViewModel(
  chapters: ChapterRecord[],
  activeChapter: ChapterRecord | null,
  nowIso: string
): HomeViewModel {
  const currencyCode = resolveDisplayCurrency(activeChapter, chapters);
  const activeMetrics = activeChapter
    ? buildPeriodMetrics([activeChapter], nowIso).find(
        (period) => period.key === "allTime"
      )
    : null;
  const periodMetrics = buildPeriodMetrics(chapters, nowIso);
  const weeklyMetrics = periodMetrics.find((period) => period.key === "thisWeek");
  const longestStreakMs = calculateLongestStreakMs(chapters, nowIso);
  const cumulativeSavingsMinor = calculateCumulativeSavingsMinor(chapters, nowIso);
  const activeMoneySavedMinor = activeMetrics?.moneySavedMinor ?? 0;
  const goalProgress = activeChapter
    ? calculateGoalProgress(activeChapter, activeMoneySavedMinor)
    : null;

  return {
    hasActiveChapter: activeChapter !== null,
    activeChapterId: activeChapter?.id ?? null,
    currencyCode,
    headline: {
      label: "Smoke-free time",
      value: formatDurationLong(activeMetrics?.elapsedMs ?? 0),
      supportingText: activeChapter ? "Current chapter" : "No active chapter",
    },
    primaryMetrics: [
      {
        label: buildEstimateLabel("Cigarettes avoided"),
        value: formatEstimatedCount(activeMetrics?.cigarettesAvoided ?? 0),
      },
      {
        label: buildEstimateLabel("Money saved"),
        value: formatCurrencyFromMinorUnits(activeMoneySavedMinor, currencyCode),
      },
    ],
    periods: periodMetrics.map((period) => ({
      key: period.key,
      label: period.label,
      cigarettesAvoided: formatEstimatedCount(period.cigarettesAvoided),
      moneySaved: formatCurrencyFromMinorUnits(
        period.moneySavedMinor,
        currencyCode
      ),
    })),
    weeklySummary: [
      {
        label: buildEstimateLabel("This week avoided"),
        value: formatEstimatedCount(weeklyMetrics?.cigarettesAvoided ?? 0),
      },
      {
        label: buildEstimateLabel("This week saved"),
        value: formatCurrencyFromMinorUnits(
          weeklyMetrics?.moneySavedMinor ?? 0,
          currencyCode
        ),
      },
    ],
    longestStreak: {
      label: "Longest smoke-free time",
      value: formatDurationCompact(longestStreakMs),
    },
    cumulativeSavings: {
      label: buildEstimateLabel("Cumulative savings"),
      value: formatCurrencyFromMinorUnits(cumulativeSavingsMinor, currencyCode),
    },
    goal: {
      hasGoal: Boolean(activeChapter?.goalAmountMinor),
      progress: goalProgress,
      savedLabel: activeChapter
        ? formatCurrencyFromMinorUnits(activeMoneySavedMinor, currencyCode)
        : null,
      targetLabel: activeChapter?.goalAmountMinor
        ? formatCurrencyFromMinorUnits(activeChapter.goalAmountMinor, currencyCode)
        : null,
    },
  };
}
