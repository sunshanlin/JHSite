# Puts the DBD Registered badge on the "About Us" slide of the master deck.
# That slide is already the credentials block (experience / education /
# certifications), and DBD Registered answers the same question: is the
# one-man consultancy a registered business.
#
# Re-runnable: every shape it creates is named dbd<n> and is deleted first.
# ASCII only - PowerShell 5.1 reads .ps1 as ANSI (no Thai in this file).
param([string]$Path)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$cfg  = Get-Content (Join-Path $root 'deck-core.json') -Encoding UTF8 -Raw | ConvertFrom-Json
$deck = if ($Path) { $Path } else { $cfg.master }
$TAG  = 'dbd'
$img  = Join-Path $cfg.imgRoot 'credentials\dbd-registered.png'
if (-not (Test-Path $img)) { throw "badge not found: $img" }

# points, 960x540 slide. Footer band under the third credential row:
# the last body text ends at y=468 and the JWIC logo sits at x=890.
$BX = 390.0; $BY = 484.0; $BH = 40.0
$BW = $BH * 324 / 154          # badge is 324x154 - off-ratio is a defaced trademark
$CX = $BX + $BW + 12
$CW = 876 - $CX
$CAPTION = 'Registered e-commerce business, Department of Business Development'
$MUTE = (0x9B * 65536) + (0x87 * 256) + 0x7A   # #7A879B, PowerPoint wants BGR
$RULE = (0xE8 * 65536) + (0xDE * 256) + 0xD9   # #D9DEE8, same weight as the row dividers

$script:seq = 0
$pp = New-Object -ComObject PowerPoint.Application
$pp.DisplayAlerts = 1
$pres = $null
try {
  $pres = $pp.Presentations.Open($deck, 0, 0, -1)

  $target = 0
  for ($i = 1; $i -le $pres.Slides.Count; $i++) {
    $s = $pres.Slides.Item($i); $t = ''
    for ($j = 1; $j -le $s.Shapes.Count; $j++) {
      $sh = $s.Shapes.Item($j)
      if ($sh.HasTextFrame -eq -1 -and $sh.TextFrame.HasText -eq -1) { $t += ' ' + $sh.TextFrame.TextRange.Text }
    }
    if ($t -match 'About Us' -and $t -match 'Jirapat Wichayapong') { $target = $i; break }
  }
  if ($target -eq 0) { throw 'slide "About Us" not found' }
  $s = $pres.Slides.Item($target)

  for ($i = $s.Shapes.Count; $i -ge 1; $i--) {
    if ($s.Shapes.Item($i).Name -like "$TAG*") { $s.Shapes.Item($i).Delete() }
  }

  # hairline above it so the badge reads as a fourth credential row, not a sticker
  $ln = $s.Shapes.AddLine($BX, $BY - 12, $BX + 520, $BY - 12)
  $script:seq++; $ln.Name = "$TAG$($script:seq)"
  $ln.Line.ForeColor.RGB = $RULE
  $ln.Line.Weight = [single]0.75

  $pic = $s.Shapes.AddPicture($img, 0, -1, $BX, $BY, $BW, $BH)
  $script:seq++; $pic.Name = "$TAG$($script:seq)"

  $cap = $s.Shapes.AddTextbox(1, $CX, $BY + 13, $CW, 16)
  $script:seq++; $cap.Name = "$TAG$($script:seq)"
  $cap.TextFrame.WordWrap = -1
  $cap.TextFrame.AutoSize = 0
  $cap.TextFrame.MarginLeft = 0; $cap.TextFrame.MarginRight = 0
  $cap.TextFrame.MarginTop = 0;  $cap.TextFrame.MarginBottom = 0
  $tr = $cap.TextFrame.TextRange
  $tr.Text = $CAPTION
  $tr.Font.Name = 'Segoe UI'
  $tr.Font.Size = [single]11
  $tr.Font.Color.RGB = $MUTE
  $tr.ParagraphFormat.Alignment = 1
  $tr.ParagraphFormat.SpaceWithin = [single]0.92

  $pres.Save()
  Write-Host ("badge added to slide {0} of {1}" -f $target, $pres.Slides.Count)
}
finally {
  if ($null -ne $pres) { $pres.Close() }
  $pp.Quit()
  [void][Runtime.InteropServices.Marshal]::ReleaseComObject($pp)
}
