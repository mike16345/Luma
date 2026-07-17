import { preferencesStorage } from "@/lib/storage/local-preferences";

const REMINDER_ENABLED_KEY = "reminders.enabled";
const REMINDER_HOUR_KEY = "reminders.hour";
const REMINDER_MINUTE_KEY = "reminders.minute";
const REMINDER_NOTIFICATION_ID_KEY = "reminders.notificationId";

export const defaultReminderHour = 20;
export const defaultReminderMinute = 0;

export type ReminderPreferences = {
  enabled: boolean;
  hour: number;
  minute: number;
  notificationId: string | null;
};

export type ParsedReminderTime =
  | {
      ok: true;
      hour: number;
      minute: number;
      normalized: string;
    }
  | {
      ok: false;
      error: string;
    };

function readStoredInteger(key: string, fallback: number) {
  const value = Number.parseInt(preferencesStorage.getString(key, ""), 10);
  return Number.isFinite(value) ? value : fallback;
}

function clampTimePart(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(Math.max(Math.trunc(value), min), max);
}

export function formatReminderTime(hour: number, minute: number) {
  const safeHour = clampTimePart(hour, 0, 23);
  const safeMinute = clampTimePart(minute, 0, 59);
  return `${String(safeHour).padStart(2, "0")}:${String(safeMinute).padStart(
    2,
    "0"
  )}`;
}

export function parseReminderTime(value: string): ParsedReminderTime {
  const trimmed = value.trim();
  const match = /^(\d{1,2}):(\d{2})$/.exec(trimmed);

  if (!match) {
    return {
      ok: false,
      error: "Use a 24-hour time, for example 20:00.",
    };
  }

  const hour = Number.parseInt(match[1], 10);
  const minute = Number.parseInt(match[2], 10);

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return {
      ok: false,
      error: "Choose a time between 00:00 and 23:59.",
    };
  }

  return {
    ok: true,
    hour,
    minute,
    normalized: formatReminderTime(hour, minute),
  };
}

export function loadReminderPreferences(): ReminderPreferences {
  const hour = clampTimePart(
    readStoredInteger(REMINDER_HOUR_KEY, defaultReminderHour),
    0,
    23
  );
  const minute = clampTimePart(
    readStoredInteger(REMINDER_MINUTE_KEY, defaultReminderMinute),
    0,
    59
  );
  const notificationId = preferencesStorage.getString(
    REMINDER_NOTIFICATION_ID_KEY,
    ""
  );

  return {
    enabled: preferencesStorage.getBoolean(REMINDER_ENABLED_KEY, false),
    hour,
    minute,
    notificationId: notificationId.trim() ? notificationId : null,
  };
}

export function saveReminderPreferences(preferences: ReminderPreferences) {
  preferencesStorage.setBoolean(REMINDER_ENABLED_KEY, preferences.enabled);
  preferencesStorage.setString(REMINDER_HOUR_KEY, String(preferences.hour));
  preferencesStorage.setString(REMINDER_MINUTE_KEY, String(preferences.minute));
  preferencesStorage.setString(
    REMINDER_NOTIFICATION_ID_KEY,
    preferences.notificationId ?? ""
  );
}

