$files = Get-ChildItem -Path '.' -Filter '*.html'
foreach ($f in $files) {
    if ($f.Name -eq "refactor.ps1") { continue }
    $content = Get-Content $f.FullName -Encoding UTF8

    $content = $content -replace "Atelier", "Store"
    $content = $content -replace "Curated Journey", "Shopping Experience"
    $content = $content -replace "Sanctuary", "Home"
    $content = $content -replace "curated pairings for your living space", "Best Quality Products"

    # Currency formatting: since $ is regex special character, we must escape it 
    $content = $content -replace '\$([0-9,]+)\.00', '₹$1'
    $content = $content -replace '\$([0-9,]+)', '₹$1'

    # Typography
    $content = $content -replace 'tracking-\[0\.25em\]', ''
    $content = $content -replace 'tracking-\[0\.2em\]', 'tracking-wide'
    $content = $content -replace 'tracking-\[0\.15em\]', ''
    $content = $content -replace 'tracking-widest', 'tracking-wide'

    # Convert specific overused uppercase
    $content = $content -replace 'text-\[10px\] uppercase', 'text-sm'
    $content = $content -replace 'text-[10px] font-bold uppercase', 'text-sm font-bold'

    Set-Content -Path $f.FullName -Value $content -Encoding UTF8
}
