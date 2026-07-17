import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Text, View } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
import { NativeTextField } from "@/components/ui/native-text-field";
import { SectionCard } from "@/components/ui/section-card";
import {
  cancelReminder,
  scheduleDailyReminder,
  sendTestReminder,
} from "@/features/reminders/reminder-service";
import {
  formatReminderTime,
  loadReminderPreferences,
  parseReminderTime,
  saveReminderPreferences,
  type ReminderPreferences,
} from "@/lib/reminders/reminder-preferences";
import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

function statusText(
  preferences: ReminderPreferences,
  t: ReturnType<typeof useLanguage>["t"]
) {
  if (!preferences.enabled) {
    return t("settings.reminderOffStatus");
  }

  return t("settings.reminderOnStatus", {
    time: formatReminderTime(preferences.hour, preferences.minute),
  });
}

export function RemindersSection() {
  const colors = useThemeColors();
  const { t, textAlign } = useLanguage();
  const initialPreferences = loadReminderPreferences();
  const [preferences, setPreferences] =
    useState<ReminderPreferences>(initialPreferences);
  const [timeValue, setTimeValue] = useState(
    formatReminderTime(initialPreferences.hour, initialPreferences.minute)
  );
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  async function enableReminder() {
    const parsedTime = parseReminderTime(timeValue, t);

    if (!parsedTime.ok) {
      setError(parsedTime.error);
      setMessage(null);
      return;
    }

    setIsBusy(true);
    setError(null);
    setMessage(null);

    try {
      const result = await scheduleDailyReminder({
        hour: parsedTime.hour,
        minute: parsedTime.minute,
        previousNotificationId: preferences.notificationId,
        t,
      });

      if (!result.ok) {
        setMessage(result.reason);
        return;
      }

      const nextPreferences: ReminderPreferences = {
        enabled: true,
        hour: parsedTime.hour,
        minute: parsedTime.minute,
        notificationId: result.notificationId,
      };

      saveReminderPreferences(nextPreferences);
      setPreferences(nextPreferences);
      setTimeValue(parsedTime.normalized);
      setMessage(t("settings.reminderSet", { time: parsedTime.normalized }));
      await Haptics.selectionAsync();
    } finally {
      setIsBusy(false);
    }
  }

  async function disableReminder() {
    setIsBusy(true);
    setError(null);
    setMessage(null);

    try {
      await cancelReminder(preferences.notificationId);

      const nextPreferences: ReminderPreferences = {
        ...preferences,
        enabled: false,
        notificationId: null,
      };

      saveReminderPreferences(nextPreferences);
      setPreferences(nextPreferences);
      setMessage(t("settings.reminderTurnedOff"));
      await Haptics.selectionAsync();
    } finally {
      setIsBusy(false);
    }
  }

  async function testReminder() {
    setIsBusy(true);
    setError(null);
    setMessage(null);

    try {
      const result = await sendTestReminder(t);
      setMessage(
        result.ok
          ? t("settings.testReminderScheduled")
          : result.reason
      );
      await Haptics.selectionAsync();
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <SectionCard
      eyebrow={t("settings.remindersEyebrow")}
      title={t("settings.remindersTitle")}
    >
      <View style={{ gap: spacing.md }}>
        <Text
          style={{
            ...typography.body,
            color: colors.textSecondary,
            textAlign,
          }}
        >
          {t("settings.remindersDescription")}
        </Text>

        <NativeTextField
          label={t("settings.reminderTime")}
          value={timeValue}
          onChangeText={setTimeValue}
          placeholder="20:00"
          keyboardType="numbers-and-punctuation"
          error={error ?? undefined}
        />

        <View style={{ gap: spacing.sm }}>
          <NativeActionButton
            disabled={isBusy}
            label={
              preferences.enabled
                ? t("settings.turnReminderOff")
                : t("settings.turnReminderOn")
            }
            onPress={() => {
              void (preferences.enabled ? disableReminder() : enableReminder());
            }}
            variant={preferences.enabled ? "outlined" : "filled"}
          />
          <NativeActionButton
            disabled={isBusy}
            label={t("settings.sendTestReminder")}
            onPress={() => {
              void testReminder();
            }}
            variant="text"
          />
        </View>

        <Text
          style={{
            ...typography.caption,
            color: colors.textMuted,
            textAlign,
          }}
        >
          {message ?? statusText(preferences, t)}
        </Text>
      </View>
    </SectionCard>
  );
}
