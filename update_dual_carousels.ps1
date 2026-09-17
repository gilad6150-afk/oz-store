$path = "C:\Users\97254\.gemini\antigravity\scratch\oz-store\index.html"
$content = Get-Content -Path $path -Raw -Encoding UTF8

# 1. Ensure no-scrollbar CSS is present in <style>
if ($content -notmatch '\.no-scrollbar') {
    $stylePattern = '</style>'
    $noScrollCss = @"
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
"@
    $content = $content -replace '</style>', $noScrollCss
}

# 2. Update startAutoScrollCarousels JS function for dual-direction & hover-pause
$oldAutoScrollPattern = '(?s)function startAutoScrollCarousels\(\)\s*\{[^}]*\}'

$newAutoScrollJs = @"
        function startAutoScrollCarousels() {
            const catContainer = document.getElementById('category-carousel-container');
            const recContainer = document.getElementById('recommended-carousel-container');

            let catHovered = false;
            let recHovered = false;

            if (catContainer) {
                catContainer.addEventListener('mouseenter', () => catHovered = true);
                catContainer.addEventListener('mouseleave', () => catHovered = false);

                let catDir = 1; // Category carousel moves Left first
                setInterval(() => {
                    if (catHovered) return;
                    const maxScroll = catContainer.scrollWidth - catContainer.clientWidth;
                    const currentPos = Math.abs(catContainer.scrollLeft);

                    if (currentPos >= maxScroll - 30) {
                        catDir = -1;
                    } else if (currentPos <= 30) {
                        catDir = 1;
                    }

                    catContainer.scrollBy({ left: catDir * 320, behavior: 'smooth' });
                }, 3200);
            }

            if (recContainer) {
                recContainer.addEventListener('mouseenter', () => recHovered = true);
                recContainer.addEventListener('mouseleave', () => recHovered = false);

                let recDir = -1; // Recommended carousel moves Right first (Opposite Direction!)
                setInterval(() => {
                    if (recHovered) return;
                    const maxScroll = recContainer.scrollWidth - recContainer.clientWidth;
                    const currentPos = Math.abs(recContainer.scrollLeft);

                    if (currentPos <= 30) {
                        recDir = 1;
                    } else if (currentPos >= maxScroll - 30) {
                        recDir = -1;
                    }

                    recContainer.scrollBy({ left: recDir * 320, behavior: 'smooth' });
                }, 3800);
            }
        }
"@

$content = [regex]::Replace($content, $oldAutoScrollPattern, $newAutoScrollJs)

# Save file UTF8 clean
[System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8)
Write-Output "Successfully updated dual-direction auto-scrolling carousels with pause on hover!"
