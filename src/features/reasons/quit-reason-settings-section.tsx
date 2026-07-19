import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Text, View } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
import { NativeTextField } from "@/components/ui/native-text-field";
import { SectionCard } from "@/components/ui/section-card";
import { useLanguage } from "@/i18n/language-context";
import { useQuitReason } from "@/features/reasons/use-quit-reason";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

export function QuitReasonSettingsSection() {
  const { reason, saveReason, clearReason } = useQuitReason();
  const [draftReason, setDraftReason] = useState(reason);
  const [message, setMessage] = useState<string | null>(null);
  const { t, textAlign } = useLanguage();
  const colors = useThemeColors();

  async function saveDraftReason() {
    const savedReason = saveReason(draftReason);
    setDraftReason(savedReason);
    setMessage(
      savedReason ? t("reasons.reasonSaved") : t("reasons.reasonRemoved")
    );
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  async function removeReason() {
    clearReason();
    setDraftReason("");
    setMessage(t("reasons.reasonRemoved"));
    await Haptics.selectionAsync();
  }

  return (
    <SectionCard
      eyebrow={t("reasons.settingsEyebrow")}
      title={t("reasons.settingsTitle")}
    >
      <View style={{ gap: spacing.md }}>
        <Text
          selectable
          style={{
            ...typography.body,
            color: colors.textSecondary,
            textAlign,
          }}
        >
          {t("reasons.settingsDescription")}
        </Text>

        <NativeTextField
          autoCapitalize="sentences"
          label={t("reasons.reasonLabel")}
          onChangeText={setDraftReason}
          placeholder={t("reasons.reasonPlaceholder")}
          value={draftReason}
        />

        <View style={{ gap: spacing.sm }}>
          <NativeActionButton
            label={t("reasons.saveReason")}
            onPress={saveDraftReason}
          />
          {reason ? (
            <NativeActionButton
              label={t("reasons.removeReason")}
              onPress={removeReason}
              variant="outlined"
            />
          ) : null}
        </View>

        {message ? (
          <Text
            selectable
            style={{
              ...typography.caption,
              color: colors.textMuted,
              textAlign,
            }}
          >
            {message}
          </Text>
        ) : null}
      </View>
    </SectionCard>
  );
}
