import { preferencesStorage } from "@/lib/storage/local-preferences";

const QUIT_REASON_KEY = "reasons.quitReason";
const MAX_REASON_LENGTH = 180;

export type ReasonStorage = {
  getString: (key: string, fallback?: string) => string;
  setString: (key: string, value: string) => void;
};

const listeners = new Set<() => void>();

export function normalizeQuitReason(reason: string) {
  return reason.trim().replace(/\s+/g, " ").slice(0, MAX_REASON_LENGTH);
}

export function loadQuitReason(storage: ReasonStorage = preferencesStorage) {
  return normalizeQuitReason(storage.getString(QUIT_REASON_KEY, ""));
}

export function saveQuitReason(
  reason: string,
  storage: ReasonStorage = preferencesStorage
) {
  const normalizedReason = normalizeQuitReason(reason);
  storage.setString(QUIT_REASON_KEY, normalizedReason);
  notifyReasonListeners();

  return normalizedReason;
}

export function subscribeToQuitReason(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function notifyReasonListeners() {
  listeners.forEach((listener) => listener());
}
