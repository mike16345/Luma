import { RefreshControl, Text, View } from "react-native";

import { Screen } from "@/components/ui/screen";
import { GoalForm } from "@/features/goal/goal-form";
import { GoalProgressCard } from "@/features/goal/goal-progress-card";
import {
  GoalErrorState,
  GoalLoadingState,
  GoalNoActiveChapterState,
} from "@/features/goal/goal-states";
import { useGoalViewModel } from "@/features/goal/use-goal-view-model";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function GoalScreen() {
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
    <Screen
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => {
            void state.refresh();
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
          Goal
        </Text>
        <Text
          selectable
          style={{
            ...typography.title,
            color: colors.textPrimary,
          }}
        >
          Save toward one thing.
        </Text>
        <Text
          selectable
          style={{
            ...typography.body,
            color: colors.textSecondary,
          }}
        >
          Goal progress uses estimated money saved in the current chapter.
        </Text>
      </View>

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
