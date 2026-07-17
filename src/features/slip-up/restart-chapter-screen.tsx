import { Text, View } from "react-native";

import { Screen } from "@/components/ui/screen";
import { StartChapterForm } from "@/features/onboarding/start-chapter-form";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function RestartChapterScreen() {
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
          New chapter
        </Text>
        <Text
          selectable
          style={{
            ...typography.title,
            color: colors.textPrimary,
          }}
        >
          Start again from here.
        </Text>
        <Text
          selectable
          style={{
            ...typography.body,
            color: colors.textSecondary,
          }}
        >
          Your previous chapter stays in History. This starts a fresh chapter
          with new goal progress.
        </Text>
      </View>

      <StartChapterForm />
    </Screen>
  );
}
