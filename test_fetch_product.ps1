$url = 'https://mishkan-hatchelet.co.il/m/t-shirt-and-tzitzit/'
$headers = @{
    'User-Agent' = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

try {
    $res = Invoke-WebRequest -Uri $url -Headers $headers -UseBasicParsing
    [System.IO.File]::WriteAllText('C:\Users\97254\.gemini\antigravity\scratch\oz-store\sample_product.html', $res.Content, [System.Text.Encoding]::UTF8)
    Write-Host "Sample downloaded successfully ($($res.Content.Length) bytes)."
} catch {
    Write-Host "Error fetching sample product: $_"
}
