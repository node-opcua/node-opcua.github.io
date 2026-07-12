# dev.ps1
# Runs the Astro dev server for node-opcua.github.io v2-rebuild

$originalLocation = Get-Location

try {
    Set-Location -Path "$PSScriptRoot\v2"
    Write-Host "Starting Astro dev server on http://localhost:4321/v2 ..." -ForegroundColor Cyan
    npm run dev
}
finally {
    Set-Location -Path $originalLocation
}
