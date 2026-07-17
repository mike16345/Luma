import { Pressable, Text } from "react-native";

import { useLanguage } from "@/i18n/language-context";
import { gradientStyle, gradients } from "@/theme/gradients";
import { spacing } from "@/theme/spacing";
import { useTheme } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

export type NativeActionButtonVariant = "filled" | "outlined" | "text";

export type NativeActionButtonProps = {
  label: string;
  onPress: () => void;
  variant?: NativeActionButtonVariant;
  disabled?: boolean;
};

export function NativeActionButton({
  disabled = false,
  label,
  onPress,
  variant = "filled",
}: NativeActionButtonProps) {
  const { textAlign } = useLanguage();
  const { colors, resolvedTheme } = useTheme();
  const isFilled = variant === "filled";

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        {
          minHeight: 54,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.sm,
          borderRadius: 18,
          borderCurve: "continuous",
          borderWidth: variant === "text" ? 0 : 1,
          borderColor: isFilled ? "transparent" : colors.border,
          backgroundColor: isFilled ? colors.action : "transparent",
          opacity: disabled ? 0.55 : pressed ? 0.86 : 1,
        },
        isFilled
          ? gradientStyle(
              resolvedTheme === "dark" ? gradients.actionDark : gradients.action
            )
          : null,
      ]}
    >
      <Text
        style={{
          ...typography.bodyMedium,
          color: isFilled
            ? colors.actionText
            : variant === "text"
              ? colors.action
              : colors.textPrimary,
          textAlign,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
