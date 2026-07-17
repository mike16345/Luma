import { PageHeader } from "@/components/ui/page-header";
import { Screen } from "@/components/ui/screen";
import { SlipUpForm } from "@/features/slip-up/slip-up-form";
import {
  SlipUpErrorState,
  SlipUpLoadingState,
  SlipUpNoActiveChapterState,
} from "@/features/slip-up/slip-up-states";
import { useSlipUpForm } from "@/features/slip-up/use-slip-up-form";

export function SlipUpScreen() {
  const state = useSlipUpForm();

  if (state.status === "loading") {
    return <SlipUpLoadingState />;
  }

  if (state.status === "error") {
    return (
      <SlipUpErrorState
        message={state.submitError.message}
        refresh={state.refresh}
      />
    );
  }

  return (
    <Screen>
      <PageHeader
        eyebrow="Slip-up"
        title="Log what happened."
        subtitle="A slip-up closes the current chapter. The restart step comes next."
      />
      {state.activeChapter ? (
        <SlipUpForm state={state} />
      ) : (
        <SlipUpNoActiveChapterState />
      )}
    </Screen>
  );
}
