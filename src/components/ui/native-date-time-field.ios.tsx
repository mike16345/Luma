import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import { Text, View } from "react-native";

import {
  formatLocalDateTimeInput,
  parseLocalDateTimeInput,
} from "@/lib/formatting/local-date-time-input";
import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

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
  const { language, textAlign } = useLanguage();
  const selectedDate = parseLocalDateTimeInput(value) ?? new Date();

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
        <DateTimePicker
          value={selectedDate}
          mode="datetime"
          display="compact"
          locale={language}
          accentColor={colors.accentTime}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onValueChange={(_, nextDate) =>
            onChangeValue(formatLocalDateTimeInput(nextDate))
          }
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
    </View>
  );
}
