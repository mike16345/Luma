import { useState } from "react";
import { Text, View } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
import { SectionCard } from "@/components/ui/section-card";
import {
  DEV_DATA_PROFILES,
  getStoredDevDataProfile,
  isDevBuild,
  setStoredDevDataProfile,
  type DevDataProfile,
} from "@/lib/dev/dev-data-profile";
import { reloadAppForDevProfile } from "@/lib/dev/reload-app";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

const profileDescriptions: Record<DevDataProfile, string> = {
  default: "Uses the normal local development database.",
  clean: "Creates a fresh empty database each time you choose it.",
  history: "Uses seeded chapter and slip-up history for screen checks.",
};

export function DevOptionsSection({ onHide }: { onHide: () => void }) {
  const colors = useThemeColors();
  const [activeProfile, setActiveProfile] = useState(getStoredDevDataProfile);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isDevBuild()) {
    return null;
  }

  async function switchProfile(profile: DevDataProfile) {
    setStoredDevDataProfile(profile);
    setActiveProfile(profile);
    setStatusMessage("Reloading to apply the selected local data profile.");
    await reloadAppForDevProfile();
    setStatusMessage("Reload the app to apply the selected local data profile.");
  }

  return (
    <SectionCard eyebrow="Development only" title="Local data profile">
      <Text
        selectable
        style={{
          ...typography.body,
          color: colors.textSecondary,
        }}
      >
        Switch the SQLite database used for local debugging. The selection is a
        small local preference and applies on reload or the next database open.
      </Text>

      <View style={{ gap: spacing.sm }}>
        {DEV_DATA_PROFILES.map((profile) => {
          const isSelected = profile === activeProfile;
          const canSelect = !isSelected || profile === "clean";
          const actionLabel =
            profile === "clean" && isSelected
              ? "Reset clean profile"
              : isSelected
                ? "Current profile"
                : `Use ${profile}`;

          return (
            <View
              key={profile}
              style={{
                gap: spacing.xs,
                padding: spacing.sm,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: isSelected ? colors.action : colors.border,
                backgroundColor: isSelected
                  ? colors.actionSoft
                  : colors.surfaceMuted,
              }}
            >
              <Text
                selectable
                style={{
                  ...typography.bodyMedium,
                  color: colors.textPrimary,
                }}
              >
                {profile}
              </Text>
              <Text
                selectable
                style={{
                  ...typography.caption,
                  color: colors.textSecondary,
                }}
              >
                {profileDescriptions[profile]}
              </Text>
              <NativeActionButton
                disabled={!canSelect}
                label={actionLabel}
                onPress={() => {
                  void switchProfile(profile);
                }}
                variant={isSelected ? "outlined" : "filled"}
              />
            </View>
          );
        })}
      </View>

      {statusMessage ? (
        <Text
          selectable
          style={{
            ...typography.caption,
            color: colors.textMuted,
          }}
        >
          {statusMessage}
        </Text>
      ) : null}

      <NativeActionButton
        label="Hide development options"
        onPress={onHide}
        variant="text"
      />
    </SectionCard>
  );
}
