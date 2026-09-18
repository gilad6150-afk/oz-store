[System.Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$files = Get-ChildItem 'C:\Users\97254\.gemini\antigravity\scratch\oz-store' -Include *.html,*.js -Recurse

$bad = @()

foreach ($f in $files) {
    if ($f.FullName -like "*node_modules*" -or $f.FullName -like "*brain*") { continue }
    $content = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    if ($content.Contains([char]0x05F3 + [char]0x05DB) -or $content.Contains([char]0x05E2 + [char]0x20AC)) {
        Write-Host "BAD FILE:" $f.Name
        $bad += $f.Name
    } else {
        Write-Host "CLEAN FILE:" $f.Name
    }
}

if ($bad.Count -eq 0) {
    Write-Host "SUCCESS: ZERO MOJIBAKE IN ALL HTML AND JS FILES!"
}
