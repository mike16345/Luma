import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppState, type AppStateStatus } from "react-native";

import { PrivacyLockScreen } from "@/features/privacy/privacy-lock-screen";
import {
  authenticateForPrivacyLock,
  getPrivacyLockAvailability,
} from "@/features/privacy/privacy-lock-service";
import { loadUserProfile } from "@/lib/profile/profile-preferences";

export function PrivacyLockProvider({ children }: PropsWithChildren) {
  const [isLocked, setIsLocked] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const lastAppStateRef = useRef<AppStateStatus>(AppState.currentState);

  const unlock = useCallback(async () => {
    const profile = loadUserProfile();

    if (!profile.privacyLockEnabled) {
      setIsLocked(false);
      setMessage(null);
      return;
    }

    const availability = await getPrivacyLockAvailability();

    if (!availability.canAuthenticate) {
      setIsLocked(false);
      setMessage(availability.reason);
      return;
    }

    const didAuthenticate = await authenticateForPrivacyLock();

    if (didAuthenticate) {
      setIsLocked(false);
      setMessage(null);
    } else {
      setIsLocked(true);
      setMessage("Authentication was cancelled.");
    }
  }, []);

  useEffect(() => {
    const profile = loadUserProfile();

    if (profile.privacyLockEnabled) {
      setIsLocked(true);
      void unlock();
    }
  }, [unlock]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      const previousState = lastAppStateRef.current;
      lastAppStateRef.current = nextState;

      if (
        previousState.match(/inactive|background/) &&
        nextState === "active" &&
        loadUserProfile().privacyLockEnabled
      ) {
        setIsLocked(true);
        void unlock();
      }
    });

    return () => subscription.remove();
  }, [unlock]);

  if (isLocked) {
    return <PrivacyLockScreen message={message} onUnlock={() => void unlock()} />;
  }

  return children;
}
