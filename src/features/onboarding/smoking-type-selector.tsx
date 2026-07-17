import { Text, View } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
import { useLanguage } from "@/i18n/language-context";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import type { SmokingType } from "@/types/domain";

export function SmokingTypeSelector({
  value,
  onChange,
}: {
  value: SmokingType;
  onChange: (value: SmokingType) => void;
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
        {t("onboarding.smokingType")}
      </Text>
      <View style={{ gap: spacing.sm }}>
        <NativeActionButton
          label={t("common.packs")}
          variant={value === "pack" ? "filled" : "outlined"}
          onPress={() => onChange("pack")}
        />
        <NativeActionButton
          label={t("common.rollYourOwn")}
          variant={value === "roll-your-own" ? "filled" : "outlined"}
          onPress={() => onChange("roll-your-own")}
        />
      </View>
    </View>
  );
}
