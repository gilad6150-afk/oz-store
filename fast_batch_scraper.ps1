[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

if (-not (Test-Path "mishkan_product_urls.txt")) {
    Write-Host "Missing mishkan_product_urls.txt"
    exit 0
}

$urls = Get-Content "mishkan_product_urls.txt" -Encoding utf8
Write-Host "Scraping $($urls.Count) products in fast batch mode..."

$catalog = [System.Collections.Generic.List[PSObject]]::new()
$batchSize = 20

for ($i = 0; $i -lt $urls.Count; $i += $batchSize) {
    $batch = $urls[$i..([Math]::Min($i + $batchSize - 1, $urls.Count - 1))]
    Write-Host "Processing batch $($i+1) to $([Math]::Min($i + $batchSize, $urls.Count))..."

    $jobs = @()
    foreach ($u in $batch) {
        if ([string]::IsNullOrWhiteSpace($u)) { continue }
        $job = Start-Job -ScriptBlock {
            param($url)
            [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12
            try {
                $req = [System.Net.HttpWebRequest]::Create($url)
                $req.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
                $req.Timeout = 8000
                $resp = $req.GetResponse()
                $reader = [System.IO.StreamReader]::new($resp.GetResponseStream(), [System.Text.Encoding]::UTF8)
                $html = $reader.ReadToEnd()
                $reader.Close()
                $resp.Close()

                $title = "Mishkan Product"
                if ($html -match '<h1[^>]*class=["''][^"'']*product_title[^"'']*["''][^>]*>(.*?)</h1>') {
                    $title = $Matches[1] -replace '<[^>]+>', ''
                } elseif ($html -match '<title>(.*?)</title>') {
                    $title = ($Matches[1] -split '[\|-]')[0].Trim()
                }

                $price = "99"
                if ($html -match '<bdi>(.*?)</bdi>') {
                    $rawP = $Matches[1] -replace '[^\d\.]', ''
                    if ($rawP -and $rawP -match '^\d+$') { $price = $rawP }
                }

                $images = [System.Collections.Generic.HashSet[string]]::new()
                $imgMatches = [regex]::Matches($html, 'src=["''](https://mishkan-hatchelet\.co\.il/wp-content/uploads/[^"'']+\.(?:jpg|png|webp))["'']')
                foreach ($im in $imgMatches) {
                    $imgUrl = $im.Groups[1].Value
                    if ($imgUrl -notlike "*150x150*" -and $imgUrl -notlike "*100x*" -and $imgUrl -notlike "*logo*") {
                        [void]$images.Add($imgUrl)
                    }
                }

                $mainImg = ""
                if ($images.Count -gt 0) {
                    $mainImg = ($images | Select-Object -First 1)
                }

                $desc = "Quality Mishkan Hatchelet Product"
                if ($html -match '<div[^>]*class=["''][^"'']*woocommerce-product-details__short-description[^"'']*["''][^>]*>(.*?)</div>') {
                    $cleanDesc = $Matches[1] -replace '<[^>]+>', ' ' -replace '\s+', ' '
                    if ($cleanDesc.Trim().Length -gt 5) { $desc = $cleanDesc.Trim() }
                }

                return [PSCustomObject]@{
                    url = $url
                    title = $title.Trim()
                    price = [int]$price
                    original_price = [int]$price + 35
                    main_image = $mainImg
                    gallery = [string[]]($images | Select-Object -Skip 1 -First 5)
                    description = $desc
                    brand = "Mishkan HaTchelet"
                    in_stock = $true
                }
            } catch {
                return $null
            }
        } -ArgumentList $u
        $jobs += $job
    }

    $jobs | Wait-Job | Out-Null
    foreach ($j in $jobs) {
        $res = Receive-Job -Job $j
        if ($res -and $res.title) {
            $catalog.Add($res)
        }
        Remove-Job -Job $j
    }
}

Write-Host "Scraped $($catalog.Count) valid products out of $($urls.Count)!"
for ($idx = 0; $idx -lt $catalog.Count; $idx++) {
    $catalog[$idx] | Add-Member -MemberType NoteProperty -Name "id" -Value ("mishkan_" + ($idx + 1)) -Force
}

$json = $catalog | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText("mishkan_catalog_scraped.json", $json, [System.Text.Encoding]::UTF8)
Write-Host "Saved mishkan_catalog_scraped.json cleanly!"
