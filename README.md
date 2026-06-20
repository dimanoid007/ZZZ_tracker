# ZZZ Tracker
Трекер достижений Zenless Zone Zero с автоматическим каталогом, категориями, фильтрами и локальным прогрессом.
## Что уже есть
- автоматическая загрузка всех достижений из StarDB API;
- категории «Жизнь», «Тактика», «Исследование», «Аркада»;
- автоматические подкатегории по сериям достижений;
- поиск, фильтры статуса, версии и скрытых достижений;
- уровни награды Bronze, Silver и Gold;
- общий прогресс и подсчёт полихромов;
- избранное и личные заметки;
- хранение прогресса в LocalStorage;
- импорт и экспорт прогресса в JSON;
- адаптивный ZZZ-интерфейс;
- автоматическое ежедневное обновление и деплой через GitHub Actions.
## Первый запуск на Windows
1. Установи Node.js LTS.
2. Дважды нажми `start.bat`.
3. Скрипт установит зависимости, загрузит достижения и запустит сайт.
Ручной запуск:
```powershell
npm install
npm run sync
npm run dev
```
После запуска открой адрес, показанный в терминале, обычно `http://localhost:5173`.
## Команды
```powershell
npm run dev
npm run sync
npm run check
npm run build
npm run preview
```
## Как обновляется каталог
Команда `npm run sync` получает список из:
```text
https://stardb.gg/api/zzz/achievements?lang=ru
```
Результат сохраняется в `public/data/achievements-ru.json`. Прогресс пользователя хранится отдельно под ключом `zzz_ach_progress_v3`, поэтому обновление каталога его не удаляет.
## GitHub Pages
1. Создай пустой репозиторий на GitHub.
2. Добавь удалённый репозиторий:
```powershell
git remote add origin https://github.com/ТВОЙ_ЛОГИН/ZZZ_tracker.git
git push -u origin main
```
3. В GitHub открой `Settings → Pages` и в Source выбери `GitHub Actions`.
Workflow `.github/workflows/deploy.yml` будет обновлять каталог каждый день и публиковать сайт.
## Структура
```text
src/components       компоненты интерфейса
src/hooks            логика прогресса
src/lib              категории и LocalStorage
public/data           каталог достижений
scripts               синхронизация каталога
.github/workflows     автодеплой
```
## Важно
StarDB — неофициальный источник данных. При изменении его API нужно заменить `ZZZ_ACHIEVEMENTS_URL` или обновить нормализацию в `scripts/sync-achievements.mjs`.
## Если npm сообщает ETIMEDOUT

Проект принудительно использует официальный реестр `https://registry.npmjs.org/`. Запускай `start.bat`: он удалит незавершённую папку `node_modules` и повторит установку.
