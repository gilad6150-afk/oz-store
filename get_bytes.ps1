$u = New-Object System.Text.UTF8Encoding($false)
$b1 = $u.GetBytes('מכון עוז - Google Merchant Center Product Feed')
$b2 = $u.GetBytes('פיד מוצרים רשמי עבור Google Shopping והופעה במנוע החיפוש של גוגל')
$b3 = $u.GetBytes('מכון עוז')

Write-Host "Title:" ($b1 -join ',')
Write-Host "Desc:" ($b2 -join ',')
Write-Host "Brand:" ($b3 -join ',')
