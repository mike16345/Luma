import { Text, View } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
import { NativeTextField } from "@/components/ui/native-text-field";
import { SectionCard } from "@/components/ui/section-card";
import type { GoalFormErrors, GoalFormState } from "@/features/goal/goal-form-model";
import type { GoalViewModel } from "@/features/goal/goal-selectors";
import { useLanguage } from "@/i18n/language-context";
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
  const { t, textAlign } = useLanguage();

  return (
    <SectionCard
      eyebrow={t("goal.goalAmountEyebrow")}
      title={goal.hasGoal ? t("goal.updateGoal") : t("goal.createGoal")}
    >
      <View style={{ gap: spacing.md }}>
        <NativeTextField
          label={t("goal.amountInCurrency", {
            currencyCode: goal.currencyCode,
          })}
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
            ? t("goal.removeHelp")
            : t("goal.resetHelp")}
        </Text>

        {saveError ? (
          <Text
            selectable
            style={{
              ...typography.body,
              color: colors.slip,
              textAlign,
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
              textAlign,
            }}
          >
            {saveMessage}
          </Text>
        ) : null}

        <NativeActionButton
          label={isSaving ? t("common.saving") : t("goal.saveGoal")}
          disabled={isSaving}
          onPress={() => {
            void onSave();
          }}
        />
      </View>
    </SectionCard>
  );
}
