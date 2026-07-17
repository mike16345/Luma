import { Text, View } from "react-native";

import { Screen } from "@/components/ui/screen";
import { StartChapterForm } from "@/features/onboarding/start-chapter-form";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function StartChapterScreen() {
  return (
    <Screen>
      <View style={{ gap: spacing.xs }}>
        <Text
          selectable
          style={{
            ...typography.caption,
            color: colors.textMuted,
            textTransform: "uppercase",
          }}
        >
          Start
        </Text>
        <Text
          selectable
          style={{
            ...typography.title,
            color: colors.textPrimary,
          }}
        >
          Start your first chapter.
        </Text>
        <Text
          selectable
          style={{
            ...typography.body,
            color: colors.textSecondary,
          }}
        >
          Practical estimates are enough. You can correct the active chapter
          later from Settings.
        </Text>
      </View>

      <StartChapterForm />
    </Screen>
  );
}
