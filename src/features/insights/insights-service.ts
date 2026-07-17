import { slipUpRepository } from "@/db/repositories/slip-up-repository";
import { buildInsightsViewModel } from "@/features/insights/insights-selectors";

export async function loadInsightsViewModel() {
  const slipUps = await slipUpRepository.listSlipUps();
  return buildInsightsViewModel(slipUps);
}
