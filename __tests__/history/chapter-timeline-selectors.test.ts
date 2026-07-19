import { buildChapterTimeline } from "@/features/history/chapter-timeline-selectors";
import { translate } from "@/i18n/translations";
import type { ChapterRecord, SlipUpRecord } from "@/types/domain";

const t = (
  key: Parameters<typeof translate>[1],
  options?: Parameters<typeof translate>[2]
) => translate("en", key, options);

function createChapter(overrides: Partial<ChapterRecord> = {}): ChapterRecord {
  return {
    averageCigarettesPerDay: 20,
    createdAt: "2026-07-01T00:00:00.000Z",
    currencyCode: "USD",
    endedAt: "2026-07-04T00:00:00.000Z",
    estimatedCigarettesPerPurchase: 20,
    goalAmountMinor: 8000,
    id: "chapter-1",
    purchasePriceMinor: 2000,
    smokingType: "pack",
    startedAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-07-04T00:00:00.000Z",
    ...overrides,
  };
}

function createSlipUp(overrides: Partial<SlipUpRecord> = {}): SlipUpRecord {
  return {
    alcoholInvolved: false,
    chapterId: "chapter-1",
    createdAt: "2026-07-04T00:00:00.000Z",
    id: "slip-1",
    mood: null,
    note: null,
    occurredAt: "2026-07-04T00:00:00.000Z",
    trigger: null,
    ...overrides,
  };
}

function findEvent(
  timeline: ReturnType<typeof buildChapterTimeline>,
  eventId: string
) {
  const event = timeline.events.find((item) => item.id === eventId);

  if (!event) {
    throw new Error(`Missing timeline event ${eventId}`);
  }

  return event;
}

describe("buildChapterTimeline", () => {
  it("derives ordered chapter, badge, goal, and slip-up events", () => {
    const timeline = buildChapterTimeline({
      chapter: createChapter(),
      chapterNumber: 1,
      nowIso: "2026-07-05T00:00:00.000Z",
      slipUp: createSlipUp(),
      t,
    });

    expect(timeline.events[0]).toMatchObject({
      id: "chapter-start",
      isEstimated: false,
      occurredAtIso: "2026-07-01T00:00:00.000Z",
    });
    expect(findEvent(timeline, "badge-time-1")).toMatchObject({
      isEstimated: false,
      occurredAtIso: "2026-07-02T00:00:00.000Z",
    });
    expect(findEvent(timeline, "badge-cigarettes-10")).toMatchObject({
      isEstimated: true,
      occurredAtIso: "2026-07-01T12:00:00.000Z",
    });
    expect(findEvent(timeline, "goal-50")).toMatchObject({
      isEstimated: true,
      occurredAtIso: "2026-07-03T00:00:00.000Z",
    });
    expect(findEvent(timeline, "slip-up")).toMatchObject({
      isEstimated: false,
      occurredAtIso: "2026-07-04T00:00:00.000Z",
    });

    const timestamps = timeline.events.map((event) =>
      new Date(event.occurredAtIso).getTime()
    );
    expect(timestamps).toEqual([...timestamps].sort((left, right) => left - right));
    expect(timeline.events.some((event) => event.id === "goal-100")).toBe(false);
  });

  it("uses the current time window for active chapters without adding an end event", () => {
    const timeline = buildChapterTimeline({
      chapter: createChapter({ endedAt: null }),
      chapterNumber: 2,
      nowIso: "2026-07-03T00:00:00.000Z",
      slipUp: undefined,
      t,
    });

    expect(findEvent(timeline, "badge-chapter-restart")).toMatchObject({
      isEstimated: false,
      occurredAtIso: "2026-07-01T00:00:00.000Z",
    });
    expect(findEvent(timeline, "goal-50")).toMatchObject({
      occurredAtIso: "2026-07-03T00:00:00.000Z",
    });
    expect(timeline.events.some((event) => event.id === "slip-up")).toBe(false);
    expect(timeline.events.some((event) => event.id === "chapter-ended")).toBe(false);
  });

  it("places the completed goal milestone when the goal was reached", () => {
    const timeline = buildChapterTimeline({
      chapter: createChapter({ goalAmountMinor: 3000 }),
      chapterNumber: 1,
      nowIso: "2026-07-05T00:00:00.000Z",
      slipUp: createSlipUp(),
      t,
    });

    expect(findEvent(timeline, "goal-100")).toMatchObject({
      occurredAtIso: "2026-07-02T12:00:00.000Z",
    });
  });
});
