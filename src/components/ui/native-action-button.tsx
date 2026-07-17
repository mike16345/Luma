import { Button, Host } from "@expo/ui";

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
  return (
    <Host matchContents={{ vertical: true }} seedColor={colors.action}>
      <Button
        disabled={disabled}
        label={label}
        onPress={disabled ? undefined : onPress}
        variant={variant}
      />
    </Host>
  );
}
