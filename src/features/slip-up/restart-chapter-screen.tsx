import { PageHeader } from "@/components/ui/page-header";
import { Screen } from "@/components/ui/screen";
import { StartChapterForm } from "@/features/onboarding/start-chapter-form";
import { useLanguage } from "@/i18n/language-context";

export function RestartChapterScreen() {
  const { t } = useLanguage();

  return (
    <Screen>
      <PageHeader
        eyebrow={t("slipUp.newChapterEyebrow")}
        title={t("slipUp.restartTitle")}
        subtitle={t("slipUp.restartSubtitle")}
      />
      <StartChapterForm />
    </Screen>
  );
}
