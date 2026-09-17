$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)

$indexPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\index.html'
$livePath = 'C:\Users\97254\.gemini\antigravity\brain\58d0bef7-ea4b-4cd7-b83b-3570fb76c5b8\oz_store_live_ui.html'

$content = [System.IO.File]::ReadAllText($indexPath, $utf8NoBOM)

$officialWhatsAppSvgPath = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z'

# Replace any M.057 24... paths in index.html
$pattern = 'd="M\.057 24[^"]*"'
$replacement = 'd="' + $officialWhatsAppSvgPath + '"'

if ($content -match $pattern) {
    $content = [regex]::Replace($content, $pattern, $replacement)
    Write-Host "Replaced all WhatsApp SVG paths with official pristine path."
} else {
    Write-Host "Pattern match for WhatsApp path failed."
}

# Also check product card WhatsApp button SVG in JS template
$jsWaPattern = '(?s)href="https://wa\.me/[^"]*".*?<svg class="w-4 h-4 inline stroke-current stroke-2 fill-none"[^>]*>.*?</svg>'
$jsWaReplacement = @"
href="https://wa.me/972526867192?text=${encodeURIComponent('שלום מכון עוז, אני מעוניין במוצר: ' + p.name)}" target="_blank" class="py-2 px-2 sm:py-3 sm:px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] sm:text-xs rounded-lg sm:rounded-xl border border-emerald-200 transition-colors flex items-center justify-center" title="הזמן בוואטסאפ">
                                <svg class="w-4 h-4 fill-current text-emerald-600" viewBox="0 0 24 24"><path d="$officialWhatsAppSvgPath"/></svg>
"@

if ($content -match $jsWaPattern) {
    $content = [regex]::Replace($content, $jsWaPattern, [System.Text.RegularExpressions.MatchEvaluator]{ return $jsWaReplacement })
    Write-Host "Updated product card WhatsApp button SVG."
}

[System.IO.File]::WriteAllText($indexPath, $content, $utf8NoBOM)
[System.IO.File]::WriteAllText($livePath, $content, $utf8NoBOM)
Write-Host "Pristine WhatsApp icon fix applied and synced successfully."
