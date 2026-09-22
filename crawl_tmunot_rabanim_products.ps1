[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

$headers = @{
    "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

$categories = @(
    "https://tmunotrabanim.com/",
    "https://tmunotrabanim.com/shop/",
    "https://tmunotrabanim.com/product-category/%d7%94%d7%93%d7%a4%d7%a1%d7%94-%d7%a2%d7%9c-%d7%96%d7%9b%d7%95%d7%9b%d7%99%d7%aa/",
    "https://tmunotrabanim.com/product-category/%d7%94%d7%93%d7%a4%d7%a1%d7%94-%d7%a2%d7%9c-%d7%96%d7%9b%d7%95%d7%9b%d7%99%d7%aa/%d7%aa%d7%9e%d7%95%d7%a0%d7%95%d7%aa-%d7%96%d7%9b%d7%95%d7%9b%d7%99%d7%aa-%d7%a2%d7%92%d7%95%d7%9c%d7%95%d7%aa/",
    "https://tmunotrabanim.com/product-category/%d7%94%d7%93%d7%a4%d7%a1%d7%94-%d7%a2%d7%9c-%d7%96%d7%9b%d7%95%d7%9b%d7%99%d7%aa/%d7%a9%d7%9c%d7%99%d7%a9%d7%99%d7%99%d7%aa-%d7%aa%d7%9e%d7%95%d7%a0%d7%95%d7%aa-%d7%96%d7%9b%d7%95%d7%9b%d7%99%d7%aa/",
    "https://tmunotrabanim.com/product-category/%d7%94%d7%93%d7%a4%d7%a1%d7%94-%d7%a2%d7%9c-%d7%96%d7%9b%d7%95%d7%9b%d7%99%d7%aa/%d7%96%d7%95%d7%92-%d7%aa%d7%9e%d7%95%d7%a0%d7%95%d7%aa-%d7%96%d7%9b%d7%95%d7%9b%d7%99%d7%aa/",
    "https://tmunotrabanim.com/product-category/%d7%aa%d7%9e%d7%95%d7%a0%d7%95%d7%aa-%d7%99%d7%95%d7%93%d7%90%d7%99%d7%a7%d7%94/",
    "https://tmunotrabanim.com/product-category/%d7%aa%d7%9e%d7%95%d7%a0%d7%95%d7%aa-%d7%99%d7%95%d7%93%d7%90%d7%99%d7%a7%d7%94/%d7%aa%d7%9e%d7%95%d7%a0%d7%95%d7%aa-%d7%a9%d7%9c-%d7%90%d7%a9%d7%a8-%d7%99%d7%a6%d7%a8/",
    "https://tmunotrabanim.com/product-category/%d7%aa%d7%9e%d7%95%d7%a0%d7%95%d7%aa-%d7%99%d7%95%d7%93%d7%90%d7%99%d7%a7%d7%94/%d7%aa%d7%9e%d7%95%d7%a0%d7%95%d7%aa-%d7%a9%d7%9c-%d7%91%d7%a8%d7%9b%d7%aa-%d7%94%d7%91%d7%99%d7%aa/",
    "https://tmunotrabanim.com/product-category/%d7%aa%d7%9e%d7%95%d7%a0%d7%95%d7%aa-%d7%99%d7%95%d7%93%d7%90%d7%99%d7%a7%d7%94/%d7%aa%d7%9e%d7%95%d7%a0%d7%95%d7%aa-%d7%a9%d7%9c-%d7%91%d7%99%d7%aa-%d7%94%d7%9e%d7%a7%d7%93%d7%a9/",
    "https://tmunotrabanim.com/product-category/%d7%aa%d7%9e%d7%95%d7%a0%d7%95%d7%aa-%d7%99%d7%95%d7%93%d7%90%d7%99%d7%a7%d7%94/%d7%aa%d7%9e%d7%95%d7%a0%d7%95%d7%aa-%d7%a9%d7%9c-%d7%94%d7%9b%d7%95%d7%aa%d7%9c/"
)

# Add pagination for main categories (pages 2 to 5)
for ($i = 2; $i -le 5; $i++) {
    $categories += "https://tmunotrabanim.com/shop/page/$i/"
    $categories += "https://tmunotrabanim.com/product-category/%d7%94%d7%93%d7%a4%d7%a1%d7%94-%d7%a2%d7%9c-%d7%96%d7%9b%d7%95%d7%9b%d7%99%d7%aa/page/$i/"
}

$productUrls = [System.Collections.Generic.HashSet[string]]::new()

Write-Host "CRAWLING TMUNOT RABANIM CATEGORY PAGES..."

foreach ($catUrl in $categories) {
    Write-Host "Scanning: $catUrl"
    try {
        $resp = Invoke-WebRequest -Uri $catUrl -Headers $headers -UseBasicParsing
        $html = $resp.Content
        $matches = [regex]::Matches($html, 'href=["''](https://tmunotrabanim\.com/product/[^"'']+)["'']')
        foreach ($m in $matches) {
            $purl = $m.Groups[1].Value
            if ($purl -notlike "*#*" -and $purl -notlike "*feed*") {
                [void]$productUrls.Add($purl)
            }
        }
    } catch {
        Write-Host "Error scanning $catUrl : $_"
    }
}

Write-Host "`n========================================================"
Write-Host "DISCOVERED $($productUrls.Count) UNIQUE TMUNOT RABANIM PRODUCT PAGES"
Write-Host "========================================================"

$productUrls | Out-File -FilePath "tmunot_rabanim_urls.txt" -Encoding utf8
$productUrls | Select-Object -First 30 | ForEach-Object { Write-Host " - $_" }
