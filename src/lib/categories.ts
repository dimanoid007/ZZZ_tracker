import type {Achievement, AchievementSection} from "../types";
export const sectionLabels: Record<AchievementSection, string> = {
  life: "Жизнь",
  tactics: "Тактика",
  exploration: "Исследование",
  arcade: "Аркада",
  other: "Новое"
};
export const sectionDescriptions: Record<AchievementSection, string> = {
  life: "История, город, агенты и повседневная жизнь",
  tactics: "Бои, испытания и тактические режимы",
  exploration: "Каверны, зоны и исследовательские активности",
  arcade: "Достижения игровых автоматов",
  other: "Новые группы, ещё не распределённые игрой"
};
export function getSection(achievement: Achievement): AchievementSection {
  if (achievement.arcade) return "arcade";
  const firstClass = Math.floor(achievement.series / 1000);
  if (firstClass === 1) return "life";
  if (firstClass === 2) return "tactics";
  if (firstClass === 3) return "exploration";
  return "other";
}
export function getTier(reward: number): "bronze" | "silver" | "gold" {
  if (reward >= 20) return "gold";
  if (reward >= 10) return "silver";
  return "bronze";
}
export function getDifficultyLabel(value: string | null): string | null {
  if (!value) return null;
  const labels: Record<string, string> = {
    easy: "Легко",
    medium: "Средне",
    hard: "Сложно",
    very_hard: "Очень сложно"
  };
  return labels[value] ?? value;
}
