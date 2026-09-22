[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

$fpath = "C:\Users\97254\.gemini\antigravity\brain\0df20abb-5fd9-4081-b9e0-a18e1fe74db2\.system_generated\steps\1071\content.md"
$content = [System.IO.File]::ReadAllText($fpath, [System.Text.Encoding]::UTF8)

# Find links with href
$matches = [regex]::Matches($content, 'href=["'']([^"'']+)["'']')
$hrefs = [System.Collections.Generic.HashSet[string]]::new()
foreach ($m in $matches) {
    $h = $m.Groups[1].Value
    if ($h -like "*mishkan-hatchelet.co.il*" -or $h.StartsWith("/")) {
        [void]$hrefs.Add($h)
    }
}
Write-Host "Hrefs in t-shirt-and-tzitzit ($($hrefs.Count)):"
$hrefs | Sort-Object | ForEach-Object { Write-Host " - $_" }
