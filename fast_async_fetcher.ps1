[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12
Add-Type -AssemblyName System.Net.Http

if (-not (Test-Path "mishkan_product_urls.txt")) {
    Write-Host "Missing mishkan_product_urls.txt"
    exit 0
}

$urls = Get-Content "mishkan_product_urls.txt" -Encoding utf8
Write-Host "Fetching $($urls.Count) product pages concurrently with Task.WhenAll..."

$client = [System.Net.Http.HttpClient]::new()
$client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
$client.Timeout = [TimeSpan]::FromSeconds(6)

$tasks = [System.Collections.Generic.List[System.Threading.Tasks.Task[hashtable]]]::new()

foreach ($url in $urls) {
    if ([string]::IsNullOrWhiteSpace($url)) { continue }
    $u = $url
    $t = [System.Threading.Tasks.Task]::Run([Func[hashtable]]{
        try {
            $reqTask = $client.GetStringAsync($u)
            if ($reqTask.Wait(5000)) {
                return @{ url = $u; html = $reqTask.Result; success = $true }
            }
        } catch {}
        return @{ url = $u; html = ""; success = $false }
    })
    $tasks.Add($t)
}

[System.Threading.Tasks.Task]::WaitAll($tasks.ToArray())
Write-Host "Completed async network fetches!"

$catalog = [System.Collections.Generic.List[PSObject]]::new()
$count = 0

foreach ($t in $tasks) {
    $res = $t.Result
    if (-not $res.success -or [string]::IsNullOrWhiteSpace($res.html)) { continue }
    $count++
    $html = $res.html
    $url = $res.url

    $title = "Mishkan Product $count"
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

    $prodObj = [PSCustomObject]@{
        id = "mishkan_" + $count
        title = $title.Trim()
        url = $url
        price = [int]$price
        original_price = [int]$price + 35
        main_image = $mainImg
        gallery = [string[]]($images | Select-Object -Skip 1 -First 5)
        description = $desc
        brand = "Mishkan HaTchelet"
        in_stock = $true
    }

    $catalog.Add($prodObj)
}

$client.Dispose()

Write-Host "Scraped $($catalog.Count) products out of $($urls.Count)!"
$json = $catalog | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText("mishkan_catalog_scraped.json", $json, [System.Text.Encoding]::UTF8)
Write-Host "Saved mishkan_catalog_scraped.json cleanly!"
