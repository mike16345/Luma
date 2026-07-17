import { Button, Host } from "@expo/ui";

import { colors } from "@/theme/colors";

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
  return (
    <Host matchContents={{ vertical: true }} seedColor={colors.action}>
      <Button label={label} onPress={onPress} variant={variant} />
    </Host>
  );
}
