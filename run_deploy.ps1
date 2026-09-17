$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)
$pyCode = [System.IO.File]::ReadAllText('C:\Users\97254\.gemini\antigravity\scratch\oz-store\deploy_to_netlify.py', $utf8NoBOM)

# Run Python via PowerShell script host or python executable
$pythonExe = (Get-Command python -ErrorAction SilentlyContinue).Source
if (-not $pythonExe) {
    $pythonExe = "C:\Users\97254\AppData\Local\Programs\Python\Python310\python.exe"
}

Write-Host "Python Executable Path: $pythonExe"

$process = Start-Process -FilePath "python" -ArgumentList "C:\Users\97254\.gemini\antigravity\scratch\oz-store\deploy_to_netlify.py" -NoNewWindow -Wait -PassThru
Write-Host "Exit Code: $($process.ExitCode)"
