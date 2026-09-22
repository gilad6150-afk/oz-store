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

Write-Host "Starting parallel extraction for $($productUrls.Count) items..."

$extractedCatalog = [System.Collections.Concurrent.ConcurrentBag[PSCustomObject]]::new()

$handler = [System.Net.Http.HttpClientHandler]::new()
$handler.MaxConnectionsPerServer = 20

$client = [System.Net.Http.HttpClient]::new($handler)
$client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")

$tasks = [System.Collections.Generic.List[System.Threading.Tasks.Task]]::new()

$count = 0
foreach ($p in $productUrls) {
    $count++
    $itemIndex = $count
    $itemCategory = $p.category
    $itemUrl = $p.url

    $codeBlock = [Action]{
        try {
            $html = $client.GetStringAsync($itemUrl).Result
            
            # Title
            $title = $L.defaultTitle
            $tMatch = [regex]::Match($html, $L.patTitle)
            if ($tMatch.Success) {
                $rawT = $tMatch.Groups[1].Value
                $rawT = [regex]::Replace($rawT, '<[^>]+>', '').Trim()
                $title = [System.Net.WebUtility]::HtmlDecode($rawT)
            }
            $title = $title -replace 'משכן התכלת', 'עוז יודאיקה' -replace 'משכן', 'עוז יודאיקה'

            # Short description
            $shortDesc = ""
            $dMatch = [regex]::Match($html, $L.patDesc)
            if ($dMatch.Success) {
                $rawD = [regex]::Replace($dMatch.Groups[1].Value, '<[^>]+>', ' ').Trim()
                $shortDesc = [System.Net.WebUtility]::HtmlDecode($rawD) -replace 'משכן התכלת', 'עוז יודאיקה'
            }

            # Full description
            $fullDesc = ""
            $fdMatch = [regex]::Match($html, $L.patFullDesc)
            if ($fdMatch.Success) {
                $rawFD = [regex]::Replace($fdMatch.Groups[1].Value, '<[^>]+>', ' ').Trim()
                $fullDesc = [System.Net.WebUtility]::HtmlDecode($rawFD) -replace 'משכן התכלת', 'עוז יודאיקה'
            }

            $combinedText = "$title $shortDesc $fullDesc"

            # Fabric
            $fabric = $L.fabricWool
            if ($combinedText -match $L.kwDryFit) { $fabric = $L.fabricDryFit }
            elseif ($combinedText -match $L.kwCotton) { $fabric = $L.fabricCotton }
            elseif ($combinedText -match $L.kwUndershirt) { $fabric = $L.fabricUndershirt }

            # Certifications
            $certsList = [System.Collections.Generic.List[string]]::new()
            if ($combinedText -match $L.kwEda) { $certsList.Add($L.certEda) }
            if ($combinedText -match $L.kwLanda) { $certsList.Add($L.certLanda) }
            if ($combinedText -match $L.kwMachpud) { $certsList.Add($L.certMachpud) }
            if ($combinedText -match $L.kwRubin) { $certsList.Add($L.certRubin) }
            if ($certsList.Count -eq 0) { $certsList.Add($L.certDefault) }

            # Sizes & Prices
            $sizePriceMatrix = [System.Collections.Generic.List[PSCustomObject]]::new()
            
            $vMatch = [regex]::Match($html, $L.patVariations1)
            if (-not $vMatch.Success) { $vMatch = [regex]::Match($html, $L.patVariations2) }

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
                    sku = "OZ-PROD-$itemIndex"
                })
            }

            # Images
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
            if ($itemCategory -eq 'tzitzit') {
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
                id = "OZ-ITEM-$itemIndex"
                url = $itemUrl
                category = $itemCategory
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

            Write-Host "Processed [$itemIndex/$total] $title"
        } catch {
            Write-Host "Error [$itemIndex/$total]: $_"
        }
    }

    $task = [System.Threading.Tasks.Task]::Run($codeBlock)
    $tasks.Add($task)
}

[System.Threading.Tasks.Task]::WaitAll($tasks.ToArray())
$client.Dispose()

Write-Host "Parallel extraction completed for $($extractedCatalog.Count) products!"

# Order by ID
$ordered = $extractedCatalog.ToArray() | Sort-Object { [int]($_.id -replace 'OZ-ITEM-', '') }
$catalogJson = $ordered | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText('C:\Users\97254\.gemini\antigravity\scratch\oz-store\mishkan_catalog_preview.json', $catalogJson, [System.Text.Encoding]::UTF8)
Write-Host "Saved mishkan_catalog_preview.json successfully!"
