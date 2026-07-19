import { useWindowDimensions } from "react-native";

import { PageHeader } from "@/components/ui/page-header";
import { Screen } from "@/components/ui/screen";
import { HomeBadgesSection } from "@/features/home/home-badges-section";
import { HomeContextMetrics } from "@/features/home/home-context-metrics";
import { HomeGoalCard } from "@/features/home/home-goal-card";
import { HomeHero } from "@/features/home/home-hero";
import { HomePeriodRows } from "@/features/home/home-period-rows";
import { HomePrimaryMetrics } from "@/features/home/home-primary-metrics";
import { HomeErrorState, HomeLoadingState } from "@/features/home/home-states";
import { HomeWeeklySummary } from "@/features/home/home-weekly-summary";
import type { HomeViewModel } from "@/features/home/home-selectors";
import { useHomeViewModel } from "@/features/home/use-home-view-model";
import { HomeQuitReasonCard } from "@/features/reasons/home-quit-reason-card";
import { useLanguage } from "@/i18n/language-context";

function HomeContent({ data }: { data: HomeViewModel }) {
  const { t } = useLanguage();
  const { width } = useWindowDimensions();
  const isWide = width >= 720;

  return (
    <Screen>
      <PageHeader eyebrow={t("common.appName")} title={t("home.title")} />
      <HomeHero data={data} />
      <HomePrimaryMetrics metrics={data.primaryMetrics} isWide={isWide} />
      <HomeWeeklySummary data={data} />
      <HomePeriodRows data={data} />
      <HomeGoalCard data={data} />
      <HomeQuitReasonCard />
      <HomeBadgesSection data={data} />
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

  return <HomeContent data={state.data} />;
}
