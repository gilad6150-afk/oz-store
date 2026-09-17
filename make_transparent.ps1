Add-Type -AssemblyName System.Drawing
$imgPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\public\oz_logo.png'
$outPurplePath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\public\oz_logo_transparent.png'
$outWhitePath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\public\oz_logo_white.png'

# 1. Purple Transparent Logo (for white background / header)
$orig = [System.Drawing.Bitmap]::FromFile($imgPath)
$bmpPurple = New-Object System.Drawing.Bitmap $orig.Width, $orig.Height
$gP = [System.Drawing.Graphics]::FromImage($bmpPurple)
$gP.DrawImage($orig, 0, 0)

for ($x = 0; $x -lt $bmpPurple.Width; $x++) {
    for ($y = 0; $y -lt $bmpPurple.Height; $y++) {
        $c = $bmpPurple.GetPixel($x, $y)
        if ($c.R -gt 225 -and $c.G -gt 225 -and $c.B -gt 225) {
            $bmpPurple.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        }
    }
}
$bmpPurple.Save($outPurplePath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmpPurple.Dispose()
$gP.Dispose()

# 2. White Transparent Logo (for dark background / footer)
$orig2 = [System.Drawing.Bitmap]::FromFile($imgPath)
$bmpWhite = New-Object System.Drawing.Bitmap $orig2.Width, $orig2.Height
$gW = [System.Drawing.Graphics]::FromImage($bmpWhite)
$gW.DrawImage($orig2, 0, 0)

for ($x = 0; $x -lt $bmpWhite.Width; $x++) {
    for ($y = 0; $y -lt $bmpWhite.Height; $y++) {
        $c = $bmpWhite.GetPixel($x, $y)
        if ($c.R -gt 225 -and $c.G -gt 225 -and $c.B -gt 225) {
            $bmpWhite.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        } else {
            # Turn purple emblem pixels to crisp pure white (#FFFFFF)
            $bmpWhite.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($c.A, 255, 255, 255))
        }
    }
}
$bmpWhite.Save($outWhitePath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmpWhite.Dispose()
$gW.Dispose()
$orig.Dispose()
$orig2.Dispose()

Write-Host "Both transparent logos created successfully!"

