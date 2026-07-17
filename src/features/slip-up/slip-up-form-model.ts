import {
  formatLocalDateTimeInput,
  parseLocalDateTimeInput,
} from "@/lib/formatting/local-date-time-input";
import { translate, type Translator } from "@/i18n/translations";
import type { SlipUpRecord } from "@/types/domain";

export type SlipUpFormState = {
  occurredAt: string;
  mood: string;
  trigger: string;
  alcoholInvolved: boolean;
  note: string;
};

export type SlipUpField = keyof SlipUpFormState;

export type SlipUpFormErrors = Partial<Record<SlipUpField, string>>;

type SlipUpFormDefaults = Pick<
  SlipUpRecord,
  "alcoholInvolved" | "mood" | "note" | "trigger"
>;

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

export function createInitialSlipUpFormState(
  defaults?: SlipUpFormDefaults | null
): SlipUpFormState {
  return {
    occurredAt: formatLocalDateTimeInput(),
    mood: defaults?.mood ?? "",
    trigger: defaults?.trigger ?? "",
    alcoholInvolved: defaults?.alcoholInvolved ?? false,
    note: defaults?.note ?? "",
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
  const occurredAt = parseLocalDateTimeInput(form.occurredAt.trim());
  const chapterStartedAt = new Date(activeChapterStartedAt);

  if (!form.occurredAt.trim() || !occurredAt) {
    errors.occurredAt = t("validation.invalidDateTime");
    return {
      ok: false,
      input: null,
      errors,
    };
  }

  if (occurredAt.getTime() > now.getTime() + 60 * 1000) {
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
