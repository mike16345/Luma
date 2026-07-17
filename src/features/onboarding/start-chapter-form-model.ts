import type { CreateChapterInput, SmokingType } from "@/types/domain";
import { isSupportedCurrencyCode } from "@/lib/currency/currencies";

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

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function formatLocalDateTimeInput(date = new Date()) {
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join("-") + `T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

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

function parseDateTime(value: string, now: Date, errors: StartChapterFormErrors) {
  const trimmed = value.trim();
  const parsed = new Date(trimmed);

  if (!trimmed || Number.isNaN(parsed.getTime())) {
    errors.startedAt = "Enter a valid quit date and time.";
    return null;
  }

  if (parsed.getTime() > now.getTime() + 60 * 1000) {
    errors.startedAt = "Quit date and time cannot be in the future.";
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
  errors: StartChapterFormErrors
) {
  if (!value.trim()) {
    return null;
  }

  const parsed = parsePositiveNumber(
    value,
    "goalAmountMajor",
    "Enter a goal amount greater than zero, or leave it blank.",
    errors
  );

  return parsed === null ? null : Math.round(parsed * 100);
}

function normalizeCurrencyCode(
  value: string,
  errors: StartChapterFormErrors
) {
  const currencyCode = value.trim().toUpperCase();

  if (!/^[A-Z]{3}$/.test(currencyCode)) {
    errors.currencyCode = "Choose a currency from the list.";
    return null;
  }

  if (!isSupportedCurrencyCode(currencyCode)) {
    errors.currencyCode = "Choose a supported currency from the list.";
    return null;
  }

  return currencyCode;
}

export function parseStartChapterForm(
  form: StartChapterFormState,
  now = new Date()
): ParsedStartChapterForm {
  const errors: StartChapterFormErrors = {};
  const startedAt = parseDateTime(form.startedAt, now, errors);
  const currencyCode = normalizeCurrencyCode(form.currencyCode, errors);
  const purchasePriceMajor = parsePositiveNumber(
    form.purchasePriceMajor,
    "purchasePriceMajor",
    "Enter a purchase price greater than zero.",
    errors
  );
  const estimatedCigarettesPerPurchase = parsePositiveNumber(
    form.estimatedCigarettesPerPurchase,
    "estimatedCigarettesPerPurchase",
    "Enter an estimate greater than zero.",
    errors
  );
  const averageCigarettesPerDay = parsePositiveNumber(
    form.averageCigarettesPerDay,
    "averageCigarettesPerDay",
    "Enter an average greater than zero.",
    errors
  );
  const goalAmountMinor = parseOptionalMoneyMinor(form.goalAmountMajor, errors);

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
