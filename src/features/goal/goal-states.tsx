import { useRouter } from "expo-router";
import { Text, View } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
import { Screen } from "@/components/ui/screen";
import { SectionCard } from "@/components/ui/section-card";
import { useLanguage } from "@/i18n/language-context";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function GoalLoadingState() {
  return (
    <Screen>
      <View style={{ gap: spacing.sm }}>
        {[0, 1, 2].map((item) => (
          <View
            key={item}
            style={{
              height: item === 0 ? 144 : 104,
              borderRadius: 24,
              backgroundColor: colors.surfaceMuted,
            }}
          />
        ))}
      </View>
    </Screen>
  );
}

export function GoalErrorState({
  message,
  refresh,
}: {
  message: string;
  refresh: () => Promise<void>;
}) {
  const { t, textAlign } = useLanguage();

  return (
    <Screen>
      <SectionCard title={t("goal.unavailable")}>
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

export function GoalNoActiveChapterState() {
  const router = useRouter();
  const { t, textAlign } = useLanguage();

  return (
    <SectionCard title={t("common.noActiveChapter")}>
      <Text
        selectable
        style={{
          ...typography.body,
          color: colors.textSecondary,
          textAlign,
        }}
      >
        {t("goal.noActiveHelp")}
      </Text>
      <NativeActionButton
        label={t("common.startChapter")}
        onPress={() => router.push("/onboarding")}
      />
    </SectionCard>
  );
}
