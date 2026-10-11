# SmartSpace AI - PowerShell One-Click Launcher (Local Network & Localhost)
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting Intent-to-Interface: Adaptive AI Workspace" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$root = $PSScriptRoot
if (-not $root) { $root = Get-Location }

# Detect Local LAN IP Address
$localIp = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias 'Wi-Fi*','Ethernet*' -ErrorAction SilentlyContinue | Select-Object -First 1).IPAddress
if (-not $localIp) {
    try {
        $localIp = ([System.Net.Dns]::GetHostAddresses([System.Net.Dns]::GetHostName()) | Where-Object { $_.AddressFamily -eq 'InterNetwork' -and $_.IPAddressToString -ne '127.0.0.1' } | Select-Object -First 1).IPAddressToString
    } catch {
        $localIp = "127.0.0.1"
    }
}

Write-Host "[1/3] Starting FastAPI Backend on 0.0.0.0:8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\backend'; `$env:PYTHONPATH = '.'; python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

Start-Sleep -Seconds 3

Write-Host "[2/3] Starting React Frontend on 0.0.0.0:5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\frontend'; npm run dev -- --host 0.0.0.0 --port 5173"

Start-Sleep -Seconds 3

Write-Host "[3/3] Opening Web Browser at http://localhost:5173/..." -ForegroundColor Green
Start-Process "http://localhost:5173/"

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Workspace is running on Local Network!" -ForegroundColor Green
Write-Host "  - Local PC:       http://localhost:5173/" -ForegroundColor White
Write-Host "  - Mobile / LAN:   http://$localIp`:5173/" -ForegroundColor Yellow
Write-Host "  - Backend API:    http://$localIp`:8000/docs" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Kisi bhi phone ya doosre computer par 'http://$localIp`:5173/' kholein." -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit this launcher window (servers keep running)..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
