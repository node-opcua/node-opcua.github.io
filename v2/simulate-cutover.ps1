#!/usr/bin/env pwsh
# simulate-cutover.ps1
# Builds the Astro site in production mode (base: '/') and serves it
# alongside the existing Jekyll content for local preview.
#
# Usage: .\v2\simulate-cutover.ps1
# Then open http://localhost:8080/

$ErrorActionPreference = "Stop"
$root = "c:\sterfive\node-opcua.github.io"
$v2 = "$root\v2"
$preview = "$v2\preview_prod"

Write-Host "`n=== Step 1: Temporarily switch to production config ===" -ForegroundColor Cyan

# Back up the staging .env and astro.config
Copy-Item "$v2\.env" "$v2\.env.bak" -Force
Copy-Item "$v2\astro.config.mjs" "$v2\astro.config.mjs.bak" -Force

# Create a production .env (no staging flag, GA ID preserved)
@"
# Production simulation - no staging flag
PUBLIC_GA_MEASUREMENT_ID=G-J4DZPPT47Y
"@ | Set-Content "$v2\.env"

# Flip base to '/'
(Get-Content "$v2\astro.config.mjs") -replace "base: '/v2'", "base: '/'" | Set-Content "$v2\astro.config.mjs"

Write-Host "  Config flipped to base: '/'" -ForegroundColor Green

Write-Host "`n=== Step 2: Build Astro in production mode ===" -ForegroundColor Cyan
Push-Location $v2
npm run build
Pop-Location

Write-Host "`n=== Step 3: Assemble the preview root ===" -ForegroundColor Cyan

# Clean preview dir
if (Test-Path $preview) { Remove-Item "$preview\*" -Recurse -Force }

# Copy Astro dist (the new site root)
Copy-Item "$v2\dist\*" $preview -Recurse -Force

# Layer in Jekyll content that coexists
# api_doc
if (Test-Path "$root\api_doc") {
    Copy-Item "$root\api_doc" "$preview\api_doc" -Recurse -Force
    Write-Host "  Copied /api_doc/" -ForegroundColor Green
}

# Keep the Google verification file
if (Test-Path "$root\googlea35ecc050f9ca765.html") {
    Copy-Item "$root\googlea35ecc050f9ca765.html" "$preview\" -Force
}

# NOTE: Do NOT copy the old Jekyll feed.xml — the Astro RSS endpoint
# (feed.xml.ts) is the single source of truth for /feed.xml.

Write-Host "`n=== Step 4: Restore staging config ===" -ForegroundColor Cyan
Copy-Item "$v2\.env.bak" "$v2\.env" -Force
Copy-Item "$v2\astro.config.mjs.bak" "$v2\astro.config.mjs" -Force
Remove-Item "$v2\.env.bak" -Force
Remove-Item "$v2\astro.config.mjs.bak" -Force
Write-Host "  Staging config restored" -ForegroundColor Green

Write-Host "`n=== Step 5: Serve ===" -ForegroundColor Cyan
Write-Host "  Starting local server at http://localhost:8080/" -ForegroundColor Yellow
Write-Host "  Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

npx -y http-server $preview -p 8080 -c-1
