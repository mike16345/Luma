import { SymbolView } from "expo-symbols";
import { type ReactNode, useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
  type ListRenderItemInfo,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getFlexDirection } from "@/i18n/languages";
import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

export type NativePickerOption<T extends string> = {
  label: string;
  value: T;
};

export function NativePickerField<T extends string>({
  disabled = false,
  error,
  label,
  onChange,
  options,
  selectedAccessory,
  value,
}: {
  disabled?: boolean;
  error?: string;
  label: string;
  onChange: (value: T) => void;
  options: Array<NativePickerOption<T>>;
  selectedAccessory?: ReactNode;
  value: T;
}) {
  const colors = useThemeColors();
  const { direction, t, textAlign } = useLanguage();
  const insets = useSafeAreaInsets();
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );

  function selectOption(nextValue: T) {
    onChange(nextValue);
    setIsOpen(false);
  }

  function renderOption({ item }: ListRenderItemInfo<NativePickerOption<T>>) {
    const isSelected = item.value === value;

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
        onPress={() => selectOption(item.value)}
        style={({ pressed }) => ({
          minHeight: 54,
          justifyContent: "center",
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
          <Text
            style={{
              ...typography.bodyMedium,
              color: colors.textPrimary,
              flex: 1,
              textAlign,
            }}
          >
            {item.label}
          </Text>
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
              name={{
                ios: "checkmark.circle.fill",
                android: "check_circle",
                web: "check_circle",
              }}
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
        {label}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={() => setIsOpen(true)}
        style={({ pressed }) => ({
          minHeight: 56,
          justifyContent: "center",
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          borderRadius: 20,
          borderCurve: "continuous",
          borderWidth: 1,
          borderColor: error ? colors.slip : colors.border,
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
          {selectedAccessory ? selectedAccessory : null}
          <Text
            style={{
              ...typography.bodyMedium,
              color: colors.textPrimary,
              flex: 1,
              textAlign,
            }}
          >
            {selectedOption?.label ?? label}
          </Text>
          <SymbolView
            name={{
              ios: "chevron.up.chevron.down",
              android: "unfold_more",
              web: "unfold_more",
            }}
            size={18}
            tintColor={colors.textMuted}
            fallback={
              <Text
                style={{
                  ...typography.caption,
                  color: colors.textMuted,
                }}
              >
                v
              </Text>
            }
          />
        </View>
      </Pressable>
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
              {label}
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
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={renderOption}
            ItemSeparatorComponent={() => <View style={{ height: spacing.xs }} />}
            contentContainerStyle={{ paddingBottom: spacing.xxl }}
          />
        </View>
      </Modal>
    </View>
  );
}
