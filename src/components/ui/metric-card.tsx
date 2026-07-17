import { Text, View, type ViewStyle } from "react-native";

import { useLanguage } from "@/i18n/language-context";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function MetricCard({
  label,
  value,
  supportingText,
  accentColor = colors.action,
  style,
}: {
  label: string;
  value: string;
  supportingText?: string;
  accentColor?: string;
  style?: ViewStyle;
}) {
  const { textAlign } = useLanguage();

  return (
    <View
      style={[
        {
          minHeight: 116,
          flex: 1,
          minWidth: 150,
          justifyContent: "space-between",
          gap: spacing.md,
          padding: spacing.lg,
          borderRadius: 8,
          borderCurve: "continuous",
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
        },
        style,
      ]}
    >
      <View
        style={{
          width: 34,
          height: 4,
          borderRadius: 999,
          backgroundColor: accentColor,
        }}
      />
      <View style={{ gap: spacing.xs }}>
        <Text
          selectable
          style={{
            ...typography.label,
            color: colors.textSecondary,
            textTransform: "uppercase",
            textAlign,
          }}
        >
          {label}
        </Text>
        <Text
          selectable
          adjustsFontSizeToFit
          numberOfLines={1}
          style={{
            fontSize: 28,
            lineHeight: 34,
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
