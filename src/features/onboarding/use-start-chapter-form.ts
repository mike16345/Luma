import { useCallback, useState } from "react";

import {
  createInitialStartChapterFormState,
  parseStartChapterForm,
  type StartChapterField,
  type StartChapterFormErrors,
  type StartChapterFormState,
} from "@/features/onboarding/start-chapter-form-model";
import { createStartChapter } from "@/features/onboarding/start-chapter-service";
import { useLanguage } from "@/i18n/language-context";

export function useStartChapterForm() {
  const { t } = useLanguage();
  const [form, setForm] = useState<StartChapterFormState>(() =>
    createInitialStartChapterFormState()
  );
  const [errors, setErrors] = useState<StartChapterFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback(
    (field: StartChapterField, value: string) => {
      setForm((current) => ({ ...current, [field]: value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
      setSubmitError(null);
    },
    []
  );

  const setSmokingType = useCallback(
    (smokingType: StartChapterFormState["smokingType"]) => {
      setForm((current) => ({ ...current, smokingType }));
      setSubmitError(null);
    },
    []
  );

  const submit = useCallback(async () => {
    const parsed = parseStartChapterForm(form, new Date(), t);

    setErrors(parsed.errors);
    setSubmitError(null);

    if (!parsed.ok) {
      return null;
    }

    setIsSubmitting(true);

    try {
      return await createStartChapter(parsed.input);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error &&
        caughtError.message === "active chapter already exists"
          ? t("validation.activeChapterExists")
          : t("validation.unableToStartChapter");

      setSubmitError(message);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [form, t]);

  return {
    errors,
    form,
    isSubmitting,
    setSmokingType,
    submit,
    submitError,
    updateField,
  };
}
