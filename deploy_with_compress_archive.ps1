$utf8 = New-Object System.Text.UTF8Encoding($false)
$dir = "C:\Users\97254\.gemini\antigravity\scratch\oz-store"
$zipPath = Join-Path $dir "site_deploy.zip"

if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

$filesToCompress = @()
foreach ($f in @("index.html", "google_merchant_feed.xml", "sitemap.xml", "robots.txt", "_headers")) {
    $p = Join-Path $dir $f
    if (Test-Path $p) { $filesToCompress += $p }
}

$publicDir = Join-Path $dir "public"
if (Test-Path $publicDir) {
    $filesToCompress += $publicDir
}

Compress-Archive -Path $filesToCompress -DestinationPath $zipPath -Force
Write-Host "✅ Zip archive created at:" $zipPath "(Size:" (Get-Item $zipPath).Length "bytes)"

$bytes = [System.IO.File]::ReadAllBytes($zipPath)
$response = Invoke-RestMethod -Uri "https://api.netlify.com/api/v1/sites" -Method Post -Body $bytes -ContentType "application/zip"

Write-Host "=== DEPLOYMENT SUCCESSFUL ==="
Write-Host "Live Netlify URL:" $response.ssl_url
Write-Host "Subdomain:" $response.subdomain
Write-Host "Admin URL:" $response.admin_url

$deployInfo = @{
    ssl_url = $response.ssl_url
    subdomain = $response.subdomain
    admin_url = $response.admin_url
    site_id = $response.site_id
    updated_at = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
} | ConvertTo-Json

[System.IO.File]::WriteAllText((Join-Path $dir "deploy_info.json"), $deployInfo, $utf8)
