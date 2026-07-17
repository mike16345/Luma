import { useCallback, useMemo, useRef, useState } from "react";

import {
  isDevBuild,
  isDevProfilePassphrase,
} from "@/lib/dev/dev-data-profile";
import { useLanguage } from "@/i18n/language-context";

const REQUIRED_TAPS = 10;
const TAP_WINDOW_MS = 6000;

export function useDevOptionsUnlock() {
  const { t } = useLanguage();
  const tapTimesRef = useRef<number[]>([]);
  const [isPromptVisible, setIsPromptVisible] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recordTap = useCallback(() => {
    if (!isDevBuild() || isUnlocked) {
      return;
    }

    const now = Date.now();
    tapTimesRef.current = [...tapTimesRef.current, now].filter(
      (tapTime) => now - tapTime <= TAP_WINDOW_MS
    );

    if (tapTimesRef.current.length >= REQUIRED_TAPS) {
      tapTimesRef.current = [];
      setError(null);
      setIsPromptVisible(true);
    }
  }, [isUnlocked]);

  const cancelPrompt = useCallback(() => {
    setError(null);
    setIsPromptVisible(false);
  }, []);

  const hideOptions = useCallback(() => {
    setError(null);
    setIsUnlocked(false);
    setIsPromptVisible(false);
  }, []);

  const submitPassphrase = useCallback((passphrase: string) => {
    if (isDevProfilePassphrase(passphrase)) {
      setError(null);
      setIsUnlocked(true);
      setIsPromptVisible(false);
      return;
    }

    setError(t("dev.wrongPassphrase"));
  }, [t]);

  return useMemo(
    () => ({
      cancelPrompt,
      error,
      hideOptions,
      isPromptVisible: isDevBuild() && isPromptVisible,
      isUnlocked: isDevBuild() && isUnlocked,
      recordTap,
      submitPassphrase,
    }),
    [
      cancelPrompt,
      error,
      hideOptions,
      isPromptVisible,
      isUnlocked,
      recordTap,
      submitPassphrase,
    ]
  );
}
