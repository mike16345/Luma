import { Text, View, type DimensionValue } from "react-native";

import { BadgeIcon } from "@/features/badges/badge-icon";
import type { BadgeViewModel } from "@/features/badges/badge-selectors";
import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

export function BadgeCard({
  badge,
  showDescription = false,
  width = 132,
}: {
  badge: BadgeViewModel;
  showDescription?: boolean;
  width?: number;
}) {
  const colors = useThemeColors();
  const { direction, t, textAlign } = useLanguage();
  const progressPercent = `${Math.round(badge.progress * 100)}%` as DimensionValue;

  return (
    <View
      style={{
        width,
        minHeight: showDescription ? 194 : 146,
        justifyContent: "space-between",
        gap: spacing.xs,
        padding: spacing.sm,
        borderRadius: 18,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: badge.isUnlocked ? colors.actionSoft : colors.border,
        backgroundColor: badge.isUnlocked
          ? colors.surfaceElevated
          : colors.surfaceMuted,
        boxShadow: badge.isUnlocked ? `0 12px 26px ${colors.shadow}` : undefined,
      }}
    >
      <View style={{ gap: spacing.sm }}>
        <BadgeIcon
          fallback={badge.iconFallback}
          icon={badge.icon}
          isUnlocked={badge.isUnlocked}
          tone={badge.tone}
        />
        <View style={{ gap: spacing.xxs }}>
          <Text
            selectable
            numberOfLines={showDescription ? 3 : 2}
            style={{
              ...typography.caption,
              color: colors.textPrimary,
              textAlign,
            }}
          >
            {badge.title}
          </Text>
          {showDescription ? (
            <Text
              selectable
              numberOfLines={3}
              style={{
                ...typography.caption,
                color: colors.textSecondary,
                textAlign,
              }}
            >
              {badge.description}
            </Text>
          ) : null}
          <Text
            selectable
            numberOfLines={1}
            style={{
              ...typography.caption,
              color: colors.textMuted,
              textAlign,
            }}
          >
            {badge.isUnlocked ? t("badges.unlocked") : t("badges.locked")}
          </Text>
        </View>
      </View>

      <View style={{ gap: spacing.xs }}>
        <View
          style={{
            height: 6,
            overflow: "hidden",
            borderRadius: 999,
            backgroundColor: colors.border,
          }}
        >
          <View
            style={{
              width: progressPercent,
              height: "100%",
              alignSelf: direction === "rtl" ? "flex-end" : "flex-start",
              borderRadius: 999,
              backgroundColor: badge.isUnlocked ? colors.action : colors.textMuted,
            }}
          />
        </View>
        <Text
          selectable
          numberOfLines={1}
          style={{
            ...typography.caption,
            color: colors.textSecondary,
            textAlign,
          }}
        >
          {badge.remainingLabel ?? badge.targetLabel}
        </Text>
      </View>
    </View>
  );
}
