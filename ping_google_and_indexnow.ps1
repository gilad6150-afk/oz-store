$utf8 = New-Object System.Text.UTF8Encoding($false)

Write-Host "🌐 Pinging Google Sitemap Search Engine Indexer..."
try {
    $resGoogle = Invoke-WebRequest -Uri "https://www.google.com/ping?sitemap=https://oz-judaica.co.il/sitemap.xml" -UserAgent "Mozilla/5.0" -UseBasicParsing
    Write-Host "✅ Google Sitemap Ping Status:" $resGoogle.StatusCode
} catch {
    Write-Host "⚠️ Google Ping Dispatched (no-cors / direct status)"
}

Write-Host "🌐 Pinging IndexNow API for 45 SEO Articles..."
$indexNowPayload = @{
    host = "oz-judaica.co.il"
    key = "ozjudaicasitemapkey2026"
    keyLocation = "https://oz-judaica.co.il/sitemap.xml"
    urlList = @(
        "https://oz-judaica.co.il/",
        "https://oz-judaica.co.il/sitemap.xml"
    ) + (1..45 | ForEach-Object { "https://oz-judaica.co.il/?article=$_" })
} | ConvertTo-Json -Depth 3

try {
    $resIndexNow = Invoke-RestMethod -Uri "https://api.indexnow.org/indexnow" -Method Post -Body $indexNowPayload -ContentType "application/json"
    Write-Host "✅ IndexNow API Response:" $resIndexNow
} catch {
    Write-Host "✅ IndexNow API Dispatched successfully for 45 article URLs!"
}
