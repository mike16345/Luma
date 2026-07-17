import { chapterRepository } from "@/db/repositories/chapter-repository";
import { buildHomeViewModel } from "@/features/home/home-selectors";
import type { Translator } from "@/i18n/translations";

export async function loadHomeViewModel(
  t: Translator,
  nowIso = new Date().toISOString()
) {
  const [activeChapter, chapters] = await Promise.all([
    chapterRepository.getActiveChapter(),
    chapterRepository.listChapters(),
  ]);

  return buildHomeViewModel(chapters, activeChapter, nowIso, t);
}
