import {
  buildInsightsSummary,
  type InsightCountItem,
} from "@/lib/calculations/insights";
import { formatDateTimeShort } from "@/lib/formatting/date-time";
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
    return "No data";
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
  slipUps: SlipUpRecord[]
): InsightsViewModel {
  const summary = buildInsightsSummary(slipUps);

  return {
    hasSlipUps: summary.totalSlipUps > 0,
    summary: [
      {
        label: "Logged slip-ups",
        value: `${summary.totalSlipUps}`,
      },
      {
        label: "Alcohol involved",
        value: `${summary.alcoholInvolvedCount}`,
        supportingText: `of ${summary.totalSlipUps} logged`,
      },
      {
        label: "Top trigger",
        value: formatTopItem(summary.triggers),
      },
      {
        label: "Top mood",
        value: formatTopItem(summary.moods),
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
