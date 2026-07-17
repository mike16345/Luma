import { Text, View } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
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
  return (
    <View style={{ gap: spacing.xs }}>
      <Text
        selectable
        style={{
          ...typography.label,
          color: colors.textPrimary,
        }}
      >
        Smoking type
      </Text>
      <View style={{ gap: spacing.sm }}>
        <NativeActionButton
          label="Packs"
          variant={value === "pack" ? "filled" : "outlined"}
          onPress={() => onChange("pack")}
        />
        <NativeActionButton
          label="Roll-your-own"
          variant={value === "roll-your-own" ? "filled" : "outlined"}
          onPress={() => onChange("roll-your-own")}
        />
      </View>
    </View>
  );
}
