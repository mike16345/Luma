import { useRouter } from "expo-router";
import { Text, View } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
import { NativeTextField } from "@/components/ui/native-text-field";
import { SectionCard } from "@/components/ui/section-card";
import { AlcoholInvolvedSelector } from "@/features/slip-up/alcohol-involved-selector";
import type { SlipUpFormStateModel } from "@/features/slip-up/use-slip-up-form";
import { useLanguage } from "@/i18n/language-context";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function SlipUpForm({
  state,
}: {
  state: Extract<SlipUpFormStateModel, { status: "ready" }>;
}) {
  const router = useRouter();
  const { t, textAlign } = useLanguage();

  async function handleSubmit() {
    const slipUp = await state.submit();

    if (slipUp) {
      router.replace("/restart");
    }
  }

  return (
    <View style={{ gap: spacing.lg }}>
      <SectionCard eyebrow={t("common.required")} title={t("slipUp.timeTitle")}>
        <NativeTextField
          label={t("slipUp.dateAndTime")}
          value={state.form.occurredAt}
          onChangeText={(value) => state.updateField("occurredAt", value)}
          placeholder="YYYY-MM-DDTHH:mm"
          error={state.errors.occurredAt}
        />
      </SectionCard>

      <SectionCard eyebrow={t("common.optional")} title={t("slipUp.contextTitle")}>
        <View style={{ gap: spacing.md }}>
          <NativeTextField
            label={t("slipUp.mood")}
            value={state.form.mood}
            onChangeText={(value) => state.updateField("mood", value)}
            placeholder={t("slipUp.moodPlaceholder")}
          />
          <NativeTextField
            label={t("slipUp.trigger")}
            value={state.form.trigger}
            onChangeText={(value) => state.updateField("trigger", value)}
            placeholder={t("slipUp.triggerPlaceholder")}
          />
          <AlcoholInvolvedSelector
            value={state.form.alcoholInvolved}
            onChange={(value) => state.updateField("alcoholInvolved", value)}
          />
          <NativeTextField
            label={t("slipUp.note")}
            value={state.form.note}
            onChangeText={(value) => state.updateField("note", value)}
            placeholder={t("slipUp.notePlaceholder")}
          />
        </View>
      </SectionCard>

      <Text
        selectable
        style={{
          ...typography.body,
          color: colors.textSecondary,
          textAlign,
        }}
      >
        {t("slipUp.endWarning")}
      </Text>

      {typeof state.submitError === "string" ? (
        <Text
          selectable
          style={{
            ...typography.body,
            color: colors.slip,
            textAlign,
          }}
        >
          {state.submitError}
        </Text>
      ) : null}

      <NativeActionButton
        label={state.isSubmitting ? t("common.logging") : t("slipUp.logSlipUp")}
        disabled={state.isSubmitting}
        onPress={() => {
          void handleSubmit();
        }}
      />
    </View>
  );
}
