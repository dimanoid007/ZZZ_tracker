import {useEffect, useMemo, useRef, useState} from "react";
import type {AchievementCatalog, AchievementProgress, AchievementSection, StatusFilter} from "./types";
import {getSection, sectionLabels} from "./lib/categories";
import {downloadProgress, importProgress} from "./lib/storage";
import {useProgress} from "./hooks/useProgress";
import {Stats} from "./components/Stats";
import {Sidebar} from "./components/Sidebar";
import {Filters} from "./components/Filters";
import {AchievementCard} from "./components/AchievementCard";
const emptyItem: AchievementProgress = {completed: false, favorite: false, completedAt: null, note: ""};
const sectionOrder: AchievementSection[] = ["life", "tactics", "exploration", "arcade", "other"];
export default function App() {
  const [catalog, setCatalog] = useState<AchievementCatalog>({sourceUrl: "", updatedAt: null, count: 0, achievements: []});
  const [loadError, setLoadError] = useState("");
  const [activeSection, setActiveSection] = useState<AchievementSection>("life");
  const [activeSeries, setActiveSeries] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [version, setVersion] = useState("all");
  const [showHidden, setShowHidden] = useState(true);
  const fileInput = useRef<HTMLInputElement>(null);
  const {progress, update, toggleCompleted, toggleFavorite, replace, clear} = useProgress();
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/achievements-ru.json`, {cache: "no-store"})
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data: AchievementCatalog) => setCatalog(data))
      .catch(error => setLoadError(error instanceof Error ? error.message : "Не удалось загрузить каталог"));
  }, []);
  const visibleBySection = useMemo(() => catalog.achievements.filter(item => getSection(item) === activeSection), [catalog, activeSection]);
  const series = useMemo(() => {
    const groups = new Map<number, {id: number; name: string; count: number; completed: number}>();
    visibleBySection.forEach(item => {
      const current = groups.get(item.series) ?? {id: item.series, name: item.seriesName || `Серия ${item.series}`, count: 0, completed: 0};
      current.count += 1;
      if (progress[String(item.id)]?.completed) current.completed += 1;
      groups.set(item.series, current);
    });
    return [...groups.values()].sort((a, b) => a.id - b.id);
  }, [visibleBySection, progress]);
  const sections = useMemo(() => sectionOrder.map(id => {
    const items = catalog.achievements.filter(item => getSection(item) === id);
    return {id, count: items.length, completed: items.filter(item => progress[String(item.id)]?.completed).length};
  }).filter(item => item.count > 0 || item.id !== "other"), [catalog, progress]);
  const versions = useMemo(() => [...new Set(catalog.achievements.map(item => item.version).filter((item): item is string => Boolean(item)))].sort((a, b) => b.localeCompare(a, undefined, {numeric: true})), [catalog]);
  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("ru");
    return visibleBySection.filter(item => {
      const itemProgress = progress[String(item.id)] ?? emptyItem;
      if (activeSeries !== null && item.series !== activeSeries) return false;
      if (!showHidden && item.hidden) return false;
      if (version !== "all" && item.version !== version) return false;
      if (status === "completed" && !itemProgress.completed) return false;
      if (status === "remaining" && itemProgress.completed) return false;
      if (status === "favorite" && !itemProgress.favorite) return false;
      if (query && !`${item.name} ${item.description} ${item.seriesName}`.toLocaleLowerCase("ru").includes(query)) return false;
      return true;
    });
  }, [visibleBySection, activeSeries, showHidden, version, status, search, progress]);
  const completed = catalog.achievements.filter(item => progress[String(item.id)]?.completed).length;
  const earned = catalog.achievements.reduce((sum, item) => sum + (progress[String(item.id)]?.completed ? item.reward : 0), 0);
  const available = catalog.achievements.reduce((sum, item) => sum + item.reward, 0);
  async function handleImport(file?: File) {
    if (!file) return;
    try {
      replace(await importProgress(file));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Не удалось импортировать файл");
    }
  }
  function resetProgress() {
    if (confirm("Удалить все отметки, избранное и заметки?")) clear();
  }
  function selectSection(section: AchievementSection) {
    setActiveSection(section);
    setActiveSeries(null);
  }
  return <div className="app-shell">
    <div className="scanlines" />
    <header className="hero">
      <div className="brand-mark"><i /><i /><i /></div>
      <div><span className="eyebrow">NEW ERIDU DATABASE // ACHIEVEMENTS</span><h1>ZZZ <b>TRACKER</b></h1><p>Трекер достижений Zenless Zone Zero</p></div>
      <div className="hero-actions">
        <button onClick={() => downloadProgress(progress)}>Экспорт</button>
        <button onClick={() => fileInput.current?.click()}>Импорт</button>
        <button className="danger-button" onClick={resetProgress}>Сброс</button>
        <input ref={fileInput} type="file" accept="application/json" hidden onChange={event => handleImport(event.target.files?.[0])} />
      </div>
    </header>
    <Stats total={catalog.count || catalog.achievements.length} completed={completed} earned={earned} available={available} />
    <main className="workspace">
      <Sidebar activeSection={activeSection} sections={sections} series={series} activeSeries={activeSeries} onSection={selectSection} onSeries={setActiveSeries} />
      <section className="content">
        <Filters search={search} status={status} version={version} versions={versions} showHidden={showHidden} onSearch={setSearch} onStatus={setStatus} onVersion={setVersion} onShowHidden={setShowHidden} />
        <div className="content-heading"><div><span>{sectionLabels[activeSection]}</span><h2>{activeSeries === null ? "Все достижения" : series.find(item => item.id === activeSeries)?.name}</h2></div><strong>{filtered.length}</strong></div>
        {loadError && <div className="empty-state"><h3>Каталог не загрузился</h3><p>{loadError}</p><code>npm run sync</code></div>}
        {!loadError && catalog.achievements.length === 0 && <div className="empty-state"><h3>База достижений пока пуста</h3><p>Открой терминал в папке проекта и выполни команду:</p><code>npm run sync</code><p>После этого обнови страницу.</p></div>}
        <div className="achievement-list">
          {filtered.map(item => <AchievementCard key={item.id} achievement={item} progress={progress[String(item.id)] ?? emptyItem} onCompleted={() => toggleCompleted(item.id)} onFavorite={() => toggleFavorite(item.id)} onNote={note => update(item.id, {note})} />)}
        </div>
      </section>
    </main>
    <footer><span>CATALOG: {catalog.updatedAt ? new Date(catalog.updatedAt).toLocaleString("ru-RU") : "не синхронизирован"}</span><span>LOCAL PROGRESS // OFFLINE FIRST</span></footer>
  </div>;
}
