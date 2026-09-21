$utf8 = New-Object System.Text.UTF8Encoding($false)
$files = Get-ChildItem -Path "C:\Users\97254\.gemini\antigravity\scratch\oz-store" -Include *.html,*.js -Recurse

foreach ($f in $files) {
    if ($f.FullName -like "*node_modules*" -or $f.FullName -like "*.git*") { continue }
    $txt = [System.IO.File]::ReadAllText($f.FullName, $utf8)
    if ($txt.Contains("׳’") -or $txt.Contains("ג€")) {
        Write-Host "MOJIBAKE:" $f.Name
    } else {
        Write-Host "CLEAN:" $f.Name
    }
}
