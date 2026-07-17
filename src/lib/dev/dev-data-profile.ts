import { preferencesStorage } from "@/lib/storage/local-preferences";

export type DevDataProfile = "default" | "clean" | "history";

export const DEV_DATA_PROFILES: DevDataProfile[] = [
  "default",
  "clean",
  "history",
];
export const DEV_DATA_PROFILE_PASSPHRASE = "luma";

const DEV_DATA_PROFILE_KEY = "dev.dataProfile";
const DEV_CLEAN_PROFILE_RUN_KEY = "dev.cleanProfileRunId";
const DEFAULT_CLEAN_PROFILE_RUN_ID = "initial";

export function isDevBuild() {
  return typeof __DEV__ !== "undefined" && __DEV__;
}

export function isDevDataProfile(value: string): value is DevDataProfile {
  return DEV_DATA_PROFILES.includes(value as DevDataProfile);
}

export function isDevProfilePassphrase(value: string) {
  return value.trim() === DEV_DATA_PROFILE_PASSPHRASE;
}

function createCleanProfileRunId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getDevDatabaseName(profile: DevDataProfile) {
  if (profile === "default") {
    return "luma.db";
  }

  if (profile === "clean") {
    const runId = preferencesStorage.getString(
      DEV_CLEAN_PROFILE_RUN_KEY,
      DEFAULT_CLEAN_PROFILE_RUN_ID
    );

    return `luma.dev.clean.${runId}.db`;
  }

  return `luma.dev.${profile}.db`;
}

export function getStoredDevDataProfile(): DevDataProfile {
  if (!isDevBuild()) {
    return "default";
  }

  const storedProfile = preferencesStorage.getString(
    DEV_DATA_PROFILE_KEY,
    "default"
  );

  return isDevDataProfile(storedProfile) ? storedProfile : "default";
}

export function setStoredDevDataProfile(profile: DevDataProfile) {
  if (!isDevBuild()) {
    return;
  }

  if (profile === "clean") {
    preferencesStorage.setString(
      DEV_CLEAN_PROFILE_RUN_KEY,
      createCleanProfileRunId()
    );
  }

  preferencesStorage.setString(DEV_DATA_PROFILE_KEY, profile);
}

export function getActiveDatabaseName() {
  return getDevDatabaseName(getStoredDevDataProfile());
}
