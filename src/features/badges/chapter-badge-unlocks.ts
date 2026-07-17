import { badgeDefinitions } from "@/features/badges/badge-definitions";
import {
  buildBadgeForCurrentValue,
  type BadgeMetricInput,
  type BadgeViewModel,
} from "@/features/badges/badge-selectors";
import type { Translator } from "@/i18n/translations";
import {
  calculateChapterMetrics,
  calculateGoalProgress,
} from "@/lib/calculations/chapter-metrics";
import type { ChapterRecord } from "@/types/domain";

export type ChapterBadgeUnlocksInput = {
  chapter: ChapterRecord;
  chapterNumber: number;
  nowIso: string;
  t: Translator;
};

export type ChapterBadgeUnlocksViewModel = {
  unlockedBadges: BadgeViewModel[];
};

export function buildChapterBadgeUnlocks(
  input: ChapterBadgeUnlocksInput
): ChapterBadgeUnlocksViewModel {
  const metrics = calculateChapterMetrics(input.chapter, input.nowIso);
  const goalProgress = calculateGoalProgress(
    input.chapter,
    metrics.moneySavedMinor
  );
  const metricInput: BadgeMetricInput = {
    chapterCount: input.chapterNumber,
    cigarettesAvoided: metrics.cigarettesAvoided,
    currencyCode: input.chapter.currencyCode,
    goalProgress,
    moneySavedMinor: metrics.moneySavedMinor,
    smokeFreeMs: metrics.elapsedMs,
    t: input.t,
  };
  const unlockedBadges = badgeDefinitions
    .map((definition) => {
      const current =
        definition.category === "chapter" &&
        input.chapterNumber !== definition.target
          ? 0
          : undefined;

      return buildBadgeForCurrentValue(
        definition,
        current ?? getChapterBadgeCurrentValue(definition.category, metricInput),
        metricInput
      );
    })
    .filter((badge) => badge.isUnlocked);

  return {
    unlockedBadges,
  };
}

function getChapterBadgeCurrentValue(
  category: BadgeViewModel["category"],
  input: BadgeMetricInput
) {
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
