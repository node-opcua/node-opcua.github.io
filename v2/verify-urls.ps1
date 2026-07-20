#!/usr/bin/env pwsh
# verify-urls.ps1 — checks all 13 legacy URLs exist in dist/
$urls = @(
    "tutorial/2015/07/05/weather-station.html",
    "tutorial/2015/07/05/weather-stationold.html",
    "tutorial/2015/12/05/objecttype-and-object-instantiation.html",
    "news/2015/12/05/nodejs-5.0.html",
    "tutorial/2018/01/22/node-opcua-embraces-async-await.html",
    "info/2019/01/15/node-opcua-goes-typescript.html",
    "concepts/2022/02/16/node-opcua-pubsub-episode1.html",
    "news/2023/06/07/when-seamless-operation-sparks-sustainable-partneship.html",
    "news/2023/07/08/ride-the-open-source-wave-with-node-opcua.html",
    "news/2023/10/04/node-opcua-open-source-is-permanent-beta.html",
    "news/2024/03/19/OPC-UA-Model-vs-tag-naming-convention.html",
    "2025/02/12/boosting-opcua-client-performance.html"
)

$pass = 0
$fail = 0
foreach ($u in $urls) {
    $path = "dist/$u"
    if (Test-Path $path) {
        Write-Host "OK   $u" -ForegroundColor Green
        $pass++
    } else {
        Write-Host "MISS $u" -ForegroundColor Red
        $fail++
    }
}

# Extra checks
$extras = @(
    "feed.xml",
    "googlea35ecc050f9ca765.html",
    "about.html",
    ".nojekyll",
    "index.html",
    "news.html",
    "projects.html",
    "commercial-use.html",
    "privacy.html",
    "getting-started.html",
    "role_based_security.html",
    "release-notes/2026/06/30/v2-174-0-role-based-security.html"
)

Write-Host ""
Write-Host "--- Extra files ---"
foreach ($e in $extras) {
    $path = "dist/$e"
    if (Test-Path $path) {
        Write-Host "OK   $e" -ForegroundColor Green
        $pass++
    } else {
        Write-Host "MISS $e" -ForegroundColor Red
        $fail++
    }
}

# Redirect stubs
$stubs = @(
    "posts.html",
    "tutorial/index.html",
    "news/index.html",
    "info/index.html",
    "concepts/index.html"
)

Write-Host ""
Write-Host "--- Redirect stubs ---"
foreach ($s in $stubs) {
    $path = "dist/$s"
    if (Test-Path $path) {
        Write-Host "OK   $s" -ForegroundColor Green
        $pass++
    } else {
        Write-Host "MISS $s" -ForegroundColor Red
        $fail++
    }
}

Write-Host ""
Write-Host "=== Results: $pass OK, $fail MISS ==="
if ($fail -gt 0) { exit 1 }
