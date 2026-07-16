import { randomUUID } from "expo-crypto";

import { getAppDatabase } from "@/db/client";
import type {
  ChapterRecord,
  CreateChapterInput,
  SmokingType,
  UpdateActiveChapterInput,
} from "@/types/domain";

interface ChapterRow {
  id: string;
  started_at: string;
  ended_at: string | null;
  currency_code: string;
  smoking_type: SmokingType;
  purchase_price_minor: number;
  estimated_cigarettes_per_purchase: number;
  average_cigarettes_per_day: number;
  goal_amount_minor: number | null;
  created_at: string;
  updated_at: string;
}

function mapChapterRow(row: ChapterRow): ChapterRecord {
  return {
    id: row.id,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    currencyCode: row.currency_code,
    smokingType: row.smoking_type,
    purchasePriceMinor: row.purchase_price_minor,
    estimatedCigarettesPerPurchase: row.estimated_cigarettes_per_purchase,
    averageCigarettesPerDay: row.average_cigarettes_per_day,
    goalAmountMinor: row.goal_amount_minor,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const chapterRepository = {
  async getActiveChapter(): Promise<ChapterRecord | null> {
    const db = await getAppDatabase();
    const row = await db.getFirstAsync<ChapterRow>(
      "SELECT * FROM chapters WHERE ended_at IS NULL ORDER BY started_at DESC LIMIT 1"
    );

    return row ? mapChapterRow(row) : null;
  },

  async listChapters(): Promise<ChapterRecord[]> {
    const db = await getAppDatabase();
    const rows = await db.getAllAsync<ChapterRow>(
      "SELECT * FROM chapters ORDER BY started_at DESC"
    );

    return rows.map(mapChapterRow);
  },

  async createChapter(input: CreateChapterInput): Promise<ChapterRecord> {
    const db = await getAppDatabase();
    const activeChapter = await this.getActiveChapter();

    if (activeChapter) {
      throw new Error("active chapter already exists");
    }

    const id = randomUUID();
    const now = new Date().toISOString();

    await db.runAsync(
      `INSERT INTO chapters (
        id,
        started_at,
        ended_at,
        currency_code,
        smoking_type,
        purchase_price_minor,
        estimated_cigarettes_per_purchase,
        average_cigarettes_per_day,
        goal_amount_minor,
        created_at,
        updated_at
      ) VALUES (?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.startedAt,
        input.currencyCode,
        input.smokingType,
        input.purchasePriceMinor,
        input.estimatedCigarettesPerPurchase,
        input.averageCigarettesPerDay,
        input.goalAmountMinor,
        now,
        now,
      ]
    );

    return {
      id,
      endedAt: null,
      createdAt: now,
      updatedAt: now,
      ...input,
    };
  },

  async endChapter(input: { chapterId: string; endedAt: string }) {
    const db = await getAppDatabase();

    await db.runAsync(
      "UPDATE chapters SET ended_at = ?, updated_at = ? WHERE id = ? AND ended_at IS NULL",
      [input.endedAt, new Date().toISOString(), input.chapterId]
    );
  },

  async updateActiveChapter(input: UpdateActiveChapterInput) {
    const activeChapter = await this.getActiveChapter();

    if (!activeChapter) {
      throw new Error("no active chapter");
    }

    const db = await getAppDatabase();
    const updated = {
      startedAt: input.startedAt ?? activeChapter.startedAt,
      currencyCode: input.currencyCode ?? activeChapter.currencyCode,
      smokingType: input.smokingType ?? activeChapter.smokingType,
      purchasePriceMinor:
        input.purchasePriceMinor ?? activeChapter.purchasePriceMinor,
      estimatedCigarettesPerPurchase:
        input.estimatedCigarettesPerPurchase ??
        activeChapter.estimatedCigarettesPerPurchase,
      averageCigarettesPerDay:
        input.averageCigarettesPerDay ?? activeChapter.averageCigarettesPerDay,
      goalAmountMinor:
        "goalAmountMinor" in input
          ? input.goalAmountMinor ?? null
          : activeChapter.goalAmountMinor,
      updatedAt: new Date().toISOString(),
    };

    await db.runAsync(
      `UPDATE chapters
       SET started_at = ?,
           currency_code = ?,
           smoking_type = ?,
           purchase_price_minor = ?,
           estimated_cigarettes_per_purchase = ?,
           average_cigarettes_per_day = ?,
           goal_amount_minor = ?,
           updated_at = ?
       WHERE id = ? AND ended_at IS NULL`,
      [
        updated.startedAt,
        updated.currencyCode,
        updated.smokingType,
        updated.purchasePriceMinor,
        updated.estimatedCigarettesPerPurchase,
        updated.averageCigarettesPerDay,
        updated.goalAmountMinor,
        updated.updatedAt,
        activeChapter.id,
      ]
    );

    return {
      ...activeChapter,
      ...updated,
    };
  },
};
