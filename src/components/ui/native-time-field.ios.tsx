import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import { Text, View } from "react-native";

import {
  dateFromLocalTimeInput,
  formatLocalTimeInput,
} from "@/lib/formatting/local-date-time-input";
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
  const { language, textAlign } = useLanguage();
  const selectedDate = dateFromLocalTimeInput(value) ?? new Date();

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
          mode="time"
          display="compact"
          locale={language}
          accentColor={colors.accentTime}
          onValueChange={(_, nextDate) =>
            onChangeValue(formatLocalTimeInput(nextDate))
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
