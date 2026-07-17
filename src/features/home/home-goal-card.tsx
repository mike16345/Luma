import { Text, View } from "react-native";

import { SectionCard } from "@/components/ui/section-card";
import type { HomeViewModel } from "@/features/home/home-selectors";
import { useLanguage } from "@/i18n/language-context";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function HomeGoalCard({ data }: { data: HomeViewModel }) {
  const { t, textAlign } = useLanguage();
  const progressPercent = Math.round((data.goal.progress ?? 0) * 100);

  return (
    <SectionCard
      eyebrow={t("home.goalEyebrow")}
      title={
        data.goal.hasGoal ? t("home.currentChapterGoal") : t("home.noGoalSet")
      }
    >
      {data.goal.hasGoal ? (
        <View style={{ gap: spacing.sm }}>
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
              textAlign,
            }}
          >
            {t("home.goalProgressText", {
              saved: data.goal.savedLabel ?? "",
              target: data.goal.targetLabel ?? "",
            })}
          </Text>
        </View>
      ) : (
        <Text
          selectable
          style={{
            ...typography.body,
            color: colors.textSecondary,
            textAlign,
          }}
        >
          {t("home.noGoalMessage")}
        </Text>
      )}
    </SectionCard>
  );
}
