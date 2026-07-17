import { PageHeader } from "@/components/ui/page-header";
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

function HistoryContent({ data }: { data: HistoryViewModel }) {
  return (
    <Screen>
      <PageHeader eyebrow="History" title="Chapters stay intact." />
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

  return <HistoryContent data={state.data} />;
}
