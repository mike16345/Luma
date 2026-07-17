import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Text, View } from "react-native";

import { NativePickerField } from "@/components/ui/native-picker-field";
import { SectionCard } from "@/components/ui/section-card";
import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";
import {
  useTheme,
  useThemeColors,
  type ThemePreference,
} from "@/theme/theme-context";
import { typography } from "@/theme/typography";

const THEME_OPTIONS: Array<{
  fallback: string;
  icon: SymbolViewProps["name"];
  label: "settings.themeSystem" | "settings.themeLight" | "settings.themeDark";
  value: ThemePreference;
}> = [
  {
    fallback: "A",
    icon: { ios: "circle.lefthalf.filled", android: "contrast", web: "contrast" },
    label: "settings.themeSystem",
    value: "system",
  },
  {
    fallback: "L",
    icon: { ios: "sun.max.fill", android: "wb_sunny", web: "wb_sunny" },
    label: "settings.themeLight",
    value: "light",
  },
  {
    fallback: "D",
    icon: { ios: "moon.fill", android: "dark_mode", web: "dark_mode" },
    label: "settings.themeDark",
    value: "dark",
  },
];

export function ThemePreferenceSection() {
  const { preference, setPreference } = useTheme();
  const { t, textAlign } = useLanguage();
  const colors = useThemeColors();
  const selectedTheme =
    THEME_OPTIONS.find((option) => option.value === preference) ??
    THEME_OPTIONS[0];
  const options = THEME_OPTIONS.map((option) => ({
    label: t(option.label),
    value: option.value,
  }));

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
        <NativePickerField<ThemePreference>
          label={t("settings.themeTitle")}
          value={preference}
          onChange={setPreference}
          options={options}
          selectedAccessory={
            <View
              style={{
                minWidth: 48,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: spacing.xs,
                paddingVertical: spacing.xxs,
                borderRadius: 999,
                backgroundColor: colors.actionSoft,
              }}
            >
              <SymbolView
                name={selectedTheme.icon}
                size={20}
                tintColor={colors.action}
                fallback={
                  <Text
                    style={{
                      ...typography.caption,
                      color: colors.action,
                      textAlign: "center",
                    }}
                  >
                    {selectedTheme.fallback}
                  </Text>
                }
              />
            </View>
          }
        />
      </View>
    </SectionCard>
  );
}
