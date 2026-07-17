import { chapterRepository } from "@/db/repositories/chapter-repository";
import type { CreateChapterInput } from "@/types/domain";

export async function createStartChapter(input: CreateChapterInput) {
  return chapterRepository.createChapter(input);
}
