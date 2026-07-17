import { Text, View } from "react-native";

import { CurrencySelector } from "@/components/ui/currency-selector";
import { NativeActionButton } from "@/components/ui/native-action-button";
import { NativeTextField } from "@/components/ui/native-text-field";
import { SectionCard } from "@/components/ui/section-card";
import { SmokingTypeSelector } from "@/features/onboarding/smoking-type-selector";
import type {
  ChapterSettingsField,
  ChapterSettingsFormErrors,
  ChapterSettingsFormState,
} from "@/features/settings/chapter-settings-form-model";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import type { SmokingType } from "@/types/domain";

export function ChapterSettingsForm({
  errors,
  form,
  isSaving,
  onSave,
  saveError,
  saveMessage,
  setSmokingType,
  updateField,
}: {
  errors: ChapterSettingsFormErrors;
  form: ChapterSettingsFormState;
  isSaving: boolean;
  onSave: () => Promise<void>;
  saveError: string | null;
  saveMessage: string | null;
  setSmokingType: (value: SmokingType) => void;
  updateField: (field: ChapterSettingsField, value: string) => void;
}) {
  return (
    <View style={{ gap: spacing.lg }}>
      <SectionCard eyebrow="Current chapter" title="Start details">
        <View style={{ gap: spacing.md }}>
          <NativeTextField
            label="Quit date and time"
            value={form.startedAt}
            onChangeText={(value) => updateField("startedAt", value)}
            placeholder="YYYY-MM-DDTHH:mm"
            error={errors.startedAt}
          />
          <SmokingTypeSelector
            value={form.smokingType}
            onChange={setSmokingType}
          />
        </View>
      </SectionCard>

      <SectionCard eyebrow="Estimate inputs" title="Smoking profile">
        <View style={{ gap: spacing.md }}>
          <CurrencySelector
            label="Currency"
            value={form.currencyCode}
            onChange={(value) => updateField("currencyCode", value)}
            error={errors.currencyCode}
          />
          <NativeTextField
            label="Purchase price"
            value={form.purchasePriceMajor}
            onChangeText={(value) => updateField("purchasePriceMajor", value)}
            placeholder="12.50"
            keyboardType="decimal-pad"
            error={errors.purchasePriceMajor}
          />
          <NativeTextField
            label="Estimated cigarettes per purchase"
            value={form.estimatedCigarettesPerPurchase}
            onChangeText={(value) =>
              updateField("estimatedCigarettesPerPurchase", value)
            }
            placeholder="20"
            keyboardType="decimal-pad"
            error={errors.estimatedCigarettesPerPurchase}
          />
          <NativeTextField
            label="Average cigarettes per day"
            value={form.averageCigarettesPerDay}
            onChangeText={(value) =>
              updateField("averageCigarettesPerDay", value)
            }
            placeholder="10"
            keyboardType="decimal-pad"
            error={errors.averageCigarettesPerDay}
          />
        </View>
      </SectionCard>

      <SectionCard eyebrow="Optional" title="Savings goal">
        <View style={{ gap: spacing.md }}>
          <NativeTextField
            label="Goal amount"
            value={form.goalAmountMajor}
            onChangeText={(value) => updateField("goalAmountMajor", value)}
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
            Leave this blank to remove the current chapter goal.
          </Text>
        </View>
      </SectionCard>

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
        label={isSaving ? "Saving..." : "Save current chapter"}
        disabled={isSaving}
        onPress={() => {
          void onSave();
        }}
      />
    </View>
  );
}
