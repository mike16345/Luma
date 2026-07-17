import type { SmokingType } from "@/types/domain";

type ChapterRow = {
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
};

type SlipUpRow = {
  id: string;
  chapter_id: string;
  occurred_at: string;
  mood: string | null;
  trigger_text: string | null;
  alcohol_involved: 0 | 1;
  note: string | null;
  created_at: string;
};

type WebDatabaseState = {
  chapters: ChapterRow[];
  slipUps: SlipUpRow[];
};

const STORAGE_KEY = "luma.web.database";

function readState(): WebDatabaseState {
  const rawValue = globalThis.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return {
      chapters: [],
      slipUps: [],
    };
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<WebDatabaseState>;

    return {
      chapters: Array.isArray(parsed.chapters) ? parsed.chapters : [],
      slipUps: Array.isArray(parsed.slipUps) ? parsed.slipUps : [],
    };
  } catch {
    return {
      chapters: [],
      slipUps: [],
    };
  }
}

function writeState(state: WebDatabaseState) {
  globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function sortByStartedAtDesc(chapters: ChapterRow[]) {
  return [...chapters].sort(
    (left, right) =>
      new Date(right.started_at).getTime() - new Date(left.started_at).getTime()
  );
}

function sortByOccurredAtDesc(slipUps: SlipUpRow[]) {
  return [...slipUps].sort(
    (left, right) =>
      new Date(right.occurred_at).getTime() - new Date(left.occurred_at).getTime()
  );
}

const webDatabase = {
  async execAsync() {
    return;
  },

  async getFirstAsync<T>(statement: string): Promise<T | null> {
    const state = readState();

    if (
      statement.includes("FROM chapters") &&
      statement.includes("ended_at IS NULL")
    ) {
      return (
        sortByStartedAtDesc(state.chapters).find(
          (chapter) => chapter.ended_at === null
        ) ?? null
      ) as T | null;
    }

    return null;
  },

  async getAllAsync<T>(statement: string): Promise<T[]> {
    const state = readState();

    if (statement.includes("FROM chapters")) {
      return sortByStartedAtDesc(state.chapters) as T[];
    }

    if (statement.includes("FROM slip_ups")) {
      return sortByOccurredAtDesc(state.slipUps) as T[];
    }

    return [];
  },

  async runAsync(statement: string, params: unknown[] = []) {
    const state = readState();

    if (statement.includes("INSERT INTO chapters")) {
      const [
        id,
        startedAt,
        currencyCode,
        smokingType,
        purchasePriceMinor,
        estimatedCigarettesPerPurchase,
        averageCigarettesPerDay,
        goalAmountMinor,
        createdAt,
        updatedAt,
      ] = params;

      state.chapters.push({
        id: String(id),
        started_at: String(startedAt),
        ended_at: null,
        currency_code: String(currencyCode),
        smoking_type: smokingType as SmokingType,
        purchase_price_minor: Number(purchasePriceMinor),
        estimated_cigarettes_per_purchase: Number(estimatedCigarettesPerPurchase),
        average_cigarettes_per_day: Number(averageCigarettesPerDay),
        goal_amount_minor:
          goalAmountMinor === null || goalAmountMinor === undefined
            ? null
            : Number(goalAmountMinor),
        created_at: String(createdAt),
        updated_at: String(updatedAt),
      });
      writeState(state);
      return;
    }

    if (statement.includes("UPDATE chapters") && statement.includes("ended_at")) {
      const [endedAt, updatedAt, chapterId] = params;
      state.chapters = state.chapters.map((chapter) =>
        chapter.id === chapterId && chapter.ended_at === null
          ? {
              ...chapter,
              ended_at: String(endedAt),
              updated_at: String(updatedAt),
            }
          : chapter
      );
      writeState(state);
      return;
    }

    if (statement.includes("UPDATE chapters")) {
      const [
        startedAt,
        currencyCode,
        smokingType,
        purchasePriceMinor,
        estimatedCigarettesPerPurchase,
        averageCigarettesPerDay,
        goalAmountMinor,
        updatedAt,
        chapterId,
      ] = params;

      state.chapters = state.chapters.map((chapter) =>
        chapter.id === chapterId && chapter.ended_at === null
          ? {
              ...chapter,
              started_at: String(startedAt),
              currency_code: String(currencyCode),
              smoking_type: smokingType as SmokingType,
              purchase_price_minor: Number(purchasePriceMinor),
              estimated_cigarettes_per_purchase: Number(
                estimatedCigarettesPerPurchase
              ),
              average_cigarettes_per_day: Number(averageCigarettesPerDay),
              goal_amount_minor:
                goalAmountMinor === null || goalAmountMinor === undefined
                  ? null
                  : Number(goalAmountMinor),
              updated_at: String(updatedAt),
            }
          : chapter
      );
      writeState(state);
      return;
    }

    if (statement.includes("INSERT INTO slip_ups")) {
      const [
        id,
        chapterId,
        occurredAt,
        mood,
        trigger,
        alcoholInvolved,
        note,
        createdAt,
      ] = params;

      state.slipUps.push({
        id: String(id),
        chapter_id: String(chapterId),
        occurred_at: String(occurredAt),
        mood: mood === null || mood === undefined ? null : String(mood),
        trigger_text:
          trigger === null || trigger === undefined ? null : String(trigger),
        alcohol_involved: alcoholInvolved ? 1 : 0,
        note: note === null || note === undefined ? null : String(note),
        created_at: String(createdAt),
      });
      writeState(state);
    }
  },
};

export function openAppDatabase() {
  return Promise.resolve(webDatabase);
}

export async function getAppDatabase() {
  return webDatabase;
}
