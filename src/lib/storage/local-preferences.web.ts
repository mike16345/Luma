const localStorageApi = globalThis.localStorage;

export const preferencesStorage = {
  getString(key: string, fallback = "") {
    return localStorageApi.getItem(key) ?? fallback;
  },

  setString(key: string, value: string) {
    localStorageApi.setItem(key, value);
  },

  getBoolean(key: string, fallback = false) {
    const value = localStorageApi.getItem(key);
    return value === null ? fallback : value === "true";
  },

  setBoolean(key: string, value: boolean) {
    localStorageApi.setItem(key, String(value));
  },
};
