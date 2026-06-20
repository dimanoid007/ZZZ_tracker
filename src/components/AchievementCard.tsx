import type {Achievement, AchievementProgress} from "../types";
import {getDifficultyLabel, getTier} from "../lib/categories";
interface Props {
  achievement: Achievement;
  progress: AchievementProgress;
  onCompleted: () => void;
  onFavorite: () => void;
  onNote: (note: string) => void;
}
export function AchievementCard({achievement, progress, onCompleted, onFavorite, onNote}: Props) {
  const tier = getTier(achievement.reward);
  const difficulty = getDifficultyLabel(achievement.difficulty);
  return <article className={`achievement-card ${progress.completed ? "completed" : ""} tier-${tier}`}>
    <div className="card-accent" />
    <button className={`check-button ${progress.completed ? "checked" : ""}`} onClick={onCompleted} aria-label={progress.completed ? "Снять отметку" : "Отметить выполненным"}>{progress.completed ? "✓" : ""}</button>
    <div className="achievement-content">
      <div className="achievement-topline">
        <span className={`tier-badge ${tier}`}>{tier === "gold" ? "GOLD" : tier === "silver" ? "SILVER" : "BRONZE"}</span>
        {achievement.version && <span className="tag">v{achievement.version}</span>}
        {achievement.hidden && <span className="tag warning">Скрытое</span>}
        {difficulty && <span className="tag">{difficulty}</span>}
        {achievement.missable && <span className="tag danger">Пропускаемое</span>}
        {achievement.timegated && <span className="tag warning">По времени</span>}
      </div>
      <h3>{achievement.name}</h3>
      <p>{achievement.description}</p>
      {achievement.comment && <div className="hint">{achievement.comment}</div>}
      <input className="note-input" value={progress.note} onChange={event => onNote(event.target.value)} placeholder="Личная заметка…" />
    </div>
    <div className="achievement-side">
      <button className={`favorite-button ${progress.favorite ? "active" : ""}`} onClick={onFavorite} aria-label="Избранное">★</button>
      <strong>{achievement.reward}</strong><small>полихромов</small>
      <span className="achievement-id">#{achievement.id}</span>
    </div>
  </article>;
}
