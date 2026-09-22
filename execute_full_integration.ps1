Write-Host "=========================================================="
Write-Host "EXECUTE FULL INTEGRATION OF MISHKAN HATCHELET CATALOG"
Write-Host "=========================================================="

# 1. Convert scraped json to products_data.js
Write-Host "`n[Step 1] Converting scraped catalog to products_data.js..."
powershell -ExecutionPolicy Bypass -Command "
    if (Test-Path 'mishkan_catalog_scraped.json') {
        \$jsonContent = Get-Content 'mishkan_catalog_scraped.json' -Raw -Encoding utf8
        if (\$jsonContent.Length -gt 100) {
            Write-Host 'mishkan_catalog_scraped.json ready!'
        }
    }
"

# Run python conversion script
Write-Host "Running python convert_scraped_to_products_data.py..."
python convert_scraped_to_products_data.py

# 2. Build Unicode Google Merchant Feed
Write-Host "`n[Step 2] Regenerating UTF-8 Google Merchant Feed..."
powershell -ExecutionPolicy Bypass -File build_merchant_feed_unicode.ps1

# 3. Rebuild Master Site HTML (index.html)
Write-Host "`n[Step 3] Rebuilding Master Site (index.html)..."
powershell -ExecutionPolicy Bypass -File rebuild_master_site.ps1

# 4. Deploy Live
Write-Host "`n[Step 4] Deploying to Netlify / Live Site..."
powershell -ExecutionPolicy Bypass -File deploy_netlify.ps1

Write-Host "`n=========================================================="
Write-Host "INTEGRATION AND DEPLOYMENT COMPLETE!"
Write-Host "=========================================================="
