import * as SQLite from "expo-sqlite";

import { runMigrations } from "@/db/migrations";
import {
  getActiveDatabaseName,
  getStoredDevDataProfile,
} from "@/lib/dev/dev-data-profile";
import { seedDevDatabaseIfNeeded } from "@/lib/dev/dev-database-seed";

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;
let migrationPromise: Promise<void> | null = null;

export function openAppDatabase() {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync(getActiveDatabaseName());
  }

  return databasePromise;
}

export async function getAppDatabase() {
  const db = await openAppDatabase();

  if (!migrationPromise) {
    migrationPromise = runMigrations(db).then(() =>
      seedDevDatabaseIfNeeded(db, getStoredDevDataProfile())
    );
  }

  await migrationPromise;
  return db;
}
