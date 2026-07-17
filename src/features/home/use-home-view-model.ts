import { useCallback, useEffect, useState } from "react";

import { loadHomeViewModel } from "@/features/home/home-service";
import type { HomeViewModel } from "@/features/home/home-selectors";
import { useLanguage } from "@/i18n/language-context";

export type HomeViewModelState =
  | {
      status: "loading";
      data: null;
      error: null;
      refresh: () => Promise<void>;
    }
  | {
      status: "ready";
      data: HomeViewModel;
      error: null;
      refresh: () => Promise<void>;
    }
  | {
      status: "error";
      data: null;
      error: Error;
      refresh: () => Promise<void>;
    };

export function useHomeViewModel(): HomeViewModelState {
  const { t } = useLanguage();
  const [data, setData] = useState<HomeViewModel | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async (showLoading: boolean) => {
    if (showLoading) {
      setIsLoading(true);
    }

    setError(null);

    try {
      setData(await loadHomeViewModel(t));
    } catch (caughtError) {
      setData(null);
      setError(
        caughtError instanceof Error
          ? caughtError
          : new Error(t("validation.unableToLoadHome"))
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

    const intervalId = setInterval(() => {
      void load(false);
    }, 60 * 1000);

    return () => clearInterval(intervalId);
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
    data: data as HomeViewModel,
    error: null,
    refresh,
  };
}
