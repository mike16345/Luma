import { Text, View, type ViewStyle } from "react-native";

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
  return (
    <View
      style={[
        {
          minHeight: 116,
          flex: 1,
          minWidth: 150,
          justifyContent: "space-between",
          gap: spacing.md,
          padding: spacing.md,
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
          width: 28,
          height: 3,
          borderRadius: 999,
          backgroundColor: accentColor,
        }}
      />
      <View style={{ gap: spacing.xs }}>
        <Text
          selectable
          style={{
            ...typography.caption,
            color: colors.textMuted,
            textTransform: "uppercase",
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
            }}
          >
            {supportingText}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
