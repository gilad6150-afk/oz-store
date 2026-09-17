$files = Get-ChildItem -Path "C:\Users\97254\.gemini\antigravity\scratch\oz-store" -Include *.html,*.js -Recurse
foreach ($file in $files) {
    $text = Get-Content $file.FullName -Raw -Encoding UTF8
    if ($text -match "[├â├é├â├é├ù├ק]") {
        Write-Host "Found possible corruption in:" $file.Name
    } else {
        Write-Host "Clean UTF8:" $file.Name
    }
}
