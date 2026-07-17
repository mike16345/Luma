import type { SymbolViewProps } from "expo-symbols";
import type { TranslationKey } from "@/i18n/translations";

export type BadgeCategory = "time" | "cigarettes" | "money" | "chapter" | "goal";

export type BadgeTone = "time" | "savings" | "warm" | "chapter" | "goal";

export type BadgeDefinition = {
  category: BadgeCategory;
  id: string;
  icon: SymbolViewProps["name"];
  iconFallback: string;
  descriptionKey: TranslationKey;
  target: number;
  titleKey: TranslationKey;
  tone: BadgeTone;
  unit: "count" | "minor" | "ms" | "ratio";
};

const dayMs = 24 * 60 * 60 * 1000;

export const badgeDefinitions: BadgeDefinition[] = [
  {
    category: "chapter",
    id: "chapter-first",
    icon: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
    iconFallback: "*",
    descriptionKey: "badges.firstChapterDescription",
    target: 1,
    titleKey: "badges.firstChapter",
    tone: "chapter",
    unit: "count",
  },
  {
    category: "chapter",
    id: "chapter-restart",
    icon: {
      ios: "arrow.clockwise.circle.fill",
      android: "restart_alt",
      web: "restart_alt",
    },
    iconFallback: "R",
    descriptionKey: "badges.freshStartDescription",
    target: 2,
    titleKey: "badges.freshStart",
    tone: "chapter",
    unit: "count",
  },
  {
    category: "time",
    id: "time-1",
    icon: { ios: "sunrise.fill", android: "wb_twilight", web: "wb_twilight" },
    iconFallback: "1",
    descriptionKey: "badges.timeDescription",
    target: dayMs,
    titleKey: "badges.oneDay",
    tone: "time",
    unit: "ms",
  },
  {
    category: "time",
    id: "time-3",
    icon: { ios: "calendar", android: "calendar_month", web: "calendar_month" },
    iconFallback: "3",
    descriptionKey: "badges.timeDescription",
    target: 3 * dayMs,
    titleKey: "badges.threeDays",
    tone: "time",
    unit: "ms",
  },
  {
    category: "time",
    id: "time-7",
    icon: { ios: "7.circle.fill", android: "counter_7", web: "counter_7" },
    iconFallback: "7",
    descriptionKey: "badges.timeDescription",
    target: 7 * dayMs,
    titleKey: "badges.sevenDays",
    tone: "time",
    unit: "ms",
  },
  {
    category: "time",
    id: "time-14",
    icon: { ios: "14.circle.fill", android: "looks_two", web: "looks_two" },
    iconFallback: "14",
    descriptionKey: "badges.timeDescription",
    target: 14 * dayMs,
    titleKey: "badges.fourteenDays",
    tone: "time",
    unit: "ms",
  },
  {
    category: "time",
    id: "time-30",
    icon: { ios: "moon.stars.fill", android: "nights_stay", web: "nights_stay" },
    iconFallback: "30",
    descriptionKey: "badges.timeDescription",
    target: 30 * dayMs,
    titleKey: "badges.thirtyDays",
    tone: "time",
    unit: "ms",
  },
  {
    category: "time",
    id: "time-90",
    icon: { ios: "leaf.fill", android: "eco", web: "eco" },
    iconFallback: "90",
    descriptionKey: "badges.timeDescription",
    target: 90 * dayMs,
    titleKey: "badges.ninetyDays",
    tone: "time",
    unit: "ms",
  },
  {
    category: "time",
    id: "time-180",
    icon: { ios: "flag.checkered", android: "outlined_flag", web: "outlined_flag" },
    iconFallback: "180",
    descriptionKey: "badges.timeDescription",
    target: 180 * dayMs,
    titleKey: "badges.oneEightyDays",
    tone: "time",
    unit: "ms",
  },
  {
    category: "time",
    id: "time-365",
    icon: { ios: "star.circle.fill", android: "stars", web: "stars" },
    iconFallback: "365",
    descriptionKey: "badges.timeDescription",
    target: 365 * dayMs,
    titleKey: "badges.oneYear",
    tone: "time",
    unit: "ms",
  },
  ...[10, 50, 100, 250, 500, 1000].map((target) => ({
    category: "cigarettes" as const,
    id: `cigarettes-${target}`,
    icon: {
      ios: "minus.circle.fill",
      android: "remove_circle",
      web: "remove_circle",
    } as const,
    iconFallback: String(target),
    descriptionKey: "badges.cigarettesDescription" as const,
    target,
    titleKey: "badges.cigarettesAvoided" as const,
    tone: "warm" as const,
    unit: "count" as const,
  })),
  ...[25, 50, 100, 250, 500, 1000].map((target) => ({
    category: "money" as const,
    id: `money-${target}`,
    icon: { ios: "dollarsign.circle.fill", android: "savings", web: "savings" } as const,
    iconFallback: "$",
    descriptionKey: "badges.moneyDescription" as const,
    target: target * 100,
    titleKey: "badges.moneySaved" as const,
    tone: "savings" as const,
    unit: "minor" as const,
  })),
  ...[25, 50, 75, 100].map((target) => ({
    category: "goal" as const,
    id: `goal-${target}`,
    icon: { ios: "target", android: "my_location", web: "my_location" } as const,
    iconFallback: "%",
    descriptionKey: "badges.goalDescription" as const,
    target: target / 100,
    titleKey: "badges.goalProgress" as const,
    tone: "goal" as const,
    unit: "ratio" as const,
  })),
];
