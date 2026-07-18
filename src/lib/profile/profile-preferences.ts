import { preferencesStorage } from "@/lib/storage/local-preferences";
import {
  defaultPrivacyLockTimeout,
  isPrivacyLockTimeout,
  type PrivacyLockTimeout,
} from "@/features/privacy/privacy-lock-timeout";

export type UserProfile = {
  avatarUri: string | null;
  displayName: string;
  privacyLockEnabled: boolean;
  privacyLockTimeout: PrivacyLockTimeout;
};

const DISPLAY_NAME_KEY = "profile.displayName";
const AVATAR_URI_KEY = "profile.avatarUri";
const PRIVACY_LOCK_ENABLED_KEY = "privacy.lockEnabled";
const PRIVACY_LOCK_TIMEOUT_KEY = "privacy.lockTimeout";

export function getInitials(displayName: string) {
  const words = displayName
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "L";
  }

  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

export function loadUserProfile(): UserProfile {
  const storedPrivacyLockTimeout = preferencesStorage.getString(
    PRIVACY_LOCK_TIMEOUT_KEY,
    defaultPrivacyLockTimeout
  );

  return {
    avatarUri: preferencesStorage.getString(AVATAR_URI_KEY, "") || null,
    displayName: preferencesStorage.getString(DISPLAY_NAME_KEY, ""),
    privacyLockEnabled: preferencesStorage.getBoolean(
      PRIVACY_LOCK_ENABLED_KEY,
      false
    ),
    privacyLockTimeout: isPrivacyLockTimeout(storedPrivacyLockTimeout)
      ? storedPrivacyLockTimeout
      : defaultPrivacyLockTimeout,
  };
}

export function saveDisplayName(displayName: string) {
  preferencesStorage.setString(DISPLAY_NAME_KEY, displayName.trim());
}

export function saveAvatarUri(avatarUri: string | null) {
  preferencesStorage.setString(AVATAR_URI_KEY, avatarUri ?? "");
}

export function savePrivacyLockEnabled(enabled: boolean) {
  preferencesStorage.setBoolean(PRIVACY_LOCK_ENABLED_KEY, enabled);
}

export function savePrivacyLockTimeout(timeout: PrivacyLockTimeout) {
  preferencesStorage.setString(PRIVACY_LOCK_TIMEOUT_KEY, timeout);
}
