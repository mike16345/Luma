import { chapterRepository } from "@/db/repositories/chapter-repository";
import { buildHomeViewModel } from "@/features/home/home-selectors";

export async function loadHomeViewModel(nowIso = new Date().toISOString()) {
  const [activeChapter, chapters] = await Promise.all([
    chapterRepository.getActiveChapter(),
    chapterRepository.listChapters(),
  ]);

  return buildHomeViewModel(chapters, activeChapter, nowIso);
}
