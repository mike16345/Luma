import { formatLocalDateTimeInput } from "@/features/onboarding/start-chapter-form-model";
import { isSupportedCurrencyCode } from "@/lib/currency/currencies";
import type {
  ChapterRecord,
  SmokingType,
  UpdateActiveChapterInput,
} from "@/types/domain";

export type ChapterSettingsFormState = {
  startedAt: string;
  currencyCode: string;
  smokingType: SmokingType;
  purchasePriceMajor: string;
  estimatedCigarettesPerPurchase: string;
  averageCigarettesPerDay: string;
  goalAmountMajor: string;
};

export type ChapterSettingsField = keyof ChapterSettingsFormState;

export type ChapterSettingsFormErrors = Partial<
  Record<ChapterSettingsField, string>
>;

export type ParsedChapterSettingsForm =
  | {
      ok: true;
      input: UpdateActiveChapterInput;
      errors: ChapterSettingsFormErrors;
    }
  | {
      ok: false;
      input: null;
      errors: ChapterSettingsFormErrors;
    };

function formatMajorUnits(valueMinor: number | null) {
  if (valueMinor === null) {
    return "";
  }

  const value = valueMinor / 100;
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

export function createChapterSettingsFormState(
  chapter: ChapterRecord
): ChapterSettingsFormState {
  return {
    startedAt: formatLocalDateTimeInput(new Date(chapter.startedAt)),
    currencyCode: chapter.currencyCode,
    smokingType: chapter.smokingType,
    purchasePriceMajor: formatMajorUnits(chapter.purchasePriceMinor),
    estimatedCigarettesPerPurchase: String(
      chapter.estimatedCigarettesPerPurchase
    ),
    averageCigarettesPerDay: String(chapter.averageCigarettesPerDay),
    goalAmountMajor: formatMajorUnits(chapter.goalAmountMinor),
  };
}

function parseDateTime(
  value: string,
  now: Date,
  errors: ChapterSettingsFormErrors
) {
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
  field: ChapterSettingsField,
  message: string,
  errors: ChapterSettingsFormErrors
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
  errors: ChapterSettingsFormErrors
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
  errors: ChapterSettingsFormErrors
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

export function parseChapterSettingsForm(
  form: ChapterSettingsFormState,
  now = new Date()
): ParsedChapterSettingsForm {
  const errors: ChapterSettingsFormErrors = {};
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
