import {
  formatReminderTime,
  parseReminderTime,
} from "@/lib/reminders/reminder-preferences";

jest.mock("@/lib/storage/local-preferences", () => ({
  preferencesStorage: {
    getBoolean: jest.fn((_key: string, fallback: boolean) => fallback),
    getString: jest.fn((_key: string, fallback: string) => fallback),
    setBoolean: jest.fn(),
    setString: jest.fn(),
  },
}));

describe("reminder preferences", () => {
  it("parses and normalizes 24-hour reminder times", () => {
    expect(parseReminderTime("8:05")).toEqual({
      ok: true,
      hour: 8,
      minute: 5,
      normalized: "08:05",
    });
    expect(parseReminderTime("20:00")).toEqual({
      ok: true,
      hour: 20,
      minute: 0,
      normalized: "20:00",
    });
  });

  it("rejects invalid reminder times", () => {
    expect(parseReminderTime("24:00").ok).toBe(false);
    expect(parseReminderTime("12:99").ok).toBe(false);
    expect(parseReminderTime("soon").ok).toBe(false);
  });

  it("formats reminder times safely", () => {
    expect(formatReminderTime(7, 3)).toBe("07:03");
    expect(formatReminderTime(99, -2)).toBe("23:00");
  });
});
