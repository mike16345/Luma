import { RefreshControl, Text, View } from "react-native";

import { Screen } from "@/components/ui/screen";
import { HistoryChapterRow } from "@/features/history/history-chapter-row";
import { HistoryEmptyState } from "@/features/history/history-empty-state";
import type { HistoryViewModel } from "@/features/history/history-selectors";
import {
  HistoryErrorState,
  HistoryLoadingState,
} from "@/features/history/history-states";
import { HistorySummary } from "@/features/history/history-summary";
import { useHistoryViewModel } from "@/features/history/use-history-view-model";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

function HistoryContent({
  data,
  refresh,
}: {
  data: HistoryViewModel;
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
          History
        </Text>
        <Text
          selectable
          style={{
            ...typography.title,
            color: colors.textPrimary,
          }}
        >
          Chapters stay intact.
        </Text>
      </View>

      <HistorySummary summary={data.summary} />
      {data.hasChapters ? (
        data.rows.map((row) => <HistoryChapterRow key={row.id} row={row} />)
      ) : (
        <HistoryEmptyState />
      )}
    </Screen>
  );
}

export function HistoryScreen() {
  const state = useHistoryViewModel();

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

  return <HistoryContent data={state.data} refresh={state.refresh} />;
}
