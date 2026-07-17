import { Text, View } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
import { Screen } from "@/components/ui/screen";
import { SectionCard } from "@/components/ui/section-card";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function HomeLoadingState() {
  return (
    <Screen>
      <View style={{ gap: spacing.sm }}>
        <View
          style={{
            width: 88,
            height: 12,
            borderRadius: 999,
            backgroundColor: colors.surfaceMuted,
          }}
        />
        <View
          style={{
            width: "74%",
            height: 42,
            borderRadius: 8,
            backgroundColor: colors.surfaceMuted,
          }}
        />
      </View>
      <View style={{ flexDirection: "row", gap: spacing.sm }}>
        <View
          style={{
            flex: 1,
            height: 116,
            borderRadius: 8,
            backgroundColor: colors.surfaceMuted,
          }}
        />
        <View
          style={{
            flex: 1,
            height: 116,
            borderRadius: 8,
            backgroundColor: colors.surfaceMuted,
          }}
        />
      </View>
    </Screen>
  );
}

export function HomeErrorState({
  message,
  refresh,
}: {
  message: string;
  refresh: () => Promise<void>;
}) {
  return (
    <Screen>
      <SectionCard title="Home is unavailable">
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
