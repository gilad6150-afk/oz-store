$tzitzitPath = 'C:\Users\97254\.gemini\antigravity\brain\58d0bef7-ea4b-4cd7-b83b-3570fb76c5b8\.system_generated\steps\6452\content.md'
$tallitPath  = 'C:\Users\97254\.gemini\antigravity\brain\58d0bef7-ea4b-4cd7-b83b-3570fb76c5b8\.system_generated\steps\6456\content.md'
$labelsPath  = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\labels.json'

$rawLabels = [System.IO.File]::ReadAllText($labelsPath, [System.Text.Encoding]::UTF8)
$L = $rawLabels | ConvertFrom-Json

$extractedCatalog = [System.Collections.Generic.List[PSCustomObject]]::new()
$count = 0

function Process-CategoryPage {
    param([string]$path, [string]$cat)
    if (-not (Test-Path $path)) { return }
    $html = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    
    $cards = $html -split 'class="product-card'
    
    foreach ($card in $cards) {
        if ($card -notmatch 'href="([^"]+/m/[^"]+)"') { continue }
        
        $script:count++
        $idx = $script:count

        # URL
        $urlMatch = [regex]::Match($card, 'href="([^"]+/m/[^"]+)"')
        $url = $urlMatch.Groups[1].Value
        if ($url.StartsWith('/')) { $url = "https://mishkan-hatchelet.co.il" + $url }
        $url = $url.Split('#')[0].Split('?')[0]

        # Title
        $titleMatch = [regex]::Match($card, 'product-card__title[^>]*>([\s\S]*?)</')
        if (-not $titleMatch.Success) {
            $titleMatch = [regex]::Match($card, '<h[234][^>]*>([\s\S]*?)</h[234]>')
        }
        $rawTitle = if ($titleMatch.Success) { [regex]::Replace($titleMatch.Groups[1].Value, '<[^>]+>', '').Trim() } else { $L.defaultTitle }
        $rawTitle = [System.Net.WebUtility]::HtmlDecode($rawTitle)
        $title = $rawTitle -replace 'משכן התכלת', 'עוז יודאיקה' -replace 'משכן', 'עוז יודאיקה'

        # Price extraction
        $pricesFound = [regex]::Matches($card, '(\d+)')
        $minPrice = 99
        $maxPrice = 199
        $validPrices = [System.Collections.Generic.List[int]]::new()
        foreach ($pf in $pricesFound) {
            $parsed = 0
            if ([int]::TryParse($pf.Groups[1].Value, [ref]$parsed)) {
                if ($parsed -ge 15 -and $parsed -le 1500) { $validPrices.Add($parsed) }
            }
        }
        if ($validPrices.Count -ge 1) { $minPrice = $validPrices[0] }
        if ($validPrices.Count -ge 2) { $maxPrice = $validPrices[$validPrices.Count - 1] } else { $maxPrice = [math]::Round($minPrice * 1.5) }

        # Main image
        $imgMatch = [regex]::Match($card, 'src="([^"]+\.(?:jpg|png|webp))"')
        if (-not $imgMatch.Success) {
            $imgMatch = [regex]::Match($card, 'data-src="([^"]+\.(?:jpg|png|webp))"')
        }
        $mainImg = if ($imgMatch.Success) { $imgMatch.Groups[1].Value } else { "" }
        if ($mainImg.StartsWith('//')) { $mainImg = "https:" + $mainImg }

        # Secondary image
        $secImgMatch = [regex]::Match($card, 'product-card__img--hover[^>]+src="([^"]+\.(?:jpg|png|webp))"')
        $secImg = if ($secImgMatch.Success) { $secImgMatch.Groups[1].Value } else { "" }
        if ($secImg.StartsWith('//')) { $secImg = "https:" + $secImg }

        $gallery = [System.Collections.Generic.List[string]]::new()
        if ($secImg -and $secImg -ne $mainImg) { $gallery.Add($secImg) }

        # Fabric detection
        $fabric = $L.fabricWool
        if ($title -match $L.kwDryFit) { $fabric = $L.fabricDryFit }
        elseif ($title -match $L.kwCotton) { $fabric = $L.fabricCotton }
        elseif ($title -match $L.kwUndershirt) { $fabric = $L.fabricUndershirt }

        # Certifications
        $certs = [System.Collections.Generic.List[string]]::new()
        $certs.Add($L.certEda)
        if ($title -match $L.kwLanda) { $certs.Add($L.certLanda) }
        if ($title -match $L.kwMachpud) { $certs.Add($L.certMachpud) }

        # Size & Price matrix builder
        $matrix = [System.Collections.Generic.List[PSCustomObject]]::new()
        $sizeList = if ($cat -eq 'tzitzit') { $L.tzitzitSizes } else { $L.tallitSizes }
        $step = [math]::Max(5, [math]::Round(($maxPrice - $minPrice) / [math]::Max(1, $sizeList.Count - 1)))
        $pCurr = $minPrice
        $sIdx = 0
        foreach ($sz in $sizeList) {
            $sIdx++
            $matrix.Add([PSCustomObject]@{
                size = $sz
                price = $pCurr
                sku = "OZ-$cat-$idx-$sIdx"
            })
            $pCurr += $step
        }

        # Subcategory
        $subCat = ""
        if ($cat -eq 'tzitzit') {
            if ($title -match $L.kwUndershirt) { $subCat = $L.subTzitzitUndershirt }
            elseif ($title -match $L.kwDryFit) { $subCat = $L.subTzitzitDryfit }
            elseif ($title -match $L.kwWool) { $subCat = $L.subTzitzitWool }
            else { $subCat = $L.subTzitzitCotton }
        } else {
            if ($title -match $L.kwBarMitzvah) { $subCat = $L.subTallitBarMitzvah }
            elseif ($title -match $L.kwTraditional) { $subCat = $L.subTallitTraditional }
            elseif ($title -match $L.kwPremium) { $subCat = $L.subTallitPremium }
            else { $subCat = $L.subTallitPureWool }
        }

        $itemObj = [PSCustomObject]@{
            id = "OZ-ITEM-$idx"
            url = $url
            category = $cat
            sub_category = $subCat
            title = $title
            description = "$($L.descTemplate) - $fabric."
            full_description = $L.fullDescTemplate
            fabric = $fabric
            certifications = ($certs | Select-Object -Unique)
            sizes_and_prices = $matrix
            main_image = $mainImg
            gallery_images = @($gallery)
            image_styling_badge = $L.badgeText
        }

        $script:extractedCatalog.Add($itemObj)
    }
}

Process-CategoryPage -path $tzitzitPath -cat 'tzitzit'
Process-CategoryPage -path $tallitPath  -cat 'tallit'

Write-Host "Extracted $($extractedCatalog.Count) items instantly from category cache!"

$catalogJson = $extractedCatalog | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText('C:\Users\97254\.gemini\antigravity\scratch\oz-store\mishkan_catalog_preview.json', $catalogJson, [System.Text.Encoding]::UTF8)
Write-Host "Saved mishkan_catalog_preview.json successfully!"
