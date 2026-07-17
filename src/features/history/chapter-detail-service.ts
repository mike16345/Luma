import { chapterRepository } from "@/db/repositories/chapter-repository";
import { slipUpRepository } from "@/db/repositories/slip-up-repository";
import {
  buildChapterDetailViewModel,
  type ChapterDetailViewModel,
} from "@/features/history/chapter-detail-selectors";
import type { Translator } from "@/i18n/translations";

export async function loadChapterDetailViewModel(
  chapterId: string,
  t: Translator,
  nowIso = new Date().toISOString()
): Promise<ChapterDetailViewModel | null> {
  const [chapters, slipUps] = await Promise.all([
    chapterRepository.listChapters(),
    slipUpRepository.listSlipUps(),
  ]);

  return buildChapterDetailViewModel(chapters, slipUps, chapterId, nowIso, t);
}
