export type SmokingType = "pack" | "roll-your-own";

export type ChapterStatus = "active" | "completed";

export type ProgressPeriod = "today" | "thisWeek" | "thisMonth" | "thisYear" | "allTime";

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

export interface CreateChapterInput {
  startedAt: string;
  currencyCode: string;
  smokingType: SmokingType;
  purchasePriceMinor: number;
  estimatedCigarettesPerPurchase: number;
  averageCigarettesPerDay: number;
  goalAmountMinor: number | null;
}

export interface UpdateActiveChapterInput {
  startedAt?: string;
  currencyCode?: string;
  smokingType?: SmokingType;
  purchasePriceMinor?: number;
  estimatedCigarettesPerPurchase?: number;
  averageCigarettesPerDay?: number;
  goalAmountMinor?: number | null;
}

export interface CreateSlipUpInput {
  chapterId: string;
  occurredAt: string;
  mood: string | null;
  trigger: string | null;
  alcoholInvolved: boolean;
  note: string | null;
}
