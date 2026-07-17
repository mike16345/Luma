import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
import { SectionCard } from "@/components/ui/section-card";
import {
  authenticateForPrivacyLock,
  getPrivacyLockAvailability,
  type PrivacyLockAvailability,
} from "@/features/privacy/privacy-lock-service";
import {
  loadUserProfile,
  savePrivacyLockEnabled,
} from "@/lib/profile/profile-preferences";
import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

export function PrivacyLockSection() {
  const colors = useThemeColors();
  const { t, textAlign } = useLanguage();
  const [availability, setAvailability] =
    useState<PrivacyLockAvailability | null>(null);
  const [isEnabled, setIsEnabled] = useState(
    loadUserProfile().privacyLockEnabled
  );
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void getPrivacyLockAvailability(t).then(setAvailability);
  }, [t]);

  async function enableLock() {
    const nextAvailability = await getPrivacyLockAvailability(t);
    setAvailability(nextAvailability);

    if (!nextAvailability.canAuthenticate) {
      setMessage(nextAvailability.reason);
      return;
    }

    const didAuthenticate = await authenticateForPrivacyLock(t);

    if (!didAuthenticate) {
      setMessage(t("settings.privacyCancelled"));
      return;
    }

    savePrivacyLockEnabled(true);
    setIsEnabled(true);
    setMessage(t("settings.privacyLockOn"));
  }

  async function disableLock() {
    savePrivacyLockEnabled(false);
    setIsEnabled(false);
    setMessage(t("settings.privacyLockOff"));
    await Haptics.selectionAsync();
  }

  return (
    <SectionCard
      eyebrow={t("settings.privacyEyebrow")}
      title={t("settings.appLockTitle")}
    >
      <View style={{ gap: spacing.md }}>
        <Text
          style={{
            ...typography.body,
            color: colors.textSecondary,
            textAlign,
          }}
        >
          {t("settings.privacyDescription", {
            method: availability?.label ?? t("privacy.deviceAuthentication"),
          })}
        </Text>

        {availability?.reason ? (
          <Text
            style={{
              ...typography.caption,
              color: colors.textMuted,
              textAlign,
            }}
          >
            {availability.reason}
          </Text>
        ) : null}

        <NativeActionButton
          label={
            isEnabled
              ? t("settings.turnPrivacyLockOff")
              : t("settings.turnPrivacyLockOn")
          }
          onPress={() => {
            void (isEnabled ? disableLock() : enableLock());
          }}
          variant={isEnabled ? "outlined" : "filled"}
        />

        {message ? (
          <Text
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
