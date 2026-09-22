[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$url = 'https://mishkan-hatchelet.co.il/m/t-shirt-and-tzitzit/'
$client = [System.Net.Http.HttpClient]::new()
$client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

try {
    $html = $client.GetStringAsync($url).Result
    [System.IO.File]::WriteAllText('C:\Users\97254\.gemini\antigravity\scratch\oz-store\sample_product.html', $html, [System.Text.Encoding]::UTF8)
    Write-Host "Sample downloaded via HttpClient ($($html.Length) bytes)."
} catch {
    Write-Host "HttpClient error: $_"
} finally {
    $client.Dispose()
}
