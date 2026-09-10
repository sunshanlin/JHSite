# Inserts the customer reference slide right after About Us.
#
# It is the first proof point in the deck: the intro says who we are, this page
# says the work is already running somewhere real, then the content starts.
#
# Everything that names the customer - logo, headline, cards, notes, even the
# accent colour (their brand colour, not ours) - lives in build\reference.json,
# which is NOT in git: this repo is public and a customer reference is not ours
# to publish. reference.example.json shows the shape; ask the owner for the
# real file. The logo goes under assets\customer\, also ignored.
#
# Layout is the modern card style the rest of the deck uses - light page, one
# accent, a two-line headline that carries the story, three cards underneath -
# built by duplicating the JWIC Localization overview slide so the background,
# the JW logo and the type come from the deck itself.
#
# Re-runnable: the slide it creates is named JWIC_reference and is deleted first.
# ASCII only - PowerShell 5.1 reads .ps1 as ANSI. Thai lives in the JSON.
param([string]$Path)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$base = Split-Path -Parent $root
$cfg  = Get-Content (Join-Path $root 'deck-core.json') -Encoding UTF8 -Raw | ConvertFrom-Json
$deck = if ($Path) { $Path } else { $cfg.master }
$NAME = 'JWIC_reference'

# The script is the exam: no content file or no logo means no slide, rather
# than a page with a hole where the customer should be.
$src = Join-Path $root 'reference.json'
if (-not (Test-Path $src)) { throw "build\reference.json is not in git - copy reference.example.json and fill it in, or ask the owner for the real one" }
$ref  = Get-Content $src -Encoding UTF8 -Raw | ConvertFrom-Json
$MARK = Join-Path $base ($ref.logo -replace '/', '\')
if (-not (Test-Path $MARK)) { throw "customer logo not found: $MARK" }

function Hex2Ole([string]$h) {
  $h = $h.TrimStart('#')
  $r = [Convert]::ToInt32($h.Substring(0,2),16)
  $g = [Convert]::ToInt32($h.Substring(2,2),16)
  $b = [Convert]::ToInt32($h.Substring(4,2),16)
  return ($b * 65536) + ($g * 256) + $r      # PowerPoint wants BGR
}
$ACC   = Hex2Ole $ref.accent
$INK   = Hex2Ole '#1C1F26'
$BODY  = Hex2Ole '#5A6270'       # the body grey used across the deck
$MUTE  = Hex2Ole '#6E7480'
$WHITE = Hex2Ole '#FFFFFF'
$FONT  = 'Segoe Sans Display'

function Add-Text($slide, $l, $t, $w, $h, $text, $size, $colour, $bold, $space) {
  $tb = $slide.Shapes.AddTextbox(1, [float]$l, [float]$t, [float]$w, [float]$h)
  $tb.TextFrame.WordWrap = -1
  $tb.TextFrame.AutoSize = 0
  $tb.TextFrame.MarginLeft = 0; $tb.TextFrame.MarginRight = 0
  $tb.TextFrame.MarginTop = 0;  $tb.TextFrame.MarginBottom = 0
  $tr = $tb.TextFrame.TextRange
  $tr.Text = $text
  $tr.Font.Name = $FONT
  $tr.Font.Size = [float]$size
  $tr.Font.Color.RGB = $colour
  if ($bold) { $tr.Font.Bold = -1 }
  if ($space) { $tb.TextFrame2.TextRange.Font.Spacing = [float]$space }
  return $tb
}
function Set-Notes($s, $text) {
  $np = $s.NotesPage
  for ($i = 1; $i -le $np.Shapes.Count; $i++) {
    $sh = $np.Shapes.Item($i)
    if ($sh.HasTextFrame -and $sh.Type -eq 14 -and $sh.PlaceholderFormat.Type -eq 2) {
      $sh.TextFrame.TextRange.Text = $text; return
    }
  }
}
function Read-Slide($s) {
  $t = ''
  for ($j = 1; $j -le $s.Shapes.Count; $j++) {
    $sh = $s.Shapes.Item($j)
    if ($sh.HasTextFrame -eq -1 -and $sh.TextFrame.HasText -eq -1) { $t += ' ' + $sh.TextFrame.TextRange.Text }
  }
  return $t
}

$pp = New-Object -ComObject PowerPoint.Application
$pp.DisplayAlerts = 1
$pres = $null
try {
  $pres = $pp.Presentations.Open($deck, 0, 0, -1)

  for ($i = $pres.Slides.Count; $i -ge 1; $i--) {
    if ($pres.Slides.Item($i).Name -eq $NAME) { $pres.Slides.Item($i).Delete() }
  }

  $after = 0; $donor = 0
  for ($i = 1; $i -le $pres.Slides.Count; $i++) {
    $t = Read-Slide $pres.Slides.Item($i)
    if ($after -eq 0 -and $t -match 'About Us' -and $t -match 'Jirapat Wichayapong') { $after = $i }
    if ($t -match 'JWIC Localization' -and $t -match 'Value Added Tax' -and $t -match 'Billing Note') { $donor = $i }
  }
  if ($after -eq 0) { throw 'slide "About Us" not found' }
  if ($donor -eq 0) { throw 'no light content slide to borrow the layout from' }

  # borrow the page: background, JW logo and theme come from the deck, so this
  # page keeps looking right when the deck is restyled by hand later
  $slide = $pres.Slides.Item($donor).Duplicate().Item(1)
  for ($i = $slide.Shapes.Count; $i -ge 1; $i--) { $slide.Shapes.Item($i).Delete() }
  $slide.MoveTo($after + 1)
  $slide.Name = $NAME

  # --- headline ------------------------------------------------------------
  Add-Text $slide 60 54 400 16 $ref.eyebrow 11 $ACC -1 1.8 | Out-Null
  $pic = $slide.Shapes.AddPicture($MARK, 0, -1, 0, 44)   # native size, then scale to width
  $pic.LockAspectRatio = -1
  $pic.Width = [single]$ref.logoWidth
  $pic.Left  = [single](900 - $pic.Width)

  Add-Text $slide 60 96  760 46 $ref.headline[0] 32 $INK 0 0 | Out-Null
  Add-Text $slide 60 146 760 46 $ref.headline[1] 32 $ACC 0 0 | Out-Null

  $rule = $slide.Shapes.AddShape(1, 60, 212, 88, 4)
  $rule.Fill.ForeColor.RGB = $ACC
  $rule.Line.Visible = 0

  # --- three cards: context / requirement / solution -----------------------
  $x = 60.0
  foreach ($c in $ref.cards) {
    $card = $slide.Shapes.AddShape(5, $x, 254, 260, 186)   # msoShapeRoundedRectangle
    $card.Adjustments.Item(1) = 0.05
    $card.Fill.ForeColor.RGB = $WHITE
    $card.Line.Visible = 0
    $tick = $slide.Shapes.AddShape(1, ($x + 26), 282, 26, 4)
    $tick.Fill.ForeColor.RGB = $ACC
    $tick.Line.Visible = 0
    Add-Text $slide ($x + 26) 304 208 22 $c.h 16 $INK -1 0 | Out-Null
    Add-Text $slide ($x + 26) 334 208 92 $c.b 12.5 $BODY 0 0 | Out-Null
    $x += 280
  }

  Add-Text $slide 60 464 600 14 $ref.foot 9.5 $MUTE 0 0 | Out-Null

  $jw = Join-Path $cfg.imgRoot $cfg.logo.file
  if (Test-Path $jw) {
    [void]$slide.Shapes.AddPicture($jw, 0, -1, $cfg.logo.left, $cfg.logo.top, $cfg.logo.size, $cfg.logo.size)
  }

  Set-Notes $slide $ref.notes

  $pres.Save()
  Write-Host ("reference added as slide {0} of {1}" -f ($after + 1), $pres.Slides.Count)
}
finally {
  if ($null -ne $pres) { $pres.Close() }
  $pp.Quit()
  [void][Runtime.InteropServices.Marshal]::ReleaseComObject($pp)
}
