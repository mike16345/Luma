import { Text, View, type ViewStyle } from "react-native";

import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

export function MetricCard({
  label,
  value,
  supportingText,
  accentColor,
  style,
}: {
  label: string;
  value: string;
  supportingText?: string;
  accentColor?: string;
  style?: ViewStyle;
}) {
  const { textAlign } = useLanguage();
  const colors = useThemeColors();
  const resolvedAccent = accentColor ?? colors.action;

  return (
    <View
      style={[
        {
          minHeight: 128,
          flex: 1,
          minWidth: 150,
          justifyContent: "space-between",
          gap: spacing.md,
          padding: spacing.lg,
          borderRadius: 24,
          borderCurve: "continuous",
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surfaceElevated,
          boxShadow: `0 16px 36px ${colors.shadow}`,
        },
        style,
      ]}
    >
      <View
        style={{
          width: 34,
          height: 4,
          borderRadius: 999,
          backgroundColor: resolvedAccent,
        }}
      />
      <View style={{ gap: spacing.xs }}>
        <Text
          selectable
          style={{
            ...typography.label,
            color: colors.textSecondary,
            textAlign,
            letterSpacing: 0,
          }}
        >
          {label}
        </Text>
        <Text
          selectable
          adjustsFontSizeToFit
          numberOfLines={1}
          style={{
            fontSize: 31,
            lineHeight: 37,
            fontWeight: "700",
            color: colors.textPrimary,
            fontVariant: ["tabular-nums"],
            textAlign,
          }}
        >
          {value}
        </Text>
        {supportingText ? (
          <Text
            selectable
            style={{
              ...typography.caption,
              color: colors.textSecondary,
              textAlign,
            }}
          >
            {supportingText}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
