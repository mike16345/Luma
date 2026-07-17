import { Text } from "react-native";

import { SectionCard } from "@/components/ui/section-card";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

export function InsightsEmptyState() {
  return (
    <SectionCard title="No insight data yet">
      <Text
        selectable
        style={{
          ...typography.body,
          color: colors.textSecondary,
        }}
      >
        Once slip-ups are logged, Luma will summarize the recorded triggers,
        moods, timing, and notes here. These summaries stay descriptive.
      </Text>
    </SectionCard>
  );
}
