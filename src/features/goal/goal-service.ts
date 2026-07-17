import { chapterRepository } from "@/db/repositories/chapter-repository";
import { buildGoalViewModel } from "@/features/goal/goal-selectors";

export async function loadGoalViewModel(nowIso = new Date().toISOString()) {
  const activeChapter = await chapterRepository.getActiveChapter();
  return buildGoalViewModel(activeChapter, nowIso);
}

export async function updateChapterGoal(goalAmountMinor: number | null) {
  return chapterRepository.updateActiveChapter({ goalAmountMinor });
}
