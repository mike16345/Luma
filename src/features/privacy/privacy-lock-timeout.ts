export type PrivacyLockTimeout = "immediately" | "oneMinute" | "fiveMinutes";

export const defaultPrivacyLockTimeout: PrivacyLockTimeout = "fiveMinutes";

const privacyLockTimeoutMs: Record<PrivacyLockTimeout, number> = {
  immediately: 0,
  oneMinute: 60 * 1000,
  fiveMinutes: 5 * 60 * 1000,
};

export function isPrivacyLockTimeout(
  value: string
): value is PrivacyLockTimeout {
  return (
    value === "immediately" ||
    value === "oneMinute" ||
    value === "fiveMinutes"
  );
}

export function getPrivacyLockTimeoutMs(timeout: PrivacyLockTimeout) {
  return privacyLockTimeoutMs[timeout];
}

export function shouldRequirePrivacyUnlock({
  backgroundedAt,
  now,
  timeout,
}: {
  backgroundedAt: number | null;
  now: number;
  timeout: PrivacyLockTimeout;
}) {
  if (backgroundedAt === null) {
    return true;
  }

  return now - backgroundedAt >= getPrivacyLockTimeoutMs(timeout);
}
