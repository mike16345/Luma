import { useRouter } from "expo-router";
import { Text, View } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
import { SectionCard } from "@/components/ui/section-card";
import { useLanguage } from "@/i18n/language-context";
import { useQuitReason } from "@/features/reasons/use-quit-reason";
import { spacing } from "@/theme/spacing";
import { useThemeColors } from "@/theme/theme-context";
import { typography } from "@/theme/typography";

export function HomeQuitReasonCard() {
  const router = useRouter();
  const { reason } = useQuitReason();
  const { t, textAlign } = useLanguage();
  const colors = useThemeColors();

  if (!reason) {
    return null;
  }

  return (
    <SectionCard eyebrow={t("reasons.homeEyebrow")} title={t("reasons.homeTitle")}>
      <View style={{ gap: spacing.md }}>
        <Text
          selectable
          style={{
            ...typography.body,
            color: colors.textPrimary,
            textAlign,
          }}
        >
          {reason}
        </Text>
        <NativeActionButton
          label={t("reasons.editReason")}
          onPress={() => router.push("/settings")}
          variant="text"
        />
      </View>
    </SectionCard>
  );
}
