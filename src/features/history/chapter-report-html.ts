import type { ChapterDetailViewModel } from "@/features/history/chapter-detail-selectors";
import type { TextDirection } from "@/i18n/languages";
import type { Translator } from "@/i18n/translations";

export type ChapterReportHtmlInput = {
  data: ChapterDetailViewModel;
  direction: TextDirection;
  generatedAtLabel: string;
  t: Translator;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderMetricRows(rows: Array<{ label: string; value: string }>) {
  return rows
    .map(
      (row) => `
        <div class="metric-row">
          <dt>${escapeHtml(row.label)}</dt>
          <dd>${escapeHtml(row.value)}</dd>
        </div>`
    )
    .join("");
}

function renderBadgeSection(input: ChapterReportHtmlInput) {
  const { data, t } = input;

  if (data.badgesUnlockedDuringChapter.length === 0) {
    return "";
  }

  const badges = data.badgesUnlockedDuringChapter
    .map(
      (badge) => `
        <li>
          <span class="badge-mark">${escapeHtml(badge.iconFallback)}</span>
          <span>${escapeHtml(badge.title)}</span>
        </li>`
    )
    .join("");

  return `
    <section>
      <h2>${escapeHtml(t("history.unlockedDuringChapter"))}</h2>
      <ul class="badge-list">${badges}</ul>
    </section>`;
}

function renderSlipUpSection(data: ChapterDetailViewModel) {
  if (!data.slipUp) {
    return "";
  }

  return `
    <section>
      <h2>${escapeHtml(data.slipUp.title)}</h2>
      <dl>${renderMetricRows(data.slipUp.rows)}</dl>
    </section>`;
}

export function buildChapterReportHtml(input: ChapterReportHtmlInput) {
  const { data, direction, generatedAtLabel, t } = input;
  const textAlign = direction === "rtl" ? "right" : "left";

  return `<!doctype html>
<html lang="${direction === "rtl" ? "he" : "en"}" dir="${direction}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(t("history.pdfTitle"))}</title>
    <style>
      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        padding: 42px;
        background: #f3f8f4;
        color: #142c28;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        text-align: ${textAlign};
      }

      main {
        max-width: 760px;
        margin: 0 auto;
        padding: 34px;
        border: 1px solid #dce7de;
        border-radius: 28px;
        background: #fffdf8;
      }

      .brand {
        margin: 0 0 10px;
        color: #177c68;
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 0;
      }

      h1 {
        margin: 0 0 8px;
        color: #142c28;
        font-size: 34px;
        line-height: 1.15;
      }

      .status {
        display: inline-block;
        margin: 12px 0 24px;
        padding: 8px 12px;
        border-radius: 999px;
        background: #ddf4ea;
        color: #0d5f51;
        font-size: 13px;
        font-weight: 700;
      }

      section {
        margin-top: 26px;
        padding-top: 22px;
        border-top: 1px solid #dce7de;
      }

      h2 {
        margin: 0 0 14px;
        font-size: 20px;
        line-height: 1.3;
      }

      dl {
        margin: 0;
      }

      .metric-row {
        display: flex;
        justify-content: space-between;
        gap: 18px;
        padding: 10px 0;
      }

      dt {
        color: #6f827b;
        font-size: 13px;
      }

      dd {
        margin: 0;
        color: #142c28;
        font-size: 15px;
        font-weight: 650;
        text-align: end;
      }

      .badge-list {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .badge-list li {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px;
        border: 1px solid #dce7de;
        border-radius: 16px;
        background: #ffffff;
        font-weight: 650;
      }

      .badge-mark {
        display: inline-flex;
        width: 30px;
        height: 30px;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        background: #ddf4ea;
        color: #177c68;
        font-size: 12px;
        font-weight: 800;
      }

      footer {
        margin-top: 28px;
        color: #6f827b;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <main>
      <p class="brand">${escapeHtml(t("common.appName"))}</p>
      <h1>${escapeHtml(t("history.pdfTitle"))}</h1>
      <p>${escapeHtml(data.title)}</p>
      <p class="status">${escapeHtml(data.statusLabel)}</p>

      <section>
        <h2>${escapeHtml(t("history.detail"))}</h2>
        <dl>${renderMetricRows(data.metrics)}</dl>
      </section>

      ${renderBadgeSection(input)}
      ${renderSlipUpSection(data)}

      <footer>
        ${escapeHtml(t("history.generatedLocally"))}
        ${escapeHtml(t("history.generatedAt", { date: generatedAtLabel }))}
      </footer>
    </main>
  </body>
</html>`;
}
