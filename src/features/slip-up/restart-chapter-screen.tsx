import { PageHeader } from "@/components/ui/page-header";
import { Screen } from "@/components/ui/screen";
import { StartChapterForm } from "@/features/onboarding/start-chapter-form";

export function RestartChapterScreen() {
  return (
    <Screen>
      <PageHeader
        eyebrow="New chapter"
        title="Start again from here."
        subtitle="Your previous chapter stays in History. This starts a fresh chapter with new goal progress."
      />
      <StartChapterForm />
    </Screen>
  );
}
