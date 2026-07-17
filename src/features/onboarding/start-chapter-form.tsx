import { useRouter } from "expo-router";
import { Text, View } from "react-native";

import { CurrencySelector } from "@/components/ui/currency-selector";
import { NativeActionButton } from "@/components/ui/native-action-button";
import { NativeDateTimeField } from "@/components/ui/native-date-time-field";
import { NativeTextField } from "@/components/ui/native-text-field";
import { SectionCard } from "@/components/ui/section-card";
import { useBootstrap } from "@/features/app-shell/bootstrap-context";
import { SmokingTypeSelector } from "@/features/onboarding/smoking-type-selector";
import { useStartChapterForm } from "@/features/onboarding/use-start-chapter-form";
import { useLanguage } from "@/i18n/language-context";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function StartChapterForm() {
  const router = useRouter();
  const { markReady } = useBootstrap();
  const { t, textAlign } = useLanguage();
  const {
    errors,
    form,
    isSubmitting,
    setSmokingType,
    submit,
    submitError,
    updateField,
  } = useStartChapterForm();

  async function handleSubmit() {
    const chapter = await submit();

    if (chapter) {
      markReady();
      router.replace("/onboarding/success");
    }
  }

  return (
    <View style={{ gap: spacing.lg }}>
      <SectionCard
        eyebrow={t("onboarding.chapterEyebrow")}
        title={t("onboarding.startDetailsTitle")}
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
        eyebrow={t("onboarding.estimateInputsEyebrow")}
        title={t("onboarding.smokingProfileTitle")}
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
        title={t("onboarding.savingsGoalTitle")}
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
            {t("onboarding.goalHelp")}
          </Text>
        </View>
      </SectionCard>

      {submitError ? (
        <Text
          selectable
          style={{
            ...typography.body,
            color: colors.slip,
            textAlign,
          }}
        >
          {submitError}
        </Text>
      ) : null}

      <NativeActionButton
        label={
          isSubmitting
            ? t("onboarding.startingChapter")
            : t("common.saveAndContinue")
        }
        disabled={isSubmitting}
        onPress={() => {
          void handleSubmit();
        }}
      />
    </View>
  );
}
