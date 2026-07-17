import { Text, View } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
import { SectionCard } from "@/components/ui/section-card";
import { useLanguage } from "@/i18n/language-context";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { useTheme, type ThemePreference } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

const THEME_OPTIONS: Array<{
  label: "settings.themeSystem" | "settings.themeLight" | "settings.themeDark";
  value: ThemePreference;
}> = [
  { label: "settings.themeSystem", value: "system" },
  { label: "settings.themeLight", value: "light" },
  { label: "settings.themeDark", value: "dark" },
];

export function ThemePreferenceSection() {
  const { preference, setPreference } = useTheme();
  const { t, textAlign } = useLanguage();

  return (
    <SectionCard
      eyebrow={t("settings.appearanceEyebrow")}
      title={t("settings.themeTitle")}
    >
      <View style={{ gap: spacing.md }}>
        <Text
          selectable
          style={{
            ...typography.body,
            color: colors.textSecondary,
            textAlign,
          }}
        >
          {t("settings.themeDescription")}
        </Text>
        <View style={{ gap: spacing.sm }}>
          {THEME_OPTIONS.map((option) => (
            <NativeActionButton
              key={option.value}
              label={t(option.label)}
              variant={preference === option.value ? "filled" : "outlined"}
              onPress={() => setPreference(option.value)}
            />
          ))}
        </View>
      </View>
    </SectionCard>
  );
}
