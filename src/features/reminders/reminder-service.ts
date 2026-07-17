import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { translate, type Translator } from "@/i18n/translations";

const REMINDER_CHANNEL_ID = "luma-reminders";

let hasConfiguredHandler = false;

type ReminderServiceResult =
  | {
      ok: true;
      notificationId: string;
    }
  | {
      ok: false;
      reason: string;
    };

export function configureNotificationHandling() {
  if (hasConfiguredHandler) {
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
  hasConfiguredHandler = true;
}

async function ensureReminderChannel(t: Translator) {
  if (Platform.OS !== "android") {
    return;
  }

  await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL_ID, {
    name: t("reminders.channelName"),
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

async function ensureReminderPermissions(t: Translator) {
  if (Platform.OS === "web") {
    return false;
  }

  await ensureReminderChannel(t);

  const existingPermissions = await Notifications.getPermissionsAsync();

  if (existingPermissions.granted) {
    return true;
  }

  const requestedPermissions = await Notifications.requestPermissionsAsync();
  return requestedPermissions.granted;
}

export async function cancelReminder(notificationId: string | null) {
  if (!notificationId || Platform.OS === "web") {
    return;
  }

  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export async function scheduleDailyReminder(input: {
  hour: number;
  minute: number;
  previousNotificationId: string | null;
  t?: Translator;
}): Promise<ReminderServiceResult> {
  const t = input.t ?? ((key, options) => translate("en", key, options));
  const hasPermission = await ensureReminderPermissions(t);

  if (!hasPermission) {
    return {
      ok: false,
      reason: t("reminders.notAllowed"),
    };
  }

  await cancelReminder(input.previousNotificationId);

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: t("reminders.notificationTitle"),
      body: t("reminders.notificationBody"),
      data: {
        url: "/",
        source: "daily-reminder",
      },
      sound: false,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      channelId: REMINDER_CHANNEL_ID,
      hour: input.hour,
      minute: input.minute,
    },
  });

  return {
    ok: true,
    notificationId,
  };
}

export async function sendTestReminder(
  t: Translator = (key, options) => translate("en", key, options)
): Promise<ReminderServiceResult> {
  const hasPermission = await ensureReminderPermissions(t);

  if (!hasPermission) {
    return {
      ok: false,
      reason: t("reminders.notAllowed"),
    };
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: t("reminders.notificationTitle"),
      body: t("reminders.testNotificationBody"),
      data: {
        url: "/",
        source: "test-reminder",
      },
      sound: false,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      channelId: REMINDER_CHANNEL_ID,
      seconds: 2,
    },
  });

  return {
    ok: true,
    notificationId,
  };
}
