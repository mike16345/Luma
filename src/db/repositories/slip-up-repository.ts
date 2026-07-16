import { randomUUID } from "expo-crypto";

import { getAppDatabase } from "@/db/client";
import type { CreateSlipUpInput, SlipUpRecord } from "@/types/domain";

interface SlipUpRow {
  id: string;
  chapter_id: string;
  occurred_at: string;
  mood: string | null;
  trigger_text: string | null;
  alcohol_involved: 0 | 1;
  note: string | null;
  created_at: string;
}

function mapSlipUpRow(row: SlipUpRow): SlipUpRecord {
  return {
    id: row.id,
    chapterId: row.chapter_id,
    occurredAt: row.occurred_at,
    mood: row.mood,
    trigger: row.trigger_text,
    alcoholInvolved: row.alcohol_involved === 1,
    note: row.note,
    createdAt: row.created_at,
  };
}

export const slipUpRepository = {
  async createSlipUp(input: CreateSlipUpInput): Promise<SlipUpRecord> {
    const db = await getAppDatabase();
    const id = randomUUID();
    const createdAt = new Date().toISOString();

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
        id,
        input.chapterId,
        input.occurredAt,
        input.mood,
        input.trigger,
        input.alcoholInvolved ? 1 : 0,
        input.note,
        createdAt,
      ]
    );

    return {
      id,
      createdAt,
      ...input,
    };
  },

  async listSlipUps(): Promise<SlipUpRecord[]> {
    const db = await getAppDatabase();
    const rows = await db.getAllAsync<SlipUpRow>(
      "SELECT * FROM slip_ups ORDER BY occurred_at DESC"
    );

    return rows.map(mapSlipUpRow);
  },
};
