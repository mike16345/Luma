import { useCallback, useEffect, useState } from "react";

import {
  createInitialSlipUpFormState,
  parseSlipUpForm,
  type SlipUpField,
  type SlipUpFormErrors,
  type SlipUpFormState,
} from "@/features/slip-up/slip-up-form-model";
import {
  loadSlipUpViewModel,
  logSlipUpAndEndChapter,
} from "@/features/slip-up/slip-up-service";
import type { ChapterRecord, SlipUpRecord } from "@/types/domain";

export type SlipUpFormStateModel =
  | {
      status: "loading";
      activeChapter: null;
      form: SlipUpFormState;
      errors: SlipUpFormErrors;
      submitError: null;
      isSubmitting: false;
      refresh: () => Promise<void>;
      updateField: (field: SlipUpField, value: string | boolean) => void;
      submit: () => Promise<SlipUpRecord | null>;
    }
  | {
      status: "ready";
      activeChapter: ChapterRecord | null;
      form: SlipUpFormState;
      errors: SlipUpFormErrors;
      submitError: string | null;
      isSubmitting: boolean;
      refresh: () => Promise<void>;
      updateField: (field: SlipUpField, value: string | boolean) => void;
      submit: () => Promise<SlipUpRecord | null>;
    }
  | {
      status: "error";
      activeChapter: null;
      form: SlipUpFormState;
      errors: SlipUpFormErrors;
      submitError: Error;
      isSubmitting: false;
      refresh: () => Promise<void>;
      updateField: (field: SlipUpField, value: string | boolean) => void;
      submit: () => Promise<SlipUpRecord | null>;
    };

export function useSlipUpForm(): SlipUpFormStateModel {
  const [activeChapter, setActiveChapter] = useState<ChapterRecord | null>(null);
  const [form, setForm] = useState<SlipUpFormState>(
    createInitialSlipUpFormState
  );
  const [errors, setErrors] = useState<SlipUpFormErrors>({});
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = useCallback(async (showLoading: boolean) => {
    if (showLoading) {
      setIsLoading(true);
    }

    setLoadError(null);
    setSubmitError(null);

    try {
      const data = await loadSlipUpViewModel();
      setActiveChapter(data.activeChapter);
    } catch (caughtError) {
      setActiveChapter(null);
      setLoadError(
        caughtError instanceof Error
          ? caughtError
          : new Error("Unable to load slip-up flow")
      );
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }, []);

  const refresh = useCallback(() => load(true), [load]);

  const updateField = useCallback(
    (field: SlipUpField, value: string | boolean) => {
      setForm((current) => ({ ...current, [field]: value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
      setSubmitError(null);
    },
    []
  );

  const submit = useCallback(async () => {
    if (!activeChapter) {
      setSubmitError("There is no active chapter to close.");
      return null;
    }

    const parsed = parseSlipUpForm(form, activeChapter.startedAt);
    setErrors(parsed.errors);
    setSubmitError(null);

    if (!parsed.ok) {
      return null;
    }

    setIsSubmitting(true);

    try {
      return await logSlipUpAndEndChapter(parsed.input);
    } catch (caughtError) {
      setSubmitError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to log this slip-up right now."
      );
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [activeChapter, form]);

  useEffect(() => {
    void load(true);
  }, [load]);

  const commonActions = {
    form,
    errors,
    refresh,
    updateField,
    submit,
  };

  if (isLoading) {
    return {
      status: "loading",
      activeChapter: null,
      submitError: null,
      isSubmitting: false,
      ...commonActions,
    };
  }

  if (loadError) {
    return {
      status: "error",
      activeChapter: null,
      submitError: loadError,
      isSubmitting: false,
      ...commonActions,
    };
  }

  return {
    status: "ready",
    activeChapter,
    submitError,
    isSubmitting,
    ...commonActions,
  };
}
