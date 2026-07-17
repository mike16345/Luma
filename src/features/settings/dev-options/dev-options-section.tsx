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
import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

export function DevOptionsSection({ onHide }: { onHide: () => void }) {
  const colors = useThemeColors();
  const { t, textAlign } = useLanguage();
  const [activeProfile, setActiveProfile] = useState(getStoredDevDataProfile);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isDevBuild()) {
    return null;
  }

  async function switchProfile(profile: DevDataProfile) {
    setStoredDevDataProfile(profile);
    setActiveProfile(profile);
    setStatusMessage(t("dev.reloadApplying"));
    await reloadAppForDevProfile();
    setStatusMessage(t("dev.reloadManual"));
  }

  return (
    <SectionCard eyebrow={t("dev.sectionEyebrow")} title={t("dev.sectionTitle")}>
      <Text
        selectable
        style={{
          ...typography.body,
          color: colors.textSecondary,
          textAlign,
        }}
      >
        {t("dev.description")}
      </Text>

      <View style={{ gap: spacing.sm }}>
        {DEV_DATA_PROFILES.map((profile) => {
          const isSelected = profile === activeProfile;
          const canSelect = !isSelected || profile === "clean";
          const actionLabel =
            profile === "clean" && isSelected
              ? t("dev.resetCleanProfile")
              : isSelected
                ? t("dev.currentProfile")
                : t("dev.useProfile", { profile });
          const profileDescription =
            profile === "default"
              ? t("dev.defaultDescription")
              : profile === "clean"
                ? t("dev.cleanDescription")
                : t("dev.historyDescription");

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
                  textAlign,
                }}
              >
                {profile}
              </Text>
              <Text
                selectable
                style={{
                  ...typography.caption,
                  color: colors.textSecondary,
                  textAlign,
                }}
              >
                {profileDescription}
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
            textAlign,
          }}
        >
          {statusMessage}
        </Text>
      ) : null}

      <NativeActionButton
        label={t("dev.hide")}
        onPress={onHide}
        variant="text"
      />
    </SectionCard>
  );
}
