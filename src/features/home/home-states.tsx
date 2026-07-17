import { Text, View } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
import { Screen } from "@/components/ui/screen";
import { SectionCard } from "@/components/ui/section-card";
import { useLanguage } from "@/i18n/language-context";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function HomeLoadingState() {
  return (
    <Screen>
      <View style={{ gap: spacing.sm }}>
        <View
          style={{
            width: 88,
            height: 12,
            borderRadius: 999,
            backgroundColor: colors.surfaceMuted,
          }}
        />
        <View
          style={{
            width: "74%",
            height: 42,
            borderRadius: 22,
            backgroundColor: colors.surfaceMuted,
          }}
        />
      </View>
      <View style={{ flexDirection: "row", gap: spacing.sm }}>
        <View
          style={{
            flex: 1,
            height: 116,
            borderRadius: 24,
            backgroundColor: colors.surfaceMuted,
          }}
        />
        <View
          style={{
            flex: 1,
            height: 116,
            borderRadius: 24,
            backgroundColor: colors.surfaceMuted,
          }}
        />
      </View>
    </Screen>
  );
}

export function HomeErrorState({
  message,
  refresh,
}: {
  message: string;
  refresh: () => Promise<void>;
}) {
  const { t, textAlign } = useLanguage();

  return (
    <Screen>
      <SectionCard title={t("home.unavailable")}>
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
