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
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

function statusText(preferences: ReminderPreferences) {
  if (!preferences.enabled) {
    return "Off. Luma will stay quiet unless you turn reminders on.";
  }

  return `On. Daily check-in at ${formatReminderTime(
    preferences.hour,
    preferences.minute
  )}.`;
}

export function RemindersSection() {
  const colors = useThemeColors();
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
    const parsedTime = parseReminderTime(timeValue);

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
      setMessage(`Daily check-in set for ${parsedTime.normalized}.`);
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
      setMessage("Daily check-in turned off.");
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
      const result = await sendTestReminder();
      setMessage(
        result.ok
          ? "Test reminder scheduled. It should appear in a few seconds."
          : result.reason
      );
      await Haptics.selectionAsync();
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <SectionCard eyebrow="Reminders" title="Daily check-in">
      <View style={{ gap: spacing.md }}>
        <Text
          style={{
            ...typography.body,
            color: colors.textSecondary,
          }}
        >
          Choose a quiet daily prompt to open Luma and review your chapter.
        </Text>

        <NativeTextField
          label="Reminder time"
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
              preferences.enabled ? "Turn reminder off" : "Turn reminder on"
            }
            onPress={() => {
              void (preferences.enabled ? disableReminder() : enableReminder());
            }}
            variant={preferences.enabled ? "outlined" : "filled"}
          />
          <NativeActionButton
            disabled={isBusy}
            label="Send test reminder"
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
          }}
        >
          {message ?? statusText(preferences)}
        </Text>
      </View>
    </SectionCard>
  );
}

