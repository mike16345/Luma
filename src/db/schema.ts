export const chapterTableSql = `
  CREATE TABLE IF NOT EXISTS chapters (
    id TEXT PRIMARY KEY NOT NULL,
    started_at TEXT NOT NULL,
    ended_at TEXT,
    currency_code TEXT NOT NULL,
    smoking_type TEXT NOT NULL CHECK (smoking_type IN ('pack', 'roll-your-own')),
    purchase_price_minor INTEGER NOT NULL CHECK (purchase_price_minor > 0),
    estimated_cigarettes_per_purchase REAL NOT NULL CHECK (estimated_cigarettes_per_purchase > 0),
    average_cigarettes_per_day REAL NOT NULL CHECK (average_cigarettes_per_day > 0),
    goal_amount_minor INTEGER CHECK (goal_amount_minor IS NULL OR goal_amount_minor > 0),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`;

export const activeChapterIndexSql = `
  CREATE UNIQUE INDEX IF NOT EXISTS one_active_chapter
  ON chapters ((ended_at IS NULL))
  WHERE ended_at IS NULL;
`;

export const slipUpTableSql = `
  CREATE TABLE IF NOT EXISTS slip_ups (
    id TEXT PRIMARY KEY NOT NULL,
    chapter_id TEXT NOT NULL,
    occurred_at TEXT NOT NULL,
    mood TEXT,
    trigger_text TEXT,
    alcohol_involved INTEGER NOT NULL CHECK (alcohol_involved IN (0, 1)),
    note TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (chapter_id) REFERENCES chapters(id)
  );
`;

export const schemaStatements = [
  chapterTableSql,
  activeChapterIndexSql,
  slipUpTableSql,
] as const;
