import { useCallback, useEffect, useState } from "react";

import { loadHistoryViewModel } from "@/features/history/history-service";
import type { HistoryViewModel } from "@/features/history/history-selectors";
import { useLanguage } from "@/i18n/language-context";

export type HistoryViewModelState =
  | {
      status: "loading";
      data: null;
      error: null;
      refresh: () => Promise<void>;
    }
  | {
      status: "ready";
      data: HistoryViewModel;
      error: null;
      refresh: () => Promise<void>;
    }
  | {
      status: "error";
      data: null;
      error: Error;
      refresh: () => Promise<void>;
    };

export function useHistoryViewModel(): HistoryViewModelState {
  const { t } = useLanguage();
  const [data, setData] = useState<HistoryViewModel | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async (showLoading: boolean) => {
    if (showLoading) {
      setIsLoading(true);
    }

    setError(null);

    try {
      setData(await loadHistoryViewModel(t));
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
  }, [t]);

  const refresh = useCallback(() => load(true), [load]);

  useEffect(() => {
    void load(true);
  }, [load]);

  if (isLoading) {
    return {
      status: "loading",
      data: null,
      error: null,
      refresh,
    };
  }

  if (error) {
    return {
      status: "error",
      data: null,
      error,
      refresh,
    };
  }

  return {
    status: "ready",
    data: data as HistoryViewModel,
    error: null,
    refresh,
  };
}
