jest.mock("@/lib/storage/local-preferences", () => ({
  preferencesStorage: {
    getString: jest.fn((_key: string, fallback = "") => fallback),
    setString: jest.fn(),
  },
}));

import {
  loadQuitReason,
  normalizeQuitReason,
  saveQuitReason,
} from "@/features/reasons/reason-preferences";

function createMemoryStorage(initialValue = "") {
  let value = initialValue;

  return {
    getString: jest.fn((_key: string, fallback = "") => value || fallback),
    setString: jest.fn((_key: string, nextValue: string) => {
      value = nextValue;
    }),
  };
}

describe("quit reason preferences", () => {
  it("normalizes whitespace before saving", () => {
    const storage = createMemoryStorage();

    const saved = saveQuitReason("  I want calmer mornings.  ", storage);

    expect(saved).toBe("I want calmer mornings.");
    expect(loadQuitReason(storage)).toBe("I want calmer mornings.");
  });

  it("stores blank reasons as an empty value", () => {
    const storage = createMemoryStorage("Already saved");

    const saved = saveQuitReason("    ", storage);

    expect(saved).toBe("");
    expect(loadQuitReason(storage)).toBe("");
  });

  it("caps saved reasons at a readable length", () => {
    const longReason = "x".repeat(260);

    expect(normalizeQuitReason(longReason)).toHaveLength(180);
  });
});
