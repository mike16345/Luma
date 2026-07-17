import { Text, View } from "react-native";

import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

export function PageHeader({
  eyebrow,
  subtitle,
  title,
}: {
  eyebrow?: string;
  subtitle?: string;
  title: string;
}) {
  const colors = useThemeColors();
  const { direction, textAlign } = useLanguage();

  return (
    <View
      style={{
        gap: spacing.md,
        paddingBottom: spacing.xxs,
      }}
    >
      {eyebrow ? (
        <View
          style={{
            alignSelf: direction === "rtl" ? "flex-end" : "flex-start",
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.xxs,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.surfaceElevated,
          }}
        >
          <Text
            selectable
            style={{
              ...typography.label,
              color: colors.action,
              textAlign,
              letterSpacing: 0,
            }}
          >
            {eyebrow}
          </Text>
        </View>
      ) : null}
      <Text
        selectable
        style={{
          ...typography.title,
          maxWidth: 640,
          color: colors.textPrimary,
          textAlign,
        }}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          selectable
          style={{
            ...typography.body,
            maxWidth: 620,
            color: colors.textSecondary,
            textAlign,
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
