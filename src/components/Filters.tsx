import type {StatusFilter} from "../types";
interface Props {
  search: string;
  status: StatusFilter;
  version: string;
  versions: string[];
  showHidden: boolean;
  onSearch: (value: string) => void;
  onStatus: (value: StatusFilter) => void;
  onVersion: (value: string) => void;
  onShowHidden: (value: boolean) => void;
}
export function Filters({search, status, version, versions, showHidden, onSearch, onStatus, onVersion, onShowHidden}: Props) {
  return <section className="filters panel">
    <label className="search-box"><span>⌕</span><input value={search} onChange={event => onSearch(event.target.value)} placeholder="Поиск по названию и описанию" /></label>
    <select value={status} onChange={event => onStatus(event.target.value as StatusFilter)} aria-label="Статус">
      <option value="all">Все статусы</option>
      <option value="remaining">Не выполнено</option>
      <option value="completed">Выполнено</option>
      <option value="favorite">Избранное</option>
    </select>
    <select value={version} onChange={event => onVersion(event.target.value)} aria-label="Версия">
      <option value="all">Все версии</option>
      {versions.map(item => <option key={item} value={item}>Версия {item}</option>)}
    </select>
    <label className="switch"><input type="checkbox" checked={showHidden} onChange={event => onShowHidden(event.target.checked)} /><i /><span>Скрытые</span></label>
  </section>;
}
