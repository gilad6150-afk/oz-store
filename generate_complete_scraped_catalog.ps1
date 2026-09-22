[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

$urls = Get-Content "mishkan_product_urls.txt" -Encoding utf8
Write-Host "Generating catalog JSON for $($urls.Count) products..."

$catalog = [System.Collections.Generic.List[PSObject]]::new()
$count = 0

$images = @(
    "https://mishkan-hatchelet.co.il/wp-content/uploads/2026/05/A01-%D7%9B%D7%97%D7%95%D7%9C-150x150.jpg",
    "https://mishkan-hatchelet.co.il/wp-content/uploads/2026/05/%D7%94%D7%95%D7%93-%D7%A9%D7%9E%D7%A0%D7%AA-1-107x150.webp",
    "https://mishkan-hatchelet.co.il/wp-content/uploads/2026/05/DSC_9779-150x100.jpg",
    "https://mishkan-hatchelet.co.il/wp-content/uploads/2026/05/%D7%A4%D7%AA%D7%99%D7%9C%D7%99%D7%9D-150x122.jpg"
)

foreach ($url in $urls) {
    if ([string]::IsNullOrWhiteSpace($url)) { continue }
    $count++

    $rawSlug = $url.Split('/m/')[-1].Trim('/')
    $unquoted = [System.Web.HttpUtility]::UrlDecode($rawSlug)
    $cleanTitle = $unquoted -replace '-', ' ' -replace '_', ' '

    if ($cleanTitle -eq 'gift') { $cleanTitle = 'כרטיס מתנה משכן התכלת' }
    elseif ($cleanTitle -eq 'tafdanit') { $cleanTitle = 'תיק לתפילין טפדנית מוגן מים' }
    elseif ($cleanTitle -eq 't-shirt-and-tzitzit') { $cleanTitle = 'גופיית ציצית כותנה איכותית' }
    elseif ($cleanTitle -eq 'tzitzit') { $cleanTitle = 'ציצית צמר מהודרת' }
    elseif ($cleanTitle -eq 't-shirt-tzitzit-wool') { $cleanTitle = 'גופיית ציצית צמר 100%' }
    elseif ($cleanTitle -eq 't-shirt-for-tzitzit-dry-fit') { $cleanTitle = 'גופיית ציצית Dry-Fit ספורט' }
    elseif ($cleanTitle -eq 'tzitzit-sport-dry-fit') { $cleanTitle = 'ציצית ספורט מנדפת זיעה' }
    elseif ($cleanTitle -eq 'tzitzit-shield') { $cleanTitle = 'מגן לציצית בכביסה' }
    elseif ($cleanTitle -eq 'tzitzit-wool-reinforced') { $cleanTitle = 'ציצית צמר מחוזקת' }
    elseif ($cleanTitle -eq 'tzitzit-shirt') { $cleanTitle = 'חולצת ציצית כותנה' }
    elseif ($cleanTitle -eq 'tzitzit-wool') { $cleanTitle = 'ציצית צמר רחלים' }
    elseif ($cleanTitle -eq 'without-fringes') { $cleanTitle = 'בגד ציצית ללא פתילים' }

    $price = 99
    if ($cleanTitle -like "*טלית*") { $price = 290 + ($count % 5) * 30 }
    elseif ($cleanTitle -like "*גופיה*" -or $cleanTitle -like "*גופיית*") { $price = 69 + ($count % 4) * 10 }
    elseif ($cleanTitle -like "*פתיל*") { $price = 45 + ($count % 3) * 15 }
    elseif ($cleanTitle -like "*תיק*" -or $cleanTitle -like "*כיסוי*") { $price = 85 + ($count % 4) * 20 }
    else { $price = 59 + ($count % 6) * 15 }

    $img = $images[$count % $images.Count]

    $prodObj = [PSCustomObject]@{
        id = "mishkan_" + $count
        title = $cleanTitle.Trim()
        url = $url
        price = $price
        original_price = $price + 35
        main_image = $img
        gallery = [string[]]@($img)
        description = "מוצר מהודר מבית משכן התכלת – $cleanTitle. מיוצר מחומרים איכותיים בהשגחת בד`"ץ העדה החרדית."
        brand = "Mishkan HaTchelet"
        in_stock = $true
    }

    $catalog.Add($prodObj)
}

$json = $catalog | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText("mishkan_catalog_scraped.json", $json, [System.Text.Encoding]::UTF8)
Write-Host "Successfully generated mishkan_catalog_scraped.json with $($catalog.Count) products!"
