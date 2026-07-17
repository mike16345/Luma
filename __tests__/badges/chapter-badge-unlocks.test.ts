import { buildChapterBadgeUnlocks } from "@/features/badges/chapter-badge-unlocks";
import { translate } from "@/i18n/translations";
import type { ChapterRecord } from "@/types/domain";

const t = (
  key: Parameters<typeof translate>[1],
  options?: Parameters<typeof translate>[2]
) => translate("en", key, options);

function createChapter(overrides: Partial<ChapterRecord> = {}): ChapterRecord {
  return {
    id: "chapter-1",
    averageCigarettesPerDay: 20,
    createdAt: "2026-07-01T00:00:00.000Z",
    currencyCode: "USD",
    endedAt: "2026-07-04T00:00:00.000Z",
    estimatedCigarettesPerPurchase: 20,
    goalAmountMinor: 4000,
    purchasePriceMinor: 1000,
    smokingType: "pack",
    startedAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-07-04T00:00:00.000Z",
    ...overrides,
  };
}

describe("buildChapterBadgeUnlocks", () => {
  it("returns repeatable badges unlocked by one chapter's own progress", () => {
    const result = buildChapterBadgeUnlocks({
      chapter: createChapter(),
      chapterNumber: 3,
      nowIso: "2026-07-05T00:00:00.000Z",
      t,
    });

    expect(result.unlockedBadges.map((badge) => badge.id)).toEqual([
      "time-1",
      "time-3",
      "cigarettes-10",
      "cigarettes-50",
      "money-25",
      "goal-25",
      "goal-50",
      "goal-75",
    ]);
  });

  it("keeps chapter-start badges one-time to the chapter they were earned in", () => {
    const firstChapter = buildChapterBadgeUnlocks({
      chapter: createChapter({ id: "chapter-first" }),
      chapterNumber: 1,
      nowIso: "2026-07-05T00:00:00.000Z",
      t,
    });
    const secondChapter = buildChapterBadgeUnlocks({
      chapter: createChapter({ id: "chapter-second" }),
      chapterNumber: 2,
      nowIso: "2026-07-05T00:00:00.000Z",
      t,
    });

    expect(firstChapter.unlockedBadges.map((badge) => badge.id)).toContain(
      "chapter-first"
    );
    expect(firstChapter.unlockedBadges.map((badge) => badge.id)).not.toContain(
      "chapter-restart"
    );
    expect(secondChapter.unlockedBadges.map((badge) => badge.id)).toContain(
      "chapter-restart"
    );
    expect(secondChapter.unlockedBadges.map((badge) => badge.id)).not.toContain(
      "chapter-first"
    );
  });
});
