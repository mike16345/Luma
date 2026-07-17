import { useRouter } from "expo-router";
import { Pressable, Text } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
import { PageHeader } from "@/components/ui/page-header";
import { Screen } from "@/components/ui/screen";
import { SectionCard } from "@/components/ui/section-card";
import { ChapterSettingsForm } from "@/features/settings/chapter-settings-form";
import { DevOptionsPrompt } from "@/features/settings/dev-options/dev-options-prompt";
import { DevOptionsSection } from "@/features/settings/dev-options/dev-options-section";
import { useDevOptionsUnlock } from "@/features/settings/dev-options/use-dev-options-unlock";
import { LanguagePreferenceSection } from "@/features/settings/language-preference-section";
import { PrivacyLockSection } from "@/features/settings/privacy-lock-section";
import { ProfilePreferencesSection } from "@/features/settings/profile-preferences-section";
import { RemindersSection } from "@/features/settings/reminders-section";
import {
  SettingsErrorState,
  SettingsLoadingState,
} from "@/features/settings/settings-states";
import { ThemePreferenceSection } from "@/features/settings/theme-preference-section";
import { useChapterSettingsForm } from "@/features/settings/use-chapter-settings-form";
import { isDevBuild } from "@/lib/dev/dev-data-profile";
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
  const devOptionsUnlock = useDevOptionsUnlock();

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
      {isDevBuild() ? (
        <Pressable onPress={devOptionsUnlock.recordTap}>
          <PageHeader
            eyebrow="Settings"
            title="Keep the current chapter accurate."
            subtitle="These edits only affect the active chapter. Past chapters stay intact."
          />
        </Pressable>
      ) : (
        <PageHeader
          eyebrow="Settings"
          title="Keep the current chapter accurate."
          subtitle="These edits only affect the active chapter. Past chapters stay intact."
        />
      )}
      <DevOptionsPrompt
        error={devOptionsUnlock.error}
        isVisible={devOptionsUnlock.isPromptVisible}
        onCancel={devOptionsUnlock.cancelPrompt}
        onSubmit={devOptionsUnlock.submitPassphrase}
      />
      {devOptionsUnlock.isUnlocked ? (
        <DevOptionsSection onHide={devOptionsUnlock.hideOptions} />
      ) : null}
      <ProfilePreferencesSection />
      <PrivacyLockSection />
      <RemindersSection />
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
