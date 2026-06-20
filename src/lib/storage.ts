import type {ProgressMap} from "../types";
export const STORAGE_KEY = "zzz_ach_progress_v3";
export function readProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed as ProgressMap : {};
  } catch {
    return {};
  }
}
export function writeProgress(progress: ProgressMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
export function downloadProgress(progress: ProgressMap): void {
  const payload = JSON.stringify({format: "zzz-achievement-progress", version: 3, exportedAt: new Date().toISOString(), progress}, null, 2);
  const blob = new Blob([payload], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `zzz-progress-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}
export async function importProgress(file: File): Promise<ProgressMap> {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const progress = parsed?.progress ?? parsed;
  if (!progress || typeof progress !== "object" || Array.isArray(progress)) throw new Error("Некорректный файл прогресса");
  return progress as ProgressMap;
}
