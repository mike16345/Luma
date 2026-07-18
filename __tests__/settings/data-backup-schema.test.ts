import {
  buildDataBackup,
  parseDataBackupJson,
  validateDataBackup,
} from "@/features/settings/data-backup/data-backup-schema";
import type { ChapterRecord, SlipUpRecord } from "@/types/domain";

function createChapter(overrides: Partial<ChapterRecord> = {}): ChapterRecord {
  return {
    averageCigarettesPerDay: 12,
    createdAt: "2026-07-01T10:00:00.000Z",
    currencyCode: "USD",
    endedAt: null,
    estimatedCigarettesPerPurchase: 20,
    goalAmountMinor: 5000,
    id: "chapter-1",
    purchasePriceMinor: 1200,
    smokingType: "pack",
    startedAt: "2026-07-01T10:00:00.000Z",
    updatedAt: "2026-07-01T10:00:00.000Z",
    ...overrides,
  };
}

function createSlipUp(overrides: Partial<SlipUpRecord> = {}): SlipUpRecord {
  return {
    alcoholInvolved: false,
    chapterId: "chapter-1",
    createdAt: "2026-07-02T10:00:00.000Z",
    id: "slip-up-1",
    mood: "stressed",
    note: null,
    occurredAt: "2026-07-02T10:00:00.000Z",
    trigger: "after dinner",
    ...overrides,
  };
}

describe("data backup schema", () => {
  it("builds a versioned backup with canonical chapter and slip-up data", () => {
    const backup = buildDataBackup({
      chapters: [createChapter()],
      exportedAt: "2026-07-17T12:00:00.000Z",
      slipUps: [createSlipUp()],
    });

    expect(backup).toMatchObject({
      appName: "Luma",
      exportedAt: "2026-07-17T12:00:00.000Z",
      schemaVersion: 1,
      chapters: [{ id: "chapter-1" }],
      slipUps: [{ id: "slip-up-1", chapterId: "chapter-1" }],
    });
  });

  it("accepts valid JSON backup payloads", () => {
    const backup = buildDataBackup({
      chapters: [createChapter({ endedAt: "2026-07-02T10:00:00.000Z" })],
      exportedAt: "2026-07-17T12:00:00.000Z",
      slipUps: [createSlipUp()],
    });

    expect(parseDataBackupJson(JSON.stringify(backup))).toEqual({
      backup,
      ok: true,
    });
  });

  it("rejects backups with more than one active chapter", () => {
    const result = validateDataBackup({
      appName: "Luma",
      exportedAt: "2026-07-17T12:00:00.000Z",
      schemaVersion: 1,
      chapters: [
        createChapter({ id: "chapter-1" }),
        createChapter({ id: "chapter-2" }),
      ],
      slipUps: [],
    });

    expect(result).toEqual({
      ok: false,
      reason: "multiple-active-chapters",
    });
  });

  it("rejects slip-ups that reference missing chapters", () => {
    const result = validateDataBackup({
      appName: "Luma",
      exportedAt: "2026-07-17T12:00:00.000Z",
      schemaVersion: 1,
      chapters: [createChapter({ id: "chapter-1" })],
      slipUps: [createSlipUp({ chapterId: "missing-chapter" })],
    });

    expect(result).toEqual({
      ok: false,
      reason: "orphan-slip-up",
    });
  });
});
