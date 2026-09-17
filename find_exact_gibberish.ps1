$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)

$dir = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store'
$live = 'C:\Users\97254\.gemini\antigravity\brain\58d0bef7-ea4b-4cd7-b83b-3570fb76c5b8\oz_store_live_ui.html'

$files = Get-ChildItem -Path $dir -Include *.html,*.js -Recurse
$files += Get-Item $live

$mojiChar1 = [char]0x05F3
$mojiChar2 = [char]0x00D7
$mojiChar3 = [char]0x00C3

foreach ($file in $files) {
    if (-not (Test-Path $file.FullName)) { continue }
    $lines = [System.IO.File]::ReadAllLines($file.FullName, $utf8NoBOM)
    for ($i = 0; $i -lt $lines.Length; $i++) {
        $line = $lines[$i]
        if ($line.Contains($mojiChar1) -or $line.Contains($mojiChar2) -or $line.Contains($mojiChar3)) {
            Write-Host "MOJIBAKE in $($file.Name) L$($i+1):"
            Write-Host "   $($line.Trim())"
        }
    }
}
