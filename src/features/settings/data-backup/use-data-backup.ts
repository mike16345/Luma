import { useCallback, useState } from "react";
import { Alert } from "react-native";

import { useBootstrap } from "@/features/app-shell/bootstrap-context";
import {
  DataBackupSharingUnavailableError,
  DataBackupValidationError,
  exportDataBackup,
  pickDataBackupForImport,
  replaceLocalDataWithBackup,
} from "@/features/settings/data-backup/data-backup-service";
import type { DataBackupValidationReason } from "@/features/settings/data-backup/data-backup-schema";
import { useLanguage } from "@/i18n/language-context";

function getValidationMessage(
  reason: DataBackupValidationReason,
  t: ReturnType<typeof useLanguage>["t"]
) {
  switch (reason) {
    case "invalid-json":
      return t("settings.backupInvalidJson");
    case "invalid-shape":
      return t("settings.backupInvalidShape");
    case "multiple-active-chapters":
      return t("settings.backupMultipleActiveChapters");
    case "orphan-slip-up":
      return t("settings.backupOrphanSlipUp");
    case "unsupported-version":
      return t("settings.backupUnsupportedVersion");
  }
}

export function useDataBackup(onImportComplete?: () => Promise<void>) {
  const bootstrap = useBootstrap();
  const { t } = useLanguage();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const exportBackup = useCallback(async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsExporting(true);

    try {
      await exportDataBackup(t);
      setSuccessMessage(t("settings.backupExportReady"));
    } catch (error) {
      setErrorMessage(
        error instanceof DataBackupSharingUnavailableError
          ? t("settings.backupSharingUnavailable")
          : t("settings.backupExportError")
      );
    } finally {
      setIsExporting(false);
    }
  }, [t]);

  const importBackup = useCallback(async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsImporting(true);

    try {
      const backup = await pickDataBackupForImport();

      if (!backup) {
        return;
      }

      Alert.alert(
        t("settings.importBackupConfirmTitle"),
        t("settings.importBackupConfirmMessage"),
        [
          {
            style: "cancel",
            text: t("common.no"),
          },
          {
            style: "destructive",
            text: t("settings.importBackupConfirmAction"),
            onPress: () => {
              setIsImporting(true);
              void replaceLocalDataWithBackup(backup)
                .then(async () => {
                  await Promise.all([
                    bootstrap.refresh(),
                    onImportComplete?.() ?? Promise.resolve(),
                  ]);
                })
                .then(() => {
                  setSuccessMessage(t("settings.backupImportComplete"));
                })
                .catch(() => {
                  setErrorMessage(t("settings.backupImportError"));
                })
                .finally(() => {
                  setIsImporting(false);
                });
            },
          },
        ]
      );
    } catch (error) {
      setErrorMessage(
        error instanceof DataBackupValidationError
          ? getValidationMessage(error.reason, t)
          : t("settings.backupImportError")
      );
    } finally {
      setIsImporting(false);
    }
  }, [bootstrap, onImportComplete, t]);

  return {
    errorMessage,
    exportBackup,
    importBackup,
    isExporting,
    isImporting,
    successMessage,
  };
}
