import { useRouter } from "expo-router";
import { Text } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
import { PageHeader } from "@/components/ui/page-header";
import { Screen } from "@/components/ui/screen";
import { SectionCard } from "@/components/ui/section-card";
import { ChapterSettingsForm } from "@/features/settings/chapter-settings-form";
import { LanguagePreferenceSection } from "@/features/settings/language-preference-section";
import {
  SettingsErrorState,
  SettingsLoadingState,
} from "@/features/settings/settings-states";
import { ThemePreferenceSection } from "@/features/settings/theme-preference-section";
import { useChapterSettingsForm } from "@/features/settings/use-chapter-settings-form";
import { colors } from "@/theme/colors";
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
    <Screen>
      <PageHeader
        eyebrow="Settings"
        title="Keep the current chapter accurate."
        subtitle="These edits only affect the active chapter. Past chapters stay intact."
      />
      <ThemePreferenceSection />
      <LanguagePreferenceSection />

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
