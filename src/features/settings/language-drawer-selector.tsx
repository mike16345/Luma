import { useMemo, useState } from "react";
import { SymbolView } from "expo-symbols";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
  type ListRenderItemInfo,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  findLanguageOption,
  getFlexDirection,
  supportedLanguages,
  type LanguageOption,
  type SupportedLanguage,
} from "@/i18n/languages";
import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

export function LanguageDrawerSelector({
  disabled = false,
  onChange,
  value,
}: {
  disabled?: boolean;
  onChange: (value: SupportedLanguage) => void;
  value: SupportedLanguage;
}) {
  const colors = useThemeColors();
  const { direction, t, textAlign } = useLanguage();
  const insets = useSafeAreaInsets();
  const [isOpen, setIsOpen] = useState(false);
  const selectedLanguage = useMemo(() => findLanguageOption(value), [value]);

  function selectLanguage(language: SupportedLanguage) {
    onChange(language);
    setIsOpen(false);
  }

  function renderLanguage({ item }: ListRenderItemInfo<LanguageOption>) {
    const isSelected = item.code === value;

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
        onPress={() => selectLanguage(item.code)}
        style={({ pressed }) => ({
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          borderRadius: 18,
          borderCurve: "continuous",
          borderWidth: 1,
          borderColor: isSelected ? colors.action : colors.border,
          backgroundColor: isSelected
            ? colors.actionSoft
            : pressed
              ? colors.surface
              : colors.surfaceElevated,
        })}
      >
        <View
          style={{
            flexDirection: getFlexDirection(direction),
            alignItems: "center",
            gap: spacing.sm,
          }}
        >
          <Text style={{ fontSize: 24, lineHeight: 30 }}>{item.flag}</Text>
          <View style={{ flex: 1, gap: spacing.xxs }}>
            <Text
              style={{
                ...typography.bodyMedium,
                color: colors.textPrimary,
                textAlign,
              }}
            >
              {item.nativeLabel}
            </Text>
            <Text
              style={{
                ...typography.caption,
                color: colors.textSecondary,
                textAlign,
              }}
            >
              {item.label}
            </Text>
          </View>
          {isSelected ? (
            <SymbolView
              accessibilityElementsHidden
              fallback={
                <Text
                  style={{
                    ...typography.caption,
                    color: colors.action,
                  }}
                >
                  OK
                </Text>
              }
              importantForAccessibility="no"
              name={{ ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }}
              size={22}
              tintColor={colors.action}
            />
          ) : null}
        </View>
      </Pressable>
    );
  }

  return (
    <View style={{ gap: spacing.xs }}>
      <Text
        selectable
        style={{
          ...typography.label,
          color: colors.textPrimary,
          textAlign,
        }}
      >
        {t("settings.languageTitle")}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={() => setIsOpen(true)}
        style={({ pressed }) => ({
          minHeight: 58,
          justifyContent: "center",
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          borderRadius: 20,
          borderCurve: "continuous",
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surfaceElevated,
          boxShadow: `0 10px 26px ${colors.shadow}`,
          opacity: disabled ? 0.6 : pressed ? 0.86 : 1,
        })}
      >
        <View
          style={{
            flexDirection: getFlexDirection(direction),
            alignItems: "center",
            gap: spacing.sm,
          }}
        >
          <Text style={{ fontSize: 24, lineHeight: 30 }}>
            {selectedLanguage?.flag ?? ""}
          </Text>
          <View style={{ flex: 1, gap: spacing.xxs }}>
            <Text
              style={{
                ...typography.bodyMedium,
                color: colors.textPrimary,
                textAlign,
              }}
            >
              {selectedLanguage?.nativeLabel ?? t("settings.languageTitle")}
            </Text>
            {selectedLanguage ? (
              <Text
                style={{
                  ...typography.caption,
                  color: colors.textSecondary,
                  textAlign,
                }}
              >
                {selectedLanguage.label}
              </Text>
            ) : null}
          </View>
          <Text
            accessibilityElementsHidden
            importantForAccessibility="no"
            style={{
              ...typography.bodyMedium,
              color: colors.textMuted,
            }}
          >
            v
          </Text>
        </View>
      </Pressable>

      <Modal
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
        presentationStyle="pageSheet"
        visible={isOpen}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: colors.background,
            paddingHorizontal: spacing.screen,
            paddingTop: spacing.screen + insets.top,
            paddingBottom: spacing.screen + insets.bottom,
            gap: spacing.md,
          }}
        >
          <View
            style={{
              flexDirection: getFlexDirection(direction),
              alignItems: "center",
              justifyContent: "space-between",
              gap: spacing.md,
            }}
          >
            <Text
              style={{
                ...typography.title,
                color: colors.textPrimary,
                flex: 1,
                textAlign,
              }}
            >
              {t("settings.languageTitle")}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setIsOpen(false)}
              style={{
                paddingHorizontal: spacing.sm,
                paddingVertical: spacing.xs,
              }}
            >
              <Text
                style={{
                  ...typography.bodyMedium,
                  color: colors.action,
                }}
              >
                {t("common.close")}
              </Text>
            </Pressable>
          </View>
          <FlatList
            data={supportedLanguages}
            keyExtractor={(item) => item.code}
            renderItem={renderLanguage}
            ItemSeparatorComponent={() => <View style={{ height: spacing.xs }} />}
            contentContainerStyle={{ paddingBottom: spacing.xxl }}
          />
        </View>
      </Modal>
    </View>
  );
}
