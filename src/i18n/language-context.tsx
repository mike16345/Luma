import * as Localization from "expo-localization";
import * as Updates from "expo-updates";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { I18nManager, Platform, View } from "react-native";

import {
  findLanguageOption,
  getTextAlign,
  isSupportedLanguage,
  type LanguageOption,
  type SupportedLanguage,
  type TextDirection,
} from "@/i18n/languages";
import { translate, type TranslationKey } from "@/i18n/translations";
import { preferencesStorage } from "@/lib/storage/local-preferences";

const LANGUAGE_PREFERENCE_KEY = "language.preference";

interface LanguageContextValue {
  direction: TextDirection;
  language: SupportedLanguage;
  languageOption: LanguageOption;
  isApplyingDirectionChange: boolean;
  setLanguage: (language: SupportedLanguage) => Promise<void>;
  textAlign: ReturnType<typeof getTextAlign>;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getDeviceLanguage(): SupportedLanguage {
  const languageCode = Localization.getLocales()[0]?.languageCode;
  return isSupportedLanguage(languageCode) ? languageCode : "en";
}

function readInitialLanguage(): SupportedLanguage {
  const storedLanguage = preferencesStorage.getString(
    LANGUAGE_PREFERENCE_KEY,
    ""
  );

  return isSupportedLanguage(storedLanguage)
    ? storedLanguage
    : getDeviceLanguage();
}

async function reloadForDirectionChange() {
  if (Platform.OS === "web") {
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    await Updates.reloadAsync();
  } catch {
    // In Expo Go or unsupported runtimes, the stored preference still applies
    // on the next manual app start.
  }
}

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] =
    useState<SupportedLanguage>(readInitialLanguage);
  const [isApplyingDirectionChange, setIsApplyingDirectionChange] =
    useState(false);
  const languageOption = findLanguageOption(language) ?? findLanguageOption("en")!;
  const direction = languageOption.direction;
  const textAlign = getTextAlign(direction);

  const setLanguage = useCallback(
    async (nextLanguage: SupportedLanguage) => {
      const nextLanguageOption =
        findLanguageOption(nextLanguage) ?? findLanguageOption("en")!;
      const shouldBeRTL = nextLanguageOption.direction === "rtl";
      const needsDirectionChange =
        Platform.OS !== "web" && I18nManager.isRTL !== shouldBeRTL;

      preferencesStorage.setString(LANGUAGE_PREFERENCE_KEY, nextLanguage);
      setLanguageState(nextLanguage);

      if (needsDirectionChange) {
        setIsApplyingDirectionChange(true);
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(shouldBeRTL);
        await reloadForDirectionChange();
        setIsApplyingDirectionChange(false);
      }
    },
    []
  );

  useEffect(() => {
    const shouldBeRTL = direction === "rtl";
    const needsDirectionChange =
      Platform.OS !== "web" && I18nManager.isRTL !== shouldBeRTL;

    if (!needsDirectionChange) {
      return;
    }

    setIsApplyingDirectionChange(true);
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(shouldBeRTL);
    void reloadForDirectionChange().finally(() => {
      setIsApplyingDirectionChange(false);
    });
  }, [direction]);

  const value = useMemo(
    () => ({
      direction,
      isApplyingDirectionChange,
      language,
      languageOption,
      setLanguage,
      textAlign,
      t: (key: TranslationKey) => translate(language, key),
    }),
    [
      direction,
      isApplyingDirectionChange,
      language,
      languageOption,
      setLanguage,
      textAlign,
    ]
  );

  return (
    <LanguageContext.Provider value={value}>
      <View style={{ direction, flex: 1 }}>{children}</View>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const value = useContext(LanguageContext);

  if (!value) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return value;
}
