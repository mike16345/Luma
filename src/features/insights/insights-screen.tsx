import { RefreshControl, Text, View } from "react-native";

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
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

function InsightsContent({
  data,
  refresh,
}: {
  data: InsightsViewModel;
  refresh: () => Promise<void>;
}) {
  return (
    <Screen
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => {
            void refresh();
          }}
          tintColor={colors.action}
        />
      }
    >
      <View style={{ gap: spacing.xs }}>
        <Text
          selectable
          style={{
            ...typography.caption,
            color: colors.textMuted,
            textTransform: "uppercase",
          }}
        >
          Insights
        </Text>
        <Text
          selectable
          style={{
            ...typography.title,
            color: colors.textPrimary,
          }}
        >
          Patterns from what you logged.
        </Text>
        <Text
          selectable
          style={{
            ...typography.body,
            color: colors.textSecondary,
          }}
        >
          Luma summarizes slip-up records without turning them into advice or
          diagnosis.
        </Text>
      </View>

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

  return <InsightsContent data={state.data} refresh={state.refresh} />;
}
