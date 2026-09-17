$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)

$indexPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\index.html'
$cleanNavPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\clean_nav.html'
$animatedHeroPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\animated_hero.html'
$livePath = 'C:\Users\97254\.gemini\antigravity\brain\58d0bef7-ea4b-4cd7-b83b-3570fb76c5b8\oz_store_live_ui.html'

$indexContent = [System.IO.File]::ReadAllText($indexPath, $utf8NoBOM)
$cleanNav = [System.IO.File]::ReadAllText($cleanNavPath, $utf8NoBOM)
$animatedHero = [System.IO.File]::ReadAllText($animatedHeroPath, $utf8NoBOM)

# Replace <nav ...> ... </nav>
$navRegex = '(?s)<nav class="hidden lg:flex items-center gap-6 xl:gap-8 font-extrabold text-xs sm:text-sm text-slate-700">.*?</nav>'
if ($indexContent -match $navRegex) {
    $indexContent = [regex]::Replace($indexContent, $navRegex, [System.Text.RegularExpressions.MatchEvaluator]{ return $cleanNav.Trim() })
    Write-Host "Replaced nav successfully."
} else {
    Write-Host "Nav regex match failed!"
}

# Replace <section id="hero" ...> ... </section>
$heroRegex = '(?s)<section id="hero".*?</section>'
if ($indexContent -match $heroRegex) {
    $indexContent = [regex]::Replace($indexContent, $heroRegex, [System.Text.RegularExpressions.MatchEvaluator]{ return $animatedHero.Trim() })
    Write-Host "Replaced hero section successfully."
} else {
    Write-Host "Hero regex match failed!"
}

# Add hero slider JS logic if not already present
$heroJs = @"

// HERO SLIDER LOGIC
let currentHeroSlideIndex = 0;
let heroSlideTimer = null;

function showHeroSlide(index) {
    const slides = document.querySelectorAll('#hero-slides-container .hero-slide');
    const dotsContainer = document.getElementById('hero-dots-container');
    if (!slides || slides.length === 0) return;
    
    currentHeroSlideIndex = (index + slides.length) % slides.length;
    
    slides.forEach((slide, idx) => {
        if (idx === currentHeroSlideIndex) {
            slide.classList.remove('opacity-0', 'pointer-events-none');
            slide.classList.add('opacity-100');
        } else {
            slide.classList.remove('opacity-100');
            slide.classList.add('opacity-0', 'pointer-events-none');
        }
    });
    
    if (dotsContainer) {
        const dots = dotsContainer.children;
        for (let i = 0; i < dots.length; i++) {
            if (i === currentHeroSlideIndex) {
                dots[i].className = 'w-6 h-3 rounded-full bg-amber-400 transition-all';
            } else {
                dots[i].className = 'w-3 h-3 rounded-full bg-white/30 hover:bg-white/60 transition-all';
            }
        }
    }
}

function setHeroSlide(index) {
    showHeroSlide(index);
    if (heroSlideTimer) clearInterval(heroSlideTimer);
    heroSlideTimer = setInterval(nextHeroSlide, 3500);
}

function nextHeroSlide() {
    showHeroSlide(currentHeroSlideIndex + 1);
}

function startHeroSlider() {
    showHeroSlide(0);
    if (heroSlideTimer) clearInterval(heroSlideTimer);
    heroSlideTimer = setInterval(nextHeroSlide, 3500);
}

document.addEventListener('DOMContentLoaded', function() {
    startHeroSlider();
});
"@

if ($indexContent -notmatch "startHeroSlider") {
    # find last </script>
    $lastScriptIndex = $indexContent.LastIndexOf("</script>")
    if ($lastScriptIndex -gt 0) {
        $indexContent = $indexContent.Insert($lastScriptIndex, $heroJs + "`n")
        Write-Host "Added hero slider JS functions before last script tag."
    }
}

[System.IO.File]::WriteAllText($indexPath, $indexContent, $utf8NoBOM)
[System.IO.File]::WriteAllText($livePath, $indexContent, $utf8NoBOM)
Write-Host "Updated index.html and oz_store_live_ui.html successfully."
