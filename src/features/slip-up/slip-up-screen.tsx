import { PageHeader } from "@/components/ui/page-header";
import { Screen } from "@/components/ui/screen";
import { SlipUpForm } from "@/features/slip-up/slip-up-form";
import {
  SlipUpErrorState,
  SlipUpLoadingState,
  SlipUpNoActiveChapterState,
} from "@/features/slip-up/slip-up-states";
import { useSlipUpForm } from "@/features/slip-up/use-slip-up-form";
import { useLanguage } from "@/i18n/language-context";

export function SlipUpScreen() {
  const { t } = useLanguage();
  const state = useSlipUpForm();

  if (state.status === "loading") {
    return <SlipUpLoadingState />;
  }

  if (state.status === "error") {
    return (
      <SlipUpErrorState
        message={state.submitError.message}
        refresh={state.refresh}
      />
    );
  }

  return (
    <Screen>
      <PageHeader
        eyebrow={t("slipUp.eyebrow")}
        title={t("slipUp.title")}
        subtitle={t("slipUp.subtitle")}
      />
      {state.activeChapter ? (
        <SlipUpForm state={state} />
      ) : (
        <SlipUpNoActiveChapterState />
      )}
    </Screen>
  );
}
