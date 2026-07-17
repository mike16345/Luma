import { Text, useWindowDimensions, View } from "react-native";

import { PageHeader } from "@/components/ui/page-header";
import { Screen } from "@/components/ui/screen";
import { BadgeCard } from "@/features/badges/badge-card";
import type { BadgeViewModel } from "@/features/badges/badge-selectors";
import { HomeErrorState, HomeLoadingState } from "@/features/home/home-states";
import { useHomeViewModel } from "@/features/home/use-home-view-model";
import { getFlexDirection } from "@/i18n/languages";
import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

function toRows(badges: BadgeViewModel[]) {
  const rows: BadgeViewModel[][] = [];

  for (let index = 0; index < badges.length; index += 2) {
    rows.push(badges.slice(index, index + 2));
  }

  return rows;
}

function BadgeGroup({
  badges,
  cardWidth,
  title,
}: {
  badges: BadgeViewModel[];
  cardWidth: number;
  title: string;
}) {
  const colors = useThemeColors();
  const { direction, textAlign } = useLanguage();

  if (badges.length === 0) {
    return null;
  }

  return (
    <View style={{ gap: spacing.md }}>
      <Text
        selectable
        style={{
          ...typography.section,
          color: colors.textPrimary,
          textAlign,
        }}
      >
        {title}
      </Text>
      <View style={{ gap: spacing.sm }}>
        {toRows(badges).map((row) => (
          <View
            key={row.map((badge) => badge.id).join("-")}
            style={{
              flexDirection: getFlexDirection(direction),
              gap: spacing.sm,
            }}
          >
            {row.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                showDescription
                width={cardWidth}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

export function BadgesScreen() {
  const { t } = useLanguage();
  const { width } = useWindowDimensions();
  const state = useHomeViewModel();
  const contentWidth = Math.min(width - spacing.screen * 2, 640);
  const cardWidth = Math.floor((contentWidth - spacing.sm) / 2);

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

  const unlockedBadges = state.data.badges.featuredBadges;
  const lockedBadges = state.data.badges.badges.filter(
    (badge) => !badge.isUnlocked
  );

  return (
    <Screen>
      <PageHeader
        eyebrow={t("badges.sectionEyebrow")}
        title={t("badges.allTitle")}
        subtitle={t("badges.allSubtitle")}
      />
      <BadgeGroup
        badges={unlockedBadges}
        cardWidth={cardWidth}
        title={t("badges.unlocked")}
      />
      <BadgeGroup
        badges={lockedBadges}
        cardWidth={cardWidth}
        title={t("badges.locked")}
      />
    </Screen>
  );
}
