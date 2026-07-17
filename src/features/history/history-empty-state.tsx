import { Text } from "react-native";

import { SectionCard } from "@/components/ui/section-card";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

export function HistoryEmptyState() {
  return (
    <SectionCard title="No chapters yet">
      <Text
        selectable
        style={{
          ...typography.body,
          color: colors.textSecondary,
        }}
      >
        Once a chapter exists, this page will keep a read-only record of its
        smoke-free time, estimated cigarettes avoided, and estimated savings.
      </Text>
    </SectionCard>
  );
}
