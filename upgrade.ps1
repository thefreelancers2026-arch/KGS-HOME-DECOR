# KGS Luxury UX Upgrade - All 5 files
$ErrorActionPreference = "Stop"
$utf8NoBOM = New-Object System.Text.UTF8Encoding $false

# Read index.html as raw bytes to handle mojibake
$bytes = [System.IO.File]::ReadAllBytes("d:\KGS HOME DECOR\index.html")
$idx = [System.Text.Encoding]::UTF8.GetString($bytes)

# Fix mojibake sequences (double-encoded UTF-8)
# e-acute: C3 A9 was read as two chars
$idx = $idx.Replace([char]0xC3 + [string][char]0xA9, [string][char]0xE9)
# em-dash
$idx = $idx.Replace([char]0xE2 + [string][char]0x80 + [string][char]0x93, [string][char]0x2013)
$idx = $idx.Replace([char]0xE2 + [string][char]0x80 + [string][char]0x94, [string][char]0x2014)
# middle dot
$idx = $idx.Replace([char]0xC2 + [string][char]0xB7, [string][char]0xB7)
# star
$repl = @{
  'DÃ©cor' = 'D&eacute;cor'
  'DÃ©cors' = 'D&eacute;cors'
  'dÃ©cor' = 'd&eacute;cor'
  'â€"' = '&mdash;'
  'â€"' = '&ndash;'
  'â€˜' = [char]0x2018
  'â€™' = [char]0x2019
  'â€œ' = [char]0x201C
  'Â·' = '&middot;'
  'â˜…' = '&#9733;'
  'âœ"' = '&#10003;'
  'âœ¦' = '&#10022;'
  'â†'' = '&rarr;'
  'â­' = '&#11088;'
  'Â ' = ''
}

foreach ($k in $repl.Keys) {
  $idx = $idx.Replace($k, $repl[$k])
}

# Also fix emoji sequences
$idx = $idx -replace [regex]::Escape('ðŸšš'), '&#128666;'
$idx = $idx -replace [regex]::Escape('ðŸ'°'), '&#128176;'
$idx = $idx -replace [regex]::Escape('ðŸ"±'), '&#128241;'
$idx = $idx -replace [regex]::Escape('ðŸ"¸'), '&#128248;'

Write-Host "Encoding fixes applied..."

# Trust bar icon color: text-warm to text-gold
$idx = $idx -replace '(material-symbols-outlined text-\[22px\]) text-warm mb-2', '$1 text-gold mb-2'

# Section overlines: text-[10px] to text-[11px]
$idx = $idx -replace 'text-\[10px\] font-medium tracking-\[\.18em\] uppercase text-gold mb-3', 'text-[11px] font-semibold tracking-[.18em] uppercase text-gold mb-3'
$idx = $idx -replace 'text-\[10px\] font-semibold tracking-\[\.18em\] uppercase text-gold mb-6', 'text-[11px] font-semibold tracking-[.18em] uppercase text-gold mb-6'

# Instagram overline
$idx = $idx -replace 'text-\[10px\] font-medium tracking-\[\.22em\] uppercase text-muted mb-2', 'text-[11px] font-semibold tracking-[.18em] uppercase text-gold mb-2'

# About section stat labels
$idx = $idx -replace 'text-\[10px\] text-muted tracking-\[\.18em\] uppercase mt-1', 'text-[11px] text-muted tracking-[.14em] uppercase mt-1'

# Hero overlines
$idx = $idx -replace 'text-warm text-\[10px\] font-semibold tracking-\[\.22em\] uppercase mb-4', 'text-gold text-[11px] font-semibold tracking-[.18em] uppercase mb-4'

# Google rating badge
$idx = $idx -replace 'text-white/70 text-\[10px\] font-semibold', 'text-white/70 text-[11px] font-semibold'

# Review card labels
$idx = $idx -replace 'text-muted text-\[10px\] mt-1\.5', 'text-muted text-[11px] mt-1.5'
$idx = $idx -replace 'text-gold text-\[10px\] font-medium mt-2', 'text-gold text-[11px] font-medium mt-2'

# Review stars: text-warm to text-gold
$idx = $idx -replace 'class="text-warm text-xs mb-1\.5"', 'class="text-gold text-xs mb-1.5"'

# Footer stars
$idx = $idx -replace 'text-warm text-\[10px\]"', 'text-gold text-[11px]"'

# Footer heading labels
$idx = $idx -replace 'text-white text-\[10px\] tracking-\[\.22em\] uppercase font-semibold', 'text-white text-[11px] tracking-[.18em] uppercase font-semibold'

# Footer copyright
$idx = $idx -replace 'text-\[10px\] tracking-\[\.14em\] uppercase text-white/25', 'text-[11px] tracking-[.14em] uppercase text-white/25'

# Collection tile overline
$idx = $idx -replace 'text-white/60 text-\[10px\] tracking-\[\.18em\] uppercase mb-1', 'text-white/60 text-[11px] tracking-[.18em] uppercase mb-1'

# Reel CTA text
$idx = $idx -replace '>Shop Now</a>', '>Explore Collection</a>'

# Footer tagline
$idx = $idx -replace 'curated for Indian homes\.', "Virudhachalam's favourite home d&eacute;cor store."

Write-Host "Typography and color hierarchy applied..."

[System.IO.File]::WriteAllText("d:\KGS HOME DECOR\index.html", $idx, $utf8NoBOM)
Write-Host "[OK] index.html"

# ─── PRODUCT-LISTING.HTML ─────────────────────────────────
$pl = [System.IO.File]::ReadAllText("d:\KGS HOME DECOR\product-listing.html", [System.Text.Encoding]::UTF8)

$pl = $pl -replace '(material-symbols-outlined text-\[22px\]) text-warm mb-2', '$1 text-gold mb-2'
$pl = $pl -replace 'text-muted text-\[10px\] mt-0\.5', 'text-muted text-[11px] mt-0.5'
$pl = $pl -replace 'tracking-widest font-medium mb-4', 'tracking-[.14em] font-medium mb-4'

[System.IO.File]::WriteAllText("d:\KGS HOME DECOR\product-listing.html", $pl, $utf8NoBOM)
Write-Host "[OK] product-listing.html"

# ─── PRODUCT-DETAIL.HTML ──────────────────────────────────
$pd = [System.IO.File]::ReadAllText("d:\KGS HOME DECOR\product-detail.html", [System.Text.Encoding]::UTF8)

$pd = $pd -replace 'tracking-widest', 'tracking-[.14em]'
$pd = $pd -replace 'tracking-\[\.3em\]', 'tracking-[.18em]'
$pd = $pd -replace 'text-\[9\.5px\] font-semibold tracking-\[\.2em\] uppercase text-muted mb-1', 'text-[11px] font-semibold tracking-[.14em] uppercase text-muted mb-1'
$pd = $pd -replace '(material-symbols-outlined text-\[18px\]) text-warm', '$1 text-gold'

[System.IO.File]::WriteAllText("d:\KGS HOME DECOR\product-detail.html", $pd, $utf8NoBOM)
Write-Host "[OK] product-detail.html"

# ─── CART-CHECKOUT.HTML ───────────────────────────────────
$cc = [System.IO.File]::ReadAllText("d:\KGS HOME DECOR\cart-checkout.html", [System.Text.Encoding]::UTF8)

$cc = $cc -replace 'tracking-widest', 'tracking-[.14em]'

[System.IO.File]::WriteAllText("d:\KGS HOME DECOR\cart-checkout.html", $cc, $utf8NoBOM)
Write-Host "[OK] cart-checkout.html"

# ─── CUSTOMER-ACCOUNT.HTML ────────────────────────────────
$ca = [System.IO.File]::ReadAllText("d:\KGS HOME DECOR\customer-account.html", [System.Text.Encoding]::UTF8)

$ca = $ca -replace 'tracking-widest', 'tracking-[.14em]'
$ca = $ca -replace 'text-\[9\.5px\] font-semibold tracking-\[\.14em\] uppercase text-muted mb-1', 'text-[11px] font-semibold tracking-[.14em] uppercase text-muted mb-1'
$ca = $ca -replace 'text-\[9\.5px\] font-semibold tracking-\[\.14em\] uppercase text-gold mb-2 block', 'text-[11px] font-semibold tracking-[.14em] uppercase text-gold mb-2 block'

[System.IO.File]::WriteAllText("d:\KGS HOME DECOR\customer-account.html", $ca, $utf8NoBOM)
Write-Host "[OK] customer-account.html"

Write-Host ""
Write-Host "ALL 5 FILES UPGRADED SUCCESSFULLY"
