import { Text, View } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
import { Screen } from "@/components/ui/screen";
import { SectionCard } from "@/components/ui/section-card";
import { useLanguage } from "@/i18n/language-context";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function SettingsLoadingState() {
  return (
    <Screen>
      <View style={{ gap: spacing.sm }}>
        {[0, 1, 2].map((item) => (
          <View
            key={item}
            style={{
              height: item === 0 ? 96 : 148,
              borderRadius: 24,
              backgroundColor: colors.surfaceMuted,
            }}
          />
        ))}
      </View>
    </Screen>
  );
}

export function SettingsErrorState({
  message,
  refresh,
}: {
  message: string;
  refresh: () => Promise<void>;
}) {
  const { t, textAlign } = useLanguage();

  return (
    <Screen>
      <SectionCard title={t("settings.unavailable")}>
        <Text
          selectable
          style={{
            ...typography.body,
            color: colors.textSecondary,
            textAlign,
          }}
        >
          {message}
        </Text>
        <NativeActionButton label={t("common.tryAgain")} onPress={refresh} />
      </SectionCard>
    </Screen>
  );
}
