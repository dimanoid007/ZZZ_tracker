import {useEffect, useState} from "react";
import type {AchievementProgress, ProgressMap} from "../types";
import {readProgress, writeProgress} from "../lib/storage";
const emptyProgress: AchievementProgress = {completed: false, favorite: false, completedAt: null, note: ""};
export function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>(() => readProgress());
  useEffect(() => writeProgress(progress), [progress]);
  function update(id: number, patch: Partial<AchievementProgress>) {
    setProgress(current => {
      const key = String(id);
      return {...current, [key]: {...emptyProgress, ...current[key], ...patch}};
    });
  }
  function toggleCompleted(id: number) {
    const current = progress[String(id)] ?? emptyProgress;
    update(id, {completed: !current.completed, completedAt: current.completed ? null : new Date().toISOString()});
  }
  function toggleFavorite(id: number) {
    const current = progress[String(id)] ?? emptyProgress;
    update(id, {favorite: !current.favorite});
  }
  function replace(next: ProgressMap) {
    setProgress(next);
  }
  function clear() {
    setProgress({});
  }
  return {progress, update, toggleCompleted, toggleFavorite, replace, clear};
}
