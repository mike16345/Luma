import { buildChapterReportHtml } from "@/features/history/chapter-report-html";
import type { BadgeViewModel } from "@/features/badges/badge-selectors";
import type { ChapterDetailViewModel } from "@/features/history/chapter-detail-selectors";
import { translate } from "@/i18n/translations";

const t = (
  key: Parameters<typeof translate>[1],
  options?: Parameters<typeof translate>[2]
) => translate("en", key, options);

function createBadge(overrides: Partial<BadgeViewModel> = {}): BadgeViewModel {
  return {
    category: "time",
    currentLabel: "1 day",
    description: "Reached during this chapter.",
    icon: { ios: "sunrise.fill", android: "wb_twilight", web: "wb_twilight" },
    iconFallback: "1",
    id: "time-1",
    isUnlocked: true,
    progress: 1,
    remainingLabel: null,
    targetLabel: "1 day",
    title: "1 smoke-free day",
    tone: "time",
    ...overrides,
  };
}

function createChapterDetail(
  overrides: Partial<ChapterDetailViewModel> = {}
): ChapterDetailViewModel {
  return {
    badgesUnlockedDuringChapter: [createBadge()],
    id: "chapter-1",
    metrics: [
      { label: "Started", value: "Jul 1, 2026, 10:00 AM" },
      { label: "Smoke-free time", value: "3d" },
      { label: "Estimated saved (estimate)", value: "$35.00" },
    ],
    slipUp: {
      title: "Slip-up context",
      rows: [
        { label: "Logged at", value: "Jul 4, 2026, 10:00 AM" },
        { label: "Note", value: "After dinner" },
      ],
    },
    statusLabel: "Ended with slip-up",
    subtitle: "Read-only chapter detail.",
    title: "Chapter 1",
    ...overrides,
  };
}

describe("buildChapterReportHtml", () => {
  it("renders chapter metrics, badges, slip-up context, and local footer", () => {
    const html = buildChapterReportHtml({
      data: createChapterDetail(),
      direction: "ltr",
      generatedAtLabel: "Jul 17, 2026, 12:00 PM",
      t,
    });

    expect(html).toContain("Luma");
    expect(html).toContain("Chapter report");
    expect(html).toContain("Chapter 1");
    expect(html).toContain("Smoke-free time");
    expect(html).toContain("1 smoke-free day");
    expect(html).toContain("Slip-up context");
    expect(html).toContain("Generated locally on this device.");
  });

  it("escapes user-provided text and omits empty optional sections", () => {
    const html = buildChapterReportHtml({
      data: createChapterDetail({
        badgesUnlockedDuringChapter: [],
        slipUp: {
          title: "Slip-up context",
          rows: [{ label: "Note", value: "<script>alert(1)</script>" }],
        },
        title: "Chapter <2>",
      }),
      direction: "rtl",
      generatedAtLabel: "Jul 17, 2026, 12:00 PM",
      t,
    });

    expect(html).toContain('dir="rtl"');
    expect(html).toContain("Chapter &lt;2&gt;");
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("Unlocked during this chapter");
  });
});
