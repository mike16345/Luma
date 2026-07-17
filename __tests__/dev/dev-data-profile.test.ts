jest.mock("@/lib/storage/local-preferences", () => ({
  preferencesStorage: {
    getString: jest.fn((key: string, fallback: string) =>
      key === "dev.cleanProfileRunId" ? "run-123" : fallback
    ),
    setString: jest.fn(),
  },
}));

import { preferencesStorage } from "@/lib/storage/local-preferences";
import {
  DEV_DATA_PROFILE_PASSPHRASE,
  getDevDatabaseName,
  isDevDataProfile,
  isDevProfilePassphrase,
  setStoredDevDataProfile,
} from "@/lib/dev/dev-data-profile";

describe("dev data profile helpers", () => {
  it("recognizes supported profiles only", () => {
    expect(isDevDataProfile("default")).toBe(true);
    expect(isDevDataProfile("clean")).toBe(true);
    expect(isDevDataProfile("history")).toBe(true);
    expect(isDevDataProfile("other")).toBe(false);
  });

  it("derives stable profile database names", () => {
    expect(getDevDatabaseName("default")).toBe("luma.db");
    expect(getDevDatabaseName("clean")).toBe("luma.dev.clean.run-123.db");
    expect(getDevDatabaseName("history")).toBe("luma.dev.history.db");
  });

  it("rotates the clean profile database when clean is selected", () => {
    setStoredDevDataProfile("clean");

    expect(preferencesStorage.setString).toHaveBeenCalledWith(
      "dev.cleanProfileRunId",
      expect.any(String)
    );
    expect(preferencesStorage.setString).toHaveBeenCalledWith(
      "dev.dataProfile",
      "clean"
    );
  });

  it("validates the dev passphrase", () => {
    expect(DEV_DATA_PROFILE_PASSPHRASE).toBe("luma");
    expect(isDevProfilePassphrase("luma")).toBe(true);
    expect(isDevProfilePassphrase(" luma ")).toBe(true);
    expect(isDevProfilePassphrase("wrong")).toBe(false);
  });
});
