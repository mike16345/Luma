import { Text, View } from "react-native";

import { SectionCard } from "@/components/ui/section-card";
import type { InsightsNote } from "@/features/insights/insights-selectors";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function InsightsRecentNotes({ notes }: { notes: InsightsNote[] }) {
  if (notes.length === 0) {
    return null;
  }

  return (
    <SectionCard eyebrow="Recent" title="Notes">
      <View style={{ gap: spacing.md }}>
        {notes.map((note) => (
          <View key={note.id} style={{ gap: spacing.xxs }}>
            <Text
              selectable
              style={{
                ...typography.caption,
                color: colors.textMuted,
              }}
            >
              {note.dateLabel}
            </Text>
            <Text
              selectable
              style={{
                ...typography.body,
                color: colors.textSecondary,
              }}
            >
              {note.note}
            </Text>
          </View>
        ))}
      </View>
    </SectionCard>
  );
}
