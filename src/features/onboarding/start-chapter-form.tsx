import { useRouter } from "expo-router";
import { Text, View } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
import { NativeTextField } from "@/components/ui/native-text-field";
import { SectionCard } from "@/components/ui/section-card";
import { SmokingTypeSelector } from "@/features/onboarding/smoking-type-selector";
import { useStartChapterForm } from "@/features/onboarding/use-start-chapter-form";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function StartChapterForm() {
  const router = useRouter();
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
      router.replace("/");
    }
  }

  return (
    <View style={{ gap: spacing.lg }}>
      <SectionCard eyebrow="Chapter" title="Start details">
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
          <NativeTextField
            label="Currency"
            value={form.currencyCode}
            onChangeText={(value) => updateField("currencyCode", value)}
            placeholder="USD"
            autoCapitalize="characters"
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
            Goal progress is based on estimated money saved in this chapter.
          </Text>
        </View>
      </SectionCard>

      {submitError ? (
        <Text
          selectable
          style={{
            ...typography.body,
            color: colors.slip,
          }}
        >
          {submitError}
        </Text>
      ) : null}

      <NativeActionButton
        label={isSubmitting ? "Starting chapter..." : "Save and continue"}
        disabled={isSubmitting}
        onPress={() => {
          void handleSubmit();
        }}
      />
    </View>
  );
}
