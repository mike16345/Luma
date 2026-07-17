import { useRouter } from "expo-router";
import { Text, View } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
import { Screen } from "@/components/ui/screen";
import { SectionCard } from "@/components/ui/section-card";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function GoalLoadingState() {
  return (
    <Screen>
      <View style={{ gap: spacing.sm }}>
        {[0, 1, 2].map((item) => (
          <View
            key={item}
            style={{
              height: item === 0 ? 144 : 104,
              borderRadius: 8,
              backgroundColor: colors.surfaceMuted,
            }}
          />
        ))}
      </View>
    </Screen>
  );
}

export function GoalErrorState({
  message,
  refresh,
}: {
  message: string;
  refresh: () => Promise<void>;
}) {
  return (
    <Screen>
      <SectionCard title="Goal is unavailable">
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

export function GoalNoActiveChapterState() {
  const router = useRouter();

  return (
    <SectionCard title="No active chapter">
      <Text
        selectable
        style={{
          ...typography.body,
          color: colors.textSecondary,
        }}
      >
        Start a chapter before creating a savings goal.
      </Text>
      <NativeActionButton
        label="Start chapter"
        onPress={() => router.push("/onboarding")}
      />
    </SectionCard>
  );
}
