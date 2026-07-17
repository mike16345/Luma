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
  const { textAlign } = useLanguage();

  return (
    <View
      style={{
        gap: spacing.sm,
        paddingBottom: spacing.xs,
      }}
    >
      {eyebrow ? (
        <View
          style={{
            alignSelf: "flex-start",
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.xxs,
            borderRadius: 999,
            backgroundColor: colors.actionSoft,
          }}
        >
          <Text
            selectable
            style={{
              ...typography.label,
              color: colors.action,
              textAlign,
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
