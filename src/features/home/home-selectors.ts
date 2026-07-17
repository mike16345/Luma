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
import type { Translator } from "@/i18n/translations";
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
  nowIso: string,
  t: Translator
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
      label: t("common.smokeFreeTime"),
      value: formatDurationLong(activeMetrics?.elapsedMs ?? 0),
      supportingText: activeChapter
        ? t("home.currentChapterLabel")
        : t("home.noActiveChapterLabel"),
    },
    primaryMetrics: [
      {
        label: buildEstimateLabel(
          t("common.cigarettesAvoided"),
          t("common.estimatedSuffix")
        ),
        value: formatEstimatedCount(activeMetrics?.cigarettesAvoided ?? 0),
      },
      {
        label: buildEstimateLabel(
          t("common.moneySaved"),
          t("common.estimatedSuffix")
        ),
        value: formatCurrencyFromMinorUnits(activeMoneySavedMinor, currencyCode),
      },
    ],
    periods: periodMetrics.map((period) => ({
      key: period.key,
      label: t(`periods.${period.key}`),
      cigarettesAvoided: formatEstimatedCount(period.cigarettesAvoided),
      moneySaved: formatCurrencyFromMinorUnits(
        period.moneySavedMinor,
        currencyCode
      ),
    })),
    weeklySummary: [
      {
        label: buildEstimateLabel(
          t("home.thisWeekAvoided"),
          t("common.estimatedSuffix")
        ),
        value: formatEstimatedCount(weeklyMetrics?.cigarettesAvoided ?? 0),
      },
      {
        label: buildEstimateLabel(
          t("home.thisWeekSaved"),
          t("common.estimatedSuffix")
        ),
        value: formatCurrencyFromMinorUnits(
          weeklyMetrics?.moneySavedMinor ?? 0,
          currencyCode
        ),
      },
    ],
    longestStreak: {
      label: t("common.longestSmokeFreeTime"),
      value: formatDurationCompact(longestStreakMs),
    },
    cumulativeSavings: {
      label: buildEstimateLabel(
        t("common.cumulativeSavings"),
        t("common.estimatedSuffix")
      ),
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
