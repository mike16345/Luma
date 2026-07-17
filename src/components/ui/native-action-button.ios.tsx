import { Button, Host } from "@expo/ui/swift-ui";
import {
  buttonStyle,
  controlSize,
  disabled as disabledModifier,
  frame,
  tint,
} from "@expo/ui/swift-ui/modifiers";

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
  const style =
    variant === "outlined" ? "bordered" : variant === "text" ? "plain" : "borderedProminent";

  return (
    <Host matchContents={{ vertical: true }} seedColor={colors.action}>
      <Button
        label={label}
        onPress={disabled ? undefined : onPress}
        modifiers={[
          frame({ maxWidth: 520 }),
          buttonStyle(style),
          controlSize("large"),
          tint(colors.action),
          disabledModifier(disabled),
        ]}
      />
    </Host>
  );
}
