import { useCallback, useEffect, useState } from "react";

import { loadInsightsViewModel } from "@/features/insights/insights-service";
import type { InsightsViewModel } from "@/features/insights/insights-selectors";

export type InsightsViewModelState =
  | {
      status: "loading";
      data: null;
      error: null;
      refresh: () => Promise<void>;
    }
  | {
      status: "ready";
      data: InsightsViewModel;
      error: null;
      refresh: () => Promise<void>;
    }
  | {
      status: "error";
      data: null;
      error: Error;
      refresh: () => Promise<void>;
    };

export function useInsightsViewModel(): InsightsViewModelState {
  const [data, setData] = useState<InsightsViewModel | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async (showLoading: boolean) => {
    if (showLoading) {
      setIsLoading(true);
    }

    setError(null);

    try {
      setData(await loadInsightsViewModel());
    } catch (caughtError) {
      setData(null);
      setError(
        caughtError instanceof Error
          ? caughtError
          : new Error("Unable to load Insights")
      );
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }, []);

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
    data: data as InsightsViewModel,
    error: null,
    refresh,
  };
}
