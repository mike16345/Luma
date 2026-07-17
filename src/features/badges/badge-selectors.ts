import {
  badgeDefinitions,
  type BadgeCategory,
  type BadgeDefinition,
  type BadgeTone,
} from "@/features/badges/badge-definitions";
import type { Translator } from "@/i18n/translations";
import { formatCurrencyFromMinorUnits } from "@/lib/formatting/currency";
import { formatDurationCompact } from "@/lib/formatting/duration";
import { formatEstimatedCount } from "@/lib/formatting/estimates";

export type BadgeViewModel = {
  category: BadgeCategory;
  currentLabel: string;
  description: string;
  icon: BadgeDefinition["icon"];
  iconFallback: string;
  id: string;
  isUnlocked: boolean;
  progress: number;
  remainingLabel: string | null;
  targetLabel: string;
  title: string;
  tone: BadgeTone;
};

export type BadgeSummaryViewModel = {
  badges: BadgeViewModel[];
  featuredBadges: BadgeViewModel[];
  upcomingBadges: BadgeViewModel[];
};

export type BadgeMetricInput = {
  chapterCount: number;
  cigarettesAvoided: number;
  currencyCode: string;
  goalProgress: number | null;
  moneySavedMinor: number;
  smokeFreeMs: number;
  t: Translator;
};

function getCurrentValue(definition: BadgeDefinition, input: BadgeMetricInput) {
  switch (definition.category) {
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

function clampProgress(current: number, target: number) {
  if (target <= 0) {
    return 0;
  }

  return Math.min(Math.max(current / target, 0), 1);
}

function formatValue(
  definition: BadgeDefinition,
  value: number,
  input: BadgeMetricInput
) {
  switch (definition.unit) {
    case "count":
      return formatEstimatedCount(value);
    case "minor":
      return formatCurrencyFromMinorUnits(value, input.currencyCode);
    case "ms":
      return formatDurationCompact(value);
    case "ratio":
      return `${Math.round(value * 100)}%`;
  }
}

function buildRemainingLabel(
  definition: BadgeDefinition,
  current: number,
  input: BadgeMetricInput
) {
  const remaining = Math.max(definition.target - current, 0);

  if (remaining <= 0) {
    return null;
  }

  return input.t("badges.remaining", {
    amount: formatValue(definition, remaining, input),
  });
}

function buildBadge(
  definition: BadgeDefinition,
  input: BadgeMetricInput
): BadgeViewModel {
  const current = getCurrentValue(definition, input);
  const progress = clampProgress(current, definition.target);

  return {
    category: definition.category,
    currentLabel: formatValue(definition, current, input),
    description: input.t(definition.descriptionKey),
    icon: definition.icon,
    iconFallback: definition.iconFallback,
    id: definition.id,
    isUnlocked: progress >= 1,
    progress,
    remainingLabel: buildRemainingLabel(definition, current, input),
    targetLabel: formatValue(definition, definition.target, input),
    title: input.t(definition.titleKey, {
      target: formatValue(definition, definition.target, input),
    }),
    tone: definition.tone,
  };
}

export function buildBadgeViewModel(
  input: BadgeMetricInput
): BadgeSummaryViewModel {
  const badges = badgeDefinitions.map((definition) => buildBadge(definition, input));
  const featuredBadges = badges
    .filter((badge) => badge.isUnlocked)
    .sort((left, right) => right.progress - left.progress);
  const upcomingBadges = badges
    .filter((badge) => !badge.isUnlocked)
    .sort((left, right) => right.progress - left.progress)
    .slice(0, 6);

  return {
    badges,
    featuredBadges,
    upcomingBadges,
  };
}
