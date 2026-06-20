import {mkdir, readFile, rename, writeFile} from "node:fs/promises";
import {dirname, resolve} from "node:path";
import process from "node:process";
const sourceUrl = process.env.ZZZ_ACHIEVEMENTS_URL ?? "https://stardb.gg/api/zzz/achievements?lang=ru";
const outputPath = resolve("public/data/achievements-ru.json");
function text(value, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}
function nullable(value) {
  const result = text(value);
  return result || null;
}
function normalize(item) {
  return {
    id: Number(item.id),
    series: Number(item.series),
    seriesName: text(item.series_name, `Серия ${item.series}`),
    name: text(item.name, `Достижение ${item.id}`),
    description: text(item.description),
    reward: Number(item.currency ?? 0),
    hidden: Boolean(item.hidden),
    version: nullable(item.version),
    comment: nullable(item.comment),
    reference: nullable(item.reference),
    difficulty: nullable(item.difficulty),
    video: nullable(item.video),
    gacha: Boolean(item.gacha),
    timegated: nullable(item.timegated),
    missable: Boolean(item.missable),
    impossible: Boolean(item.impossible),
    arcade: Boolean(item.arcade)
  };
}
async function loadRemote() {
  const response = await fetch(sourceUrl, {headers: {Accept: "application/json", "User-Agent": "ZZZ-tracker/1.0"}});
  if (!response.ok) throw new Error(`Источник вернул HTTP ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error("Источник вернул данные неизвестного формата");
  return data;
}
async function main() {
  const raw = await loadRemote();
  const unique = new Map();
  raw.map(normalize).forEach(item => {
    if (!Number.isInteger(item.id) || item.id <= 0) return;
    if (!Number.isInteger(item.series) || item.series <= 0) return;
    unique.set(item.id, item);
  });
  const achievements = [...unique.values()].sort((a, b) => Number(a.arcade) - Number(b.arcade) || a.series - b.series || a.id - b.id);
  if (achievements.length === 0) throw new Error("После проверки не осталось ни одного достижения");
  const payload = {sourceUrl, updatedAt: new Date().toISOString(), count: achievements.length, achievements};
  await mkdir(dirname(outputPath), {recursive: true});
  const temporaryPath = `${outputPath}.tmp`;
  await writeFile(temporaryPath, JSON.stringify(payload, null, 2), "utf8");
  try {
    const previous = JSON.parse(await readFile(outputPath, "utf8"));
    console.log(`Было достижений: ${previous.count ?? previous.achievements?.length ?? 0}`);
  } catch {}
  await rename(temporaryPath, outputPath);
  console.log(`Сохранено достижений: ${achievements.length}`);
  console.log(`Файл: ${outputPath}`);
}
main().catch(error => {
  console.error("Не удалось обновить достижения:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
