$tzitzitPath = 'C:\Users\97254\.gemini\antigravity\brain\58d0bef7-ea4b-4cd7-b83b-3570fb76c5b8\.system_generated\steps\6452\content.md'
$tallitPath  = 'C:\Users\97254\.gemini\antigravity\brain\58d0bef7-ea4b-4cd7-b83b-3570fb76c5b8\.system_generated\steps\6456\content.md'

function Get-ProductLinks {
    param([string]$path, [string]$category)
    if (-not (Test-Path $path)) {
        Write-Host "File not found: $path"
        return @()
    }
    $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    
    # Simple regex without complex quote nesting
    $pattern = 'href="([^"]*/m/[^"]+)"'
    $matches = [regex]::Matches($content, $pattern)
    
    $links = [System.Collections.Generic.HashSet[string]]::new()
    foreach ($m in $matches) {
        $url = $m.Groups[1].Value
        if ($url.StartsWith('/')) {
            $url = "https://mishkan-hatchelet.co.il" + $url
        }
        $cleanUrl = $url.Split('#')[0].Split('?')[0]
        [void]$links.Add($cleanUrl)
    }
    
    $result = @()
    foreach ($url in $links) {
        $result += [PSCustomObject]@{
            url = $url
            category = $category
        }
    }
    return $result
}

$tzitzit = Get-ProductLinks -path $tzitzitPath -category 'tzitzit'
$tallit  = Get-ProductLinks -path $tallitPath  -category 'tallit'

Write-Host "Found Tzitzit links: $($tzitzit.Count)"
Write-Host "Found Tallit links: $($tallit.Count)"

$all = $tzitzit + $tallit
$json = $all | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText('C:\Users\97254\.gemini\antigravity\scratch\oz-store\product_urls.json', $json, [System.Text.Encoding]::UTF8)

Write-Host "Saved product_urls.json with $($all.Count) products."
