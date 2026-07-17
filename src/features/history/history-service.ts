import { chapterRepository } from "@/db/repositories/chapter-repository";
import { slipUpRepository } from "@/db/repositories/slip-up-repository";
import { buildHistoryViewModel } from "@/features/history/history-selectors";

export async function loadHistoryViewModel(nowIso = new Date().toISOString()) {
  const [chapters, slipUps] = await Promise.all([
    chapterRepository.listChapters(),
    slipUpRepository.listSlipUps(),
  ]);

  return buildHistoryViewModel(chapters, slipUps, nowIso);
}
