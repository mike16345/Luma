import { Button, Host, OutlinedButton, Text, TextButton } from "@expo/ui/jetpack-compose";
import { fillMaxWidth } from "@expo/ui/jetpack-compose/modifiers";

import { colors } from "@/theme/colors";

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
  const ButtonComponent =
    variant === "outlined" ? OutlinedButton : variant === "text" ? TextButton : Button;

  return (
    <Host matchContents={{ vertical: true }} seedColor={colors.action}>
      <ButtonComponent
        enabled={!disabled}
        onClick={disabled ? undefined : onPress}
        modifiers={[fillMaxWidth()]}
      >
        <Text>{label}</Text>
      </ButtonComponent>
    </Host>
  );
}
