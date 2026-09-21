$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8080/")
try {
    $listener.Start()
    Write-Host "✅ Local web server started successfully on http://localhost:8080/"
} catch {
    Write-Host "Port 8080 in use or listener failed: $_"
}

$filePath = "C:\Users\97254\.gemini\antigravity\scratch\oz-store\index.html"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $response = $context.Response
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        
        $response.Headers.Add("Content-Type", "text/html; charset=utf-8")
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
        $response.Close()
    } catch {
        # ignore context cancellation
    }
}
