import { Text, View } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
import type { ChapterDetailViewModel } from "@/features/history/chapter-detail-selectors";
import { useChapterReportExport } from "@/features/history/use-chapter-report-export";
import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

export function ChapterReportActions({
  data,
}: {
  data: ChapterDetailViewModel;
}) {
  const colors = useThemeColors();
  const { t, textAlign } = useLanguage();
  const { errorMessage, exportReport, isExporting } =
    useChapterReportExport(data);

  return (
    <View style={{ gap: spacing.sm }}>
      <NativeActionButton
        disabled={isExporting}
        label={isExporting ? t("history.preparingPdf") : t("history.exportPdf")}
        onPress={exportReport}
        variant="outlined"
      />
      {errorMessage ? (
        <Text
          selectable
          style={{
            ...typography.caption,
            color: colors.slip,
            textAlign,
          }}
        >
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
}
