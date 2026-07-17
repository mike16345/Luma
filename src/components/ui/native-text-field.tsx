import { Host, TextInput } from "@expo/ui";
import { Text, View, type KeyboardTypeOptions } from "react-native";

import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

export type NativeTextFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  error?: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
};

export function NativeTextField({
  autoCapitalize = "none",
  error,
  keyboardType = "default",
  label,
  onChangeText,
  placeholder,
  value,
}: NativeTextFieldProps) {
  const colors = useThemeColors();
  const { textAlign } = useLanguage();

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
          minHeight: 52,
          justifyContent: "center",
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          borderRadius: 18,
          borderCurve: "continuous",
          borderWidth: 1,
          borderColor: error ? colors.slip : colors.border,
          backgroundColor: colors.surfaceElevated,
          boxShadow: `0 10px 24px ${colors.shadow}`,
        }}
      >
        <Host matchContents={{ vertical: true }} seedColor={colors.action}>
          <TextInput
            defaultValue={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.textMuted}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={false}
            cursorColor={colors.action}
            selectionColor={colors.actionSoft}
            textStyle={{
              ...typography.body,
              color: colors.textPrimary,
              textAlign,
            }}
          />
        </Host>
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
