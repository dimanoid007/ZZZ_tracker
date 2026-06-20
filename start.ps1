$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "Node.js не найден. Установи Node.js LTS с nodejs.org" -ForegroundColor Red
  Read-Host "Нажми Enter"
  exit 1
}
if (-not (Test-Path "node_modules")) {
  Write-Host "Установка зависимостей..." -ForegroundColor Cyan
  npm install
  if ($LASTEXITCODE -ne 0) {
    Write-Host "Не удалось установить зависимости." -ForegroundColor Red
    Read-Host "Нажми Enter"
    exit $LASTEXITCODE
  }
}
Write-Host "Загрузка актуальных достижений..." -ForegroundColor Cyan
npm run sync
if ($LASTEXITCODE -ne 0) {
  Write-Host "Источник достижений сейчас недоступен. Трекер запустится с последней сохранённой базой." -ForegroundColor Yellow
}
Write-Host "Запуск трекера..." -ForegroundColor Green
npm run dev
