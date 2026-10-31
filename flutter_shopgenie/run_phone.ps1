[CmdletBinding()]
param(
    [string]$DeviceId
)

$ErrorActionPreference = 'Stop'

$networks = @(
    Get-NetIPConfiguration |
        Where-Object {
            $_.NetAdapter.Status -eq 'Up' -and
            $_.IPv4DefaultGateway -and
            $_.IPv4Address
        }
)
$wifiNetworks = @(
    $networks |
        Where-Object {
            $_.InterfaceAlias -match '(?i)wi-?fi|wireless|wlan' -or
            $_.NetAdapter.InterfaceDescription -match '(?i)wi-?fi|wireless|wlan'
        }
)
$otherNetworks = @(
    $networks |
        Where-Object {
            $_.InterfaceAlias -notmatch '(?i)wi-?fi|wireless|wlan' -and
            $_.NetAdapter.InterfaceDescription -notmatch '(?i)wi-?fi|wireless|wlan'
        }
)

$lanAddress = $null
foreach ($network in @($wifiNetworks) + @($otherNetworks)) {
    $lanAddress = $network.IPv4Address.IPAddress |
        Where-Object { $_ -notmatch '^(127\.|169\.254\.|0\.)' } |
        Select-Object -First 1
    if ($lanAddress) {
        break
    }
}

if (-not $lanAddress) {
    throw 'No active Wi-Fi IPv4 address was found. Connect this PC to the same Wi-Fi network as the phone.'
}

$apiBaseUrl = "http://${lanAddress}:8000"
try {
    $health = Invoke-RestMethod -Uri "${apiBaseUrl}/api/" -Method Get -TimeoutSec 5
}
catch {
    throw "ShopGenie Django is not reachable at ${apiBaseUrl}/api/. If it is already running on localhost only, stop that instance and start it once with .\run_lan.ps1. Details: $($_.Exception.Message)"
}

if ($health.service -ne 'ShopGenie Django API' -or $health.status -ne 'online') {
    throw "The health endpoint at ${apiBaseUrl}/api/ returned an unexpected response. Expected service 'ShopGenie Django API' with status 'online'."
}

if (-not (Get-Command flutter -ErrorAction SilentlyContinue)) {
    throw 'Flutter was not found on PATH. Add the Flutter SDK bin directory to PATH and retry.'
}

Write-Host "Backend health check passed: ${apiBaseUrl}/api/" -ForegroundColor Green
Write-Host 'Starting the ShopGenie Customer app. The phone and PC must use the same trusted Wi-Fi network.'

$flutterArgs = @('run', "--dart-define=BASE_URL=$apiBaseUrl")
if ($DeviceId) {
    $flutterArgs += @('--device-id', $DeviceId)
}

Push-Location $PSScriptRoot
try {
    & flutter @flutterArgs
    if ($LASTEXITCODE -ne 0) {
        throw "flutter run failed with exit code $LASTEXITCODE."
    }
}
finally {
    Pop-Location
}
