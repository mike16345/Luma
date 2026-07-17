import { Text, View } from "react-native";

import { SectionCard } from "@/components/ui/section-card";
import type { GoalViewModel } from "@/features/goal/goal-selectors";
import { getFlexDirection } from "@/i18n/languages";
import { useLanguage } from "@/i18n/language-context";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function GoalProgressCard({ goal }: { goal: GoalViewModel }) {
  const { direction, t, textAlign } = useLanguage();

  return (
    <SectionCard
      eyebrow={t("goal.currentChapterEyebrow")}
      title={t("goal.progressTitle")}
    >
      <View style={{ gap: spacing.md }}>
        <View style={{ gap: spacing.xs }}>
          <Text
            selectable
            style={{
              ...typography.caption,
              color: colors.textMuted,
              textTransform: "uppercase",
              textAlign,
            }}
          >
            {t("goal.savedTowardGoal")}
          </Text>
          <Text
            selectable
            style={{
              fontSize: 34,
              lineHeight: 40,
              fontWeight: "700",
              color: colors.textPrimary,
              textAlign,
            }}
          >
            {goal.savedLabel}
          </Text>
        </View>

        {goal.hasGoal && goal.progress !== null ? (
          <>
            <View
              style={{
                height: 12,
                overflow: "hidden",
                borderRadius: 999,
                backgroundColor: colors.surfaceMuted,
              }}
            >
              <View
                style={{
                  width: `${Math.round(goal.progress * 100)}%`,
                  height: "100%",
                  borderRadius: 999,
                  backgroundColor: colors.accentSavings,
                }}
              />
            </View>
            <View
              style={{
                flexDirection: getFlexDirection(direction),
                justifyContent: "space-between",
                gap: spacing.md,
              }}
            >
              <Text
                selectable
                style={{
                  ...typography.bodyMedium,
                  flex: 1,
                  color: colors.textPrimary,
                  textAlign,
                }}
              >
                {goal.progressPercentLabel} {t("common.completeSuffix")}
              </Text>
              <Text
                selectable
                style={{
                  ...typography.body,
                  color: colors.textSecondary,
                  textAlign,
                }}
              >
                {goal.remainingLabel} {t("common.remainingSuffix")}
              </Text>
            </View>
          </>
        ) : (
          <Text
            selectable
            style={{
              ...typography.body,
              color: colors.textSecondary,
              textAlign,
            }}
          >
            {t("goal.addGoalHelp")}
          </Text>
        )}
      </View>
    </SectionCard>
  );
}
