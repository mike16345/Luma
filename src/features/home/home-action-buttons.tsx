import { useRouter } from "expo-router";
import { View } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
import { spacing } from "@/theme/spacing";

export function HomeActionButtons({
  hasActiveChapter,
}: {
  hasActiveChapter: boolean;
}) {
  const router = useRouter();

  return (
    <View style={{ gap: spacing.sm }}>
      {hasActiveChapter ? (
        <>
          <NativeActionButton
            label="Log slip-up"
            onPress={() => router.push("/slip-up")}
          />
          <NativeActionButton
            label="View goal"
            variant="outlined"
            onPress={() => router.push("/goal")}
          />
          <NativeActionButton
            label="Edit chapter"
            variant="text"
            onPress={() => router.push("/settings")}
          />
        </>
      ) : (
        <>
          <NativeActionButton
            label="Start a chapter"
            onPress={() => router.push("/onboarding")}
          />
          <NativeActionButton
            label="View history"
            variant="outlined"
            onPress={() => router.push("/history")}
          />
        </>
      )}
    </View>
  );
}
