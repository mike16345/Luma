import { PropsWithChildren } from "react";
import { Text, View } from "react-native";

import { getFlexDirection } from "@/i18n/languages";
import { useLanguage } from "@/i18n/language-context";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
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

  return (
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
                  textTransform: "uppercase",
                  textAlign,
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
