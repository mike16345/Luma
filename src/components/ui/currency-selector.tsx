import { useMemo, useState } from "react";
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
import {
  currencies,
  findCurrencyOption,
  type CurrencyOption,
} from "@/lib/currency/currencies";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

export function CurrencySelector({
  error,
  label,
  onChange,
  value,
}: {
  error?: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  const colors = useThemeColors();
  const { direction, textAlign } = useLanguage();
  const insets = useSafeAreaInsets();
  const [isOpen, setIsOpen] = useState(false);
  const selectedCurrency = useMemo(() => findCurrencyOption(value), [value]);

  function renderCurrency({ item }: ListRenderItemInfo<CurrencyOption>) {
    const isSelected = item.code === value;

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
        onPress={() => {
          onChange(item.code);
          setIsOpen(false);
        }}
        style={{
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          borderRadius: 8,
          backgroundColor: isSelected ? colors.actionSoft : colors.surface,
        }}
      >
        <View
          style={{
            flexDirection: getFlexDirection(direction),
            alignItems: "center",
            gap: spacing.sm,
          }}
        >
          <Text style={{ fontSize: 22, lineHeight: 28 }}>{item.flag}</Text>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                ...typography.bodyMedium,
                color: colors.textPrimary,
                textAlign,
              }}
            >
              {item.code} - {item.name}
            </Text>
            <Text
              style={{
                ...typography.caption,
                color: colors.textSecondary,
                textAlign,
              }}
            >
              {item.country}
            </Text>
          </View>
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
        }}
      >
        {label}
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => setIsOpen(true)}
        style={{
          minHeight: 48,
          justifyContent: "center",
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs,
          borderRadius: 8,
          borderCurve: "continuous",
          borderWidth: 1,
          borderColor: error ? colors.slip : colors.border,
          backgroundColor: colors.surface,
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
            {selectedCurrency?.flag ?? "$"}
          </Text>
          <Text
            style={{
              ...typography.body,
              color: selectedCurrency ? colors.textPrimary : colors.textMuted,
              flex: 1,
              textAlign,
            }}
          >
            {selectedCurrency
              ? `${selectedCurrency.code} - ${selectedCurrency.name}`
              : "Select currency"}
          </Text>
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
      {error ? (
        <Text
          selectable
          style={{
            ...typography.caption,
            color: colors.slip,
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
              Currency
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
                Close
              </Text>
            </Pressable>
          </View>
          <FlatList
            data={currencies}
            keyExtractor={(item) => item.code}
            renderItem={renderCurrency}
            ItemSeparatorComponent={() => <View style={{ height: spacing.xs }} />}
            contentContainerStyle={{ paddingBottom: spacing.xxl }}
          />
        </View>
      </Modal>
    </View>
  );
}
