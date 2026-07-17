import { useRouter } from "expo-router";
import { Text, View } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
import { NativeTextField } from "@/components/ui/native-text-field";
import { SectionCard } from "@/components/ui/section-card";
import { AlcoholInvolvedSelector } from "@/features/slip-up/alcohol-involved-selector";
import type { SlipUpFormStateModel } from "@/features/slip-up/use-slip-up-form";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function SlipUpForm({
  state,
}: {
  state: Extract<SlipUpFormStateModel, { status: "ready" }>;
}) {
  const router = useRouter();

  async function handleSubmit() {
    const slipUp = await state.submit();

    if (slipUp) {
      router.replace("/restart");
    }
  }

  return (
    <View style={{ gap: spacing.lg }}>
      <SectionCard eyebrow="Required" title="Slip-up time">
        <NativeTextField
          label="Date and time"
          value={state.form.occurredAt}
          onChangeText={(value) => state.updateField("occurredAt", value)}
          placeholder="YYYY-MM-DDTHH:mm"
          error={state.errors.occurredAt}
        />
      </SectionCard>

      <SectionCard eyebrow="Optional" title="Context">
        <View style={{ gap: spacing.md }}>
          <NativeTextField
            label="Mood"
            value={state.form.mood}
            onChangeText={(value) => state.updateField("mood", value)}
            placeholder="Stressed, tired, social"
          />
          <NativeTextField
            label="Trigger"
            value={state.form.trigger}
            onChangeText={(value) => state.updateField("trigger", value)}
            placeholder="After dinner, outside work"
          />
          <AlcoholInvolvedSelector
            value={state.form.alcoholInvolved}
            onChange={(value) => state.updateField("alcoholInvolved", value)}
          />
          <NativeTextField
            label="Note"
            value={state.form.note}
            onChangeText={(value) => state.updateField("note", value)}
            placeholder="Anything useful to remember"
          />
        </View>
      </SectionCard>

      <Text
        selectable
        style={{
          ...typography.body,
          color: colors.textSecondary,
        }}
      >
        Logging this slip-up will end the current chapter and keep its history
        intact.
      </Text>

      {typeof state.submitError === "string" ? (
        <Text
          selectable
          style={{
            ...typography.body,
            color: colors.slip,
          }}
        >
          {state.submitError}
        </Text>
      ) : null}

      <NativeActionButton
        label={state.isSubmitting ? "Logging..." : "Log slip-up"}
        disabled={state.isSubmitting}
        onPress={() => {
          void handleSubmit();
        }}
      />
    </View>
  );
}
