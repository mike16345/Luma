import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import {
  formatLocalDateTimeInput,
  parseLocalDateTimeInput,
} from "@/lib/formatting/local-date-time-input";
import { getFlexDirection } from "@/i18n/languages";
import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

type OpenPicker = "date" | "time" | null;

function mergeDate(current: Date, selected: Date) {
  const next = new Date(current);
  next.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
  return next;
}

function mergeTime(current: Date, selected: Date) {
  const next = new Date(current);
  next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
  return next;
}

export function NativeDateTimeField({
  error,
  label,
  maximumDate,
  minimumDate,
  onChangeValue,
  value,
}: {
  error?: string;
  label: string;
  maximumDate?: Date;
  minimumDate?: Date;
  onChangeValue: (value: string) => void;
  value: string;
}) {
  const colors = useThemeColors();
  const { direction, language, textAlign } = useLanguage();
  const [openPicker, setOpenPicker] = useState<OpenPicker>(null);
  const selectedDate = useMemo(
    () => parseLocalDateTimeInput(value) ?? new Date(),
    [value]
  );
  const dateLabel = new Intl.DateTimeFormat(language, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(selectedDate);
  const timeLabel = new Intl.DateTimeFormat(language, {
    hour: "numeric",
    minute: "2-digit",
  }).format(selectedDate);

  function commitDate(nextDate: Date) {
    const merged =
      openPicker === "time"
        ? mergeTime(selectedDate, nextDate)
        : mergeDate(selectedDate, nextDate);
    onChangeValue(formatLocalDateTimeInput(merged));
    setOpenPicker(null);
  }

  return (
    <View style={{ gap: spacing.xs }}>
      <Text
        selectable
        style={{
          ...typography.label,
          color: colors.textPrimary,
          textAlign,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          flexDirection: getFlexDirection(direction),
          gap: spacing.sm,
        }}
      >
        <PickerTrigger
          fallback="D"
          icon={{
            ios: "calendar",
            android: "calendar_today",
            web: "calendar_today",
          }}
          label={dateLabel}
          onPress={() => setOpenPicker("date")}
        />
        <PickerTrigger
          fallback="T"
          icon={{
            ios: "clock",
            android: "access_time",
            web: "access_time",
          }}
          label={timeLabel}
          onPress={() => setOpenPicker("time")}
        />
      </View>
      {error ? (
        <Text
          selectable
          style={{
            ...typography.caption,
            color: colors.slip,
            textAlign,
          }}
        >
          {error}
        </Text>
      ) : null}
      {openPicker ? (
        <DateTimePicker
          value={selectedDate}
          mode={openPicker}
          display={openPicker === "time" ? "clock" : "default"}
          presentation="dialog"
          is24Hour
          minimumDate={openPicker === "date" ? minimumDate : undefined}
          maximumDate={openPicker === "date" ? maximumDate : undefined}
          accentColor={colors.accentTime}
          onDismiss={() => setOpenPicker(null)}
          onValueChange={(_, nextDate) => commitDate(nextDate)}
        />
      ) : null}
    </View>
  );

  function PickerTrigger({
    fallback,
    icon,
    label: triggerLabel,
    onPress,
  }: {
    fallback: string;
    icon: SymbolViewProps["name"];
    label: string;
    onPress: () => void;
  }) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={{
          minHeight: 56,
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          borderRadius: 20,
          borderCurve: "continuous",
          borderWidth: 1,
          borderColor: error ? colors.slip : colors.border,
          backgroundColor: colors.surfaceElevated,
          boxShadow: `0 10px 26px ${colors.shadow}`,
        }}
      >
        <View
          style={{
            flexDirection: getFlexDirection(direction),
            alignItems: "center",
            gap: spacing.xs,
          }}
        >
          <SymbolView
            name={icon}
            size={20}
            tintColor={colors.action}
            fallback={
              <Text
                style={{
                  ...typography.caption,
                  color: colors.action,
                  minWidth: 20,
                  textAlign: "center",
                }}
              >
                {fallback}
              </Text>
            }
          />
          <Text
            style={{
              ...typography.bodyMedium,
              color: colors.textPrimary,
              flex: 1,
              textAlign,
            }}
          >
            {triggerLabel}
          </Text>
        </View>
      </Pressable>
    );
  }
}
