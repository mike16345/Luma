import * as Haptics from "expo-haptics";
import * as LocalAuthentication from "expo-local-authentication";
import { Platform } from "react-native";

import { translate, type Translator } from "@/i18n/translations";

export type PrivacyLockAvailability = {
  canAuthenticate: boolean;
  label: string;
  reason: string | null;
};

function authenticationLabel(
  types: LocalAuthentication.AuthenticationType[],
  t: Translator
) {
  if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
    return "Face ID";
  }

  if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
    return t("privacy.fingerprint");
  }

  return t("privacy.deviceAuthentication");
}

export async function getPrivacyLockAvailability(
  t: Translator = (key, options) => translate("en", key, options)
): Promise<PrivacyLockAvailability> {
  if (Platform.OS === "web") {
    return {
      canAuthenticate: false,
      label: t("privacy.deviceAuthentication"),
      reason: t("privacy.nativeOnly"),
    };
  }

  const [hasHardware, isEnrolled, authenticationTypes] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
    LocalAuthentication.supportedAuthenticationTypesAsync(),
  ]);
  const label = authenticationLabel(authenticationTypes, t);

  if (!hasHardware) {
    return {
      canAuthenticate: false,
      label,
      reason: t("privacy.noHardware"),
    };
  }

  if (!isEnrolled) {
    return {
      canAuthenticate: false,
      label,
      reason: t("privacy.notEnrolled"),
    };
  }

  return {
    canAuthenticate: true,
    label,
    reason: null,
  };
}

export async function authenticateForPrivacyLock(
  t: Translator = (key, options) => translate("en", key, options)
) {
  if (Platform.OS === "web") {
    return false;
  }

  const result = await LocalAuthentication.authenticateAsync({
    biometricsSecurityLevel: "strong",
    cancelLabel: t("privacy.cancelLabel"),
    fallbackLabel: t("privacy.fallbackLabel"),
    promptMessage: t("privacy.promptMessage"),
  });

  if (result.success) {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  return result.success;
}
