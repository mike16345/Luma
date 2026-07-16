import { useRouter } from "expo-router";
import { RefreshControl, Text, useWindowDimensions, View } from "react-native";

import { MetricCard } from "@/components/ui/metric-card";
import { NativeActionButton } from "@/components/ui/native-action-button";
import { Screen } from "@/components/ui/screen";
import { SectionCard } from "@/components/ui/section-card";
import type { HomeMetricViewModel, HomeViewModel } from "@/features/home/home-selectors";
import { useHomeViewModel } from "@/features/home/use-home-view-model";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

function ActionButtons({
  hasActiveChapter,
}: {
  hasActiveChapter: boolean;
}) {
  const router = useRouter();

  return (
    <View style={{ gap: spacing.sm }}>
      {hasActiveChapter ? (
        <>
          <NativeActionButton
            label="Log slip-up"
            onPress={() => router.push("/slip-up")}
          />
          <NativeActionButton
            label="View goal"
            variant="outlined"
            onPress={() => router.push("/goal")}
          />
          <NativeActionButton
            label="Edit chapter"
            variant="text"
            onPress={() => router.push("/settings")}
          />
        </>
      ) : (
        <>
          <NativeActionButton
            label="Start a chapter"
            onPress={() => router.push("/onboarding")}
          />
          <NativeActionButton
            label="View history"
            variant="outlined"
            onPress={() => router.push("/history")}
          />
        </>
      )}
    </View>
  );
}

function LoadingState() {
  return (
    <Screen>
      <View style={{ gap: spacing.sm }}>
        <View
          style={{
            width: 88,
            height: 12,
            borderRadius: 999,
            backgroundColor: colors.surfaceMuted,
          }}
        />
        <View
          style={{
            width: "74%",
            height: 42,
            borderRadius: 8,
            backgroundColor: colors.surfaceMuted,
          }}
        />
      </View>
      <View style={{ flexDirection: "row", gap: spacing.sm }}>
        <View
          style={{
            flex: 1,
            height: 116,
            borderRadius: 8,
            backgroundColor: colors.surfaceMuted,
          }}
        />
        <View
          style={{
            flex: 1,
            height: 116,
            borderRadius: 8,
            backgroundColor: colors.surfaceMuted,
          }}
        />
      </View>
    </Screen>
  );
}

function ErrorState({
  message,
  refresh,
}: {
  message: string;
  refresh: () => Promise<void>;
}) {
  return (
    <Screen>
      <SectionCard title="Home is unavailable">
        <Text
          selectable
          style={{
            ...typography.body,
            color: colors.textSecondary,
          }}
        >
          {message}
        </Text>
        <NativeActionButton
          label="Try again"
          onPress={refresh}
        />
      </SectionCard>
    </Screen>
  );
}

function Hero({ data }: { data: HomeViewModel }) {
  return (
    <View
      style={{
        gap: spacing.lg,
        padding: spacing.lg,
        borderRadius: 8,
        borderCurve: "continuous",
        backgroundColor: colors.textPrimary,
      }}
    >
      <View style={{ gap: spacing.xs }}>
        <Text
          selectable
          style={{
            ...typography.caption,
            color: colors.actionSoft,
            textTransform: "uppercase",
          }}
        >
          {data.headline.supportingText}
        </Text>
        <Text
          selectable
          adjustsFontSizeToFit
          numberOfLines={2}
          style={{
            ...typography.display,
            color: colors.surface,
            fontVariant: ["tabular-nums"],
          }}
        >
          {data.headline.value}
        </Text>
        <Text
          selectable
          style={{
            ...typography.body,
            color: colors.actionSoft,
          }}
        >
          {data.hasActiveChapter
            ? "Your current chapter is being measured honestly from its start time."
            : "No active chapter is running. Your history still stays intact."}
        </Text>
      </View>
      <ActionButtons
        hasActiveChapter={data.hasActiveChapter}
      />
    </View>
  );
}

function PrimaryMetrics({
  metrics,
  isWide,
}: {
  metrics: HomeMetricViewModel[];
  isWide: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: isWide ? "row" : "column",
        gap: spacing.sm,
      }}
    >
      {metrics.map((metric, index) => (
        <MetricCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          supportingText={metric.supportingText}
          accentColor={index === 0 ? colors.accentTime : colors.accentSavings}
        />
      ))}
    </View>
  );
}

function PeriodRows({ data }: { data: HomeViewModel }) {
  return (
    <SectionCard eyebrow="Progress" title="By period">
      <View style={{ gap: spacing.xs }}>
        {data.periods.map((period) => (
          <View
            key={period.key}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: spacing.md,
              paddingVertical: spacing.sm,
              borderBottomWidth: period.key === "allTime" ? 0 : 1,
              borderBottomColor: colors.border,
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
              {period.label}
            </Text>
            <View style={{ alignItems: "flex-end", gap: spacing.xxs }}>
              <Text
                selectable
                style={{
                  ...typography.bodyMedium,
                  color: colors.textPrimary,
                  fontVariant: ["tabular-nums"],
                }}
              >
                {period.moneySaved}
              </Text>
              <Text
                selectable
                style={{
                  ...typography.caption,
                  color: colors.textMuted,
                  fontVariant: ["tabular-nums"],
                }}
              >
                {period.cigarettesAvoided} avoided
              </Text>
            </View>
          </View>
        ))}
      </View>
    </SectionCard>
  );
}

function WeeklySummary({ data }: { data: HomeViewModel }) {
  return (
    <SectionCard eyebrow="This week" title="Weekly summary">
      <View style={{ flexDirection: "row", gap: spacing.sm }}>
        {data.weeklySummary.map((metric) => (
          <View
            key={metric.label}
            style={{
              flex: 1,
              minHeight: 86,
              justifyContent: "space-between",
              gap: spacing.xs,
              padding: spacing.sm,
              borderRadius: 8,
              borderCurve: "continuous",
              backgroundColor: colors.surfaceMuted,
            }}
          >
            <Text
              selectable
              style={{
                ...typography.caption,
                color: colors.textMuted,
              }}
            >
              {metric.label}
            </Text>
            <Text
              selectable
              adjustsFontSizeToFit
              numberOfLines={1}
              style={{
                ...typography.section,
                color: colors.textPrimary,
                fontVariant: ["tabular-nums"],
              }}
            >
              {metric.value}
            </Text>
          </View>
        ))}
      </View>
    </SectionCard>
  );
}

function GoalCard({ data }: { data: HomeViewModel }) {
  const progressPercent = Math.round((data.goal.progress ?? 0) * 100);

  return (
    <SectionCard eyebrow="Goal" title={data.goal.hasGoal ? "Current chapter goal" : "No goal set"}>
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
          Money saved still counts. Add one goal when you want a concrete target for this chapter.
        </Text>
      )}
    </SectionCard>
  );
}

function ContextMetrics({ data }: { data: HomeViewModel }) {
  return (
    <View style={{ flexDirection: "row", gap: spacing.sm }}>
      <MetricCard
        label={data.longestStreak.label}
        value={data.longestStreak.value}
        accentColor={colors.accentWarm}
      />
      <MetricCard
        label={data.cumulativeSavings.label}
        value={data.cumulativeSavings.value}
        accentColor={colors.accentSavings}
      />
    </View>
  );
}

function HomeContent({ data, refresh }: { data: HomeViewModel; refresh: () => Promise<void> }) {
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

      <Hero data={data} />
      <PrimaryMetrics metrics={data.primaryMetrics} isWide={isWide} />
      <WeeklySummary data={data} />
      <PeriodRows data={data} />
      <GoalCard data={data} />
      <ContextMetrics data={data} />
    </Screen>
  );
}

export function HomeScreen() {
  const state = useHomeViewModel();

  if (state.status === "loading") {
    return <LoadingState />;
  }

  if (state.status === "error") {
    return <ErrorState message={state.error.message} refresh={state.refresh} />;
  }

  return <HomeContent data={state.data} refresh={state.refresh} />;
}
