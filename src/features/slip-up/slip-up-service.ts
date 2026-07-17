import { chapterRepository } from "@/db/repositories/chapter-repository";
import { slipUpRepository } from "@/db/repositories/slip-up-repository";
import type { CreateChapterInput, CreateSlipUpInput } from "@/types/domain";

export async function loadSlipUpViewModel() {
  const [activeChapter, latestSlipUp] = await Promise.all([
    chapterRepository.getActiveChapter(),
    slipUpRepository.getLatestSlipUp(),
  ]);

  return {
    activeChapter,
    latestSlipUp,
  };
}

export async function logSlipUpAndEndChapter(
  input: Omit<CreateSlipUpInput, "chapterId">
) {
  const activeChapter = await chapterRepository.getActiveChapter();

  if (!activeChapter) {
    throw new Error("no active chapter");
  }

  const slipUp = await slipUpRepository.createSlipUp({
    ...input,
    chapterId: activeChapter.id,
  });

  await chapterRepository.endChapter({
    chapterId: activeChapter.id,
    endedAt: input.occurredAt,
  });

  return slipUp;
}

export async function restartChapter(input: CreateChapterInput) {
  return chapterRepository.createChapter(input);
}
