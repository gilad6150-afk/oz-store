[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Add-Type -AssemblyName System.Net.Http

$jsonPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\product_urls.json'
$labelsPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\labels.json'

if (-not (Test-Path $jsonPath) -or -not (Test-Path $labelsPath)) {
    Write-Host "Input files missing."
    exit 1
}

$rawUrls = [System.IO.File]::ReadAllText($jsonPath, [System.Text.Encoding]::UTF8)
$productUrls = $rawUrls | ConvertFrom-Json

$rawLabels = [System.IO.File]::ReadAllText($labelsPath, [System.Text.Encoding]::UTF8)
$L = $rawLabels | ConvertFrom-Json

$client = [System.Net.Http.HttpClient]::new()
$client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")

$extractedCatalog = [System.Collections.Generic.List[PSCustomObject]]::new()

$count = 0
$total = $productUrls.Count

foreach ($p in $productUrls) {
    $count++
    Write-Host "[$count/$total] Fetching: $($p.url) ($($p.category))..."
    
    try {
        $html = $client.GetStringAsync($p.url).Result
        
        # 1. Title
        $title = $L.defaultTitle
        $tMatch = [regex]::Match($html, $L.patTitle)
        if ($tMatch.Success) {
            $rawT = $tMatch.Groups[1].Value
            $rawT = [regex]::Replace($rawT, '<[^>]+>', '').Trim()
            $title = [System.Net.WebUtility]::HtmlDecode($rawT)
        }
        
        # Replace supplier branding
        $title = $title -replace 'משכן התכלת', 'עוז יודאיקה'
        $title = $title -replace 'משכן', 'עוז יודאיקה'

        # 2. Short description
        $shortDesc = ""
        $dMatch = [regex]::Match($html, $L.patDesc)
        if ($dMatch.Success) {
            $rawD = [regex]::Replace($dMatch.Groups[1].Value, '<[^>]+>', ' ').Trim()
            $shortDesc = [System.Net.WebUtility]::HtmlDecode($rawD) -replace 'משכן התכלת', 'עוז יודאיקה'
        }

        # 3. Full description
        $fullDesc = ""
        $fdMatch = [regex]::Match($html, $L.patFullDesc)
        if ($fdMatch.Success) {
            $rawFD = [regex]::Replace($fdMatch.Groups[1].Value, '<[^>]+>', ' ').Trim()
            $fullDesc = [System.Net.WebUtility]::HtmlDecode($rawFD) -replace 'משכן התכלת', 'עוז יודאיקה'
        }

        # 4. Combined text analysis
        $combinedText = "$title $shortDesc $fullDesc"

        # Fabric detection
        $fabric = $L.fabricWool
        if ($combinedText -match $L.kwDryFit) {
            $fabric = $L.fabricDryFit
        } elseif ($combinedText -match $L.kwCotton) {
            $fabric = $L.fabricCotton
        } elseif ($combinedText -match $L.kwUndershirt) {
            $fabric = $L.fabricUndershirt
        }

        # Certifications
        $certsList = [System.Collections.Generic.List[string]]::new()
        if ($combinedText -match $L.kwEda) { $certsList.Add($L.certEda) }
        if ($combinedText -match $L.kwLanda) { $certsList.Add($L.certLanda) }
        if ($combinedText -match $L.kwMachpud) { $certsList.Add($L.certMachpud) }
        if ($combinedText -match $L.kwRubin) { $certsList.Add($L.certRubin) }
        if ($certsList.Count -eq 0) { $certsList.Add($L.certDefault) }

        # 5. Sizes & Prices
        $sizePriceMatrix = [System.Collections.Generic.List[PSCustomObject]]::new()
        
        $vMatch = [regex]::Match($html, $L.patVariations1)
        if (-not $vMatch.Success) {
            $vMatch = [regex]::Match($html, $L.patVariations2)
        }

        if ($vMatch.Success) {
            $rawJson = [System.Net.WebUtility]::HtmlDecode($vMatch.Groups[1].Value)
            try {
                $variations = $rawJson | ConvertFrom-Json
                foreach ($v in $variations) {
                    $sizeVal = ""
                    foreach ($prop in $v.attributes.psobject.properties) {
                        if ($prop.Name -match 'size|מידה|attribute_') {
                            $sizeVal = [System.Net.WebUtility]::UrlDecode($prop.Value)
                        }
                    }
                    if (-not $sizeVal) { $sizeVal = $L.standardSize }
                    
                    $priceVal = $v.display_price
                    if (-not $priceVal) { $priceVal = $v.price }

                    $sizePriceMatrix.Add([PSCustomObject]@{
                        size = $sizeVal
                        price = [math]::Round([double]$priceVal)
                        sku = "OZ-VAR-$($v.variation_id)"
                    })
                }
            } catch {}
        }

        if ($sizePriceMatrix.Count -eq 0) {
            $pm = [regex]::Match($html, $L.patPrice)
            $priceText = if ($pm.Success) { [regex]::Replace($pm.Groups[1].Value, '<[^>]+>', '') } else { "0" }
            $numMatch = [regex]::Match($priceText, '(\d+)')
            $basePrice = if ($numMatch.Success) { [int]$numMatch.Groups[1].Value } else { 99 }

            $sizePriceMatrix.Add([PSCustomObject]@{
                size = $L.standardSize
                price = $basePrice
                sku = "OZ-PROD-$count"
            })
        }

        # 6. Images
        $mainImg = ""
        $imMatch = [regex]::Match($html, $L.patMainImg1)
        if ($imMatch.Success) { $mainImg = $imMatch.Groups[1].Value }
        if (-not $mainImg) {
            $imMatch2 = [regex]::Match($html, $L.patMainImg2)
            if ($imMatch2.Success) { $mainImg = $imMatch2.Groups[1].Value }
        }
        if ($mainImg.StartsWith('//')) { $mainImg = "https:" + $mainImg }

        # Gallery images
        $gallery = [System.Collections.Generic.HashSet[string]]::new()
        $gMatches = [regex]::Matches($html, $L.patGallery)
        foreach ($gm in $gMatches) {
            $gUrl = $gm.Groups[1].Value
            if ($gUrl.StartsWith('//')) { $gUrl = "https:" + $gUrl }
            if ($gUrl -ne $mainImg) { [void]$gallery.Add($gUrl) }
        }

        # Subcategory
        $subCat = ""
        if ($p.category -eq 'tzitzit') {
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

        $extractedCatalog.Add([PSCustomObject]@{
            id = "OZ-ITEM-$count"
            url = $p.url
            category = $p.category
            sub_category = $subCat
            title = $title
            description = $shortDesc
            full_description = $fullDesc
            fabric = $fabric
            certifications = ($certsList | Select-Object -Unique)
            sizes_and_prices = $sizePriceMatrix
            main_image = $mainImg
            gallery_images = @($gallery)
            image_styling_badge = $L.badgeText
        })

    } catch {
        Write-Host "  Error processing $($p.url): $_"
    }

    Start-Sleep -Milliseconds 50
}

$client.Dispose()

Write-Host "Successfully extracted catalog for $($extractedCatalog.Count) products!"
$catalogJson = $extractedCatalog | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText('C:\Users\97254\.gemini\antigravity\scratch\oz-store\mishkan_catalog_preview.json', $catalogJson, [System.Text.Encoding]::UTF8)
Write-Host "Saved mishkan_catalog_preview.json successfully!"
