import { useRouter } from "expo-router";
import { RefreshControl, Text, View } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
import { Screen } from "@/components/ui/screen";
import { SectionCard } from "@/components/ui/section-card";
import { ChapterSettingsForm } from "@/features/settings/chapter-settings-form";
import {
  SettingsErrorState,
  SettingsLoadingState,
} from "@/features/settings/settings-states";
import { ThemePreferenceSection } from "@/features/settings/theme-preference-section";
import { useChapterSettingsForm } from "@/features/settings/use-chapter-settings-form";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

function NoActiveChapterState() {
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
        Start a chapter before editing quit details, estimates, or a savings
        goal.
      </Text>
      <NativeActionButton
        label="Start chapter"
        onPress={() => router.push("/onboarding")}
      />
    </SectionCard>
  );
}

export function SettingsScreen() {
  const state = useChapterSettingsForm();

  if (state.status === "loading") {
    return <SettingsLoadingState />;
  }

  if (state.status === "error") {
    return (
      <SettingsErrorState
        message={state.saveError.message}
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
          Settings
        </Text>
        <Text
          selectable
          style={{
            ...typography.title,
            color: colors.textPrimary,
          }}
        >
          Keep the current chapter accurate.
        </Text>
        <Text
          selectable
          style={{
            ...typography.body,
            color: colors.textSecondary,
          }}
        >
          These edits only affect the active chapter. Past chapters stay intact.
        </Text>
      </View>

      <ThemePreferenceSection />

      {state.form ? (
        <ChapterSettingsForm
          errors={state.errors}
          form={state.form}
          isSaving={state.isSaving}
          onSave={async () => {
            await state.save();
          }}
          saveError={state.saveError}
          saveMessage={state.saveMessage}
          setSmokingType={state.setSmokingType}
          updateField={state.updateField}
        />
      ) : (
        <NoActiveChapterState />
      )}
    </Screen>
  );
}
