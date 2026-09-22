[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Add-Type -AssemblyName System.Net.Http

$url = 'https://mishkan-hatchelet.co.il/m/%d7%98%d7%9c%d7%99%d7%aa-%d7%a6%d7%9e%d7%a8-%d7%90-%d7%90-%d7%a9%d7%97%d7%95%d7%a8/'

try {
    $client = [System.Net.Http.HttpClient]::new()
    $client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
    $html = $client.GetStringAsync($url).Result
    Write-Host "Success! Length: $($html.Length)"
} catch {
    Write-Host "Error: $_"
}
