import { Button, Host, OutlinedButton, Shape, Text, TextButton } from "@expo/ui/jetpack-compose";
import { fillMaxWidth, height } from "@expo/ui/jetpack-compose/modifiers";

import { useThemeColors } from "@/theme/theme-context";

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
  const colors = useThemeColors();
  const ButtonComponent =
    variant === "outlined" ? OutlinedButton : variant === "text" ? TextButton : Button;
  const isFilled = variant === "filled";

  return (
    <Host matchContents={{ vertical: true }} seedColor={colors.action}>
      <ButtonComponent
        enabled={!disabled}
        onClick={disabled ? undefined : onPress}
        modifiers={[fillMaxWidth(), height(54)]}
        shape={Shape.RoundedCorner({
          cornerRadii: {
            topStart: 18,
            topEnd: 18,
            bottomStart: 18,
            bottomEnd: 18,
          },
        })}
        colors={{
          containerColor: isFilled ? colors.action : "transparent",
          contentColor: isFilled ? colors.actionText : colors.action,
          disabledContainerColor: colors.surfaceMuted,
          disabledContentColor: colors.textMuted,
        }}
      >
        <Text
          color={isFilled ? colors.actionText : colors.action}
          style={{ typography: "labelLarge" }}
        >
          {label}
        </Text>
      </ButtonComponent>
    </Host>
  );
}
