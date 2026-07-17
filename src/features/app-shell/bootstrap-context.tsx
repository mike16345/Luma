import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { chapterRepository } from "@/db/repositories/chapter-repository";

export type BootstrapStatus = "loading" | "onboarding" | "ready";

type BootstrapContextValue = {
  markReady: () => void;
  refresh: () => Promise<void>;
  status: BootstrapStatus;
};

const BootstrapContext = createContext<BootstrapContextValue | null>(null);

async function resolveBootstrapStatus(): Promise<BootstrapStatus> {
  const [activeChapter, chapters] = await Promise.all([
    chapterRepository.getActiveChapter(),
    chapterRepository.listChapters(),
  ]);

  return activeChapter || chapters.length > 0 ? "ready" : "onboarding";
}

export function BootstrapProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<BootstrapStatus>("loading");

  const refresh = useCallback(async () => {
    try {
      setStatus(await resolveBootstrapStatus());
    } catch {
      setStatus("onboarding");
    }
  }, []);

  const markReady = useCallback(() => {
    setStatus("ready");
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      markReady,
      refresh,
      status,
    }),
    [markReady, refresh, status]
  );

  return (
    <BootstrapContext.Provider value={value}>
      {children}
    </BootstrapContext.Provider>
  );
}

export function useBootstrap() {
  const value = useContext(BootstrapContext);

  if (!value) {
    throw new Error("useBootstrap must be used inside BootstrapProvider");
  }

  return value;
}
