import type { SlipUpRecord } from "@/types/domain";

export interface InsightCountItem {
  label: string;
  count: number;
}

export interface InsightNoteItem {
  id: string;
  occurredAt: string;
  note: string;
}

export interface InsightsSummary {
  totalSlipUps: number;
  alcoholInvolvedCount: number;
  triggers: InsightCountItem[];
  moods: InsightCountItem[];
  timeOfDay: InsightCountItem[];
  dayOfWeek: InsightCountItem[];
  recentNotes: InsightNoteItem[];
}

export type InsightsSummaryLabels = {
  notSpecified: string;
  overnight: string;
  morning: string;
  afternoon: string;
  evening: string;
  locale?: string;
};

const defaultLabels: InsightsSummaryLabels = {
  notSpecified: "Not specified",
  overnight: "Overnight",
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

function normalizeLabel(value: string | null, fallback: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

function incrementCount(counts: Map<string, number>, label: string) {
  counts.set(label, (counts.get(label) ?? 0) + 1);
}

function toSortedItems(counts: Map<string, number>): InsightCountItem[] {
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label));
}

function getTimeOfDayLabel(iso: string, labels: InsightsSummaryLabels) {
  const hour = new Date(iso).getHours();

  if (hour < 5) {
    return labels.overnight;
  }

  if (hour < 12) {
    return labels.morning;
  }

  if (hour < 17) {
    return labels.afternoon;
  }

  return labels.evening;
}

function getDayOfWeekLabel(iso: string, locale?: string) {
  return new Intl.DateTimeFormat(locale, { weekday: "long" }).format(
    new Date(iso)
  );
}

export function buildInsightsSummary(
  slipUps: SlipUpRecord[],
  labels: InsightsSummaryLabels = defaultLabels
): InsightsSummary {
  const triggers = new Map<string, number>();
  const moods = new Map<string, number>();
  const timeOfDay = new Map<string, number>();
  const dayOfWeek = new Map<string, number>();
  let alcoholInvolvedCount = 0;

  for (const slipUp of slipUps) {
    incrementCount(triggers, normalizeLabel(slipUp.trigger, labels.notSpecified));
    incrementCount(moods, normalizeLabel(slipUp.mood, labels.notSpecified));
    incrementCount(timeOfDay, getTimeOfDayLabel(slipUp.occurredAt, labels));
    incrementCount(dayOfWeek, getDayOfWeekLabel(slipUp.occurredAt, labels.locale));

    if (slipUp.alcoholInvolved) {
      alcoholInvolvedCount += 1;
    }
  }

  return {
    totalSlipUps: slipUps.length,
    alcoholInvolvedCount,
    triggers: toSortedItems(triggers),
    moods: toSortedItems(moods),
    timeOfDay: toSortedItems(timeOfDay),
    dayOfWeek: toSortedItems(dayOfWeek),
    recentNotes: slipUps
      .filter((slipUp) => slipUp.note?.trim())
      .slice(0, 3)
      .map((slipUp) => ({
        id: slipUp.id,
        occurredAt: slipUp.occurredAt,
        note: slipUp.note?.trim() ?? "",
      })),
  };
}
