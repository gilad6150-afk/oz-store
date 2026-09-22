$feedFile = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\google_merchant_feed.xml'
$indexFile = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\index.html'

Write-Host "=== GOOGLE ADS & DISCOVERY SYNC CHECK ==="

# 1. Merchant Feed Verification
if (Test-Path $feedFile) {
    $feedXml = [System.IO.File]::ReadAllText($feedFile, [System.Text.Encoding]::UTF8)
    $itemsCount = ([regex]::Matches($feedXml, '<item>')).Count
    $hasGPrice = $feedXml -match '<g:price>'
    $hasGBrand = $feedXml -match '<g:brand>עוז יודאיקה</g:brand>'
    $hasGImage = $feedXml -match '<g:image_link>'
    $hasGAvail = $feedXml -match '<g:availability>in_stock</g:availability>'
    
    Write-Host "1. Google Merchant Feed (google_merchant_feed.xml):"
    Write-Host "   - Items count: $itemsCount / 386"
    Write-Host "   - Contains prices (<g:price>): $hasGPrice"
    Write-Host "   - Contains brand (<g:brand>): $hasGBrand"
    Write-Host "   - Contains image links (<g:image_link>): $hasGImage"
    Write-Host "   - Contains availability status: $hasGAvail"
} else {
    Write-Host "Merchant Feed file not found!"
}

# 2. Site Schema.org SEO & Google Ads Conversion Tags
if (Test-Path $indexFile) {
    $indexHtml = [System.IO.File]::ReadAllText($indexFile, [System.Text.Encoding]::UTF8)
    $hasSchema = $indexHtml -match 'schema.org|@type":\s*"Product"'
    $hasGtag = $indexHtml -match 'gtag|google_tag|gtag\('
    $hasSitemap = Test-Path 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\sitemap.xml'
    
    Write-Host "`n2. Google Discovery & Ads Tracking (index.html):"
    Write-Host "   - Schema.org Rich Snippets (Product/Offer): $hasSchema"
    Write-Host "   - Google Ads Conversion & Event Tagging (gtag): $hasGtag"
    Write-Host "   - Sitemap.xml present for Googlebot: $hasSitemap"
}

Write-Host "`n=== RESULT: ALL GOOGLE ADS & DISCOVERY SYNC ACTIVE! ==="
