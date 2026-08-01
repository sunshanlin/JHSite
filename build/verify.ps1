# Assert the built deck is safe to put in front of a customer.
# Reads the .pptx as a zip - no PowerPoint, no Excel.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$cfg  = Get-Content (Join-Path $root 'deck-core.json') -Encoding UTF8 -Raw | ConvertFrom-Json

$fails = @()
function Check($name, $ok, $detail) {
  if ($ok) { Write-Host "  PASS  $name" }
  else { Write-Host "  FAIL  $name : $detail" -ForegroundColor Red; $script:fails += $name }
}

if (-not (Test-Path $cfg.out)) { Write-Host "FAIL: $($cfg.out) not built"; exit 1 }

$zip = [IO.Compression.ZipFile]::OpenRead($cfg.out)
try {
  $slides = @($zip.Entries | Where-Object { $_.FullName -match '^ppt/slides/slide[0-9]+\.xml$' } |
              Sort-Object { [int]([regex]::Match($_.FullName, '[0-9]+').Value) })
  $notes  = @($zip.Entries | Where-Object { $_.FullName -match '^ppt/notesSlides/notesSlide[0-9]+\.xml$' })

  $allText = ''
  $hiddenCount = 0
  $slideText = @{}
  foreach ($e in $slides) {
    $sr = New-Object IO.StreamReader($e.Open())
    try { $xml = $sr.ReadToEnd() } finally { $sr.Close() }
    $n = [int]([regex]::Match($e.FullName, '[0-9]+').Value)
    $t = ([regex]::Matches($xml, '<a:t>(.*?)</a:t>') | ForEach-Object { $_.Groups[1].Value }) -join ' '
    $slideText[$n] = $t
    $allText += ' ' + $t
    if ($xml -match '<p:sld [^>]*show="0"') { $hiddenCount++ }
  }

  $notesText = ''
  $thaiNotes = 0
  foreach ($e in $notes) {
    $sr = New-Object IO.StreamReader($e.Open())
    try { $xml = $sr.ReadToEnd() } finally { $sr.Close() }
    $t = ([regex]::Matches($xml, '<a:t>(.*?)</a:t>') | ForEach-Object { $_.Groups[1].Value }) -join ' '
    $notesText += ' ' + $t
    # Test by char code, not a literal Thai regex: PowerShell 5.1 reads .ps1 as ANSI
    # and would mangle any Thai character written into this file.
    if (@($t.ToCharArray() | Where-Object { [int]$_ -ge 0x0E00 -and [int]$_ -le 0x0E7F }).Count -gt 0) { $thaiNotes++ }
  }

  Write-Host "Verifying $($cfg.out)"

  # 1. nothing internal-only survived
  Check 'no PARTNER & SELLER GUIDANCE ONLY' `
    ($allText -notmatch 'PARTNER (&amp;|&) SELLER GUIDANCE ONLY') 'internal guidance slide reached the deck'
  Check 'no DO NOT PRESENT' ($allText -notmatch 'DO NOT PRESENT') 'seller guidance slide reached the deck'
  Check 'no "Note to Sellers/Partners" boxes' `
    ($allText -notmatch 'Note to (Sellers|Partners)') 'presenter-only annotation still on a slide'

  # 1b. Microsoft's confidentiality / copyright / warranty / restriction wording
  $restrictPat = 'Classified as|Microsoft Confidential|All rights reserved|Copyright Microsoft|MAKES NO WARRANTIES|Available in .{0,40}Premium|management\*|Manufacturing\*'
  $restricted = @()
  foreach ($e in $zip.Entries) {
    if ($e.FullName -notmatch '^ppt/(slides|slideLayouts|slideMasters|notesSlides)/.*\.xml$') { continue }
    $sr = New-Object IO.StreamReader($e.Open())
    try { $xml = $sr.ReadToEnd() } finally { $sr.Close() }
    $flat = ([regex]::Matches($xml, '<a:t>(.*?)</a:t>') | ForEach-Object { $_.Groups[1].Value }) -join ' '
    if ($flat -match $restrictPat) { $restricted += ($e.FullName -replace '^ppt/', '') }
  }
  Check 'no Microsoft confidentiality / copyright / restriction wording' `
    ($restricted.Count -eq 0) ($restricted -join ', ')

  # 2. customer success is gone
  Check 'no customer stories' `
    (($allText -notmatch 'Situation:') -and ($allText -notmatch 'Total Economic Impact')) 'a customer success slide survived'

  # 3. structure
  $visible = $slides.Count - $hiddenCount
  $appendixStart = ($cfg.newSlides | Where-Object { $_.id -eq 'appendix-divider' }).pos
  $expectedVisible = $appendixStart - 1 - @($cfg.newSlides | Where-Object { $_.PSObject.Properties.Name -contains 'hidden' -and $_.hidden -and $_.pos -lt $appendixStart }).Count
  Check "visible slides = $expectedVisible" ($visible -eq $expectedVisible) "got $visible"
  Check 'deck has an appendix' ($slides.Count -gt $appendixStart) "only $($slides.Count) slides"

  # 4. the closing slide is the capability recap, not an empty Thank you
  Check 'last slide is a real closing slide' `
    ($slideText[$appendixStart - 1] -match 'Capabilities') 'slide before the appendix is not the capability recap'
  Check 'JWIC banner on the closing slide' `
    ($slideText[$appendixStart - 1] -match 'JWIC Thai Localization') 'the JWIC banner is missing'

  # 5. Thai notes landed
  Check "Thai notes >= $($cfg.notesTh.PSObject.Properties.Name.Count)" `
    ($thaiNotes -ge $cfg.notesTh.PSObject.Properties.Name.Count) "only $thaiNotes notes pages contain Thai"

  # 6. JWIC images actually got embedded
  $media = @($zip.Entries | Where-Object { $_.FullName -like 'ppt/media/*' }).Count
  Check 'media present' ($media -gt 0) 'no media at all'
  Check 'contact details on the closing slide' `
    ($slideText[$appendixStart - 1] -match [regex]::Escape($cfg.brand.email)) 'contact line missing'

  # 7. the partner placeholder was actually filled in
  Check 'partner slide names JWIC' `
    ($allText -match [regex]::Escape($cfg.brand.company)) 'JWIC Consulting appears nowhere in the deck'
}
finally { $zip.Dispose() }

if ($fails.Count) { Write-Host "`n$($fails.Count) check(s) failed" -ForegroundColor Red; exit 1 }
Write-Host "`nAll checks passed" -ForegroundColor Green
