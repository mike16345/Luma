import { useCallback, useEffect, useState } from "react";

import {
  createChapterSettingsFormState,
  parseChapterSettingsForm,
  type ChapterSettingsField,
  type ChapterSettingsFormErrors,
  type ChapterSettingsFormState,
} from "@/features/settings/chapter-settings-form-model";
import {
  loadSettingsViewModel,
  updateActiveChapterSettings,
} from "@/features/settings/settings-service";
import { useLanguage } from "@/i18n/language-context";
import type { ChapterRecord, SmokingType } from "@/types/domain";

export type ChapterSettingsFormStateModel =
  | {
      status: "loading";
      activeChapter: null;
      form: null;
      errors: ChapterSettingsFormErrors;
      saveError: null;
      saveMessage: null;
      isSaving: false;
      refresh: () => Promise<void>;
      updateField: (field: ChapterSettingsField, value: string) => void;
      setSmokingType: (value: SmokingType) => void;
      save: () => Promise<ChapterRecord | null>;
    }
  | {
      status: "ready";
      activeChapter: ChapterRecord | null;
      form: ChapterSettingsFormState | null;
      errors: ChapterSettingsFormErrors;
      saveError: string | null;
      saveMessage: string | null;
      isSaving: boolean;
      refresh: () => Promise<void>;
      updateField: (field: ChapterSettingsField, value: string) => void;
      setSmokingType: (value: SmokingType) => void;
      save: () => Promise<ChapterRecord | null>;
    }
  | {
      status: "error";
      activeChapter: null;
      form: null;
      errors: ChapterSettingsFormErrors;
      saveError: Error;
      saveMessage: null;
      isSaving: false;
      refresh: () => Promise<void>;
      updateField: (field: ChapterSettingsField, value: string) => void;
      setSmokingType: (value: SmokingType) => void;
      save: () => Promise<ChapterRecord | null>;
    };

export function useChapterSettingsForm(): ChapterSettingsFormStateModel {
  const { t } = useLanguage();
  const [activeChapter, setActiveChapter] = useState<ChapterRecord | null>(null);
  const [form, setForm] = useState<ChapterSettingsFormState | null>(null);
  const [errors, setErrors] = useState<ChapterSettingsFormErrors>({});
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
    setSaveMessage(null);

    try {
      const data = await loadSettingsViewModel();
      setActiveChapter(data.activeChapter);
      setForm(
        data.activeChapter
          ? createChapterSettingsFormState(data.activeChapter)
          : null
      );
      setErrors({});
    } catch (caughtError) {
      setActiveChapter(null);
      setForm(null);
      setLoadError(
        caughtError instanceof Error
          ? caughtError
          : new Error(t("validation.unableToLoadSettings"))
      );
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }, [t]);

  const refresh = useCallback(() => load(true), [load]);

  const updateField = useCallback(
    (field: ChapterSettingsField, value: string) => {
      setForm((currentForm) =>
        currentForm ? { ...currentForm, [field]: value } : currentForm
      );
      setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
      setSaveError(null);
      setSaveMessage(null);
    },
    []
  );

  const setSmokingType = useCallback((value: SmokingType) => {
    setForm((currentForm) =>
      currentForm ? { ...currentForm, smokingType: value } : currentForm
    );
    setSaveError(null);
    setSaveMessage(null);
  }, []);

  const save = useCallback(async () => {
    if (!form) {
      return null;
    }

    const parsed = parseChapterSettingsForm(form, new Date(), t);
    setErrors(parsed.errors);
    setSaveError(null);
    setSaveMessage(null);

    if (!parsed.ok) {
      return null;
    }

    setIsSaving(true);

    try {
      const chapter = await updateActiveChapterSettings(parsed.input);
      setActiveChapter(chapter);
      setForm(createChapterSettingsFormState(chapter));
      setSaveMessage(t("validation.currentChapterUpdated"));
      return chapter;
    } catch (caughtError) {
      setSaveError(
        caughtError instanceof Error
          ? caughtError.message
          : t("validation.unableToUpdateSettings")
      );
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [form, t]);

  useEffect(() => {
    void load(true);
  }, [load]);

  const commonActions = {
    errors,
    refresh,
    updateField,
    setSmokingType,
    save,
  };

  if (isLoading) {
    return {
      status: "loading",
      activeChapter: null,
      form: null,
      saveError: null,
      saveMessage: null,
      isSaving: false,
      ...commonActions,
    };
  }

  if (loadError) {
    return {
      status: "error",
      activeChapter: null,
      form: null,
      saveError: loadError,
      saveMessage: null,
      isSaving: false,
      ...commonActions,
    };
  }

  return {
    status: "ready",
    activeChapter,
    form,
    saveError,
    saveMessage,
    isSaving,
    ...commonActions,
  };
}
