import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import { buildChapterReportHtml } from "@/features/history/chapter-report-html";
import type { ChapterDetailViewModel } from "@/features/history/chapter-detail-selectors";
import type { TextDirection } from "@/i18n/languages";
import type { Translator } from "@/i18n/translations";
import { formatDateTimeShort } from "@/lib/formatting/date-time";

export class ChapterReportSharingUnavailableError extends Error {
  constructor() {
    super("chapter report sharing is unavailable");
  }
}

export type ShareChapterReportInput = {
  data: ChapterDetailViewModel;
  direction: TextDirection;
  generatedAtIso?: string;
  t: Translator;
};

export async function shareChapterReportPdf({
  data,
  direction,
  generatedAtIso = new Date().toISOString(),
  t,
}: ShareChapterReportInput) {
  const isSharingAvailable = await Sharing.isAvailableAsync();

  if (!isSharingAvailable) {
    throw new ChapterReportSharingUnavailableError();
  }

  const html = buildChapterReportHtml({
    data,
    direction,
    generatedAtLabel: formatDateTimeShort(generatedAtIso),
    t,
  });
  const { uri } = await Print.printToFileAsync({ html });

  await Sharing.shareAsync(uri, {
    UTI: ".pdf",
    dialogTitle: t("history.sharePdfTitle"),
    mimeType: "application/pdf",
  });

  return uri;
}
