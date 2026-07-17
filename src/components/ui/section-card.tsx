import { PropsWithChildren } from "react";
import { Text, View } from "react-native";

import { getFlexDirection } from "@/i18n/languages";
import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

export function SectionCard({
  children,
  eyebrow,
  title,
}: PropsWithChildren<{
  eyebrow?: string;
  title?: string;
}>) {
  const { direction, textAlign } = useLanguage();
  const colors = useThemeColors();

  return (
    <View
      style={{
        gap: spacing.lg,
        padding: spacing.lg,
        borderRadius: 22,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surfaceElevated,
        boxShadow: `0 18px 42px ${colors.shadow}`,
      }}
    >
      {eyebrow || title ? (
        <View style={{ gap: spacing.xs }}>
          {eyebrow ? (
            <View
              style={{
                flexDirection: getFlexDirection(direction),
                alignItems: "center",
                gap: spacing.xs,
              }}
            >
              <View
                style={{
                  width: 18,
                  height: 2,
                  borderRadius: 999,
                  backgroundColor: colors.action,
                }}
              />
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
          {title ? (
            <Text
              selectable
              style={{
                ...typography.section,
                color: colors.textPrimary,
                textAlign,
              }}
            >
              {title}
            </Text>
          ) : null}
        </View>
      ) : null}
      {children}
    </View>
  );
}
