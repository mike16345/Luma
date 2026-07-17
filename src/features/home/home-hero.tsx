import { Text, View } from "react-native";

import type { HomeViewModel } from "@/features/home/home-selectors";
import { HomeActionButtons } from "@/features/home/home-action-buttons";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function HomeHero({ data }: { data: HomeViewModel }) {
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
      <HomeActionButtons hasActiveChapter={data.hasActiveChapter} />
    </View>
  );
}
