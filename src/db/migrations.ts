import type * as SQLite from "expo-sqlite";

import { schemaStatements } from "@/db/schema";

export async function runMigrations(db: SQLite.SQLiteDatabase) {
  for (const statement of schemaStatements) {
    await db.execAsync(statement);
  }
}
