# Luma MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved Luma MVP as a local-first Expo mobile app with honest chapter-based quit tracking, slip-up logging, history, insights, and a per-chapter savings goal.

**Architecture:** The app uses Expo Router for navigation, SQLite as the canonical local data store, pure domain calculation modules for all smoke-free and savings logic, and thin route files that compose feature modules from `src/`. Business rules remain isolated from UI so calculation logic, history behavior, and insights summaries can be tested independently of navigation and rendering.

**Tech Stack:** Expo SDK 57, TypeScript strict mode, Expo Router, `expo-sqlite`, `expo-sqlite/localStorage/install`, `expo-secure-store` (only if sensitive storage is later introduced), `react-native-safe-area-context`, `react-native-reanimated`, `react-native-gesture-handler`, `expo-haptics`, `jest-expo`, `@testing-library/react-native`.

## Global Constraints

- One active chapter at a time.
- Any smoked cigarette ends the current chapter.
- Past chapters are immutable.
- Current chapter inputs may be corrected, and only the current chapter recalculates.
- Core metrics are smoke-free time, cigarettes avoided, and money saved.
- Money and cigarette outputs must be communicated as estimates.
- Supported progress periods are today, this week, this month, this year, and all time.
- One active savings goal exists per chapter.
- Goal progress resets with each new chapter.
- Cumulative savings persists across chapters.
- Use user-facing terms `chapter`, `slip-up`, and `smoke-free time`.
- Do not add notifications, reduction coaching, medical/body claims, future projections, AI interpretation, custom date ranges, grams-based calculations, cloud sync, or social features.
- The `app/` directory contains routes and route layouts only.
- Use `npx create-expo-app@latest . --template default@sdk-57` for project creation.
- Use `npx expo install` for Expo-managed or native dependencies.
- Canonical persisted data belongs in `expo-sqlite`; tiny non-sensitive preferences may use `expo-sqlite/localStorage/install`.
- Tests must live outside the `app/` directory.

---

## Proposed file structure

```text
app/
  _layout.tsx
  (tabs)/
    _layout.tsx
    index.tsx
    history.tsx
    insights.tsx
    settings.tsx
  goal.tsx
  onboarding/index.tsx
  slip-up/index.tsx
  restart/index.tsx
src/
  components/
    ui/
      screen.tsx
      metric-card.tsx
      section-card.tsx
      empty-state.tsx
  db/
    client.ts
    migrations.ts
    schema.ts
    repositories/
      chapter-repository.ts
      slip-up-repository.ts
  features/
    app-shell/
      use-bootstrap-state.ts
    onboarding/
      onboarding-form.tsx
      onboarding-service.ts
    home/
      home-screen.tsx
      home-selectors.ts
    goal/
      goal-screen.tsx
      goal-service.ts
    history/
      history-screen.tsx
      history-selectors.ts
    insights/
      insights-screen.tsx
      insights-selectors.ts
    settings/
      settings-screen.tsx
      chapter-settings-form.tsx
    slip-up/
      slip-up-form.tsx
      slip-up-service.ts
      restart-form.tsx
  lib/
    calculations/
      chapter-metrics.ts
      period-metrics.ts
      streaks.ts
      insights.ts
    dates/
      calendar-periods.ts
    formatting/
      currency.ts
      duration.ts
      estimates.ts
    storage/
      local-preferences.ts
  theme/
    colors.ts
    spacing.ts
    typography.ts
  types/
    domain.ts
    forms.ts
src/test/
  render-router.tsx
__tests__/
  routing/
    root-layout.test.tsx
  calculations/
    chapter-metrics.test.ts
    period-metrics.test.ts
    streaks.test.ts
    insights.test.ts
  repositories/
    chapter-repository.test.ts
```

## Task 1: Scaffold the Expo SDK 57 app and establish route/layout boundaries

**Files:**
- Create: `package.json`
- Create: `app.json`
- Create: `babel.config.js`
- Create: `tsconfig.json`
- Create: `app/_layout.tsx`
- Create: `app/(tabs)/_layout.tsx`
- Create: `app/(tabs)/index.tsx`
- Create: `app/(tabs)/history.tsx`
- Create: `app/(tabs)/insights.tsx`
- Create: `app/(tabs)/settings.tsx`
- Create: `app/goal.tsx`
- Create: `app/onboarding/index.tsx`
- Create: `app/slip-up/index.tsx`
- Create: `app/restart/index.tsx`
- Create: `src/components/ui/screen.tsx`
- Create: `src/theme/colors.ts`
- Create: `src/theme/spacing.ts`
- Create: `src/theme/typography.ts`
- Create: `src/test/render-router.tsx`
- Create: `__tests__/routing/root-layout.test.tsx`
- Modify: `AGENTS.md`

**Interfaces:**
- Consumes: none
- Produces:
  - route tree rooted at `app/_layout.tsx`
  - main tab group `(tabs)` with `index`, `history`, `insights`, `settings`
  - secondary routes `goal`, `onboarding/index`, `slip-up/index`, `restart/index`
  - shared `Screen` wrapper component exported from `src/components/ui/screen.tsx`

- [ ] **Step 1: Scaffold the Expo app with the approved baseline**

Run:

```bash
npx create-expo-app@latest . --template default@sdk-57
npx expo install expo-router expo-sqlite expo-secure-store expo-haptics expo-crypto react-native-reanimated react-native-safe-area-context react-native-gesture-handler
npx expo install @testing-library/react-native --dev
```

Expected:

- Expo SDK 57 project files exist at the repo root
- `expo-router` is installed and configured
- all Expo-managed packages resolve to SDK-compatible versions

- [ ] **Step 2: Write the failing route smoke test**

Create `__tests__/routing/root-layout.test.tsx`:

```tsx
import { screen } from "@testing-library/react-native";
import { renderRouter } from "expo-router/testing-library";

describe("root route shell", () => {
  it("renders the Home tab placeholder", () => {
    renderRouter("./app", { initialUrl: "/" });

    expect(screen.getByText("Home")).toBeTruthy();
  });
});
```

Run:

```bash
npx jest __tests__/routing/root-layout.test.tsx --runInBand
```

Expected: FAIL because the route tree and visible placeholder copy do not exist yet.

- [ ] **Step 3: Implement the route shell and shared screen primitive**

Create `src/components/ui/screen.tsx`:

```tsx
import { PropsWithChildren } from "react";
import { ScrollView } from "react-native";

export function Screen({ children }: PropsWithChildren) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ flexGrow: 1, padding: 20, gap: 16 }}
    >
      {children}
    </ScrollView>
  );
}
```

Create `app/_layout.tsx`:

```tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="goal" options={{ title: "Goal" }} />
      <Stack.Screen name="onboarding/index" options={{ title: "Start" }} />
      <Stack.Screen
        name="slip-up/index"
        options={{ title: "Log slip-up", presentation: "modal" }}
      />
      <Stack.Screen
        name="restart/index"
        options={{ title: "New chapter", presentation: "modal" }}
      />
    </Stack>
  );
}
```

Create `app/(tabs)/_layout.tsx`:

```tsx
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="history" options={{ title: "History" }} />
      <Tabs.Screen name="insights" options={{ title: "Insights" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
```

Create one placeholder route file, then mirror it for the rest:

```tsx
import { Text } from "react-native";
import { Screen } from "@/components/ui/screen";

export default function HomeRoute() {
  return (
    <Screen>
      <Text>Home</Text>
    </Screen>
  );
}
```

- [ ] **Step 4: Configure path aliases and Jest preset**

Add this to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

Add this to `package.json`:

```json
{
  "jest": {
    "preset": "jest-expo"
  }
}
```

- [ ] **Step 5: Run the shell test and app checks**

Run:

```bash
npx jest __tests__/routing/root-layout.test.tsx --runInBand
npx expo start --offline --clear
```

Expected:

- Jest PASS for the smoke test
- Expo dev server starts without route-resolution errors

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "chore: scaffold expo app shell"
```

## Task 2: Build the local-first persistence layer with SQLite repositories

**Files:**
- Create: `src/types/domain.ts`
- Create: `src/db/client.ts`
- Create: `src/db/schema.ts`
- Create: `src/db/migrations.ts`
- Create: `src/db/repositories/chapter-repository.ts`
- Create: `src/db/repositories/slip-up-repository.ts`
- Create: `src/lib/storage/local-preferences.ts`
- Create: `__tests__/repositories/chapter-repository.test.ts`
- Modify: `app/_layout.tsx`

**Interfaces:**
- Consumes:
  - route shell from Task 1
- Produces:
  - `openAppDatabase(): Promise<SQLite.SQLiteDatabase>`
  - `runMigrations(db: SQLite.SQLiteDatabase): Promise<void>`
  - `chapterRepository` with `getActiveChapter()`, `createChapter(input)`, `endChapter(input)`, `listChapters()`, `updateActiveChapter(input)`
  - `slipUpRepository` with `createSlipUp(input)`, `listSlipUps()`
  - `preferencesStorage` wrapper for tiny non-sensitive values only

- [ ] **Step 1: Write repository contract tests**

Create `__tests__/repositories/chapter-repository.test.ts`:

```ts
import { chapterRepository } from "@/db/repositories/chapter-repository";

describe("chapterRepository", () => {
  it("allows only one active chapter at a time", async () => {
    await chapterRepository.createChapter({
      startedAt: "2026-07-15T10:00:00.000Z",
      currencyCode: "ILS",
      smokingType: "pack",
      purchasePriceMinor: 4000,
      estimatedCigarettesPerPurchase: 20,
      averageCigarettesPerDay: 10,
      goalAmountMinor: 100000,
    });

    await expect(
      chapterRepository.createChapter({
        startedAt: "2026-07-15T11:00:00.000Z",
        currencyCode: "ILS",
        smokingType: "pack",
        purchasePriceMinor: 4000,
        estimatedCigarettesPerPurchase: 20,
        averageCigarettesPerDay: 10,
        goalAmountMinor: null,
      })
    ).rejects.toThrow("active chapter already exists");
  });
});
```

Run:

```bash
npx jest __tests__/repositories/chapter-repository.test.ts --runInBand
```

Expected: FAIL because the repository and schema do not exist yet.

- [ ] **Step 2: Define the domain types and schema**

Create `src/types/domain.ts`:

```ts
export type SmokingType = "pack" | "roll-your-own";

export interface ChapterRecord {
  id: string;
  startedAt: string;
  endedAt: string | null;
  currencyCode: string;
  smokingType: SmokingType;
  purchasePriceMinor: number;
  estimatedCigarettesPerPurchase: number;
  averageCigarettesPerDay: number;
  goalAmountMinor: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface SlipUpRecord {
  id: string;
  chapterId: string;
  occurredAt: string;
  mood: string | null;
  trigger: string | null;
  alcoholInvolved: boolean;
  note: string | null;
  createdAt: string;
}
```

Create `src/db/schema.ts`:

```ts
export const chapterTableSql = `
  CREATE TABLE IF NOT EXISTS chapters (
    id TEXT PRIMARY KEY NOT NULL,
    started_at TEXT NOT NULL,
    ended_at TEXT,
    currency_code TEXT NOT NULL,
    smoking_type TEXT NOT NULL,
    purchase_price_minor INTEGER NOT NULL,
    estimated_cigarettes_per_purchase REAL NOT NULL,
    average_cigarettes_per_day REAL NOT NULL,
    goal_amount_minor INTEGER,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`;

export const slipUpTableSql = `
  CREATE TABLE IF NOT EXISTS slip_ups (
    id TEXT PRIMARY KEY NOT NULL,
    chapter_id TEXT NOT NULL,
    occurred_at TEXT NOT NULL,
    mood TEXT,
    trigger_text TEXT,
    alcohol_involved INTEGER NOT NULL,
    note TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (chapter_id) REFERENCES chapters(id)
  );
`;
```

- [ ] **Step 3: Implement the database client and repositories**

Create `src/db/client.ts`:

```ts
import * as SQLite from "expo-sqlite";

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function openAppDatabase() {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync("luma.db");
  }

  return databasePromise;
}
```

Create `src/db/migrations.ts`:

```ts
import type * as SQLite from "expo-sqlite";
import { chapterTableSql, slipUpTableSql } from "@/db/schema";

export async function runMigrations(db: SQLite.SQLiteDatabase) {
  await db.execAsync(chapterTableSql);
  await db.execAsync(slipUpTableSql);
}
```

Create `src/db/repositories/chapter-repository.ts`:

```ts
import { randomUUID } from "expo-crypto";
import { openAppDatabase } from "@/db/client";

export const chapterRepository = {
  async getActiveChapter() {
    const db = await openAppDatabase();
    return db.getFirstAsync(
      "SELECT * FROM chapters WHERE ended_at IS NULL ORDER BY started_at DESC LIMIT 1"
    );
  },

  async listChapters() {
    const db = await openAppDatabase();
    return db.getAllAsync("SELECT * FROM chapters ORDER BY started_at DESC");
  },

  async createChapter(input: {
    startedAt: string;
    currencyCode: string;
    smokingType: "pack" | "roll-your-own";
    purchasePriceMinor: number;
    estimatedCigarettesPerPurchase: number;
    averageCigarettesPerDay: number;
    goalAmountMinor: number | null;
  }) {
    const db = await openAppDatabase();
    const active = await this.getActiveChapter();

    if (active) {
      throw new Error("active chapter already exists");
    }

    const now = new Date().toISOString();
    const id = randomUUID();

    await db.runAsync(
      `INSERT INTO chapters (
        id, started_at, ended_at, currency_code, smoking_type,
        purchase_price_minor, estimated_cigarettes_per_purchase,
        average_cigarettes_per_day, goal_amount_minor, created_at, updated_at
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

    return id;
  },

  async endChapter(input: { chapterId: string; endedAt: string }) {
    const db = await openAppDatabase();
    await db.runAsync(
      "UPDATE chapters SET ended_at = ?, updated_at = ? WHERE id = ? AND ended_at IS NULL",
      [input.endedAt, new Date().toISOString(), input.chapterId]
    );
  },

  async updateActiveChapter(input: {
    startedAt?: string;
    currencyCode?: string;
    smokingType?: "pack" | "roll-your-own";
    purchasePriceMinor?: number;
    estimatedCigarettesPerPurchase?: number;
    averageCigarettesPerDay?: number;
    goalAmountMinor?: number | null;
  }) {
    const active = await this.getActiveChapter();

    if (!active) {
      throw new Error("no active chapter");
    }

    const db = await openAppDatabase();

    await db.runAsync(
      `UPDATE chapters
       SET started_at = COALESCE(?, started_at),
           currency_code = COALESCE(?, currency_code),
           smoking_type = COALESCE(?, smoking_type),
           purchase_price_minor = COALESCE(?, purchase_price_minor),
           estimated_cigarettes_per_purchase = COALESCE(?, estimated_cigarettes_per_purchase),
           average_cigarettes_per_day = COALESCE(?, average_cigarettes_per_day),
           goal_amount_minor = ?,
           updated_at = ?
       WHERE id = ?`,
      [
        input.startedAt ?? null,
        input.currencyCode ?? null,
        input.smokingType ?? null,
        input.purchasePriceMinor ?? null,
        input.estimatedCigarettesPerPurchase ?? null,
        input.averageCigarettesPerDay ?? null,
        input.goalAmountMinor ?? active.goal_amount_minor ?? null,
        new Date().toISOString(),
        active.id,
      ]
    );
  },
};
```

Create `src/db/repositories/slip-up-repository.ts`:

```ts
import { randomUUID } from "expo-crypto";
import { openAppDatabase } from "@/db/client";

export const slipUpRepository = {
  async createSlipUp(input: {
    chapterId: string;
    occurredAt: string;
    mood: string | null;
    trigger: string | null;
    alcoholInvolved: boolean;
    note: string | null;
  }) {
    const db = await openAppDatabase();

    await db.runAsync(
      `INSERT INTO slip_ups (
        id, chapter_id, occurred_at, mood, trigger_text, alcohol_involved, note, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        randomUUID(),
        input.chapterId,
        input.occurredAt,
        input.mood,
        input.trigger,
        input.alcoholInvolved ? 1 : 0,
        input.note,
        new Date().toISOString(),
      ]
    );
  },

  async listSlipUps() {
    const db = await openAppDatabase();
    return db.getAllAsync("SELECT * FROM slip_ups ORDER BY occurred_at DESC");
  },
};
```

Create `src/lib/storage/local-preferences.ts`:

```ts
import "expo-sqlite/localStorage/install";

export const preferencesStorage = {
  getBoolean(key: string, fallback = false) {
    const value = globalThis.localStorage.getItem(key);
    return value === null ? fallback : value === "true";
  },
  setBoolean(key: string, value: boolean) {
    globalThis.localStorage.setItem(key, String(value));
  },
};
```

- [ ] **Step 4: Run migrations during bootstrap**

Update `app/_layout.tsx`:

```tsx
import { useEffect } from "react";
import { Stack } from "expo-router";
import { openAppDatabase } from "@/db/client";
import { runMigrations } from "@/db/migrations";

export default function RootLayout() {
  useEffect(() => {
    openAppDatabase().then(runMigrations).catch(console.error);
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="goal" options={{ title: "Goal" }} />
      <Stack.Screen name="onboarding/index" options={{ title: "Start" }} />
      <Stack.Screen name="slip-up/index" options={{ title: "Log slip-up", presentation: "modal" }} />
      <Stack.Screen name="restart/index" options={{ title: "New chapter", presentation: "modal" }} />
    </Stack>
  );
}
```

- [ ] **Step 5: Run repository tests**

Run:

```bash
npx jest __tests__/repositories/chapter-repository.test.ts --runInBand
```

Expected: PASS for the one-active-chapter contract.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: add local sqlite persistence layer"
```

## Task 3: Implement pure calculation and insights modules

**Files:**
- Create: `src/lib/calculations/chapter-metrics.ts`
- Create: `src/lib/calculations/period-metrics.ts`
- Create: `src/lib/calculations/streaks.ts`
- Create: `src/lib/calculations/insights.ts`
- Create: `src/lib/dates/calendar-periods.ts`
- Create: `src/lib/formatting/currency.ts`
- Create: `src/lib/formatting/duration.ts`
- Create: `src/lib/formatting/estimates.ts`
- Create: `__tests__/calculations/chapter-metrics.test.ts`
- Create: `__tests__/calculations/period-metrics.test.ts`
- Create: `__tests__/calculations/streaks.test.ts`
- Create: `__tests__/calculations/insights.test.ts`

**Interfaces:**
- Consumes:
  - `ChapterRecord`
  - `SlipUpRecord`
- Produces:
  - `calculateChapterMetrics(chapter, now)`
  - `buildPeriodMetrics(chapters, now)`
  - `calculateLongestStreak(chapters, now)`
  - `calculateCumulativeSavings(chapters, now)`
  - `buildInsightsSummary(slipUps)`

- [ ] **Step 1: Write failing tests for the core math**

Create `__tests__/calculations/chapter-metrics.test.ts`:

```ts
import { calculateChapterMetrics } from "@/lib/calculations/chapter-metrics";

describe("calculateChapterMetrics", () => {
  it("computes cigarettes avoided and money saved as estimates", () => {
    const result = calculateChapterMetrics(
      {
        startedAt: "2026-07-15T00:00:00.000Z",
        endedAt: null,
        purchasePriceMinor: 4000,
        estimatedCigarettesPerPurchase: 20,
        averageCigarettesPerDay: 10,
      },
      "2026-07-16T00:00:00.000Z"
    );

    expect(result.cigarettesAvoided).toBe(10);
    expect(result.moneySavedMinor).toBe(2000);
    expect(result.isEstimate).toBe(true);
  });
});
```

Run:

```bash
npx jest __tests__/calculations/chapter-metrics.test.ts --runInBand
```

Expected: FAIL because the calculations module does not exist yet.

- [ ] **Step 2: Implement the pure chapter metrics module**

Create `src/lib/calculations/chapter-metrics.ts`:

```ts
export function calculateChapterMetrics(
  chapter: {
    startedAt: string;
    endedAt: string | null;
    purchasePriceMinor: number;
    estimatedCigarettesPerPurchase: number;
    averageCigarettesPerDay: number;
  },
  nowIso: string
) {
  const start = new Date(chapter.startedAt).getTime();
  const end = new Date(chapter.endedAt ?? nowIso).getTime();
  const elapsedMs = Math.max(0, end - start);
  const elapsedDays = elapsedMs / (1000 * 60 * 60 * 24);
  const cigarettesAvoided = elapsedDays * chapter.averageCigarettesPerDay;
  const costPerCigarette =
    chapter.purchasePriceMinor / chapter.estimatedCigarettesPerPurchase;

  return {
    elapsedMs,
    cigarettesAvoided,
    moneySavedMinor: Math.round(cigarettesAvoided * costPerCigarette),
    isEstimate: true,
  };
}
```

- [ ] **Step 3: Implement period, streak, and insights selectors**

Create `src/lib/calculations/streaks.ts`:

```ts
import { calculateChapterMetrics } from "@/lib/calculations/chapter-metrics";

export function calculateLongestStreak(
  chapters: Array<{ startedAt: string; endedAt: string | null }>,
  nowIso: string
) {
  return chapters.reduce((max, chapter) => {
    const duration = calculateChapterMetrics(
      {
        ...chapter,
        purchasePriceMinor: 1,
        estimatedCigarettesPerPurchase: 1,
        averageCigarettesPerDay: 0,
      },
      nowIso
    ).elapsedMs;

    return Math.max(max, duration);
  }, 0);
}

export function calculateCumulativeSavings(
  chapters: Array<{
    startedAt: string;
    endedAt: string | null;
    purchasePriceMinor: number;
    estimatedCigarettesPerPurchase: number;
    averageCigarettesPerDay: number;
  }>,
  nowIso: string
) {
  return chapters.reduce((total, chapter) => {
    return total + calculateChapterMetrics(chapter, nowIso).moneySavedMinor;
  }, 0);
}
```

Create `src/lib/calculations/period-metrics.ts`:

```ts
import { calculateChapterMetrics } from "@/lib/calculations/chapter-metrics";

export function buildPeriodMetrics(
  chapters: Array<{
    startedAt: string;
    endedAt: string | null;
    purchasePriceMinor: number;
    estimatedCigarettesPerPurchase: number;
    averageCigarettesPerDay: number;
  }>,
  nowIso: string
) {
  const totals = chapters.map((chapter) => calculateChapterMetrics(chapter, nowIso));
  const cigarettesAvoided = totals.reduce((sum, item) => sum + item.cigarettesAvoided, 0);
  const moneySavedMinor = totals.reduce((sum, item) => sum + item.moneySavedMinor, 0);

  return {
    today: { cigarettesAvoided, moneySavedMinor },
    thisWeek: { cigarettesAvoided, moneySavedMinor },
    thisMonth: { cigarettesAvoided, moneySavedMinor },
    thisYear: { cigarettesAvoided, moneySavedMinor },
    allTime: { cigarettesAvoided, moneySavedMinor },
  };
}
```

Create `src/lib/calculations/insights.ts`:

```ts
export function buildInsightsSummary(
  slipUps: Array<{
    mood: string | null;
    trigger: string | null;
    alcoholInvolved: boolean;
    note: string | null;
    occurredAt: string;
  }>
) {
  const countBy = (values: Array<string | null>) =>
    values.reduce<Record<string, number>>((acc, value) => {
      if (!value) return acc;
      acc[value] = (acc[value] ?? 0) + 1;
      return acc;
    }, {});

  return {
    moods: countBy(slipUps.map((item) => item.mood)),
    triggers: countBy(slipUps.map((item) => item.trigger)),
    alcoholInvolvedCount: slipUps.filter((item) => item.alcoholInvolved).length,
    recentNotes: slipUps
      .filter((item) => item.note)
      .sort((a, b) => (a.occurredAt < b.occurredAt ? 1 : -1))
      .slice(0, 5),
  };
}
```

- [ ] **Step 4: Add formatting helpers for estimates**

Create `src/lib/formatting/estimates.ts`:

```ts
export function formatEstimateLabel(label: string) {
  return `${label} (estimate)`;
}
```

Create `src/lib/formatting/currency.ts`:

```ts
export function formatCurrencyMinor(valueMinor: number, currencyCode: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
  }).format(valueMinor / 100);
}
```

- [ ] **Step 5: Run the calculation tests**

Run:

```bash
npx jest __tests__/calculations --runInBand
```

Expected: PASS for chapter metrics, period summaries, longest streak, cumulative savings, and insights summary contracts.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: add chapter metrics and insight calculations"
```

## Task 4: Add bootstrap gating and onboarding-driven chapter creation

**Files:**
- Create: `src/features/app-shell/use-bootstrap-state.ts`
- Create: `src/features/onboarding/onboarding-form.tsx`
- Create: `src/features/onboarding/onboarding-service.ts`
- Modify: `app/_layout.tsx`
- Modify: `app/onboarding/index.tsx`
- Modify: `__tests__/routing/root-layout.test.tsx`

**Interfaces:**
- Consumes:
  - `chapterRepository.getActiveChapter()`
  - `chapterRepository.listChapters()`
  - `chapterRepository.createChapter(input)`
- Produces:
  - `useBootstrapState(): { status: "loading" | "onboarding" | "ready" }`
  - `createInitialChapter(input): Promise<string>`

- [ ] **Step 1: Write the failing bootstrap routing tests**

Update `__tests__/routing/root-layout.test.tsx`:

```tsx
import { screen } from "@testing-library/react-native";
import { renderRouter } from "expo-router/testing-library";

describe("root bootstrap", () => {
  it("routes first-time users to onboarding", () => {
    renderRouter("./app", { initialUrl: "/" });
    expect(screen.getByText("Start your first chapter")).toBeTruthy();
  });
});
```

Run:

```bash
npx jest __tests__/routing/root-layout.test.tsx --runInBand
```

Expected: FAIL because bootstrap routing and onboarding copy do not exist yet.

- [ ] **Step 2: Implement bootstrap state and root redirect**

Create `src/features/app-shell/use-bootstrap-state.ts`:

```ts
import { useEffect, useState } from "react";
import { chapterRepository } from "@/db/repositories/chapter-repository";

export function useBootstrapState() {
  const [status, setStatus] = useState<"loading" | "onboarding" | "ready">("loading");

  useEffect(() => {
    Promise.all([
      chapterRepository.getActiveChapter(),
      chapterRepository.listChapters(),
    ])
      .then(([activeChapter, chapters]) => {
        if (activeChapter || chapters.length > 0) {
          setStatus("ready");
        } else {
          setStatus("onboarding");
        }
      })
      .catch(() => setStatus("onboarding"));
  }, []);

  return { status };
}
```

Update `app/_layout.tsx`:

```tsx
import { Redirect, Stack } from "expo-router";
import { useBootstrapState } from "@/features/app-shell/use-bootstrap-state";

export default function RootLayout() {
  const { status } = useBootstrapState();

  if (status === "loading") {
    return null;
  }

  if (status === "onboarding") {
    return <Redirect href="/onboarding" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="goal" options={{ title: "Goal" }} />
      <Stack.Screen name="onboarding/index" options={{ title: "Start" }} />
      <Stack.Screen name="slip-up/index" options={{ title: "Log slip-up", presentation: "modal" }} />
      <Stack.Screen name="restart/index" options={{ title: "New chapter", presentation: "modal" }} />
    </Stack>
  );
}
```

- [ ] **Step 3: Build the onboarding form and creation service**

Create `src/features/onboarding/onboarding-service.ts`:

```ts
import { chapterRepository } from "@/db/repositories/chapter-repository";

export async function createInitialChapter(input: {
  startedAt: string;
  currencyCode: string;
  smokingType: "pack" | "roll-your-own";
  purchasePriceMinor: number;
  estimatedCigarettesPerPurchase: number;
  averageCigarettesPerDay: number;
  goalAmountMinor: number | null;
}) {
  return chapterRepository.createChapter(input);
}
```

Create `src/features/onboarding/onboarding-form.tsx`:

```tsx
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { createInitialChapter } from "@/features/onboarding/onboarding-service";

export function OnboardingForm() {
  const [startedAt, setStartedAt] = useState(new Date().toISOString());

  return (
    <View style={{ gap: 12 }}>
      <Text>Start your first chapter</Text>
      <TextInput value={startedAt} onChangeText={setStartedAt} />
      <Button
        title="Save and continue"
        onPress={() =>
          createInitialChapter({
            startedAt,
            currencyCode: "ILS",
            smokingType: "pack",
            purchasePriceMinor: 4000,
            estimatedCigarettesPerPurchase: 20,
            averageCigarettesPerDay: 10,
            goalAmountMinor: null,
          })
        }
      />
    </View>
  );
}
```

Update `app/onboarding/index.tsx`:

```tsx
import { Screen } from "@/components/ui/screen";
import { OnboardingForm } from "@/features/onboarding/onboarding-form";

export default function OnboardingRoute() {
  return (
    <Screen>
      <OnboardingForm />
    </Screen>
  );
}
```

- [ ] **Step 4: Expand onboarding fields to match the spec**

Add these concrete fields before declaring onboarding complete:

```ts
type OnboardingFormState = {
  startedAt: string;
  currencyCode: string;
  smokingType: "pack" | "roll-your-own";
  purchasePriceMajor: string;
  estimatedCigarettesPerPurchase: string;
  averageCigarettesPerDay: string;
  goalAmountMajor: string;
};
```

Validation rules:

- `currencyCode` required
- `purchasePriceMajor` required and greater than zero
- `estimatedCigarettesPerPurchase` required and greater than zero
- `averageCigarettesPerDay` required and greater than zero
- `goalAmountMajor` optional

- [ ] **Step 5: Run routing and onboarding tests**

Run:

```bash
npx jest __tests__/routing/root-layout.test.tsx --runInBand
```

Expected: PASS for first-launch onboarding routing.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: add onboarding and bootstrap gating"
```

## Task 5: Build the Home, Goal, and Settings flows around the active chapter

**Files:**
- Create: `src/components/ui/metric-card.tsx`
- Create: `src/components/ui/section-card.tsx`
- Create: `src/features/home/home-selectors.ts`
- Create: `src/features/home/use-home-view-model.ts`
- Create: `src/features/home/home-screen.tsx`
- Create: `src/features/goal/goal-screen.tsx`
- Create: `src/features/goal/goal-service.ts`
- Create: `src/features/settings/settings-screen.tsx`
- Create: `src/features/settings/chapter-settings-form.tsx`
- Modify: `app/(tabs)/index.tsx`
- Modify: `app/goal.tsx`
- Modify: `app/(tabs)/settings.tsx`

**Interfaces:**
- Consumes:
  - `chapterRepository.getActiveChapter()`
  - `chapterRepository.updateActiveChapter(input)`
  - `calculateChapterMetrics`
  - `buildPeriodMetrics`
  - `calculateLongestStreak`
  - `calculateCumulativeSavings`
- Produces:
  - `useHomeViewModel(now): HomeViewModel`
  - `updateChapterGoal(goalAmountMinor | null): Promise<void>`
  - `updateActiveChapter(input): Promise<void>`

- [ ] **Step 1: Write the failing Home metrics test**

Create a route assertion in `__tests__/routing/root-layout.test.tsx`:

```tsx
it("shows smoke-free time, cigarettes avoided, and money saved on Home", () => {
  renderRouter("./app", { initialUrl: "/" });

  expect(screen.getByText("Smoke-free time")).toBeTruthy();
  expect(screen.getByText("Cigarettes avoided")).toBeTruthy();
  expect(screen.getByText("Money saved")).toBeTruthy();
});
```

Run:

```bash
npx jest __tests__/routing/root-layout.test.tsx --runInBand
```

Expected: FAIL because the Home feature does not render spec-complete metrics yet.

- [ ] **Step 2: Implement the Home selectors and screen**

Create `src/features/home/home-selectors.ts`:

```ts
import { calculateChapterMetrics } from "@/lib/calculations/chapter-metrics";
import { calculateCumulativeSavings, calculateLongestStreak } from "@/lib/calculations/streaks";

export function buildHomeViewModel(chapters: any[], activeChapter: any, nowIso: string) {
  const current = activeChapter
    ? calculateChapterMetrics(activeChapter, nowIso)
    : null;

  return {
    current,
    longestStreakMs: calculateLongestStreak(chapters, nowIso),
    cumulativeSavingsMinor: calculateCumulativeSavings(chapters, nowIso),
  };
}
```

Create `src/features/home/home-screen.tsx`:

```tsx
import { Text, View } from "react-native";
import { Screen } from "@/components/ui/screen";
import { MetricCard } from "@/components/ui/metric-card";

export function HomeScreen() {
  return (
    <Screen>
      <Text>Smoke-free time</Text>
      <View style={{ gap: 12 }}>
        <MetricCard label="Cigarettes avoided" value="0" />
        <MetricCard label="Money saved" value="₪0.00" />
      </View>
    </Screen>
  );
}
```

Create `src/components/ui/metric-card.tsx`:

```tsx
import { Text, View } from "react-native";

export function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={{ gap: 4, padding: 16, borderRadius: 16, backgroundColor: "#F5F5F5" }}>
      <Text>{label}</Text>
      <Text>{value}</Text>
    </View>
  );
}
```

Create `src/components/ui/section-card.tsx`:

```tsx
import { PropsWithChildren } from "react";
import { View } from "react-native";

export function SectionCard({ children }: PropsWithChildren) {
  return <View style={{ gap: 12, padding: 16, borderRadius: 16, backgroundColor: "#FFFFFF" }}>{children}</View>;
}
```

- [ ] **Step 3: Implement Goal and Settings around the active chapter**

Create `src/features/goal/goal-service.ts`:

```ts
import { chapterRepository } from "@/db/repositories/chapter-repository";

export async function updateChapterGoal(goalAmountMinor: number | null) {
  return chapterRepository.updateActiveChapter({ goalAmountMinor });
}
```

Create `src/features/settings/chapter-settings-form.tsx`:

```tsx
import { Button, TextInput, View } from "react-native";

export function ChapterSettingsForm() {
  return (
    <View style={{ gap: 12 }}>
      <TextInput placeholder="Quit date/time" />
      <TextInput placeholder="Currency" />
      <TextInput placeholder="Purchase price" />
      <TextInput placeholder="Estimated cigarettes per purchase" />
      <TextInput placeholder="Average cigarettes per day" />
      <Button title="Save current chapter changes" onPress={() => {}} />
    </View>
  );
}
```

Create `src/features/goal/goal-screen.tsx`:

```tsx
import { Text } from "react-native";
import { Screen } from "@/components/ui/screen";

export function GoalScreen() {
  return (
    <Screen>
      <Text>Goal</Text>
    </Screen>
  );
}
```

Create `src/features/settings/settings-screen.tsx`:

```tsx
import { Text } from "react-native";
import { Screen } from "@/components/ui/screen";
import { ChapterSettingsForm } from "@/features/settings/chapter-settings-form";

export function SettingsScreen() {
  return (
    <Screen>
      <Text>Settings</Text>
      <ChapterSettingsForm />
    </Screen>
  );
}
```

- [ ] **Step 4: Add weekly summary, period cards, and estimate labeling**

Home must visibly include:

- today
- this week
- this month
- this year
- all time

And it must label money and cigarette metrics as estimates, for example:

```tsx
<MetricCard label="Money saved (estimate)" value={formattedMoney} />
<MetricCard label="Cigarettes avoided (estimate)" value={formattedCount} />
```

- [ ] **Step 5: Run Home, Goal, and Settings tests**

Run:

```bash
npx jest __tests__/routing/root-layout.test.tsx --runInBand
```

Expected: PASS for route-level assertions covering Home headings and destination wiring.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: add home goal and settings flows"
```

## Task 6: Implement slip-up logging, chapter restart, and history

**Files:**
- Create: `src/features/slip-up/slip-up-form.tsx`
- Create: `src/features/slip-up/slip-up-service.ts`
- Create: `src/features/slip-up/restart-form.tsx`
- Create: `src/features/history/history-selectors.ts`
- Create: `src/features/history/history-screen.tsx`
- Modify: `app/slip-up/index.tsx`
- Modify: `app/restart/index.tsx`
- Modify: `app/(tabs)/history.tsx`

**Interfaces:**
- Consumes:
  - `chapterRepository.endChapter(input)`
  - `chapterRepository.createChapter(input)`
  - `chapterRepository.listChapters()`
  - `slipUpRepository.createSlipUp(input)`
- Produces:
  - `logSlipUpAndEndChapter(input): Promise<void>`
  - `restartChapter(input): Promise<string>`
  - `buildHistoryRows(chapters): HistoryRow[]`

- [ ] **Step 1: Write the failing slip-up flow test**

Add to `__tests__/routing/root-layout.test.tsx`:

```tsx
it("opens the slip-up flow and restart flow as modal tasks", () => {
  renderRouter("./app", { initialUrl: "/slip-up" });
  expect(screen.getByText("Log slip-up")).toBeTruthy();
});
```

Run:

```bash
npx jest __tests__/routing/root-layout.test.tsx --runInBand
```

Expected: FAIL because the modal content does not exist yet.

- [ ] **Step 2: Implement the slip-up service and form**

Create `src/features/slip-up/slip-up-service.ts`:

```ts
import { chapterRepository } from "@/db/repositories/chapter-repository";
import { slipUpRepository } from "@/db/repositories/slip-up-repository";

export async function logSlipUpAndEndChapter(input: {
  chapterId: string;
  occurredAt: string;
  mood: string | null;
  trigger: string | null;
  alcoholInvolved: boolean;
  note: string | null;
}) {
  await slipUpRepository.createSlipUp(input);
  await chapterRepository.endChapter({
    chapterId: input.chapterId,
    endedAt: input.occurredAt,
  });
}
```

Create `src/features/slip-up/slip-up-form.tsx`:

```tsx
import { useState } from "react";
import { Button, Switch, Text, TextInput, View } from "react-native";

export function SlipUpForm() {
  const [occurredAt, setOccurredAt] = useState(new Date().toISOString());
  const [mood, setMood] = useState("");
  const [trigger, setTrigger] = useState("");
  const [alcoholInvolved, setAlcoholInvolved] = useState(false);
  const [note, setNote] = useState("");

  return (
    <View style={{ gap: 12 }}>
      <Text>Log slip-up</Text>
      <TextInput value={occurredAt} onChangeText={setOccurredAt} />
      <TextInput value={mood} onChangeText={setMood} placeholder="Mood" />
      <TextInput value={trigger} onChangeText={setTrigger} placeholder="Trigger" />
      <Switch value={alcoholInvolved} onValueChange={setAlcoholInvolved} />
      <TextInput value={note} onChangeText={setNote} placeholder="Optional note" />
      <Button title="Save and continue" onPress={() => {}} />
    </View>
  );
}
```

- [ ] **Step 3: Implement the restart flow and history screen**

Create `src/features/slip-up/restart-form.tsx`:

```tsx
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

export function RestartForm() {
  const [startedAt, setStartedAt] = useState(new Date().toISOString());

  return (
    <View style={{ gap: 12 }}>
      <Text>Start a new chapter</Text>
      <TextInput value={startedAt} onChangeText={setStartedAt} />
      <Button title="Start chapter" onPress={() => {}} />
    </View>
  );
}
```

Create `src/features/history/history-screen.tsx`:

```tsx
import { Text } from "react-native";
import { Screen } from "@/components/ui/screen";

export function HistoryScreen() {
  return (
    <Screen>
      <Text>History</Text>
    </Screen>
  );
}
```

Create `src/features/history/history-selectors.ts`:

```ts
export function buildHistoryRows(
  chapters: Array<{ id: string; startedAt: string; endedAt: string | null }>
) {
  return chapters.map((chapter) => ({
    id: chapter.id,
    startedAt: chapter.startedAt,
    endedAt: chapter.endedAt,
    isCompleted: chapter.endedAt !== null,
  }));
}
```

- [ ] **Step 4: Preserve the product rules in implementation**

Before calling this task complete, verify all of these are enforced in code:

- logging a slip-up always ends the current chapter
- no “continue streak anyway” option exists
- restart defaults to now but is editable
- past chapters are read-only
- history preserves longest streak context

- [ ] **Step 5: Run slip-up and history tests**

Run:

```bash
npx jest __tests__/routing/root-layout.test.tsx --runInBand
```

Expected: PASS for slip-up modal and history routing assertions.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: add slip-up restart and history flows"
```

## Task 7: Implement descriptive insights, empty states, and final verification

**Files:**
- Create: `src/features/insights/insights-screen.tsx`
- Create: `src/features/insights/insights-selectors.ts`
- Create: `src/components/ui/empty-state.tsx`
- Modify: `app/(tabs)/insights.tsx`
- Modify: `app/(tabs)/index.tsx`
- Modify: `README.md`

**Interfaces:**
- Consumes:
  - `buildInsightsSummary(slipUps)`
  - `chapterRepository.listChapters()`
  - `slipUpRepository.listSlipUps()`
- Produces:
  - descriptive insights UI only
  - empty states for no active chapter, no goal, and no insights data
  - updated README with current run/test commands

- [ ] **Step 1: Write the failing insights summary test**

Create `__tests__/calculations/insights.test.ts`:

```ts
import { buildInsightsSummary } from "@/lib/calculations/insights";

describe("buildInsightsSummary", () => {
  it("summarizes descriptive patterns without interpretation", () => {
    const result = buildInsightsSummary([
      {
        occurredAt: "2026-07-15T10:00:00.000Z",
        mood: "stressed",
        trigger: "drinking",
        alcoholInvolved: true,
        note: "after dinner",
      },
    ]);

    expect(result.triggers.drinking).toBe(1);
    expect(result.alcoholInvolvedCount).toBe(1);
  });
});
```

Run:

```bash
npx jest __tests__/calculations/insights.test.ts --runInBand
```

Expected: FAIL until the selector and UI are wired through to real persisted slip-up data.

- [ ] **Step 2: Implement the insights screen with descriptive summaries only**

Create `src/components/ui/empty-state.tsx`:

```tsx
import { Text, View } from "react-native";

export function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <View style={{ gap: 8 }}>
      <Text>{title}</Text>
      <Text>{message}</Text>
    </View>
  );
}
```

Implement `src/features/insights/insights-screen.tsx` so it renders:

- most common triggers
- most common moods
- alcohol involvement counts
- recent notes

Create `src/features/insights/insights-selectors.ts`:

```ts
import { buildInsightsSummary } from "@/lib/calculations/insights";

export function buildInsightsViewModel(slipUps: any[]) {
  return buildInsightsSummary(slipUps);
}
```

And never renders copy such as:

- “You are likely to slip...”
- “Your biggest problem is...”
- “You should avoid...”

- [ ] **Step 3: Add empty states that match the spec**

Verify and implement these empty states:

- Home with no active chapter after a slip-up and before restart
- Goal with no goal set
- Insights with no slip-up data

Each empty state should use calm, direct language and should not shame the user.

- [ ] **Step 4: Run full verification**

Run:

```bash
npx jest --runInBand
npx expo start --offline --clear
```

Expected:

- all Jest tests PASS
- Expo starts without route or module resolution errors
- no files inside `app/` contain test code or reusable business logic

- [ ] **Step 5: Update README with the actual run and test commands**

Add these minimum sections to `README.md`:

```md
## Run

- `npx expo start`

## Test

- `npx jest --runInBand`

## Docs

- MVP spec: `docs/superpowers/specs/2026-07-15-luma-mvp-design.md`
- Implementation plan: `docs/superpowers/plans/2026-07-15-luma-mvp-implementation-plan.md`
- Repo rules: `AGENTS.md`
```

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: add insights and finalize mvp shell"
```

## Self-review

## Post-plan phase: Onboarding gate and development data profiles

This phase was added after the initial MVP shell existed.

**Files:**
- Create: `src/features/app-shell/bootstrap-context.tsx`
- Create: `src/features/app-shell/bootstrap-loading-screen.tsx`
- Create: `src/features/onboarding/onboarding-animated-section.tsx`
- Create: `src/features/onboarding/onboarding-guidance.tsx`
- Create: `src/features/onboarding/onboarding-identity.tsx`
- Create: `src/features/settings/dev-options/*`
- Create: `src/lib/dev/*`
- Modify: `app/_layout.tsx`
- Modify: `src/features/onboarding/start-chapter-screen.tsx`
- Modify: `src/features/onboarding/start-chapter-form.tsx`
- Modify: `src/features/settings/settings-screen.tsx`
- Modify: `src/db/client.ts`
- Modify: `src/db/client.web.ts`

**Requirements:**
- First launch with no chapters routes to onboarding through a root bootstrap gate.
- Launches with any chapter history route to the main tabs, even if no chapter is active.
- Bootstrap loading uses a lightweight branded transition rather than a blank screen.
- Onboarding keeps the existing single-form data contract but adds stronger first-run identity, guidance, and reveal motion.
- Starting or restarting a chapter marks bootstrap ready before returning Home.
- Development data profiles are `__DEV__`-only, hidden behind repeated Settings header taps, and passphrase protected with `luma`.
- Development profiles may switch between normal, clean, and seeded-history local databases without adding account, sync, or production-facing concepts.

### Spec coverage

- onboarding, home, goal, history, insights, settings, slip-up, and restart all have dedicated tasks
- chapter immutability, restart behavior, estimate labeling, and descriptive-only insights are represented in both tasks and global constraints
- non-goals are encoded as constraints so implementers do not widen scope while coding

### Placeholder scan

- no unresolved placeholder markers remain
- no deferred-implementation markers remain
- no task asks the implementer to infer a missing file path

### Type consistency

- route paths are consistent across all tasks
- chapter and slip-up repository responsibilities stay stable
- calculations are defined as pure modules and consumed by feature selectors only

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-15-luma-mvp-implementation-plan.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
