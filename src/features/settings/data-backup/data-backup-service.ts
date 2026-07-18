import { File, Paths } from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";

import { dataBackupRepository } from "@/db/repositories/data-backup-repository";
import {
  buildDataBackup,
  parseDataBackupJson,
  type DataBackup,
  type DataBackupValidationReason,
} from "@/features/settings/data-backup/data-backup-schema";
import type { Translator } from "@/i18n/translations";

export class DataBackupSharingUnavailableError extends Error {
  constructor() {
    super("data backup sharing is unavailable");
  }
}

export class DataBackupValidationError extends Error {
  constructor(readonly reason: DataBackupValidationReason) {
    super(`invalid data backup: ${reason}`);
  }
}

function buildBackupFilename(exportedAt: string) {
  return `luma-backup-${exportedAt.replaceAll(":", "-")}.json`;
}

export async function exportDataBackup(t: Translator) {
  const isSharingAvailable = await Sharing.isAvailableAsync();

  if (!isSharingAvailable) {
    throw new DataBackupSharingUnavailableError();
  }

  const exportedAt = new Date().toISOString();
  const data = await dataBackupRepository.exportData();
  const backup = buildDataBackup({
    ...data,
    exportedAt,
  });
  const file = new File(Paths.cache, buildBackupFilename(exportedAt));

  file.create({ overwrite: true });
  file.write(JSON.stringify(backup, null, 2));

  await Sharing.shareAsync(file.uri, {
    UTI: "public.json",
    dialogTitle: t("settings.exportBackup"),
    mimeType: "application/json",
  });

  return file.uri;
}

export async function pickDataBackupForImport(): Promise<DataBackup | null> {
  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
    multiple: false,
    type: ["application/json", "text/json", "text/plain", "*/*"],
  });

  if (result.canceled) {
    return null;
  }

  const asset = result.assets[0];

  if (!asset) {
    throw new DataBackupValidationError("invalid-shape");
  }

  const file = new File(asset.uri);
  const parsed = parseDataBackupJson(await file.text());

  if (!parsed.ok) {
    throw new DataBackupValidationError(parsed.reason);
  }

  return parsed.backup;
}

export async function replaceLocalDataWithBackup(backup: DataBackup) {
  await dataBackupRepository.replaceData(backup);
}
