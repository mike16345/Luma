import { Text, View } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
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
  return (
    <View style={{ gap: spacing.xs }}>
      <Text
        selectable
        style={{
          ...typography.label,
          color: colors.textPrimary,
        }}
      >
        Was alcohol involved?
      </Text>
      <View style={{ gap: spacing.sm }}>
        <NativeActionButton
          label="No"
          variant={value ? "outlined" : "filled"}
          onPress={() => onChange(false)}
        />
        <NativeActionButton
          label="Yes"
          variant={value ? "filled" : "outlined"}
          onPress={() => onChange(true)}
        />
      </View>
    </View>
  );
}
