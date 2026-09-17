$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)
$storeDir = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store'
$zipPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\site_deploy.zip'

if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

# Add System.IO.Compression.FileSystem assembly
Add-Type -AssemblyName System.IO.Compression.FileSystem

$zip = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)

# Add index.html
$indexPath = Join-Path $storeDir 'index.html'
if (Test-Path $indexPath) {
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $indexPath, 'index.html')
}

# Add public directory
$publicDir = Join-Path $storeDir 'public'
if (Test-Path $publicDir) {
    $files = Get-ChildItem -Path $publicDir -Recurse -File
    foreach ($file in $files) {
        $relativePath = "public/" + $file.Name
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file.FullName, $relativePath)
    }
}

$zip.Dispose()

Write-Host "ZIP file created successfully: $( (Get-Item $zipPath).Length ) bytes"

# Upload ZIP binary directly to Netlify API for anonymous instant site creation
$zipBytes = [System.IO.File]::ReadAllBytes($zipPath)

$headers = @{
    'Content-Type' = 'application/zip'
    'User-Agent' = 'AntigravityDeployEngine/1.0'
}

try {
    $response = Invoke-RestMethod -Uri 'https://api.netlify.com/api/v1/sites' -Method Post -Body $zipBytes -Headers $headers -ContentType 'application/zip'
    
    $liveUrl = $response.ssl_url
    if (-not $liveUrl) { $liveUrl = $response.url }
    $subdomain = $response.subdomain
    $adminUrl = $response.admin_url
    $siteId = $response.site_id
    
    Write-Host "=== DEPLOYMENT SUCCESSFUL ==="
    Write-Host "Live HTTPS URL: $liveUrl"
    Write-Host "Subdomain: $subdomain"
    Write-Host "Admin URL: $adminUrl"
    Write-Host "Site ID: $siteId"
    
    $resultJson = @{
        ssl_url = $liveUrl
        subdomain = $subdomain
        admin_url = $adminUrl
        site_id = $siteId
        status = 'success'
    } | ConvertTo-Json
    
    [System.IO.File]::WriteAllText("C:\Users\97254\.gemini\antigravity\scratch\oz-store\deploy_result.json", $resultJson, $utf8NoBOM)
} catch {
    Write-Host "Error uploading to Netlify API: $_"
}
