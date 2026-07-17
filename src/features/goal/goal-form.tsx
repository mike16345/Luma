import { Text, View } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
import { NativeTextField } from "@/components/ui/native-text-field";
import { SectionCard } from "@/components/ui/section-card";
import type { GoalFormErrors, GoalFormState } from "@/features/goal/goal-form-model";
import type { GoalViewModel } from "@/features/goal/goal-selectors";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function GoalForm({
  errors,
  form,
  goal,
  isSaving,
  onSave,
  saveError,
  saveMessage,
  updateGoalAmount,
}: {
  errors: GoalFormErrors;
  form: GoalFormState;
  goal: GoalViewModel;
  isSaving: boolean;
  onSave: () => Promise<void>;
  saveError: string | null;
  saveMessage: string | null;
  updateGoalAmount: (value: string) => void;
}) {
  return (
    <SectionCard
      eyebrow="Goal amount"
      title={goal.hasGoal ? "Update goal" : "Create goal"}
    >
      <View style={{ gap: spacing.md }}>
        <NativeTextField
          label={`Amount in ${goal.currencyCode}`}
          value={form.goalAmountMajor}
          onChangeText={updateGoalAmount}
          placeholder="250"
          keyboardType="decimal-pad"
          error={errors.goalAmountMajor}
        />
        <Text
          selectable
          style={{
            ...typography.body,
            color: colors.textSecondary,
          }}
        >
          {goal.hasGoal
            ? "Leave this blank and save to remove the current chapter goal."
            : "Goal progress resets when a new chapter starts."}
        </Text>

        {saveError ? (
          <Text
            selectable
            style={{
              ...typography.body,
              color: colors.slip,
            }}
          >
            {saveError}
          </Text>
        ) : null}

        {saveMessage ? (
          <Text
            selectable
            style={{
              ...typography.bodyMedium,
              color: colors.action,
            }}
          >
            {saveMessage}
          </Text>
        ) : null}

        <NativeActionButton
          label={isSaving ? "Saving..." : "Save goal"}
          disabled={isSaving}
          onPress={() => {
            void onSave();
          }}
        />
      </View>
    </SectionCard>
  );
}
