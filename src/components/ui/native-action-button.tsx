import { Pressable, Text } from "react-native";

import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export type NativeActionButtonVariant = "filled" | "outlined" | "text";

export type NativeActionButtonProps = {
  label: string;
  onPress: () => void;
  variant?: NativeActionButtonVariant;
};

export function NativeActionButton({
  label,
  onPress,
  variant = "filled",
}: NativeActionButtonProps) {
  const isFilled = variant === "filled";
  const isOutlined = variant === "outlined";

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 44,
        width: "100%",
        maxWidth: 520,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 8,
        borderWidth: isOutlined ? 1 : 0,
        borderColor: colors.action,
        backgroundColor: isFilled ? colors.action : "transparent",
        opacity: pressed ? 0.76 : 1,
      })}
    >
      <Text
        style={{
          ...typography.bodyMedium,
          color: isFilled ? colors.surface : colors.action,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
