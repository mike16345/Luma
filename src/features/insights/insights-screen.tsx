import { PageHeader } from "@/components/ui/page-header";
import { Screen } from "@/components/ui/screen";
import { InsightsEmptyState } from "@/features/insights/insights-empty-state";
import { InsightsListSection } from "@/features/insights/insights-list-section";
import { InsightsRecentNotes } from "@/features/insights/insights-recent-notes";
import type { InsightsViewModel } from "@/features/insights/insights-selectors";
import {
  InsightsErrorState,
  InsightsLoadingState,
} from "@/features/insights/insights-states";
import { InsightsSummary } from "@/features/insights/insights-summary";
import { useInsightsViewModel } from "@/features/insights/use-insights-view-model";
import { useLanguage } from "@/i18n/language-context";

function InsightsContent({ data }: { data: InsightsViewModel }) {
  const { t } = useLanguage();

  return (
    <Screen>
      <PageHeader
        eyebrow={t("insights.eyebrow")}
        title={t("insights.title")}
        subtitle={t("insights.subtitle")}
      />
      {data.hasSlipUps ? (
        <>
          <InsightsSummary summary={data.summary} />
          <InsightsListSection title={t("insights.triggers")} rows={data.triggerRows} />
          <InsightsListSection title={t("insights.moods")} rows={data.moodRows} />
          <InsightsListSection title={t("insights.timeOfDay")} rows={data.timeRows} />
          <InsightsListSection title={t("insights.dayOfWeek")} rows={data.dayRows} />
          <InsightsRecentNotes notes={data.recentNotes} />
        </>
      ) : (
        <InsightsEmptyState />
      )}
    </Screen>
  );
}

export function InsightsScreen() {
  const state = useInsightsViewModel();

  if (state.status === "loading") {
    return <InsightsLoadingState />;
  }

  if (state.status === "error") {
    return (
      <InsightsErrorState
        message={state.error.message}
        refresh={state.refresh}
      />
    );
  }

  return <InsightsContent data={state.data} />;
}
