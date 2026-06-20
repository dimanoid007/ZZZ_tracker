interface Props {
  total: number;
  completed: number;
  earned: number;
  available: number;
}
export function Stats({total, completed, earned, available}: Props) {
  const percent = total ? Math.round(completed / total * 100) : 0;
  return <section className="stats-grid" aria-label="Статистика">
    <article className="stat-card"><span>Прогресс</span><strong>{percent}%</strong><div className="progress-track"><i style={{width: `${percent}%`}} /></div></article>
    <article className="stat-card"><span>Выполнено</span><strong>{completed}<small> / {total}</small></strong></article>
    <article className="stat-card"><span>Получено полихромов</span><strong>{earned}</strong></article>
    <article className="stat-card"><span>Всего полихромов</span><strong>{available}</strong></article>
  </section>;
}
