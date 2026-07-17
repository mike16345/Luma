import { Screen } from "@/components/ui/screen";
import { OnboardingAnimatedSection } from "@/features/onboarding/onboarding-animated-section";
import { OnboardingGuidance } from "@/features/onboarding/onboarding-guidance";
import { OnboardingIdentity } from "@/features/onboarding/onboarding-identity";
import { StartChapterForm } from "@/features/onboarding/start-chapter-form";
import { spacing } from "@/theme/spacing";

export function StartChapterScreen() {
  return (
    <Screen contentContainerStyle={{ gap: spacing.xl }}>
      <OnboardingAnimatedSection>
        <OnboardingIdentity />
      </OnboardingAnimatedSection>
      <OnboardingAnimatedSection delay={120}>
        <OnboardingGuidance />
      </OnboardingAnimatedSection>
      <OnboardingAnimatedSection delay={220}>
        <StartChapterForm />
      </OnboardingAnimatedSection>
    </Screen>
  );
}
