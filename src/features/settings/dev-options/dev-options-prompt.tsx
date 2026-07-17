import { useState } from "react";
import { Modal, Text, TextInput, View } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

export function DevOptionsPrompt({
  error,
  isVisible,
  onCancel,
  onSubmit,
}: {
  error: string | null;
  isVisible: boolean;
  onCancel: () => void;
  onSubmit: (passphrase: string) => void;
}) {
  const colors = useThemeColors();
  const { textAlign } = useLanguage();
  const [passphrase, setPassphrase] = useState("");

  return (
    <Modal
      animationType="fade"
      onRequestClose={onCancel}
      transparent
      visible={isVisible}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          padding: spacing.screen,
          backgroundColor: "rgba(0, 0, 0, 0.35)",
        }}
      >
        <View
          style={{
            gap: spacing.md,
            padding: spacing.lg,
            borderRadius: 8,
            borderCurve: "continuous",
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.surface,
          }}
        >
          <View style={{ gap: spacing.xs }}>
            <Text
              selectable
              style={{
                ...typography.section,
                color: colors.textPrimary,
                textAlign,
              }}
            >
              Development options
            </Text>
            <Text
              selectable
              style={{
                ...typography.body,
                color: colors.textSecondary,
                textAlign,
              }}
            >
              Enter the local development passphrase.
            </Text>
          </View>

          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setPassphrase}
            placeholder="Passphrase"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            style={{
              ...typography.body,
              minHeight: 48,
              paddingHorizontal: spacing.sm,
              paddingVertical: spacing.xs,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: error ? colors.slip : colors.border,
              color: colors.textPrimary,
              backgroundColor: colors.surfaceMuted,
              textAlign,
            }}
            value={passphrase}
          />

          {error ? (
            <Text
              selectable
              style={{
                ...typography.caption,
                color: colors.slip,
                textAlign,
              }}
            >
              {error}
            </Text>
          ) : null}

          <View style={{ gap: spacing.sm }}>
            <NativeActionButton
              label="Unlock"
              onPress={() => onSubmit(passphrase)}
            />
            <NativeActionButton
              label="Cancel"
              onPress={onCancel}
              variant="text"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
