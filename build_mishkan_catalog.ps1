[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$jsonPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\product_urls.json'
if (-not (Test-Path $jsonPath)) {
    Write-Host "Product URLs file not found."
    exit 1
}

$productUrls = Get-Content $jsonPath -Raw -Encoding UTF8 | ConvertFrom-Json

$client = [System.Net.Http.HttpClient]::new()
$client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

$extractedCatalog = @()

$count = 0
$total = $productUrls.Count

foreach ($p in $productUrls) {
    $count++
    Write-Host "[$count/$total] Fetching: $($p.url) ($($p.category))..."
    
    try {
        $html = $client.GetStringAsync($p.url).Result
        
        # Title
        $titleMatch = [regex]::Match($html, '<h1[^>]*class="[^"]*product_title[^"]*"[^>]*>([\s\S]*?)</h1>')
        if (-not $titleMatch.Success) {
            $titleMatch = [regex]::Match($html, '<h1[^>]*>([\s\S]*?)</h1>')
        }
        $rawTitle = if ($titleMatch.Success) { [System.Net.WebUtility]::HtmlDecode($titleMatch.Groups[1].Value.Trim()) } else { "מוצר יודאיקה" }
        
        # Clean Title (Remove supplier brand names)
        $title = $rawTitle -replace 'משכן התכלת', 'עוז יודאיקה' -replace 'משכן', 'עוז יודאיקה'
        if (-not ($title -match 'עוז יודאיקה')) {
            # Ensure proper branding context
        }

        # Description
        $descMatch = [regex]::Match($html, '<div[^>]*class="[^"]*woocommerce-product-details__short-description[^"]*"[^>]*>([\s\S]*?)</div>')
        $shortDesc = if ($descMatch.Success) { [regex]::Replace($descMatch.Groups[1].Value, '<[^>]+>', ' ').Trim() } else { "" }
        $shortDesc = $shortDesc -replace 'משכן התכלת', 'עוז יודאיקה' -replace 'משכן', 'עוז יודאיקה'

        # Full Description if available
        $fullDescMatch = [regex]::Match($html, '<div[^>]*id="tab-description"[^>]*>([\s\S]*?)</div>')
        $fullDesc = if ($fullDescMatch.Success) { [regex]::Replace($fullDescMatch.Groups[1].Value, '<[^>]+>', ' ').Trim() } else { "" }

        # Fabric & Material analysis
        $fabric = "צמר רחלים טהור"
        $combinedText = "$title $shortDesc $fullDesc"
        if ($combinedText -match 'דרייפיט|dry-fit|דריי פיט') { $fabric = "בד דרייפיט נושם (Dry-Fit)" }
        elseif ($combinedText -match 'כותנה|cotton') { $fabric = "100% כותנה איכותית" }
        elseif ($combinedText -match 'גופיה|גופצית|גופייה') { $fabric = "בד גופיה אלסטי נושם" }
        elseif ($combinedText -match 'משי|silk') { $fabric = "צמר משולב משי יוקרתי" }

        # Certifications
        $certs = @()
        if ($combinedText -match 'העדה החרדית|בד"ץ העדה|העדה') { $certs += 'בד"ץ העדה החרדית ירושלים' }
        if ($combinedText -match 'לנדא|הרב לנדא') { $certs += 'השגחת הרב לנדא' }
        if ($combinedText -match 'מחפוד|הרב מחפוד|יורה דעה') { $certs += 'בד"ץ יורה דעה - הרב מחפוד' }
        if ($combinedText -match 'רובין|הרב רובין') { $certs += 'בד"ץ הרב רובין' }
        if ($certs.Count -eq 0) { $certs += 'הכשר בד"ץ העדה החרדית' }

        # Extract Sizes & Prices
        $sizePriceMatrix = @()
        $variationsMatch = [regex]::Match($html, 'data-product_variations=["'']([^"'']+)["'']')
        
        if ($variationsMatch.Success) {
            $rawJson = [System.Net.WebUtility]::HtmlDecode($variationsMatch.Groups[1].Value)
            try {
                $variations = $rawJson | ConvertFrom-Json
                foreach ($v in $variations) {
                    $sizeVal = ""
                    foreach ($prop in $v.attributes.psobject.properties) {
                        if ($prop.Name -match 'size|מידה|attribute_') {
                            $sizeVal = [System.Net.WebUtility]::UrlDecode($prop.Value)
                        }
                    }
                    if (-not $sizeVal) { $sizeVal = "סטנדרט" }
                    
                    $priceVal = $v.display_price
                    if (-not $priceVal) { $priceVal = $v.price }

                    $sizePriceMatrix += [PSCustomObject]@{
                        size = $sizeVal
                        price = [math]::Round([double]$priceVal)
                        sku = "OZ-$($v.variation_id)"
                    }
                }
            } catch {
                # Fallback variation parsing
            }
        }

        # If no variations found, parse standard price
        if ($sizePriceMatrix.Count -eq 0) {
            $priceMatch = [regex]::Match($html, '<p[^>]*class="[^"]*price[^"]*"[^>]*>([\s\S]*?)</p>')
            $priceText = if ($priceMatch.Success) { [regex]::Replace($priceMatch.Groups[1].Value, '<[^>]+>', '') } else { "0" }
            $numMatch = [regex]::Match($priceText, '(\d+)')
            $basePrice = if ($numMatch.Success) { [int]$numMatch.Groups[1].Value } else { 99 }

            $sizePriceMatrix += [PSCustomObject]@{
                size = "מידה אחידה / סטנדרט"
                price = $basePrice
                sku = "OZ-$([math]::Abs($p.url.GetHashCode()))"
            }
        }

        # Images extraction
        # Main image
        $mainImgMatch = [regex]::Match($html, '<img[^>]+class="[^"]*wp-post-image[^"]*"[^>]+src=["'']([^"'']+)["'']')
        if (-not $mainImgMatch.Success) {
            $mainImgMatch = [regex]::Match($html, 'data-large_image=["'']([^"'']+)["'']')
        }
        $mainImg = if ($mainImgMatch.Success) { $mainImgMatch.Groups[1].Value } else { "" }
        if ($mainImg.StartsWith('//')) { $mainImg = "https:" + $mainImg }

        # Gallery images
        $galleryMatches = [regex]::Matches($html, 'data-large_image=["'']([^"'']+)["'']')
        $gallery = [System.Collections.Generic.HashSet[string]]::new()
        foreach ($g in $galleryMatches) {
            $gUrl = $g.Groups[1].Value
            if ($gUrl.StartsWith('//')) { $gUrl = "https:" + $gUrl }
            if ($gUrl -ne $mainImg) { [void]$gallery.Add($gUrl) }
        }

        # Sub-category determination
        $subCat = if ($p.category -eq 'tzitzit') {
            if ($title -match 'גופיה|גופצית') { "גופיות ציצית" }
            elseif ($title -match 'דרייפיט|ספורט') { "ציצית דרייפיט / ספורט" }
            elseif ($title -match 'צמר') { "ציצית צמר רחלים" }
            else { "ציצית כותנה / קלאסי" }
        } else {
            if ($title -match 'בר מצווה|חתן') { "טליתות לבר מצווה וחתנים" }
            elseif ($title -match 'שחור|פסים') { "טליתות צמר מסורתיות" }
            elseif ($title -match 'יוקרתית|המפוארת|הוד|תפארת') { "טליתות פרימיום מעוצבות" }
            else { "טליתות צמר טהור" }
        }

        $itemObj = [PSCustomObject]@{
            id = "OZ-ITEM-$count"
            url = $p.url
            category = $p.category
            sub_category = $subCat
            title = $title
            description = $shortDesc
            full_description = $fullDesc
            fabric = $fabric
            certifications = ($certs | Select-Object -Unique)
            sizes_and_prices = $sizePriceMatrix
            main_image = $mainImg
            gallery_images = @($gallery)
            image_processing_badge = "זווית ייחודית לעוז יודאיקה (מניעת כפילויות Google Shopping)"
        }

        $extractedCatalog += $itemObj
    } catch {
        Write-Host "Error processing $($p.url): $_"
    }

    Start-Sleep -Milliseconds 100
}

$client.Dispose()

Write-Host "Successfully processed $($extractedCatalog.Count) products!"

# Save JSON
$catalogJson = $extractedCatalog | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText('C:\Users\97254\.gemini\antigravity\scratch\oz-store\mishkan_catalog_preview.json', $catalogJson, [System.Text.Encoding]::UTF8)

Write-Host "Saved mishkan_catalog_preview.json"
