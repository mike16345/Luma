import { PageHeader } from "@/components/ui/page-header";
import { Screen } from "@/components/ui/screen";
import { GoalForm } from "@/features/goal/goal-form";
import { GoalProgressCard } from "@/features/goal/goal-progress-card";
import {
  GoalErrorState,
  GoalLoadingState,
  GoalNoActiveChapterState,
} from "@/features/goal/goal-states";
import { useGoalViewModel } from "@/features/goal/use-goal-view-model";
import { useLanguage } from "@/i18n/language-context";

export function GoalScreen() {
  const { t } = useLanguage();
  const state = useGoalViewModel();

  if (state.status === "loading") {
    return <GoalLoadingState />;
  }

  if (state.status === "error") {
    return (
      <GoalErrorState
        message={state.saveError.message}
        refresh={state.refresh}
      />
    );
  }

  return (
    <Screen>
      <PageHeader
        eyebrow={t("goal.eyebrow")}
        title={t("goal.title")}
        subtitle={t("goal.subtitle")}
      />
      {state.data.hasActiveChapter ? (
        <>
          <GoalProgressCard goal={state.data} />
          <GoalForm
            errors={state.errors}
            form={state.form}
            goal={state.data}
            isSaving={state.isSaving}
            onSave={state.save}
            saveError={state.saveError}
            saveMessage={state.saveMessage}
            updateGoalAmount={state.updateGoalAmount}
          />
        </>
      ) : (
        <GoalNoActiveChapterState />
      )}
    </Screen>
  );
}
