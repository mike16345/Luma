import { useCallback, useEffect, useState } from "react";

import {
  loadQuitReason,
  saveQuitReason,
  subscribeToQuitReason,
} from "@/features/reasons/reason-preferences";

export function useQuitReason() {
  const [reason, setReason] = useState(loadQuitReason);

  useEffect(() => {
    return subscribeToQuitReason(() => {
      setReason(loadQuitReason());
    });
  }, []);

  const saveReason = useCallback((nextReason: string) => {
    const savedReason = saveQuitReason(nextReason);
    setReason(savedReason);

    return savedReason;
  }, []);

  const clearReason = useCallback(() => {
    const savedReason = saveQuitReason("");
    setReason(savedReason);
  }, []);

  return {
    clearReason,
    reason,
    saveReason,
  };
}
