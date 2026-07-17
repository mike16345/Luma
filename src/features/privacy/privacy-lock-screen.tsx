import { Text, View } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
import { gradientStyle, gradients } from "@/theme/gradients";
import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";
import { useTheme } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

export function PrivacyLockScreen({
  message,
  onUnlock,
}: {
  message: string | null;
  onUnlock: () => void;
}) {
  const { colors, resolvedTheme } = useTheme();
  const { t, textAlign } = useLanguage();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        gap: spacing.lg,
        padding: spacing.screen,
        backgroundColor: colors.background,
        ...gradientStyle(
          resolvedTheme === "dark"
            ? gradients.appBackgroundDark
            : gradients.appBackground
        ),
      }}
    >
      <View
        style={{
          gap: spacing.md,
          padding: spacing.lg,
          borderRadius: 28,
          borderCurve: "continuous",
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surfaceElevated,
          boxShadow: `0 22px 54px ${colors.shadow}`,
        }}
      >
        <View style={{ gap: spacing.xs }}>
          <Text
            style={{
              ...typography.title,
              color: colors.textPrimary,
              textAlign,
            }}
          >
            {t("privacy.lockedTitle")}
          </Text>
          <Text
            style={{
              ...typography.body,
              color: colors.textSecondary,
              textAlign,
            }}
          >
            {t("privacy.lockedMessage")}
          </Text>
        </View>
        {message ? (
          <Text
            style={{
              ...typography.caption,
              color: colors.textMuted,
              textAlign,
            }}
          >
            {message}
          </Text>
        ) : null}
        <NativeActionButton label={t("privacy.unlockLuma")} onPress={onUnlock} />
      </View>
    </View>
  );
}
