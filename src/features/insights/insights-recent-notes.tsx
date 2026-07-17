import { Text, View } from "react-native";

import { SectionCard } from "@/components/ui/section-card";
import type { InsightsNote } from "@/features/insights/insights-selectors";
import { useLanguage } from "@/i18n/language-context";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function InsightsRecentNotes({ notes }: { notes: InsightsNote[] }) {
  const { t, textAlign } = useLanguage();

  if (notes.length === 0) {
    return null;
  }

  return (
    <SectionCard eyebrow={t("insights.recent")} title={t("insights.notes")}>
      <View style={{ gap: spacing.md }}>
        {notes.map((note) => (
          <View key={note.id} style={{ gap: spacing.xxs }}>
            <Text
              selectable
              style={{
                ...typography.caption,
                color: colors.textMuted,
                textAlign,
              }}
            >
              {note.dateLabel}
            </Text>
            <Text
              selectable
              style={{
                ...typography.body,
                color: colors.textSecondary,
                textAlign,
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
