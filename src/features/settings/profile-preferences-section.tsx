import * as DocumentPicker from "expo-document-picker";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useState } from "react";
import { Text, View } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
import { NativeTextField } from "@/components/ui/native-text-field";
import { SectionCard } from "@/components/ui/section-card";
import {
  getInitials,
  loadUserProfile,
  saveAvatarUri,
  saveDisplayName,
} from "@/lib/profile/profile-preferences";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

export function ProfilePreferencesSection() {
  const colors = useThemeColors();
  const initialProfile = loadUserProfile();
  const [displayName, setDisplayName] = useState(initialProfile.displayName);
  const [avatarUri, setAvatarUri] = useState(initialProfile.avatarUri);
  const [message, setMessage] = useState<string | null>(null);

  async function chooseAvatar() {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: false,
      type: "image/*",
    });

    if (result.canceled) {
      return;
    }

    const uri = result.assets[0]?.uri;

    if (!uri) {
      setMessage("Unable to use that image.");
      return;
    }

    setAvatarUri(uri);
    saveAvatarUri(uri);
    setMessage("Profile image saved.");
    await Haptics.selectionAsync();
  }

  async function removeAvatar() {
    setAvatarUri(null);
    saveAvatarUri(null);
    setMessage("Profile image removed.");
    await Haptics.selectionAsync();
  }

  async function saveName() {
    saveDisplayName(displayName);
    setDisplayName(displayName.trim());
    setMessage("Profile saved.");
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  return (
    <SectionCard eyebrow="Personal" title="Profile">
      <View style={{ gap: spacing.md }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
          }}
        >
          <View
            style={{
              width: 72,
              height: 72,
              overflow: "hidden",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 24,
              borderCurve: "continuous",
              backgroundColor: colors.heroSurface,
            }}
          >
            {avatarUri ? (
              <Image
                source={avatarUri}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
                transition={180}
              />
            ) : (
              <Text
                style={{
                  ...typography.title,
                  color: colors.heroText,
                }}
              >
                {getInitials(displayName)}
              </Text>
            )}
          </View>
          <View style={{ flex: 1, gap: spacing.xs }}>
            <Text
              style={{
                ...typography.bodyMedium,
                color: colors.textPrimary,
              }}
            >
              {displayName.trim() || "Local profile"}
            </Text>
            <Text
              style={{
                ...typography.caption,
                color: colors.textSecondary,
              }}
            >
              Stored privately on this device.
            </Text>
          </View>
        </View>

        <NativeTextField
          label="Display name"
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Your name"
          autoCapitalize="words"
        />

        <View style={{ gap: spacing.sm }}>
          <NativeActionButton label="Choose profile image" onPress={chooseAvatar} />
          {avatarUri ? (
            <NativeActionButton
              label="Remove profile image"
              onPress={removeAvatar}
              variant="outlined"
            />
          ) : null}
          <NativeActionButton label="Save profile" onPress={saveName} />
        </View>

        {message ? (
          <Text
            style={{
              ...typography.caption,
              color: colors.textMuted,
            }}
          >
            {message}
          </Text>
        ) : null}
      </View>
    </SectionCard>
  );
}
