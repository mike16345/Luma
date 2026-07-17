import { Host, TextInput } from "@expo/ui";
import { Text, View, type KeyboardTypeOptions } from "react-native";

import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
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
  return (
    <View style={{ gap: spacing.xs }}>
      <Text
        selectable
        style={{
          ...typography.label,
          color: colors.textPrimary,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          minHeight: 48,
          justifyContent: "center",
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs,
          borderRadius: 8,
          borderCurve: "continuous",
          borderWidth: 1,
          borderColor: error ? colors.slip : colors.border,
          backgroundColor: colors.surface,
        }}
      >
        <Host matchContents={{ vertical: true }} seedColor={colors.action}>
          <TextInput
            defaultValue={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={false}
          />
        </Host>
      </View>
      {error ? (
        <Text
          selectable
          style={{
            ...typography.caption,
            color: colors.slip,
          }}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}
