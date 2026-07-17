import { Text, View } from "react-native";

import { PageHeader } from "@/components/ui/page-header";
import { NativeActionButton } from "@/components/ui/native-action-button";
import { Screen } from "@/components/ui/screen";
import { SectionCard } from "@/components/ui/section-card";
import { ChapterDetailMetrics } from "@/features/history/chapter-detail-metrics";
import { ChapterReportActions } from "@/features/history/chapter-report-actions";
import { ChapterUnlockedBadgesSection } from "@/features/history/chapter-unlocked-badges-section";
import {
  HistoryErrorState,
  HistoryLoadingState,
} from "@/features/history/history-states";
import { useChapterDetailViewModel } from "@/features/history/use-chapter-detail-view-model";
import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

export function ChapterDetailScreen({ chapterId }: { chapterId: string }) {
  const { t, textAlign } = useLanguage();
  const colors = useThemeColors();
  const state = useChapterDetailViewModel(chapterId);

  if (state.status === "loading") {
    return <HistoryLoadingState />;
  }

  if (state.status === "error") {
    return (
      <HistoryErrorState
        message={state.error.message}
        refresh={state.refresh}
      />
    );
  }

  if (state.status === "not-found") {
    return (
      <Screen>
        <SectionCard title={t("history.chapterNotFound")}>
          <Text
            selectable
            style={{
              ...typography.body,
              color: colors.textSecondary,
              textAlign,
            }}
          >
            {t("history.chapterNotFoundMessage")}
          </Text>
          <NativeActionButton
            label={t("common.tryAgain")}
            onPress={state.refresh}
          />
        </SectionCard>
      </Screen>
    );
  }

  const { data } = state;

  return (
    <Screen>
      <PageHeader
        eyebrow={data.statusLabel}
        subtitle={data.subtitle}
        title={data.title}
      />
      <ChapterReportActions data={data} />
      <ChapterDetailMetrics metrics={data.metrics} title={t("history.detail")} />
      <ChapterUnlockedBadgesSection
        badges={data.badgesUnlockedDuringChapter}
      />
      {data.slipUp ? (
        <View style={{ gap: spacing.md }}>
          <ChapterDetailMetrics
            metrics={data.slipUp.rows}
            title={data.slipUp.title}
          />
        </View>
      ) : null}
    </Screen>
  );
}
