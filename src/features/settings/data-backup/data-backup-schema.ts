import type { ChapterRecord, SlipUpRecord, SmokingType } from "@/types/domain";

export const dataBackupSchemaVersion = 1;

export type DataBackupValidationReason =
  | "invalid-json"
  | "invalid-shape"
  | "multiple-active-chapters"
  | "orphan-slip-up"
  | "unsupported-version";

export type DataBackup = {
  appName: "Luma";
  chapters: ChapterRecord[];
  exportedAt: string;
  schemaVersion: typeof dataBackupSchemaVersion;
  slipUps: SlipUpRecord[];
};

export type DataBackupValidationResult =
  | {
      backup: DataBackup;
      ok: true;
    }
  | {
      ok: false;
      reason: DataBackupValidationReason;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isSmokingType(value: unknown): value is SmokingType {
  return value === "pack" || value === "roll-your-own";
}

function isPositiveNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function isPositiveIntegerOrNull(value: unknown) {
  return value === null || (Number.isInteger(value) && Number(value) > 0);
}

function isChapterRecord(value: unknown): value is ChapterRecord {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    isIsoDate(value.startedAt) &&
    (value.endedAt === null || isIsoDate(value.endedAt)) &&
    typeof value.currencyCode === "string" &&
    isSmokingType(value.smokingType) &&
    isPositiveNumber(value.purchasePriceMinor) &&
    isPositiveNumber(value.estimatedCigarettesPerPurchase) &&
    isPositiveNumber(value.averageCigarettesPerDay) &&
    isPositiveIntegerOrNull(value.goalAmountMinor) &&
    isIsoDate(value.createdAt) &&
    isIsoDate(value.updatedAt)
  );
}

function isSlipUpRecord(value: unknown): value is SlipUpRecord {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.chapterId === "string" &&
    isIsoDate(value.occurredAt) &&
    isNullableString(value.mood) &&
    isNullableString(value.trigger) &&
    typeof value.alcoholInvolved === "boolean" &&
    isNullableString(value.note) &&
    isIsoDate(value.createdAt)
  );
}

export function buildDataBackup({
  chapters,
  exportedAt,
  slipUps,
}: {
  chapters: ChapterRecord[];
  exportedAt: string;
  slipUps: SlipUpRecord[];
}): DataBackup {
  return {
    appName: "Luma",
    chapters,
    exportedAt,
    schemaVersion: dataBackupSchemaVersion,
    slipUps,
  };
}

export function validateDataBackup(
  value: unknown
): DataBackupValidationResult {
  if (!isRecord(value)) {
    return {
      ok: false,
      reason: "invalid-shape",
    };
  }

  if (value.schemaVersion !== dataBackupSchemaVersion) {
    return {
      ok: false,
      reason: "unsupported-version",
    };
  }

  if (
    value.appName !== "Luma" ||
    !isIsoDate(value.exportedAt) ||
    !Array.isArray(value.chapters) ||
    !Array.isArray(value.slipUps) ||
    !value.chapters.every(isChapterRecord) ||
    !value.slipUps.every(isSlipUpRecord)
  ) {
    return {
      ok: false,
      reason: "invalid-shape",
    };
  }

  if (value.chapters.filter((chapter) => chapter.endedAt === null).length > 1) {
    return {
      ok: false,
      reason: "multiple-active-chapters",
    };
  }

  const chapterIds = new Set(value.chapters.map((chapter) => chapter.id));

  if (value.slipUps.some((slipUp) => !chapterIds.has(slipUp.chapterId))) {
    return {
      ok: false,
      reason: "orphan-slip-up",
    };
  }

  return {
    backup: value as DataBackup,
    ok: true,
  };
}

export function parseDataBackupJson(json: string): DataBackupValidationResult {
  try {
    return validateDataBackup(JSON.parse(json));
  } catch {
    return {
      ok: false,
      reason: "invalid-json",
    };
  }
}
