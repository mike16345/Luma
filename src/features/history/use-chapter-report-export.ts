import { useCallback, useState } from "react";

import type { ChapterDetailViewModel } from "@/features/history/chapter-detail-selectors";
import {
  ChapterReportSharingUnavailableError,
  shareChapterReportPdf,
} from "@/features/history/chapter-report-service";
import { useLanguage } from "@/i18n/language-context";

export function useChapterReportExport(data: ChapterDetailViewModel) {
  const { direction, t } = useLanguage();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportReport = useCallback(async () => {
    setErrorMessage(null);
    setIsExporting(true);

    try {
      await shareChapterReportPdf({
        data,
        direction,
        t,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof ChapterReportSharingUnavailableError
          ? t("history.pdfUnavailable")
          : t("history.pdfError")
      );
    } finally {
      setIsExporting(false);
    }
  }, [data, direction, t]);

  return {
    errorMessage,
    exportReport,
    isExporting,
  };
}
