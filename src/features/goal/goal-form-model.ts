import { translate, type Translator } from "@/i18n/translations";

export type GoalFormState = {
  goalAmountMajor: string;
};

export type GoalFormErrors = Partial<Record<keyof GoalFormState, string>>;

export type ParsedGoalForm =
  | {
      ok: true;
      goalAmountMinor: number | null;
      errors: GoalFormErrors;
    }
  | {
      ok: false;
      goalAmountMinor: null;
      errors: GoalFormErrors;
    };

export function formatGoalAmountMajor(goalAmountMinor: number | null) {
  if (goalAmountMinor === null) {
    return "";
  }

  const value = goalAmountMinor / 100;
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

export function parseGoalForm(
  form: GoalFormState,
  t: Translator = (key, options) => translate("en", key, options)
): ParsedGoalForm {
  const errors: GoalFormErrors = {};
  const normalized = form.goalAmountMajor.trim().replace(/,/g, "");

  if (!normalized) {
    return {
      ok: true,
      goalAmountMinor: null,
      errors,
    };
  }

  const parsed = Number(normalized);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    errors.goalAmountMajor = t("validation.invalidGoalOrBlank");

    return {
      ok: false,
      goalAmountMinor: null,
      errors,
    };
  }

  return {
    ok: true,
    goalAmountMinor: Math.round(parsed * 100),
    errors,
  };
}
