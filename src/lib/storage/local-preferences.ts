import "expo-sqlite/localStorage/install";

const localStorageApi = globalThis.localStorage;

export const preferencesStorage = {
  getBoolean(key: string, fallback = false) {
    const value = localStorageApi.getItem(key);
    return value === null ? fallback : value === "true";
  },

  setBoolean(key: string, value: boolean) {
    localStorageApi.setItem(key, String(value));
  },
};
