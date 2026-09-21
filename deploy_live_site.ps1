$utf8 = New-Object System.Text.UTF8Encoding($false)
$dir = "C:\Users\97254\.gemini\antigravity\scratch\oz-store"
$zipPath = Join-Path $dir "site_deploy.zip"

if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

Add-Type -AssemblyName System.IO.Compression.FileSystem

$zip = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)

function Add-FileToZip($zipArchive, $filePath, $entryName) {
    if (Test-Path $filePath) {
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zipArchive, $filePath, $entryName) | Out-Null
        Write-Host "Added to zip:" $entryName
    }
}

Add-FileToZip $zip (Join-Path $dir "index.html") "index.html"
Add-FileToZip $zip (Join-Path $dir "google_merchant_feed.xml") "google_merchant_feed.xml"
Add-FileToZip $zip (Join-Path $dir "sitemap.xml") "sitemap.xml"
Add-FileToZip $zip (Join-Path $dir "robots.txt") "robots.txt"
Add-FileToZip $zip (Join-Path $dir "_headers") "_headers"

$publicDir = Join-Path $dir "public"
if (Test-Path $publicDir) {
    $publicFiles = Get-ChildItem -Path $publicDir -Recurse -File
    foreach ($pf in $publicFiles) {
        $rel = "public/" + $pf.FullName.Substring($publicDir.Length + 1).Replace("\", "/")
        Add-FileToZip $zip $pf.FullName $rel
    }
}

$zip.Dispose()

Write-Host "✅ Zip package created! Deploying to Netlify API..."

$bytes = [System.IO.File]::ReadAllBytes($zipPath)

$response = Invoke-RestMethod -Uri "https://api.netlify.com/api/v1/sites" -Method Post -Body $bytes -ContentType "application/zip"

Write-Host "=== DEPLOYMENT SUCCESSFUL ==="
Write-Host "Live URL:" $response.ssl_url
Write-Host "Site Subdomain:" $response.subdomain
Write-Host "Admin Dashboard:" $response.admin_url

$deployInfo = @{
    ssl_url = $response.ssl_url
    subdomain = $response.subdomain
    admin_url = $response.admin_url
    site_id = $response.site_id
    updated_at = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
} | ConvertTo-Json

[System.IO.File]::WriteAllText((Join-Path $dir "deploy_info.json"), $deployInfo, $utf8)
