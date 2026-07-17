import type { CreateChapterInput, SmokingType } from "@/types/domain";
import { isSupportedCurrencyCode } from "@/lib/currency/currencies";
import {
  formatLocalDateTimeInput,
  parseLocalDateTimeInput,
} from "@/lib/formatting/local-date-time-input";
import { translate, type Translator } from "@/i18n/translations";

export type StartChapterFormState = {
  startedAt: string;
  currencyCode: string;
  smokingType: SmokingType;
  purchasePriceMajor: string;
  estimatedCigarettesPerPurchase: string;
  averageCigarettesPerDay: string;
  goalAmountMajor: string;
};

export type StartChapterField = keyof StartChapterFormState;

export type StartChapterFormErrors = Partial<
  Record<StartChapterField, string>
>;

export type ParsedStartChapterForm =
  | {
      ok: true;
      input: CreateChapterInput;
      errors: StartChapterFormErrors;
    }
  | {
      ok: false;
      input: null;
      errors: StartChapterFormErrors;
    };

export function createInitialStartChapterFormState(): StartChapterFormState {
  return {
    startedAt: formatLocalDateTimeInput(),
    currencyCode: "USD",
    smokingType: "pack",
    purchasePriceMajor: "",
    estimatedCigarettesPerPurchase: "20",
    averageCigarettesPerDay: "",
    goalAmountMajor: "",
  };
}

function parseDateTime(
  value: string,
  now: Date,
  errors: StartChapterFormErrors,
  t: Translator
) {
  const trimmed = value.trim();
  const parsed = parseLocalDateTimeInput(trimmed);

  if (!trimmed || !parsed) {
    errors.startedAt = t("validation.invalidQuitDateTime");
    return null;
  }

  if (parsed.getTime() > now.getTime() + 60 * 1000) {
    errors.startedAt = t("validation.futureQuitDateTime");
    return null;
  }

  return parsed.toISOString();
}

function parsePositiveNumber(
  value: string,
  field: StartChapterField,
  message: string,
  errors: StartChapterFormErrors
) {
  const normalized = value.trim().replace(/,/g, "");
  const parsed = Number(normalized);

  if (!normalized || !Number.isFinite(parsed) || parsed <= 0) {
    errors[field] = message;
    return null;
  }

  return parsed;
}

function parseOptionalMoneyMinor(
  value: string,
  errors: StartChapterFormErrors,
  t: Translator
) {
  if (!value.trim()) {
    return null;
  }

  const parsed = parsePositiveNumber(
    value,
    "goalAmountMajor",
    t("validation.invalidGoalOrBlank"),
    errors
  );

  return parsed === null ? null : Math.round(parsed * 100);
}

function normalizeCurrencyCode(
  value: string,
  errors: StartChapterFormErrors,
  t: Translator
) {
  const currencyCode = value.trim().toUpperCase();

  if (!/^[A-Z]{3}$/.test(currencyCode)) {
    errors.currencyCode = t("validation.chooseCurrency");
    return null;
  }

  if (!isSupportedCurrencyCode(currencyCode)) {
    errors.currencyCode = t("validation.chooseSupportedCurrency");
    return null;
  }

  return currencyCode;
}

export function parseStartChapterForm(
  form: StartChapterFormState,
  now = new Date(),
  t: Translator = (key, options) => translate("en", key, options)
): ParsedStartChapterForm {
  const errors: StartChapterFormErrors = {};
  const startedAt = parseDateTime(form.startedAt, now, errors, t);
  const currencyCode = normalizeCurrencyCode(form.currencyCode, errors, t);
  const purchasePriceMajor = parsePositiveNumber(
    form.purchasePriceMajor,
    "purchasePriceMajor",
    t("validation.purchasePricePositive"),
    errors
  );
  const estimatedCigarettesPerPurchase = parsePositiveNumber(
    form.estimatedCigarettesPerPurchase,
    "estimatedCigarettesPerPurchase",
    t("validation.estimatePositive"),
    errors
  );
  const averageCigarettesPerDay = parsePositiveNumber(
    form.averageCigarettesPerDay,
    "averageCigarettesPerDay",
    t("validation.averagePositive"),
    errors
  );
  const goalAmountMinor = parseOptionalMoneyMinor(form.goalAmountMajor, errors, t);

  if (
    !startedAt ||
    !currencyCode ||
    purchasePriceMajor === null ||
    estimatedCigarettesPerPurchase === null ||
    averageCigarettesPerDay === null ||
    errors.goalAmountMajor
  ) {
    return {
      ok: false,
      input: null,
      errors,
    };
  }

  return {
    ok: true,
    errors,
    input: {
      startedAt,
      currencyCode,
      smokingType: form.smokingType,
      purchasePriceMinor: Math.round(purchasePriceMajor * 100),
      estimatedCigarettesPerPurchase,
      averageCigarettesPerDay,
      goalAmountMinor,
    },
  };
}
