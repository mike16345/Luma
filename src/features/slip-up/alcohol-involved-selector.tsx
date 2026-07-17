import { Text, View } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
import { useLanguage } from "@/i18n/language-context";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function AlcoholInvolvedSelector({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  const { t, textAlign } = useLanguage();

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
        {t("slipUp.alcoholQuestion")}
      </Text>
      <View style={{ gap: spacing.sm }}>
        <NativeActionButton
          label={t("common.no")}
          variant={value ? "outlined" : "filled"}
          onPress={() => onChange(false)}
        />
        <NativeActionButton
          label={t("common.yes")}
          variant={value ? "filled" : "outlined"}
          onPress={() => onChange(true)}
        />
      </View>
    </View>
  );
}
