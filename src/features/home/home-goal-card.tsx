import { Text, View } from "react-native";

import { SectionCard } from "@/components/ui/section-card";
import type { HomeViewModel } from "@/features/home/home-selectors";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function HomeGoalCard({ data }: { data: HomeViewModel }) {
  const progressPercent = Math.round((data.goal.progress ?? 0) * 100);

  return (
    <SectionCard
      eyebrow="Goal"
      title={data.goal.hasGoal ? "Current chapter goal" : "No goal set"}
    >
      {data.goal.hasGoal ? (
        <View style={{ gap: spacing.sm }}>
          <View
            style={{
              height: 8,
              overflow: "hidden",
              borderRadius: 999,
              backgroundColor: colors.surfaceMuted,
            }}
          >
            <View
              style={{
                width: `${progressPercent}%`,
                height: "100%",
                borderRadius: 999,
                backgroundColor: colors.accentSavings,
              }}
            />
          </View>
          <Text
            selectable
            style={{
              ...typography.body,
              color: colors.textSecondary,
            }}
          >
            {data.goal.savedLabel} saved toward {data.goal.targetLabel}
          </Text>
        </View>
      ) : (
        <Text
          selectable
          style={{
            ...typography.body,
            color: colors.textSecondary,
          }}
        >
          Money saved still counts. Add one goal when you want a concrete target
          for this chapter.
        </Text>
      )}
    </SectionCard>
  );
}
