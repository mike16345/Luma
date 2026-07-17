import * as Updates from "expo-updates";

import { isDevBuild } from "@/lib/dev/dev-data-profile";

type GlobalWithLocation = typeof globalThis & {
  location?: {
    reload: () => void;
  };
};

export async function reloadAppForDevProfile() {
  if (!isDevBuild()) {
    return;
  }

  try {
    await Updates.reloadAsync();
    return;
  } catch {
    const location = (globalThis as GlobalWithLocation).location;

    if (location) {
      location.reload();
    }
  }
}
