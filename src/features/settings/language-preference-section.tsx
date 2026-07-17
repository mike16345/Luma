import { Pressable, Text, View } from "react-native";

import { SectionCard } from "@/components/ui/section-card";
import { getFlexDirection, supportedLanguages } from "@/i18n/languages";
import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

export function LanguagePreferenceSection() {
  const {
    direction,
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
        <View style={{ gap: spacing.sm }}>
          {supportedLanguages.map((option) => {
            const isSelected = option.code === language;

            return (
              <Pressable
                key={option.code}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                disabled={isApplyingDirectionChange}
                onPress={() => {
                  void setLanguage(option.code);
                }}
                style={{
                  minHeight: 48,
                  justifyContent: "center",
                  paddingHorizontal: spacing.sm,
                  paddingVertical: spacing.xs,
                  borderRadius: 8,
                  borderCurve: "continuous",
                  borderWidth: 1,
                  borderColor: isSelected ? colors.action : colors.border,
                  backgroundColor: isSelected ? colors.actionSoft : colors.surface,
                  opacity: isApplyingDirectionChange ? 0.64 : 1,
                }}
              >
                <View
                  style={{
                    flexDirection: getFlexDirection(direction),
                    alignItems: "center",
                    gap: spacing.sm,
                  }}
                >
                  <Text style={{ fontSize: 22, lineHeight: 28 }}>
                    {option.flag}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        ...typography.bodyMedium,
                        color: colors.textPrimary,
                        textAlign,
                      }}
                    >
                      {option.nativeLabel}
                    </Text>
                    <Text
                      style={{
                        ...typography.caption,
                        color: colors.textSecondary,
                        textAlign,
                      }}
                    >
                      {option.label}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
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
