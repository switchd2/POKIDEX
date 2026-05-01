# PokéWiki All-in-One Startup Script

Write-Host "🚀 Starting PokéWiki Stack..." -ForegroundColor Cyan

# 1. Start all containers in background
podman-compose up -d --build

Write-Host "⏳ Waiting for Database to be ready..." -ForegroundColor Yellow
# Loop until postgres is healthy
$retryCount = 0
while ($retryCount -lt 15) {
    $status = podman inspect -f '{{.State.Health.Status}}' pokewiki_postgres 2>$null
    if ($status -eq "healthy") {
        Write-Host "✅ Database is ready!" -ForegroundColor Green
        break
    }
    Write-Host "..."
    Start-Sleep -Seconds 3
    $retryCount++
}

# 2. Run Migrations
Write-Host "🔄 Running Database Migrations..." -ForegroundColor Yellow
podman exec pokidex_backend npx prisma migrate deploy

# 3. Seed Data
Write-Host "🌱 Seeding Pokémon Data..." -ForegroundColor Yellow
podman exec pokidex_backend npm run prisma:seed

Write-Host "✨ Everything is up and running!" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔌 Backend API: http://localhost:4000/api/v1" -ForegroundColor Cyan

# 4. Show logs
Write-Host "📝 Attaching to logs (Press Ctrl+C to stop logs, containers will keep running)..." -ForegroundColor Gray
podman-compose logs -f
