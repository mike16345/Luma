import { Text, View } from "react-native";

import { SectionCard } from "@/components/ui/section-card";
import { LanguageDrawerSelector } from "@/features/settings/language-drawer-selector";
import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

export function LanguagePreferenceSection() {
  const {
    isApplyingDirectionChange,
    language,
    setLanguage,
    t,
    textAlign,
  } = useLanguage();
  const colors = useThemeColors();

  return (
    <SectionCard
      eyebrow={t("settings.languageEyebrow")}
      title={t("settings.languageTitle")}
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
          {t("settings.languageDescription")}
        </Text>
        <LanguageDrawerSelector
          disabled={isApplyingDirectionChange}
          value={language}
          onChange={(nextLanguage) => {
            void setLanguage(nextLanguage);
          }}
        />
        <Text
          selectable
          style={{
            ...typography.caption,
            color: colors.textMuted,
            textAlign,
          }}
        >
          {isApplyingDirectionChange
            ? t("settings.applyingLanguage")
            : t("settings.restartNote")}
        </Text>
      </View>
    </SectionCard>
  );
}
