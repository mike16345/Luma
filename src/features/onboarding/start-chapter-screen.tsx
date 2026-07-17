import { PageHeader } from "@/components/ui/page-header";
import { Screen } from "@/components/ui/screen";
import { StartChapterForm } from "@/features/onboarding/start-chapter-form";

export function StartChapterScreen() {
  return (
    <Screen>
      <PageHeader
        eyebrow="Start"
        title="Start your first chapter."
        subtitle="Practical estimates are enough. You can correct the active chapter later from Settings."
      />
      <StartChapterForm />
    </Screen>
  );
}
