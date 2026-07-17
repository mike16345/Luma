import { slipUpRepository } from "@/db/repositories/slip-up-repository";
import { buildInsightsViewModel } from "@/features/insights/insights-selectors";
import type { SupportedLanguage } from "@/i18n/languages";
import type { Translator } from "@/i18n/translations";

export async function loadInsightsViewModel(
  t: Translator,
  language: SupportedLanguage
) {
  const slipUps = await slipUpRepository.listSlipUps();
  return buildInsightsViewModel(slipUps, t, language);
}
