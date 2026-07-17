import {
  buildInsightsSummary,
  type InsightCountItem,
} from "@/lib/calculations/insights";
import { formatDateTimeShort } from "@/lib/formatting/date-time";
import type { SupportedLanguage } from "@/i18n/languages";
import type { Translator } from "@/i18n/translations";
import type { SlipUpRecord } from "@/types/domain";

export interface InsightsMetric {
  label: string;
  value: string;
  supportingText?: string;
}

export interface InsightsRow {
  label: string;
  value: string;
}

export interface InsightsNote {
  id: string;
  dateLabel: string;
  note: string;
}

export interface InsightsViewModel {
  hasSlipUps: boolean;
  summary: InsightsMetric[];
  triggerRows: InsightsRow[];
  moodRows: InsightsRow[];
  timeRows: InsightsRow[];
  dayRows: InsightsRow[];
  recentNotes: InsightsNote[];
}

function formatTopItem(items: InsightCountItem[]) {
  const topItem = items[0];

  if (!topItem) {
    return null;
  }

  return topItem.label;
}

function toRows(items: InsightCountItem[]): InsightsRow[] {
  return items.map((item) => ({
    label: item.label,
    value: `${item.count}`,
  }));
}

export function buildInsightsViewModel(
  slipUps: SlipUpRecord[],
  t: Translator,
  language: SupportedLanguage
): InsightsViewModel {
  const summary = buildInsightsSummary(slipUps, {
    notSpecified: t("insights.notSpecified"),
    overnight: t("insights.overnight"),
    morning: t("insights.morning"),
    afternoon: t("insights.afternoon"),
    evening: t("insights.evening"),
    locale: language === "he" ? "he-IL" : "en-US",
  });

  return {
    hasSlipUps: summary.totalSlipUps > 0,
    summary: [
      {
        label: t("insights.loggedSlipUps"),
        value: `${summary.totalSlipUps}`,
      },
      {
        label: t("insights.alcoholInvolved"),
        value: `${summary.alcoholInvolvedCount}`,
        supportingText: t("insights.ofLogged", { count: summary.totalSlipUps }),
      },
      {
        label: t("insights.topTrigger"),
        value: formatTopItem(summary.triggers) ?? t("common.noData"),
      },
      {
        label: t("insights.topMood"),
        value: formatTopItem(summary.moods) ?? t("common.noData"),
      },
    ],
    triggerRows: toRows(summary.triggers),
    moodRows: toRows(summary.moods),
    timeRows: toRows(summary.timeOfDay),
    dayRows: toRows(summary.dayOfWeek),
    recentNotes: summary.recentNotes.map((note) => ({
      id: note.id,
      dateLabel: formatDateTimeShort(note.occurredAt),
      note: note.note,
    })),
  };
}
