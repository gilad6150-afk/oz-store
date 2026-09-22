$html = [System.IO.File]::ReadAllText('C:\Users\97254\.gemini\antigravity\scratch\oz-store\sample_product.html', [System.Text.Encoding]::UTF8)

# 1. Extract data-product_variations attribute
$variationsMatch = [regex]::Match($html, 'data-product_variations=["'']([^"'']+)["'']')
if ($variationsMatch.Success) {
    $rawJson = [System.Net.WebUtility]::HtmlDecode($variationsMatch.Groups[1].Value)
    Write-Host "Found data-product_variations (length $($rawJson.Length))"
    try {
        $variations = $rawJson | ConvertFrom-Json
        Write-Host "Parsed $($variations.Count) variations:"
        foreach ($v in $variations) {
            $attrStr = ($v.attributes.psobject.properties | ForEach-Object { "$($_.Name)=$($_.Value)" }) -join ', '
            Write-Host "  - ID: $($v.variation_id) | Price: $($v.display_price) NIS | Attrs: $attrStr | Img: $($v.image.url)"
        }
    } catch {
        Write-Host "Error parsing variations JSON: $_"
    }
} else {
    Write-Host "No data-product_variations found."
}

# 2. Extract Product Title
$titleMatch = [regex]::Match($html, '<h1[^>]*class="[^"]*product_title[^"]*"[^>]*>([\s\S]*?)</h1>')
if (-not $titleMatch.Success) {
    $titleMatch = [regex]::Match($html, '<h1[^>]*>([\s\S]*?)</h1>')
}
if ($titleMatch.Success) {
    Write-Host "Title: $([System.Net.WebUtility]::HtmlDecode($titleMatch.Groups[1].Value.Trim()))"
}

# 3. Extract Short/Full Description
$descMatch = [regex]::Match($html, '<div[^>]*class="[^"]*woocommerce-product-details__short-description[^"]*"[^>]*>([\s\S]*?)</div>')
if ($descMatch.Success) {
    $cleanDesc = [regex]::Replace($descMatch.Groups[1].Value, '<[^>]+>', ' ').Trim()
    Write-Host "Short Description: $cleanDesc"
}
