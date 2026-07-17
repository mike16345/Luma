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

function InsightsContent({ data }: { data: InsightsViewModel }) {
  return (
    <Screen>
      <PageHeader
        eyebrow="Insights"
        title="Patterns from what you logged."
        subtitle="Luma summarizes slip-up records without turning them into advice or diagnosis."
      />
      {data.hasSlipUps ? (
        <>
          <InsightsSummary summary={data.summary} />
          <InsightsListSection title="Triggers" rows={data.triggerRows} />
          <InsightsListSection title="Moods" rows={data.moodRows} />
          <InsightsListSection title="Time of day" rows={data.timeRows} />
          <InsightsListSection title="Day of week" rows={data.dayRows} />
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
