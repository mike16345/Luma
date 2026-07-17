import { useLocalSearchParams } from "expo-router";

import { ChapterDetailScreen } from "@/features/history/chapter-detail-screen";

export default function ChapterDetailRoute() {
  const { chapterId } = useLocalSearchParams<{ chapterId?: string }>();

  return <ChapterDetailScreen chapterId={chapterId ?? ""} />;
}
