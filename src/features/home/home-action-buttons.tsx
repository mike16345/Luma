import { useRouter } from "expo-router";
import { View } from "react-native";

import { NativeActionButton } from "@/components/ui/native-action-button";
import { useLanguage } from "@/i18n/language-context";
import { spacing } from "@/theme/spacing";

export function HomeActionButtons({
  hasActiveChapter,
}: {
  hasActiveChapter: boolean;
}) {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <View style={{ gap: spacing.sm }}>
      {hasActiveChapter ? (
        <>
          <NativeActionButton
            label={t("home.logSlipUp")}
            onPress={() => router.push("/slip-up")}
          />
          <NativeActionButton
            label={t("home.viewGoal")}
            variant="outlined"
            onPress={() => router.push("/goal")}
          />
          <NativeActionButton
            label={t("home.editChapter")}
            variant="text"
            onPress={() => router.push("/settings")}
          />
        </>
      ) : (
        <>
          <NativeActionButton
            label={t("common.startAChapter")}
            onPress={() => router.push("/onboarding")}
          />
          <NativeActionButton
            label={t("home.viewHistory")}
            variant="outlined"
            onPress={() => router.push("/history")}
          />
        </>
      )}
    </View>
  );
}
