jest.mock("@/lib/storage/local-preferences", () => ({
  preferencesStorage: {
    getBoolean: jest.fn((_key: string, fallback: boolean) => fallback),
    getString: jest.fn((_key: string, fallback: string) => fallback),
    setBoolean: jest.fn(),
    setString: jest.fn(),
  },
}));

import {
  getPrivacyLockTimeoutMs,
  shouldRequirePrivacyUnlock,
} from "@/features/privacy/privacy-lock-timeout";
import {
  loadUserProfile,
  savePrivacyLockTimeout,
} from "@/lib/profile/profile-preferences";
import { preferencesStorage } from "@/lib/storage/local-preferences";

const storage = jest.mocked(preferencesStorage);

describe("privacy lock timeout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storage.getBoolean.mockImplementation(
      (_key, fallback = false) => fallback
    );
    storage.getString.mockImplementation((_key, fallback = "") => fallback);
  });

  it("loads five minutes as the default app lock timeout", () => {
    expect(loadUserProfile().privacyLockTimeout).toBe("fiveMinutes");
  });

  it("stores only supported app lock timeout values", () => {
    savePrivacyLockTimeout("oneMinute");

    expect(storage.setString).toHaveBeenCalledWith(
      "privacy.lockTimeout",
      "oneMinute"
    );
  });

  it("maps timeout choices to lock durations", () => {
    expect(getPrivacyLockTimeoutMs("immediately")).toBe(0);
    expect(getPrivacyLockTimeoutMs("oneMinute")).toBe(60 * 1000);
    expect(getPrivacyLockTimeoutMs("fiveMinutes")).toBe(5 * 60 * 1000);
  });

  it("requires unlock only after the selected timeout has elapsed", () => {
    expect(
      shouldRequirePrivacyUnlock({
        backgroundedAt: 1_000,
        now: 61_000,
        timeout: "oneMinute",
      })
    ).toBe(true);
    expect(
      shouldRequirePrivacyUnlock({
        backgroundedAt: 1_000,
        now: 60_999,
        timeout: "oneMinute",
      })
    ).toBe(false);
  });
});
