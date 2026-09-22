$files = @(
    "C:\Users\97254\.gemini\antigravity\brain\0df20abb-5fd9-4081-b9e0-a18e1fe74db2\.system_generated\steps\1056\content.md",
    "C:\Users\97254\.gemini\antigravity\brain\0df20abb-5fd9-4081-b9e0-a18e1fe74db2\.system_generated\steps\1058\content.md"
)

foreach ($fpath in $files) {
    Write-Host "=================== File: $fpath ==================="
    if (Test-Path $fpath) {
        $content = [System.IO.File]::ReadAllText($fpath, [System.Text.Encoding]::UTF8)
        
        # Match all hrefs
        $matches = [regex]::Matches($content, 'href=["'']([^"'']+)["'']')
        $hrefs = [System.Collections.Generic.HashSet[string]]::new()
        foreach ($m in $matches) {
            $h = $m.Groups[1].Value
            if ($h -like "*mishkan-hatchelet.co.il*" -or $h.StartsWith("/")) {
                [void]$hrefs.Add($h)
            }
        }
        Write-Host "Found $($hrefs.Count) site hrefs:"
        $hrefs | Sort-Object | Select-Object -First 50 | ForEach-Object { Write-Host " - $_" }

        # Match product card titles and prices
        Write-Host "--- Extracting Product Cards / Images ---"
        $imgMatches = [regex]::Matches($content, '<img[^>]+src=["'']([^"'']+)["''][^>]*alt=["'']([^"'']*)["'']')
        Write-Host "Found $($imgMatches.Count) image tags"
        foreach ($img in ($imgMatches | Select-Object -First 15)) {
            Write-Host " Image: $($img.Groups[1].Value) | Alt: $($img.Groups[2].Value)"
        }
    } else {
        Write-Host "File not found: $fpath"
    }
}
