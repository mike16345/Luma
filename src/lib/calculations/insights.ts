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

const TIME_OF_DAY_LABELS = [
  "Overnight",
  "Morning",
  "Afternoon",
  "Evening",
] as const;

function normalizeLabel(value: string | null, fallback = "Not specified") {
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

function getTimeOfDayLabel(iso: string): (typeof TIME_OF_DAY_LABELS)[number] {
  const hour = new Date(iso).getHours();

  if (hour < 5) {
    return "Overnight";
  }

  if (hour < 12) {
    return "Morning";
  }

  if (hour < 17) {
    return "Afternoon";
  }

  return "Evening";
}

function getDayOfWeekLabel(iso: string) {
  return new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(
    new Date(iso)
  );
}

export function buildInsightsSummary(
  slipUps: SlipUpRecord[]
): InsightsSummary {
  const triggers = new Map<string, number>();
  const moods = new Map<string, number>();
  const timeOfDay = new Map<string, number>();
  const dayOfWeek = new Map<string, number>();
  let alcoholInvolvedCount = 0;

  for (const slipUp of slipUps) {
    incrementCount(triggers, normalizeLabel(slipUp.trigger));
    incrementCount(moods, normalizeLabel(slipUp.mood));
    incrementCount(timeOfDay, getTimeOfDayLabel(slipUp.occurredAt));
    incrementCount(dayOfWeek, getDayOfWeekLabel(slipUp.occurredAt));

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
