import { useCallback, useEffect, useState } from "react";

import { loadChapterDetailViewModel } from "@/features/history/chapter-detail-service";
import type { ChapterDetailViewModel } from "@/features/history/chapter-detail-selectors";
import { useLanguage } from "@/i18n/language-context";

export type ChapterDetailViewModelState =
  | {
      data: null;
      error: null;
      refresh: () => Promise<void>;
      status: "loading";
    }
  | {
      data: ChapterDetailViewModel;
      error: null;
      refresh: () => Promise<void>;
      status: "ready";
    }
  | {
      data: null;
      error: Error;
      refresh: () => Promise<void>;
      status: "error";
    }
  | {
      data: null;
      error: null;
      refresh: () => Promise<void>;
      status: "not-found";
    };

export function useChapterDetailViewModel(
  chapterId: string
): ChapterDetailViewModelState {
  const { t } = useLanguage();
  const [data, setData] = useState<ChapterDetailViewModel | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  const load = useCallback(
    async (showLoading: boolean) => {
      if (showLoading) {
        setIsLoading(true);
      }

      setError(null);
      setIsNotFound(false);

      try {
        const nextData = await loadChapterDetailViewModel(chapterId, t);
        setData(nextData);
        setIsNotFound(nextData === null);
      } catch (caughtError) {
        setData(null);
        setError(
          caughtError instanceof Error
            ? caughtError
            : new Error(t("validation.unableToLoadHistory"))
        );
      } finally {
        if (showLoading) {
          setIsLoading(false);
        }
      }
    },
    [chapterId, t]
  );

  const refresh = useCallback(() => load(true), [load]);

  useEffect(() => {
    void load(true);
  }, [load]);

  if (isLoading) {
    return {
      data: null,
      error: null,
      refresh,
      status: "loading",
    };
  }

  if (error) {
    return {
      data: null,
      error,
      refresh,
      status: "error",
    };
  }

  if (isNotFound || !data) {
    return {
      data: null,
      error: null,
      refresh,
      status: "not-found",
    };
  }

  return {
    data,
    error: null,
    refresh,
    status: "ready",
  };
}
