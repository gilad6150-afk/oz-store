$jsonPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\mishkan_catalog_preview.json'
$labelsPath = 'C:\Users\97254\.gemini\antigravity\scratch\oz-store\labels.json'
$outputPath = 'C:\Users\97254\.gemini\antigravity\brain\58d0bef7-ea4b-4cd7-b83b-3570fb76c5b8\mishkan_catalog_preview.md'

if (-not (Test-Path $jsonPath) -or -not (Test-Path $labelsPath)) {
    Write-Host "Required input files missing."
    exit 1
}

$rawJson = [System.IO.File]::ReadAllText($jsonPath, [System.Text.Encoding]::UTF8)
$catalog = $rawJson | ConvertFrom-Json

$rawLabels = [System.IO.File]::ReadAllText($labelsPath, [System.Text.Encoding]::UTF8)
$L = $rawLabels | ConvertFrom-Json

$tzitzitList = $catalog | Where-Object { $_.category -eq 'tzitzit' }
$tallitList  = $catalog | Where-Object { $_.category -eq 'tallit' }

$sb = [System.Text.StringBuilder]::new()

[void]$sb.AppendLine($L.mdHeaderTitle)
[void]$sb.AppendLine()
[void]$sb.AppendLine($L.mdAlertImportant)
[void]$sb.AppendLine()
[void]$sb.AppendLine($L.mdAlertNote)
[void]$sb.AppendLine()
[void]$sb.AppendLine("---")
[void]$sb.AppendLine()
[void]$sb.AppendLine($L.mdSummaryHeader)
[void]$sb.AppendLine()
[void]$sb.AppendLine($L.mdTableCols)
[void]$sb.AppendLine($L.mdTableAlign)

$rowTz = [string]::Format($L.mdRowTzitzit, $tzitzitList.Count)
$rowTl = [string]::Format($L.mdRowTallit, $tallitList.Count)
$rowTot = [string]::Format($L.mdRowTotal, $catalog.Count)

[void]$sb.AppendLine($rowTz)
[void]$sb.AppendLine($rowTl)
[void]$sb.AppendLine($rowTot)
[void]$sb.AppendLine()
[void]$sb.AppendLine("---")
[void]$sb.AppendLine()

function Render-Group {
    param([string]$groupTitle, $items)
    
    [void]$sb.AppendLine("$groupTitle ($($items.Count))")
    [void]$sb.AppendLine()

    $subGroups = $items | Group-Object sub_category

    foreach ($sg in $subGroups) {
        $subHeader = [string]::Format($L.mdSubGroupHeader, $sg.Name, $sg.Count)
        [void]$sb.AppendLine($subHeader)
        [void]$sb.AppendLine()

        foreach ($item in $sg.Group) {
            $itemHeader = [string]::Format($L.mdItemTitleHeader, $item.title)
            [void]$sb.AppendLine($itemHeader)
            [void]$sb.AppendLine()
            [void]$sb.AppendLine([string]::Format($L.mdItemSku, $item.id))
            [void]$sb.AppendLine([string]::Format($L.mdItemFabric, $item.fabric))
            [void]$sb.AppendLine([string]::Format($L.mdItemCerts, (($item.certifications) -join ', ')))
            [void]$sb.AppendLine([string]::Format($L.mdItemBadge, $item.image_styling_badge))
            
            if ($item.description) {
                [void]$sb.AppendLine([string]::Format($L.mdItemDesc, $item.description))
            }

            [void]$sb.AppendLine()
            [void]$sb.AppendLine($L.mdTablePriceHeader)
            [void]$sb.AppendLine($L.mdTablePriceAlign)

            foreach ($sp in $item.sizes_and_prices) {
                [void]$sb.AppendLine([string]::Format($L.mdTablePriceRow, $sp.size, $sp.price, $sp.sku))
            }

            [void]$sb.AppendLine()
            if ($item.main_image) {
                [void]$sb.AppendLine("![Main Image]($($item.main_image))")
                [void]$sb.AppendLine()
            }
            [void]$sb.AppendLine("---")
            [void]$sb.AppendLine()
        }
    }
}

Render-Group -groupTitle $L.mdSecTzitzitTitle -items $tzitzitList
Render-Group -groupTitle $L.mdSecTallitTitle -items $tallitList

[System.IO.File]::WriteAllText($outputPath, $sb.ToString(), [System.Text.Encoding]::UTF8)
Write-Host "Generated preview markdown artifact successfully at: $outputPath"
