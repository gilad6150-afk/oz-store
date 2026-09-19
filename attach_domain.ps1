$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)
$zipPath = "C:\Users\97254\.gemini\antigravity\scratch\oz-store\site_deploy.zip"

Write-Host "1. Uploading site ZIP to Netlify..."
$zipBytes = [System.IO.File]::ReadAllBytes($zipPath)

$res = Invoke-RestMethod -Uri "https://api.netlify.com/api/v1/sites" -Method Post -Body $zipBytes -ContentType "application/zip"
$siteId = $res.site_id
Write-Host "Netlify Site ID:" $siteId
Write-Host "Default Netlify App URL:" $res.ssl_url

Write-Host "2. Registering custom domain oz-judaica.co.il on Netlify..."
$bodyJson = @{
    custom_domain = "oz-judaica.co.il"
    domain_aliases = @("www.oz-judaica.co.il")
} | ConvertTo-Json

$res2 = Invoke-RestMethod -Uri "https://api.netlify.com/api/v1/sites/$siteId" -Method Put -Body $bodyJson -ContentType "application/json"

Write-Host "=== NETLIFY DOMAIN REGISTRATION COMPLETE ==="
Write-Host "Custom Domain:" $res2.custom_domain
Write-Host "SSL URL:" $res2.ssl_url
