import type { SupportedLanguage } from "@/i18n/languages";
import { en } from "@/i18n/translations/en";
import { he } from "@/i18n/translations/he";
import type {
  TranslationKey,
  TranslationTree,
  Translator,
  TranslateOptions,
} from "@/i18n/translations/schema";

export type { TranslationKey, Translator, TranslateOptions };

export const translations: Record<SupportedLanguage, TranslationTree> = {
  en,
  he,
};

function interpolate(value: string, options?: TranslateOptions) {
  if (!options) {
    return value;
  }

  return Object.entries(options).reduce(
    (text, [key, replacement]) =>
      text.replaceAll(`{${key}}`, String(replacement)),
    value
  );
}

export function translate(
  language: SupportedLanguage,
  key: TranslationKey,
  options?: TranslateOptions
) {
  const [section, item] = key.split(".") as [
    keyof TranslationTree,
    keyof TranslationTree[keyof TranslationTree],
  ];
  const value = translations[language][section][item] ?? en[section][item];

  return interpolate(value, options);
}
