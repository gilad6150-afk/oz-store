$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)
$dir = "C:\Users\97254\.gemini\antigravity\scratch\oz-store"

$files = Get-ChildItem -Path $dir -Include *.html,*.js -Recurse

foreach ($f in $files) {
    if (-not (Test-Path $f.FullName)) { continue }
    # Skip node_modules or .git if any
    if ($f.FullName.Contains("\.git\") -or $f.FullName.Contains("\node_modules\")) { continue }
    
    $text = [System.IO.File]::ReadAllText($f.FullName, $utf8NoBOM)
    $orig = $text

    # Replace all remaining amber and yellow variants with purple palette
    $text = $text -replace 'from-amber-[0-9]+', 'from-purple-600'
    $text = $text -replace 'via-amber-[0-9]+', 'via-purple-700'
    $text = $text -replace 'to-amber-[0-9]+', 'to-indigo-900'
    $text = $text -replace 'to-yellow-[0-9]+', 'to-purple-900'
    $text = $text -replace 'from-yellow-[0-9]+', 'from-purple-600'
    $text = $text -replace 'amber-[0-9]+', 'purple-600'
    $text = $text -replace 'yellow-[0-9]+', 'purple-600'
    $text = $text -replace 'gold-border', 'border-purple-600'
    
    # Fix text-slate-950 on purple buttons
    $text = $text -replace 'text-slate-950', 'text-white'

    if ($text -ne $orig) {
        [System.IO.File]::WriteAllText($f.FullName, $text, $utf8NoBOM)
        Write-Host "Purged amber from: $($f.Name)"
    }
}
