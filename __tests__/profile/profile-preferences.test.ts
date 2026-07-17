jest.mock("@/lib/storage/local-preferences", () => ({
  preferencesStorage: {
    getBoolean: jest.fn((_key: string, fallback: boolean) => fallback),
    getString: jest.fn((_key: string, fallback: string) => fallback),
    setBoolean: jest.fn(),
    setString: jest.fn(),
  },
}));

import { getInitials } from "@/lib/profile/profile-preferences";

describe("profile preferences", () => {
  it("builds profile initials from a display name", () => {
    expect(getInitials("")).toBe("L");
    expect(getInitials("michael")).toBe("M");
    expect(getInitials("Michael Green")).toBe("MG");
  });
});
