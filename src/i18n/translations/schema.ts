import type { en } from "@/i18n/translations/en";

type WidenStrings<T> = {
  [Key in keyof T]: T[Key] extends string ? string : WidenStrings<T[Key]>;
};

export type TranslationTree = WidenStrings<typeof en>;

export type TranslationKey = {
  [Section in keyof TranslationTree]: {
    [Key in keyof TranslationTree[Section]]: `${Section}.${Key & string}`;
  }[keyof TranslationTree[Section]];
}[keyof TranslationTree];

export type TranslateOptions = Record<string, string | number>;

export type Translator = (
  key: TranslationKey,
  options?: TranslateOptions
) => string;
