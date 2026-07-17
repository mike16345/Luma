import { Text, View } from "react-native";

import { CurrencySelector } from "@/components/ui/currency-selector";
import { NativeActionButton } from "@/components/ui/native-action-button";
import { NativeDateTimeField } from "@/components/ui/native-date-time-field";
import { NativeTextField } from "@/components/ui/native-text-field";
import { SectionCard } from "@/components/ui/section-card";
import { SmokingTypeSelector } from "@/features/onboarding/smoking-type-selector";
import type {
  ChapterSettingsField,
  ChapterSettingsFormErrors,
  ChapterSettingsFormState,
} from "@/features/settings/chapter-settings-form-model";
import { useLanguage } from "@/i18n/language-context";
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
  const { t, textAlign } = useLanguage();

  return (
    <View style={{ gap: spacing.lg }}>
      <SectionCard
        eyebrow={t("settings.currentChapterEyebrow")}
        title={t("settings.startDetailsTitle")}
      >
        <View style={{ gap: spacing.md }}>
          <NativeDateTimeField
            label={t("onboarding.quitDateTime")}
            value={form.startedAt}
            onChangeValue={(value) => updateField("startedAt", value)}
            maximumDate={new Date()}
            error={errors.startedAt}
          />
          <SmokingTypeSelector
            value={form.smokingType}
            onChange={setSmokingType}
          />
        </View>
      </SectionCard>

      <SectionCard
        eyebrow={t("settings.estimateInputsEyebrow")}
        title={t("settings.smokingProfileTitle")}
      >
        <View style={{ gap: spacing.md }}>
          <CurrencySelector
            label={t("common.currency")}
            value={form.currencyCode}
            onChange={(value) => updateField("currencyCode", value)}
            error={errors.currencyCode}
          />
          <NativeTextField
            label={t("onboarding.purchasePrice")}
            value={form.purchasePriceMajor}
            onChangeText={(value) => updateField("purchasePriceMajor", value)}
            placeholder="12.50"
            keyboardType="decimal-pad"
            error={errors.purchasePriceMajor}
          />
          <NativeTextField
            label={t("onboarding.estimatedCigarettesPerPurchase")}
            value={form.estimatedCigarettesPerPurchase}
            onChangeText={(value) =>
              updateField("estimatedCigarettesPerPurchase", value)
            }
            placeholder="20"
            keyboardType="decimal-pad"
            error={errors.estimatedCigarettesPerPurchase}
          />
          <NativeTextField
            label={t("onboarding.averageCigarettesPerDay")}
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

      <SectionCard
        eyebrow={t("common.optional")}
        title={t("settings.savingsGoalTitle")}
      >
        <View style={{ gap: spacing.md }}>
          <NativeTextField
            label={t("onboarding.goalAmount")}
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
              textAlign,
            }}
          >
            {t("settings.removeGoalHelp")}
          </Text>
        </View>
      </SectionCard>

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
        label={isSaving ? t("common.saving") : t("settings.saveCurrentChapter")}
        disabled={isSaving}
        onPress={() => {
          void onSave();
        }}
      />
    </View>
  );
}
