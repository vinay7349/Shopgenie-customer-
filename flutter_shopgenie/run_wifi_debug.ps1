param(
    [string]$DeviceId
)

$ErrorActionPreference = 'Stop'
$network = Get-NetIPConfiguration |
    Where-Object { $_.NetAdapter.Status -eq 'Up' -and $_.IPv4DefaultGateway -and $_.IPv4Address } |
    Select-Object -First 1
$lanAddress = $network.IPv4Address.IPAddress |
    Where-Object { $_ -notmatch '^(127\.|169\.254\.)' } |
    Select-Object -First 1

if (-not $lanAddress) {
    throw 'No active LAN IPv4 address was found. Connect this PC to the same Wi-Fi network as the phone.'
}

$apiUrl = "http://${lanAddress}:8000"
try {
    $health = Invoke-RestMethod -Uri "${apiUrl}/api/" -TimeoutSec 5
    if ($health.service -ne 'ShopGenie Django API') {
        throw 'The response did not identify itself as the ShopGenie Django API.'
    }
}
catch {
    throw "Django is not reachable at ${apiUrl}/api/. Start it in shopgenie_unified with .\run_lan.ps1. Details: $($_.Exception.Message)"
}

$flutterArgs = @('run', "--dart-define=BASE_URL=$apiUrl")
if ($DeviceId) {
    $flutterArgs += @('-d', $DeviceId)
}

Write-Host "Using backend: $apiUrl/api"
Write-Host 'The phone and PC must remain on the same Wi-Fi network.'
& flutter @flutterArgs
if ($LASTEXITCODE -ne 0) {
    throw "flutter run failed with exit code $LASTEXITCODE."
}
