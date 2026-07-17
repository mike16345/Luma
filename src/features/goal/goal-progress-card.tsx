import { Text, View } from "react-native";

import { SectionCard } from "@/components/ui/section-card";
import { goalSavedLabel, type GoalViewModel } from "@/features/goal/goal-selectors";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function GoalProgressCard({ goal }: { goal: GoalViewModel }) {
  return (
    <SectionCard eyebrow="Current chapter" title="Goal progress">
      <View style={{ gap: spacing.md }}>
        <View style={{ gap: spacing.xs }}>
          <Text
            selectable
            style={{
              ...typography.caption,
              color: colors.textMuted,
              textTransform: "uppercase",
            }}
          >
            {goalSavedLabel}
          </Text>
          <Text
            selectable
            style={{
              fontSize: 34,
              lineHeight: 40,
              fontWeight: "700",
              color: colors.textPrimary,
            }}
          >
            {goal.savedLabel}
          </Text>
        </View>

        {goal.hasGoal && goal.progress !== null ? (
          <>
            <View
              style={{
                height: 10,
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
                  backgroundColor: colors.action,
                }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
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
                }}
              >
                {goal.progressPercentLabel} complete
              </Text>
              <Text
                selectable
                style={{
                  ...typography.body,
                  color: colors.textSecondary,
                  textAlign: "right",
                }}
              >
                {goal.remainingLabel} remaining
              </Text>
            </View>
          </>
        ) : (
          <Text
            selectable
            style={{
              ...typography.body,
              color: colors.textSecondary,
            }}
          >
            Add a goal amount to track estimated savings against this chapter.
          </Text>
        )}
      </View>
    </SectionCard>
  );
}
