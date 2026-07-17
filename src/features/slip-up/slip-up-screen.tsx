import { RefreshControl, Text, View } from "react-native";

import { Screen } from "@/components/ui/screen";
import { SlipUpForm } from "@/features/slip-up/slip-up-form";
import {
  SlipUpErrorState,
  SlipUpLoadingState,
  SlipUpNoActiveChapterState,
} from "@/features/slip-up/slip-up-states";
import { useSlipUpForm } from "@/features/slip-up/use-slip-up-form";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function SlipUpScreen() {
  const state = useSlipUpForm();

  if (state.status === "loading") {
    return <SlipUpLoadingState />;
  }

  if (state.status === "error") {
    return (
      <SlipUpErrorState
        message={state.submitError.message}
        refresh={state.refresh}
      />
    );
  }

  return (
    <Screen
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => {
            void state.refresh();
          }}
          tintColor={colors.action}
        />
      }
    >
      <View style={{ gap: spacing.xs }}>
        <Text
          selectable
          style={{
            ...typography.caption,
            color: colors.textMuted,
            textTransform: "uppercase",
          }}
        >
          Slip-up
        </Text>
        <Text
          selectable
          style={{
            ...typography.title,
            color: colors.textPrimary,
          }}
        >
          Log what happened.
        </Text>
        <Text
          selectable
          style={{
            ...typography.body,
            color: colors.textSecondary,
          }}
        >
          A slip-up closes the current chapter. The restart step comes next.
        </Text>
      </View>

      {state.activeChapter ? (
        <SlipUpForm state={state} />
      ) : (
        <SlipUpNoActiveChapterState />
      )}
    </Screen>
  );
}
