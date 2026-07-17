import { Text, View } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
import { SectionCard } from "@/components/ui/section-card";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { useTheme, type ThemePreference } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

const THEME_OPTIONS: Array<{ label: string; value: ThemePreference }> = [
  { label: "Use system setting", value: "system" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

export function ThemePreferenceSection() {
  const { preference, setPreference } = useTheme();

  return (
    <SectionCard eyebrow="Appearance" title="Theme">
      <View style={{ gap: spacing.md }}>
        <Text
          selectable
          style={{
            ...typography.body,
            color: colors.textSecondary,
          }}
        >
          Choose how Luma appears on this device.
        </Text>
        <View style={{ gap: spacing.sm }}>
          {THEME_OPTIONS.map((option) => (
            <NativeActionButton
              key={option.value}
              label={option.label}
              variant={preference === option.value ? "filled" : "outlined"}
              onPress={() => setPreference(option.value)}
            />
          ))}
        </View>
      </View>
    </SectionCard>
  );
}
