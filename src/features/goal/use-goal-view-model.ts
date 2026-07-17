import { useCallback, useEffect, useState } from "react";

import {
  formatGoalAmountMajor,
  parseGoalForm,
  type GoalFormErrors,
  type GoalFormState,
} from "@/features/goal/goal-form-model";
import {
  loadGoalViewModel,
  updateChapterGoal,
} from "@/features/goal/goal-service";
import type { GoalViewModel } from "@/features/goal/goal-selectors";
import { useLanguage } from "@/i18n/language-context";

export type GoalViewModelState =
  | {
      status: "loading";
      data: null;
      form: GoalFormState;
      errors: GoalFormErrors;
      saveError: null;
      saveMessage: null;
      isSaving: false;
      refresh: () => Promise<void>;
      updateGoalAmount: (value: string) => void;
      save: () => Promise<void>;
    }
  | {
      status: "ready";
      data: GoalViewModel;
      form: GoalFormState;
      errors: GoalFormErrors;
      saveError: string | null;
      saveMessage: string | null;
      isSaving: boolean;
      refresh: () => Promise<void>;
      updateGoalAmount: (value: string) => void;
      save: () => Promise<void>;
    }
  | {
      status: "error";
      data: null;
      form: GoalFormState;
      errors: GoalFormErrors;
      saveError: Error;
      saveMessage: null;
      isSaving: false;
      refresh: () => Promise<void>;
      updateGoalAmount: (value: string) => void;
      save: () => Promise<void>;
    };

const emptyForm: GoalFormState = {
  goalAmountMajor: "",
};

export function useGoalViewModel(): GoalViewModelState {
  const { t } = useLanguage();
  const [data, setData] = useState<GoalViewModel | null>(null);
  const [form, setForm] = useState<GoalFormState>(emptyForm);
  const [errors, setErrors] = useState<GoalFormErrors>({});
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(async (showLoading: boolean) => {
    if (showLoading) {
      setIsLoading(true);
    }

    setLoadError(null);
    setSaveError(null);

    try {
      const nextData = await loadGoalViewModel();
      setData(nextData);
      setForm({
        goalAmountMajor: formatGoalAmountMajor(
          nextData.currentGoalAmountMinor
        ),
      });
      setErrors({});
    } catch (caughtError) {
      setData(null);
      setLoadError(
        caughtError instanceof Error
          ? caughtError
          : new Error(t("validation.unableToLoadGoal"))
      );
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }, [t]);

  const refresh = useCallback(() => load(true), [load]);

  const updateGoalAmount = useCallback((value: string) => {
    setForm({ goalAmountMajor: value });
    setErrors({});
    setSaveError(null);
    setSaveMessage(null);
  }, []);

  const save = useCallback(async () => {
    const parsed = parseGoalForm(form, t);
    setErrors(parsed.errors);
    setSaveError(null);
    setSaveMessage(null);

    if (!parsed.ok) {
      return;
    }

    setIsSaving(true);

    try {
      await updateChapterGoal(parsed.goalAmountMinor);
      const nextData = await loadGoalViewModel();
      setData(nextData);
      setForm({
        goalAmountMajor: formatGoalAmountMajor(
          nextData.currentGoalAmountMinor
        ),
      });
      setSaveMessage(
        parsed.goalAmountMinor === null
          ? t("validation.goalRemoved")
          : t("validation.goalUpdated")
      );
    } catch (caughtError) {
      setSaveError(
        caughtError instanceof Error
          ? caughtError.message
          : t("validation.unableToUpdateGoal")
      );
    } finally {
      setIsSaving(false);
    }
  }, [form, t]);

  useEffect(() => {
    void load(true);
  }, [load]);

  const commonActions = {
    form,
    errors,
    refresh,
    updateGoalAmount,
    save,
  };

  if (isLoading) {
    return {
      status: "loading",
      data: null,
      saveError: null,
      saveMessage: null,
      isSaving: false,
      ...commonActions,
    };
  }

  if (loadError) {
    return {
      status: "error",
      data: null,
      saveError: loadError,
      saveMessage: null,
      isSaving: false,
      ...commonActions,
    };
  }

  return {
    status: "ready",
    data: data as GoalViewModel,
    saveError,
    saveMessage,
    isSaving,
    ...commonActions,
  };
}
