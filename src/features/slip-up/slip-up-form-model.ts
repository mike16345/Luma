import { formatLocalDateTimeInput } from "@/features/onboarding/start-chapter-form-model";
import { translate, type Translator } from "@/i18n/translations";

export type SlipUpFormState = {
  occurredAt: string;
  mood: string;
  trigger: string;
  alcoholInvolved: boolean;
  note: string;
};

export type SlipUpField = keyof SlipUpFormState;

export type SlipUpFormErrors = Partial<Record<SlipUpField, string>>;

export type ParsedSlipUpForm =
  | {
      ok: true;
      input: {
        occurredAt: string;
        mood: string | null;
        trigger: string | null;
        alcoholInvolved: boolean;
        note: string | null;
      };
      errors: SlipUpFormErrors;
    }
  | {
      ok: false;
      input: null;
      errors: SlipUpFormErrors;
    };

export function createInitialSlipUpFormState(): SlipUpFormState {
  return {
    occurredAt: formatLocalDateTimeInput(),
    mood: "",
    trigger: "",
    alcoholInvolved: false,
    note: "",
  };
}

function optionalText(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function parseSlipUpForm(
  form: SlipUpFormState,
  activeChapterStartedAt: string,
  now = new Date(),
  t: Translator = (key, options) => translate("en", key, options)
): ParsedSlipUpForm {
  const errors: SlipUpFormErrors = {};
  const occurredAt = new Date(form.occurredAt.trim());
  const chapterStartedAt = new Date(activeChapterStartedAt);

  if (!form.occurredAt.trim() || Number.isNaN(occurredAt.getTime())) {
    errors.occurredAt = t("validation.invalidDateTime");
  } else if (occurredAt.getTime() > now.getTime() + 60 * 1000) {
    errors.occurredAt = t("validation.futureSlipUpTime");
  } else if (occurredAt.getTime() < chapterStartedAt.getTime()) {
    errors.occurredAt = t("validation.slipUpBeforeChapter");
  }

  if (errors.occurredAt) {
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
      occurredAt: occurredAt.toISOString(),
      mood: optionalText(form.mood),
      trigger: optionalText(form.trigger),
      alcoholInvolved: form.alcoholInvolved,
      note: optionalText(form.note),
    },
  };
}
