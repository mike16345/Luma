import type { ProgressPeriod } from "@/types/domain";

export interface CalendarPeriodRange {
  key: ProgressPeriod;
  label: string;
  startAt: string;
  endAt: string;
}

function startOfLocalDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0
  );
}

function startOfLocalWeek(date: Date) {
  const start = startOfLocalDay(date);
  const day = start.getDay();
  const daysSinceMonday = (day + 6) % 7;
  start.setDate(start.getDate() - daysSinceMonday);
  return start;
}

function startOfLocalMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

function startOfLocalYear(date: Date) {
  return new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0);
}

export function getCalendarPeriodRanges(nowIso: string): CalendarPeriodRange[] {
  const now = new Date(nowIso);
  const endAt = now.toISOString();

  return [
    {
      key: "today",
      label: "Today",
      startAt: startOfLocalDay(now).toISOString(),
      endAt,
    },
    {
      key: "thisWeek",
      label: "This week",
      startAt: startOfLocalWeek(now).toISOString(),
      endAt,
    },
    {
      key: "thisMonth",
      label: "This month",
      startAt: startOfLocalMonth(now).toISOString(),
      endAt,
    },
    {
      key: "thisYear",
      label: "This year",
      startAt: startOfLocalYear(now).toISOString(),
      endAt,
    },
    {
      key: "allTime",
      label: "All time",
      startAt: new Date(0).toISOString(),
      endAt,
    },
  ];
}
