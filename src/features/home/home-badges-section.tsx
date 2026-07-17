import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";

import { SectionCard } from "@/components/ui/section-card";
import { BadgeCard } from "@/features/badges/badge-card";
import type { BadgeViewModel } from "@/features/badges/badge-selectors";
import type { HomeViewModel } from "@/features/home/home-selectors";
import { getFlexDirection } from "@/i18n/languages";
import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

function uniqueBadges(badges: BadgeViewModel[]) {
  const seen = new Set<string>();
  return badges.filter((badge) => {
    if (seen.has(badge.id)) {
      return false;
    }

    seen.add(badge.id);
    return true;
  });
}

export function HomeBadgesSection({ data }: { data: HomeViewModel }) {
  const colors = useThemeColors();
  const router = useRouter();
  const { direction, t, textAlign } = useLanguage();
  const unlocked = data.badges.featuredBadges.slice(-2).reverse();
  const upcoming = data.badges.upcomingBadges.slice(0, 4);
  const visibleBadges = uniqueBadges([...unlocked, ...upcoming]).slice(0, 6);

  return (
    <SectionCard eyebrow={t("badges.sectionEyebrow")} title={t("badges.title")}>
      <View style={{ gap: spacing.md }}>
        <Text
          selectable
          style={{
            ...typography.body,
            color: colors.textSecondary,
            textAlign,
          }}
        >
          {t("badges.subtitle")}
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: direction === "rtl" ? "row-reverse" : "row",
            gap: spacing.sm,
            paddingBottom: spacing.xs,
          }}
        >
          {visibleBadges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </ScrollView>
        <View
          style={{
            flexDirection: getFlexDirection(direction),
            justifyContent: "flex-end",
          }}
        >
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/badges")}
            style={({ pressed }) => ({
              flexDirection: getFlexDirection(direction),
              alignItems: "center",
              gap: spacing.xxs,
              opacity: pressed ? 0.72 : 1,
            })}
          >
            <Text
              style={{
                ...typography.caption,
                color: colors.action,
                textAlign,
              }}
            >
              {t("badges.viewAll")}
            </Text>
            <SymbolView
              name={{
                ios: direction === "rtl" ? "chevron.left" : "chevron.right",
                android: direction === "rtl" ? "chevron_left" : "chevron_right",
                web: direction === "rtl" ? "chevron_left" : "chevron_right",
              }}
              size={14}
              tintColor={colors.action}
              fallback={
                <Text style={{ ...typography.caption, color: colors.action }}>
                  {direction === "rtl" ? "<" : ">"}
                </Text>
              }
            />
          </Pressable>
        </View>
      </View>
    </SectionCard>
  );
}
