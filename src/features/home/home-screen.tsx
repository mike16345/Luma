import { RefreshControl, Text, useWindowDimensions, View } from "react-native";

import { Screen } from "@/components/ui/screen";
import { HomeContextMetrics } from "@/features/home/home-context-metrics";
import { HomeGoalCard } from "@/features/home/home-goal-card";
import { HomeHero } from "@/features/home/home-hero";
import { HomePeriodRows } from "@/features/home/home-period-rows";
import { HomePrimaryMetrics } from "@/features/home/home-primary-metrics";
import { HomeErrorState, HomeLoadingState } from "@/features/home/home-states";
import { HomeWeeklySummary } from "@/features/home/home-weekly-summary";
import type { HomeViewModel } from "@/features/home/home-selectors";
import { useHomeViewModel } from "@/features/home/use-home-view-model";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

function HomeContent({
  data,
  refresh,
}: {
  data: HomeViewModel;
  refresh: () => Promise<void>;
}) {
  const { width } = useWindowDimensions();
  const isWide = width >= 720;

  return (
    <Screen
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => {
            void refresh();
          }}
          tintColor={colors.action}
        />
      }
    >
      <View style={{ gap: spacing.xs }}>
        <Text
          selectable
          style={{
            ...typography.caption,
            color: colors.textMuted,
            textTransform: "uppercase",
          }}
        >
          Luma
        </Text>
        <Text
          selectable
          style={{
            ...typography.title,
            color: colors.textPrimary,
          }}
        >
          Your progress, kept private.
        </Text>
      </View>

      <HomeHero data={data} />
      <HomePrimaryMetrics metrics={data.primaryMetrics} isWide={isWide} />
      <HomeWeeklySummary data={data} />
      <HomePeriodRows data={data} />
      <HomeGoalCard data={data} />
      <HomeContextMetrics data={data} />
    </Screen>
  );
}

export function HomeScreen() {
  const state = useHomeViewModel();

  if (state.status === "loading") {
    return <HomeLoadingState />;
  }

  if (state.status === "error") {
    return (
      <HomeErrorState
        message={state.error.message}
        refresh={state.refresh}
      />
    );
  }

  return <HomeContent data={state.data} refresh={state.refresh} />;
}
