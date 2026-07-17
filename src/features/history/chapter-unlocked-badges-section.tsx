import { ScrollView } from "react-native";

import { SectionCard } from "@/components/ui/section-card";
import { BadgeCard } from "@/features/badges/badge-card";
import type { BadgeViewModel } from "@/features/badges/badge-selectors";
import { getFlexDirection } from "@/i18n/languages";
import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";

export function ChapterUnlockedBadgesSection({
  badges,
}: {
  badges: BadgeViewModel[];
}) {
  const { direction, t } = useLanguage();

  if (badges.length === 0) {
    return null;
  }

  return (
    <SectionCard
      eyebrow={t("badges.sectionEyebrow")}
      title={t("history.unlockedDuringChapter")}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: getFlexDirection(direction),
          gap: spacing.sm,
          paddingEnd: spacing.xs,
        }}
      >
        {badges.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} width={142} />
        ))}
      </ScrollView>
    </SectionCard>
  );
}
