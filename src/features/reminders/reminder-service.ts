import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const REMINDER_CHANNEL_ID = "luma-reminders";
const REMINDER_TITLE = "Luma check-in";
const REMINDER_BODY =
  "A quiet check-in: your chapter is still here when you want to review it.";

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

async function ensureReminderChannel() {
  if (Platform.OS !== "android") {
    return;
  }

  await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL_ID, {
    name: "Luma reminders",
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

async function ensureReminderPermissions() {
  if (Platform.OS === "web") {
    return false;
  }

  await ensureReminderChannel();

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
}): Promise<ReminderServiceResult> {
  const hasPermission = await ensureReminderPermissions();

  if (!hasPermission) {
    return {
      ok: false,
      reason: "Notifications are not allowed for Luma on this device.",
    };
  }

  await cancelReminder(input.previousNotificationId);

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: REMINDER_TITLE,
      body: REMINDER_BODY,
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

export async function sendTestReminder(): Promise<ReminderServiceResult> {
  const hasPermission = await ensureReminderPermissions();

  if (!hasPermission) {
    return {
      ok: false,
      reason: "Notifications are not allowed for Luma on this device.",
    };
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: REMINDER_TITLE,
      body: "This is what a Luma reminder will feel like.",
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

