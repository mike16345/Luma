import type { SupportedLanguage } from "@/i18n/languages";

export const translations = {
  en: {
    settings: {
      languageEyebrow: "Language",
      languageTitle: "App language",
      languageDescription:
        "Choose the language and reading direction for this device.",
      applyingLanguage: "Applying language...",
      restartNote:
        "Switching between left-to-right and right-to-left reloads the app so native layout direction is applied.",
    },
  },
  he: {
    settings: {
      languageEyebrow: "\u05E9\u05E4\u05D4",
      languageTitle: "\u05E9\u05E4\u05EA \u05D4\u05D0\u05E4\u05DC\u05D9\u05E7\u05E6\u05D9\u05D4",
      languageDescription:
        "\u05D1\u05D7\u05E8\u05D5 \u05D0\u05EA \u05D4\u05E9\u05E4\u05D4 \u05D5\u05D0\u05EA \u05DB\u05D9\u05D5\u05D5\u05DF \u05D4\u05E7\u05E8\u05D9\u05D0\u05D4 \u05D1\u05DE\u05DB\u05E9\u05D9\u05E8 \u05D4\u05D6\u05D4.",
      applyingLanguage:
        "\u05DE\u05D7\u05D9\u05DC\u05D9\u05DD \u05D0\u05EA \u05D4\u05E9\u05E4\u05D4...",
      restartNote:
        "\u05DE\u05E2\u05D1\u05E8 \u05D1\u05D9\u05DF \u05E9\u05DE\u05D0\u05DC-\u05DC\u05D9\u05DE\u05D9\u05DF \u05DC\u05D9\u05DE\u05D9\u05DF-\u05DC\u05E9\u05DE\u05D0\u05DC \u05D8\u05D5\u05E2\u05DF \u05D0\u05EA \u05D4\u05D0\u05E4\u05DC\u05D9\u05E7\u05E6\u05D9\u05D4 \u05DE\u05D7\u05D3\u05E9 \u05DB\u05D3\u05D9 \u05DC\u05D4\u05D7\u05D9\u05DC \u05D0\u05EA \u05DB\u05D9\u05D5\u05D5\u05DF \u05D4\u05E4\u05E8\u05D9\u05E1\u05D4.",
    },
  },
} as const;

type TranslationTree = typeof translations.en;
export type TranslationKey = {
  [Section in keyof TranslationTree]: {
    [Key in keyof TranslationTree[Section]]: `${Section}.${Key & string}`;
  }[keyof TranslationTree[Section]];
}[keyof TranslationTree];

export function translate(language: SupportedLanguage, key: TranslationKey) {
  const [section, item] = key.split(".") as [
    keyof TranslationTree,
    keyof TranslationTree[keyof TranslationTree],
  ];

  return translations[language][section][item] ?? translations.en[section][item];
}
