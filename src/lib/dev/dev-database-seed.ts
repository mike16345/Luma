import type { DevDataProfile } from "@/lib/dev/dev-data-profile";

const HISTORY_PROFILE_SEED_KEY = "luma.dev.history.seed.v1";

type SeedDatabase = {
  getFirstAsync<T>(statement: string, params: any): Promise<T | null>;
  runAsync(statement: string, params: any[]): Promise<unknown>;
};

export async function seedDevDatabaseIfNeeded(
  db: SeedDatabase,
  profile: DevDataProfile
) {
  if (typeof __DEV__ === "undefined" || !__DEV__ || profile !== "history") {
    return;
  }

  const seeded = await db.getFirstAsync<{ id: string }>(
    "SELECT id FROM chapters WHERE id = ? LIMIT 1",
    [HISTORY_PROFILE_SEED_KEY]
  );

  if (seeded) {
    return;
  }

  const createdAt = "2026-07-17T08:00:00.000Z";

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
      HISTORY_PROFILE_SEED_KEY,
      "2026-06-03T07:30:00.000Z",
      "2026-06-18T19:15:00.000Z",
      "ILS",
      "pack",
      4200,
      20,
      12,
      120000,
      createdAt,
      createdAt,
    ]
  );

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
      "luma.dev.history.chapter.two",
      "2026-06-21T06:45:00.000Z",
      "2026-07-02T21:40:00.000Z",
      "ILS",
      "pack",
      4200,
      20,
      10,
      90000,
      createdAt,
      createdAt,
    ]
  );

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
      "luma.dev.history.chapter.active",
      "2026-07-08T08:00:00.000Z",
      "ILS",
      "pack",
      4200,
      20,
      8,
      100000,
      createdAt,
      createdAt,
    ]
  );

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
      "luma.dev.history.slip.one",
      HISTORY_PROFILE_SEED_KEY,
      "2026-06-18T19:15:00.000Z",
      "stressed",
      "after dinner",
      0,
      "Wanted a familiar routine after a long day.",
      createdAt,
    ]
  );

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
      "luma.dev.history.slip.two",
      "luma.dev.history.chapter.two",
      "2026-07-02T21:40:00.000Z",
      "restless",
      "social setting",
      1,
      "Logged for insights testing.",
      createdAt,
    ]
  );
}
