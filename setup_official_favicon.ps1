$srcImage = 'C:\Users\97254\.gemini\antigravity\brain\58d0bef7-ea4b-4cd7-b83b-3570fb76c5b8\.user_uploaded\media_1790063506024.png'
$dir = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store'
$utf8 = New-Object System.Text.UTF8Encoding($false)

if (-not (Test-Path $srcImage)) {
    Write-Host "Source image not found: $srcImage"
    exit 1
}

# Copy logo image to all standard favicon paths
$destPaths = @(
    (Join-Path $dir 'favicon.png'),
    (Join-Path $dir 'favicon.ico'),
    (Join-Path $dir 'apple-touch-icon.png'),
    (Join-Path $dir 'public\favicon.png'),
    (Join-Path $dir 'public\favicon.ico'),
    (Join-Path $dir 'public\apple-touch-icon.png'),
    (Join-Path $dir 'public\oz_logo.png')
)

foreach ($p in $destPaths) {
    Copy-Item $srcImage $p -Force
    Write-Host "Copied favicon to: $p"
}

# Read bytes for Base64 Data URI
$bytes = [System.IO.File]::ReadAllBytes($srcImage)
$base64 = [System.Convert]::ToBase64String($bytes)
$dataUri = "data:image/png;base64,$base64"

# Update layout_frame.html
$layoutPath = Join-Path $dir 'layout_frame.html'
$layoutText = [System.IO.File]::ReadAllText($layoutPath, $utf8)

$faviconTags = @"
    <!-- OFFICIAL BRAND FAVICON -->
    <link rel="icon" type="image/png" href="$dataUri">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon.png">
    <link rel="icon" type="image/png" sizes="16x16" href="favicon.png">
    <link rel="shortcut icon" type="image/x-icon" href="favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
"@

$oldTagsRegex = '(?s)<!-- OFFICIAL BRAND FAVICON -->.*?<link rel="apple-touch-icon"[^>]*>'
if ($layoutText -match $oldTagsRegex) {
    $layoutText = [regex]::Replace($layoutText, $oldTagsRegex, $faviconTags)
} else {
    $layoutText = $layoutText.Replace('</head>', "$faviconTags`n</head>")
}

[System.IO.File]::WriteAllText($layoutPath, $layoutText, $utf8)
Write-Host "Updated favicon tags in layout_frame.html!"

