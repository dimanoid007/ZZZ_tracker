$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
$registry = "https://registry.npmjs.org/"
function Wait-ForEnter {
  Read-Host "Нажми Enter"
}
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "Node.js не найден. Установи актуальную LTS-версию Node.js с nodejs.org." -ForegroundColor Red
  Wait-ForEnter
  exit 1
}
$nodeVersionText = (& node -p "process.versions.node").Trim()
$nodeMajor = [int]($nodeVersionText.Split('.')[0])
$nodeMinor = [int]($nodeVersionText.Split('.')[1])
if (($nodeMajor -lt 20) -or (($nodeMajor -eq 20) -and ($nodeMinor -lt 19))) {
  Write-Host "Установлена Node.js $nodeVersionText. Для этого проекта нужна Node.js 20.19 или новее." -ForegroundColor Red
  Wait-ForEnter
  exit 1
}
$lockPath = Join-Path $PSScriptRoot "package-lock.json"
if (Test-Path $lockPath) {
  $lockContent = Get-Content $lockPath -Raw
  if ($lockContent -match "applied-caas-gateway1\.internal\.api\.openai\.org") {
    Write-Host "Исправление адресов npm в package-lock.json..." -ForegroundColor Yellow
    $lockContent = $lockContent.Replace(
      "https://packages.applied-caas-gateway1.internal.api.openai.org/artifactory/api/npm/npm-public/",
      $registry
    )
    [System.IO.File]::WriteAllText($lockPath, $lockContent, [System.Text.UTF8Encoding]::new($false))
  }
}
$viteCommand = Join-Path $PSScriptRoot "node_modules\.bin\vite.cmd"
if (-not (Test-Path $viteCommand)) {
  if (Test-Path "node_modules") {
    Write-Host "Удаление незавершённой установки зависимостей..." -ForegroundColor Yellow
    Remove-Item "node_modules" -Recurse -Force
  }
  Write-Host "Установка зависимостей из официального npm-реестра..." -ForegroundColor Cyan
  & npm.cmd install --registry=$registry --no-audit --no-fund
  if ($LASTEXITCODE -ne 0) {
    Write-Host "Не удалось установить зависимости." -ForegroundColor Red
    Write-Host "Проверь интернет, VPN/прокси и доступ к registry.npmjs.org." -ForegroundColor Yellow
    Wait-ForEnter
    exit $LASTEXITCODE
  }
}
Write-Host "Загрузка актуальных достижений..." -ForegroundColor Cyan
& npm.cmd run sync
if ($LASTEXITCODE -ne 0) {
  Write-Host "Источник достижений сейчас недоступен. Трекер запустится с последней сохранённой базой." -ForegroundColor Yellow
}
Write-Host "Запуск трекера..." -ForegroundColor Green
& npm.cmd run dev
