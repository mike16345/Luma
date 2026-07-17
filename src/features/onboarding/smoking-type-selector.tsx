import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Text, View } from "react-native";

import { NativePickerField } from "@/components/ui/native-picker-field";
import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";
import type { SmokingType } from "@/types/domain";

const smokingTypeIcons = {
  pack: {
    fallback: "P",
    name: {
      ios: "shippingbox.fill",
      android: "inventory_2",
      web: "inventory_2",
    },
  },
  "roll-your-own": {
    fallback: "R",
    name: {
      ios: "pencil",
      android: "edit",
      web: "edit",
    },
  },
} satisfies Record<
  SmokingType,
  { fallback: string; name: SymbolViewProps["name"] }
>;

export function SmokingTypeSelector({
  value,
  onChange,
}: {
  value: SmokingType;
  onChange: (value: SmokingType) => void;
}) {
  const { t, textAlign } = useLanguage();
  const colors = useThemeColors();
  const options = [
    { label: t("common.packs"), value: "pack" as const },
    { label: t("common.rollYourOwn"), value: "roll-your-own" as const },
  ];
  const selectedIcon = smokingTypeIcons[value];

  return (
    <View style={{ gap: spacing.xs }}>
      <NativePickerField
        label={t("onboarding.smokingType")}
        value={value}
        onChange={onChange}
        options={options}
        selectedAccessory={
          <SymbolView
            name={selectedIcon.name}
            size={22}
            tintColor={colors.action}
            fallback={
              <Text
                style={{
                  ...typography.caption,
                  width: 24,
                  color: colors.action,
                  textAlign: "center",
                }}
              >
                {selectedIcon.fallback}
              </Text>
            }
          />
        }
      />
      <Text
        selectable
        style={{
          ...typography.caption,
          color: colors.textMuted,
          textAlign,
        }}
      >
        {value === "pack" ? t("common.packs") : t("common.rollYourOwn")}
      </Text>
    </View>
  );
}
