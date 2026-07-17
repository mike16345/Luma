import { Text, View } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

export function PrivacyLockScreen({
  message,
  onUnlock,
}: {
  message: string | null;
  onUnlock: () => void;
}) {
  const colors = useThemeColors();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        gap: spacing.lg,
        padding: spacing.screen,
        backgroundColor: colors.background,
      }}
    >
      <View
        style={{
          gap: spacing.md,
          padding: spacing.lg,
          borderRadius: 8,
          borderCurve: "continuous",
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
        }}
      >
        <View style={{ gap: spacing.xs }}>
          <Text
            style={{
              ...typography.title,
              color: colors.textPrimary,
            }}
          >
            Luma is locked.
          </Text>
          <Text
            style={{
              ...typography.body,
              color: colors.textSecondary,
            }}
          >
            Unlock to view your private progress on this device.
          </Text>
        </View>
        {message ? (
          <Text
            style={{
              ...typography.caption,
              color: colors.textMuted,
            }}
          >
            {message}
          </Text>
        ) : null}
        <NativeActionButton label="Unlock Luma" onPress={onUnlock} />
      </View>
    </View>
  );
}
