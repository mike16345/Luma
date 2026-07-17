import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import { SymbolView } from "expo-symbols";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import {
  dateFromLocalTimeInput,
  formatLocalTimeInput,
} from "@/lib/formatting/local-date-time-input";
import { getFlexDirection } from "@/i18n/languages";
import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

export function NativeTimeField({
  error,
  label,
  onChangeValue,
  value,
}: {
  error?: string;
  label: string;
  onChangeValue: (value: string) => void;
  value: string;
}) {
  const colors = useThemeColors();
  const { direction, language, textAlign } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const selectedDate = useMemo(
    () => dateFromLocalTimeInput(value) ?? new Date(),
    [value]
  );
  const timeLabel = new Intl.DateTimeFormat(language, {
    hour: "numeric",
    minute: "2-digit",
  }).format(selectedDate);

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
      <Pressable
        accessibilityRole="button"
        onPress={() => setIsOpen(true)}
        style={{
          minHeight: 56,
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
            gap: spacing.sm,
          }}
        >
          <SymbolView
            name={{
              ios: "clock",
              android: "access_time",
              web: "access_time",
            }}
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
                T
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
            {timeLabel}
          </Text>
        </View>
      </Pressable>
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
      {isOpen ? (
        <DateTimePicker
          value={selectedDate}
          mode="time"
          display="clock"
          presentation="dialog"
          is24Hour
          accentColor={colors.accentTime}
          onDismiss={() => setIsOpen(false)}
          onValueChange={(_, nextDate) => {
            onChangeValue(formatLocalTimeInput(nextDate));
            setIsOpen(false);
          }}
        />
      ) : null}
    </View>
  );
}
