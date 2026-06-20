import type {AchievementSection} from "../types";
import {sectionDescriptions, sectionLabels} from "../lib/categories";
interface Props {
  activeSection: AchievementSection;
  sections: Array<{id: AchievementSection; count: number; completed: number}>;
  series: Array<{id: number; name: string; count: number; completed: number}>;
  activeSeries: number | null;
  onSection: (section: AchievementSection) => void;
  onSeries: (series: number | null) => void;
}
export function Sidebar({activeSection, sections, series, activeSeries, onSection, onSeries}: Props) {
  return <aside className="sidebar panel">
    <div className="panel-title"><span>КАТЕГОРИИ</span><b>01</b></div>
    <nav className="section-list">
      {sections.map(item => <button key={item.id} className={activeSection === item.id ? "active" : ""} onClick={() => onSection(item.id)}>
        <span><strong>{sectionLabels[item.id]}</strong><small>{sectionDescriptions[item.id]}</small></span>
        <em>{item.completed}/{item.count}</em>
      </button>)}
    </nav>
    <div className="panel-title subcategory-title"><span>ПОДКАТЕГОРИИ</span><b>02</b></div>
    <nav className="series-list">
      <button className={activeSeries === null ? "active" : ""} onClick={() => onSeries(null)}><span>Все в категории</span><em>{series.reduce((sum, item) => sum + item.count, 0)}</em></button>
      {series.map(item => <button key={item.id} className={activeSeries === item.id ? "active" : ""} onClick={() => onSeries(item.id)}>
        <span>{item.name}</span><em>{item.completed}/{item.count}</em>
      </button>)}
    </nav>
  </aside>;
}
