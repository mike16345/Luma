import { PropsWithChildren } from "react";
import { Text, View } from "react-native";

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
  return (
    <View
      style={{
        gap: spacing.md,
        padding: spacing.md,
        borderRadius: 8,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
      }}
    >
      {eyebrow || title ? (
        <View style={{ gap: spacing.xxs }}>
          {eyebrow ? (
            <Text
              selectable
              style={{
                ...typography.caption,
                color: colors.textMuted,
                textTransform: "uppercase",
              }}
            >
              {eyebrow}
            </Text>
          ) : null}
          {title ? (
            <Text
              selectable
              style={{
                ...typography.section,
                color: colors.textPrimary,
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
