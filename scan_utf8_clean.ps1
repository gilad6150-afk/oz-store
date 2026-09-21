$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)
$dir = "C:\Users\97254\.gemini\antigravity\scratch\oz-store"

$files = Get-ChildItem -Path $dir -Include *.html,*.js,*.ps1,*.xml -Recurse

$badCount = 0

foreach ($file in $files) {
    if ($file.FullName.Contains('.git')) { continue }
    $text = [System.IO.File]::ReadAllText($file.FullName, $utf8NoBOM)
    
    # Check for Mojibake characters
    if ($text.Contains([char]0x05F3) -or $text.Contains('Ã') -or $text.Contains('ג—') -or $text.Contains('ג†') -or $text.Contains('ג€')) {
        Write-Host "CRITICAL MOJIBAKE FOUND IN FILE: $($file.FullName)"
        $badCount++
    }
}

if ($badCount -eq 0) {
    Write-Host "ZERO MOJIBAKE FOUND ACROSS ALL WORKSPACE FILES!"
} else {
    Write-Host "TOTAL FILES WITH MOJIBAKE: $badCount"
}
