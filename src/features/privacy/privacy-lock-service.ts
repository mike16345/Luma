import * as Haptics from "expo-haptics";
import * as LocalAuthentication from "expo-local-authentication";
import { Platform } from "react-native";

export type PrivacyLockAvailability = {
  canAuthenticate: boolean;
  label: string;
  reason: string | null;
};

function authenticationLabel(types: LocalAuthentication.AuthenticationType[]) {
  if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
    return "Face ID";
  }

  if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
    return "fingerprint";
  }

  return "device authentication";
}

export async function getPrivacyLockAvailability(): Promise<PrivacyLockAvailability> {
  if (Platform.OS === "web") {
    return {
      canAuthenticate: false,
      label: "device authentication",
      reason: "Privacy lock is available in native builds.",
    };
  }

  const [hasHardware, isEnrolled, authenticationTypes] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
    LocalAuthentication.supportedAuthenticationTypesAsync(),
  ]);
  const label = authenticationLabel(authenticationTypes);

  if (!hasHardware) {
    return {
      canAuthenticate: false,
      label,
      reason: "This device does not report biometric authentication hardware.",
    };
  }

  if (!isEnrolled) {
    return {
      canAuthenticate: false,
      label,
      reason: "Set up Face ID, fingerprint, or device authentication first.",
    };
  }

  return {
    canAuthenticate: true,
    label,
    reason: null,
  };
}

export async function authenticateForPrivacyLock() {
  if (Platform.OS === "web") {
    return false;
  }

  const result = await LocalAuthentication.authenticateAsync({
    biometricsSecurityLevel: "strong",
    cancelLabel: "Not now",
    fallbackLabel: "Use device passcode",
    promptMessage: "Unlock Luma",
  });

  if (result.success) {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  return result.success;
}
