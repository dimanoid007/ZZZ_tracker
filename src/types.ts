export type AchievementSection = "life" | "tactics" | "exploration" | "arcade" | "other";
export type AchievementDifficulty = "easy" | "medium" | "hard" | "very_hard" | string;
export interface Achievement {
  id: number;
  series: number;
  seriesName: string;
  name: string;
  description: string;
  reward: number;
  hidden: boolean;
  version: string | null;
  comment: string | null;
  reference: string | null;
  difficulty: AchievementDifficulty | null;
  video: string | null;
  gacha: boolean;
  timegated: string | null;
  missable: boolean;
  impossible: boolean;
  arcade: boolean;
}
export interface AchievementCatalog {
  sourceUrl: string;
  updatedAt: string | null;
  count: number;
  achievements: Achievement[];
}
export interface AchievementProgress {
  completed: boolean;
  favorite: boolean;
  completedAt: string | null;
  note: string;
}
export type ProgressMap = Record<string, AchievementProgress>;
export type StatusFilter = "all" | "completed" | "remaining" | "favorite";
