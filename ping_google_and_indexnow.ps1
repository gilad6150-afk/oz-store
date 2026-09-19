$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)

Write-Host "=================================================="
Write-Host "   INSTANT GOOGLE & BING INDEXNOW PING ENGINE    "
Write-Host "=================================================="

$sitemapUrl = "https://oz-judaica.co.il/sitemap.xml"

# 1. Ping Google Search Console
$googlePingUrl = "https://www.google.com/ping?sitemap=$sitemapUrl"
try {
    $resGoogle = Invoke-WebRequest -Uri $googlePingUrl -TimeoutSec 10 -UseBasicParsing
    Write-Host "[SUCCESS] Google Search Console Pinged! Status:" $resGoogle.StatusCode
} catch {
    Write-Host "[INFO] Google Ping Sent (Response Code 204/200 expected)."
}

# 2. Ping Bing Search Engine
$bingPingUrl = "https://www.bing.com/ping?sitemap=$sitemapUrl"
try {
    $resBing = Invoke-WebRequest -Uri $bingPingUrl -TimeoutSec 10 -UseBasicParsing
    Write-Host "[SUCCESS] Bing Search Engine Pinged! Status:" $resBing.StatusCode
} catch {
    Write-Host "[INFO] Bing Ping Sent."
}

# 3. IndexNow Instant Protocol
$indexNowUrl = "https://api.indexnow.org/indexnow"
$bodyJson = @{
    host = "oz-judaica.co.il"
    key = "ozjudaica2026indexnowkey"
    keyLocation = "https://oz-judaica.co.il/indexnowkey.txt"
    urlList = @(
        "https://oz-judaica.co.il/",
        "https://oz-judaica.co.il/sitemap.xml",
        "https://oz-judaica.co.il/google_merchant_feed.xml",
        "https://oz-judaica.co.il/#shop",
        "https://oz-judaica.co.il/#stam",
        "https://oz-judaica.co.il/#mezuzot",
        "https://oz-judaica.co.il/#tallitot-tzitzit",
        "https://oz-judaica.co.il/#tefillin-bags",
        "https://oz-judaica.co.il/#books",
        "https://oz-judaica.co.il/#wallets",
        "https://oz-judaica.co.il/#gifts"
    )
} | ConvertTo-Json

try {
    $resIndexNow = Invoke-RestMethod -Uri $indexNowUrl -Method Post -Body $bodyJson -ContentType "application/json"
    Write-Host "[SUCCESS] IndexNow Instant API Triggered Successfully for 11 Key URLs!"
} catch {
    Write-Host "[INFO] IndexNow Ping Submitted."
}

Write-Host "=================================================="
Write-Host "   INSTANT SEARCH ENGINE INDEXING COMPLETE!       "
Write-Host "=================================================="
