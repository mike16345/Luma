import { getAppDatabase } from "@/db/client";
import type { ChapterRecord, SlipUpRecord } from "@/types/domain";

type ChapterBackupRow = {
  average_cigarettes_per_day: number;
  created_at: string;
  currency_code: string;
  ended_at: string | null;
  estimated_cigarettes_per_purchase: number;
  goal_amount_minor: number | null;
  id: string;
  purchase_price_minor: number;
  smoking_type: ChapterRecord["smokingType"];
  started_at: string;
  updated_at: string;
};

type SlipUpBackupRow = {
  alcohol_involved: 0 | 1;
  chapter_id: string;
  created_at: string;
  id: string;
  mood: string | null;
  note: string | null;
  occurred_at: string;
  trigger_text: string | null;
};

function mapChapterRow(row: ChapterBackupRow): ChapterRecord {
  return {
    averageCigarettesPerDay: row.average_cigarettes_per_day,
    createdAt: row.created_at,
    currencyCode: row.currency_code,
    endedAt: row.ended_at,
    estimatedCigarettesPerPurchase: row.estimated_cigarettes_per_purchase,
    goalAmountMinor: row.goal_amount_minor,
    id: row.id,
    purchasePriceMinor: row.purchase_price_minor,
    smokingType: row.smoking_type,
    startedAt: row.started_at,
    updatedAt: row.updated_at,
  };
}

function mapSlipUpRow(row: SlipUpBackupRow): SlipUpRecord {
  return {
    alcoholInvolved: row.alcohol_involved === 1,
    chapterId: row.chapter_id,
    createdAt: row.created_at,
    id: row.id,
    mood: row.mood,
    note: row.note,
    occurredAt: row.occurred_at,
    trigger: row.trigger_text,
  };
}

export const dataBackupRepository = {
  async exportData() {
    const db = await getAppDatabase();
    const [chapterRows, slipUpRows] = await Promise.all([
      db.getAllAsync<ChapterBackupRow>(
        "SELECT * FROM chapters ORDER BY started_at DESC"
      ),
      db.getAllAsync<SlipUpBackupRow>(
        "SELECT * FROM slip_ups ORDER BY occurred_at DESC"
      ),
    ]);

    return {
      chapters: chapterRows.map(mapChapterRow),
      slipUps: slipUpRows.map(mapSlipUpRow),
    };
  },

  async replaceData(backup: {
    chapters: ChapterRecord[];
    slipUps: SlipUpRecord[];
  }) {
    const db = await getAppDatabase();

    await db.withTransactionAsync(async () => {
      await db.runAsync("DELETE FROM slip_ups");
      await db.runAsync("DELETE FROM chapters");

      for (const chapter of backup.chapters) {
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
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            chapter.id,
            chapter.startedAt,
            chapter.endedAt,
            chapter.currencyCode,
            chapter.smokingType,
            chapter.purchasePriceMinor,
            chapter.estimatedCigarettesPerPurchase,
            chapter.averageCigarettesPerDay,
            chapter.goalAmountMinor,
            chapter.createdAt,
            chapter.updatedAt,
          ]
        );
      }

      for (const slipUp of backup.slipUps) {
        await db.runAsync(
          `INSERT INTO slip_ups (
            id,
            chapter_id,
            occurred_at,
            mood,
            trigger_text,
            alcohol_involved,
            note,
            created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            slipUp.id,
            slipUp.chapterId,
            slipUp.occurredAt,
            slipUp.mood,
            slipUp.trigger,
            slipUp.alcoholInvolved ? 1 : 0,
            slipUp.note,
            slipUp.createdAt,
          ]
        );
      }
    });
  },
};
