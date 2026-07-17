import { chapterRepository } from "@/db/repositories/chapter-repository";
import type { UpdateActiveChapterInput } from "@/types/domain";

export async function loadSettingsViewModel() {
  return {
    activeChapter: await chapterRepository.getActiveChapter(),
  };
}

export async function updateActiveChapterSettings(
  input: UpdateActiveChapterInput
) {
  return chapterRepository.updateActiveChapter(input);
}
