import type { ViewStyle } from "react-native";

export type SupportedLanguage = "en" | "he";
export type TextDirection = "ltr" | "rtl";

export type LanguageOption = {
  code: SupportedLanguage;
  direction: TextDirection;
  flag: string;
  label: string;
  nativeLabel: string;
};

export const supportedLanguages: LanguageOption[] = [
  {
    code: "en",
    direction: "ltr",
    flag: "\u{1F1FA}\u{1F1F8}",
    label: "English",
    nativeLabel: "English",
  },
  {
    code: "he",
    direction: "rtl",
    flag: "\u{1F1EE}\u{1F1F1}",
    label: "Hebrew",
    nativeLabel: "עברית",
  },
];

export function findLanguageOption(code: string | null | undefined) {
  return supportedLanguages.find((language) => language.code === code);
}

export function isSupportedLanguage(
  code: string | null | undefined
): code is SupportedLanguage {
  return findLanguageOption(code) !== undefined;
}

export function getTextAlign(direction: TextDirection): "left" | "right" {
  return direction === "rtl" ? "right" : "left";
}

export function getFlexDirection(direction: TextDirection): ViewStyle["flexDirection"] {
  return direction === "rtl" ? "row-reverse" : "row";
}
