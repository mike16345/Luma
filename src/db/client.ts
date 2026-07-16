import * as SQLite from "expo-sqlite";

import { runMigrations } from "@/db/migrations";

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;
let migrationPromise: Promise<void> | null = null;

export function openAppDatabase() {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync("luma.db");
  }

  return databasePromise;
}

export async function getAppDatabase() {
  const db = await openAppDatabase();

  if (!migrationPromise) {
    migrationPromise = runMigrations(db);
  }

  await migrationPromise;
  return db;
}
