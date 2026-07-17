import { Text, View } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
import { Screen } from "@/components/ui/screen";
import { SectionCard } from "@/components/ui/section-card";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function HistoryLoadingState() {
  return (
    <Screen>
      <View style={{ gap: spacing.sm }}>
        {[0, 1, 2].map((item) => (
          <View
            key={item}
            style={{
              height: 110,
              borderRadius: 8,
              backgroundColor: colors.surfaceMuted,
            }}
          />
        ))}
      </View>
    </Screen>
  );
}

export function HistoryErrorState({
  message,
  refresh,
}: {
  message: string;
  refresh: () => Promise<void>;
}) {
  return (
    <Screen>
      <SectionCard title="History is unavailable">
        <Text
          selectable
          style={{
            ...typography.body,
            color: colors.textSecondary,
          }}
        >
          {message}
        </Text>
        <NativeActionButton label="Try again" onPress={refresh} />
      </SectionCard>
    </Screen>
  );
}
