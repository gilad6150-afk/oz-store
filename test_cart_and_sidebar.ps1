$path = "C:\Users\97254\.gemini\antigravity\brain\58d0bef7-ea4b-4cd7-b83b-3570fb76c5b8\oz_store_live_ui.html"
$content = Get-Content $path -Raw -Encoding UTF8

Write-Host "Checking String(p.id) in addToCart:" $content.Contains("String(p.id) === String(id)")
Write-Host "Checking style.transform in toggleCartDrawer:" $content.Contains("drawer.style.transform = 'translateX(0%)'")
Write-Host "Checking sidebar filter clean Hebrew:" $content.Contains("<span>סינון מוצרים</span>")
Write-Host "Checking price chips clean Hebrew:" $content.Contains("עד ₪150")
