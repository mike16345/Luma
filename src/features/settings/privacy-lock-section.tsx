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
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

export function PrivacyLockSection() {
  const colors = useThemeColors();
  const [availability, setAvailability] =
    useState<PrivacyLockAvailability | null>(null);
  const [isEnabled, setIsEnabled] = useState(
    loadUserProfile().privacyLockEnabled
  );
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void getPrivacyLockAvailability().then(setAvailability);
  }, []);

  async function enableLock() {
    const nextAvailability = await getPrivacyLockAvailability();
    setAvailability(nextAvailability);

    if (!nextAvailability.canAuthenticate) {
      setMessage(nextAvailability.reason);
      return;
    }

    const didAuthenticate = await authenticateForPrivacyLock();

    if (!didAuthenticate) {
      setMessage("Authentication was cancelled. Privacy lock stayed off.");
      return;
    }

    savePrivacyLockEnabled(true);
    setIsEnabled(true);
    setMessage("Privacy lock is on.");
  }

  async function disableLock() {
    savePrivacyLockEnabled(false);
    setIsEnabled(false);
    setMessage("Privacy lock is off.");
    await Haptics.selectionAsync();
  }

  return (
    <SectionCard eyebrow="Privacy" title="App lock">
      <View style={{ gap: spacing.md }}>
        <Text
          style={{
            ...typography.body,
            color: colors.textSecondary,
          }}
        >
          Require {availability?.label ?? "device authentication"} before Luma
          shows private progress on this device.
        </Text>

        {availability?.reason ? (
          <Text
            style={{
              ...typography.caption,
              color: colors.textMuted,
            }}
          >
            {availability.reason}
          </Text>
        ) : null}

        <NativeActionButton
          label={isEnabled ? "Turn privacy lock off" : "Turn privacy lock on"}
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
            }}
          >
            {message}
          </Text>
        ) : null}
      </View>
    </SectionCard>
  );
}
