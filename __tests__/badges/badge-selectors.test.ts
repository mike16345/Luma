import { buildBadgeViewModel } from "@/features/badges/badge-selectors";
import { translate } from "@/i18n/translations";

const dayMs = 24 * 60 * 60 * 1000;
const t = (key: Parameters<typeof translate>[1], options?: Parameters<typeof translate>[2]) =>
  translate("en", key, options);

describe("buildBadgeViewModel", () => {
  it("marks earned badges and keeps locked badge progress in the preferred currency", () => {
    const result = buildBadgeViewModel({
      chapterCount: 2,
      cigarettesAvoided: 120,
      currencyCode: "USD",
      goalProgress: 0.6,
      moneySavedMinor: 12500,
      smokeFreeMs: 8 * dayMs,
      t,
    });

    expect(result.featuredBadges.map((badge) => badge.id)).toContain("time-7");
    expect(result.featuredBadges.map((badge) => badge.id)).toContain(
      "cigarettes-100"
    );
    expect(result.featuredBadges.map((badge) => badge.id)).toContain(
      "money-100"
    );
    expect(result.featuredBadges.map((badge) => badge.id)).toContain(
      "chapter-restart"
    );

    const lockedMoneyBadge = result.upcomingBadges.find(
      (badge) => badge.id === "money-250"
    );

    expect(lockedMoneyBadge).toMatchObject({
      isUnlocked: false,
      progress: 0.5,
      targetLabel: "$250.00",
    });
  });
});
