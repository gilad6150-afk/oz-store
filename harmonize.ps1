$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)
$dir = "C:\Users\97254\.gemini\antigravity\scratch\oz-store"

$files = @("top_bar.html", "clean_nav.html", "animated_hero.html", "shop_layout.html", "footer.html", "modals.html", "floating_cart.html", "clean_render.js", "pages_code.js")

foreach ($file in $files) {
    $path = Join-Path $dir $file
    if (-not (Test-Path $path)) { continue }
    $text = [System.IO.File]::ReadAllText($path, $utf8NoBOM)
    
    $text = $text -replace 'from-\[#0F172A\] via-\[#1E1B4B\] to-\[#0F172A\]', 'from-[#2E1065] via-[#1E1B4B] to-[#2E1065]'
    $text = $text -replace 'text-amber-400', 'text-purple-300'
    $text = $text -replace 'text-amber-300', 'text-purple-200'
    $text = $text -replace 'bg-amber-400', 'bg-purple-600'
    $text = $text -replace 'bg-amber-500', 'bg-purple-600'
    $text = $text -replace 'border-amber-400', 'border-purple-400'
    $text = $text -replace 'fill-amber-400', 'fill-purple-300'
    $text = $text -replace 'hover:text-amber-300', 'hover:text-purple-300'
    $text = $text -replace 'hover:text-amber-600', 'hover:text-purple-600'
    $text = $text -replace 'hover:bg-amber-600', 'hover:bg-purple-600'
    $text = $text -replace 'text-amber-900', 'text-purple-900'
    $text = $text -replace 'text-amber-700', 'text-purple-700'
    $text = $text -replace 'bg-amber-50', 'bg-purple-50'
    $text = $text -replace 'border-amber-200', 'border-purple-200'
    $text = $text -replace 'from-amber-400 via-amber-500 to-yellow-500', 'from-[#7C3AED] via-[#6D28D9] to-[#581C87]'
    $text = $text -replace 'from-amber-400 via-amber-500 to-yellow-400', 'from-purple-600 via-purple-700 to-indigo-900'
    $text = $text -replace 'from-amber-300 via-amber-200 to-yellow-400', 'from-purple-200 via-white to-purple-300'
    $text = $text -replace 'hover:from-amber-300 hover:to-yellow-400', 'hover:from-purple-500 hover:to-indigo-800'
    $text = $text -replace 'shadow-amber-500/20', 'shadow-purple-600/30'
    
    [System.IO.File]::WriteAllText($path, $text, $utf8NoBOM)
    Write-Host "Updated $file"
}
