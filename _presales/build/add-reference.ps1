# Inserts the customer reference slide ("Miele Thailand") right after About Us.
#
# It is the first proof point in the deck: the intro says who we are, this page
# says the work is already running somewhere real, then the Agenda starts.
#
# Layout is the modern card style the rest of the deck uses - light page, one
# accent, a headline that carries the story, three cards underneath - built by
# duplicating the JWIC Localization overview slide so the background, the JW
# logo and the type come from the deck itself. The accent on this page is
# Miele's own red, taken from the logo file: the page is about them.
#
# Re-runnable: the slide it creates is named JWIC_reference and is deleted
# first. Run this AFTER add-agenda.ps1; both insert at "About Us + 1", so the
# one that runs last ends up closest to About Us.
# ASCII only - PowerShell 5.1 reads .ps1 as ANSI. Thai lives in reference-notes.json.
param([string]$Path)
$ErrorActionPreference = 'Stop'
$root  = Split-Path -Parent $MyInvocation.MyCommand.Path
$cfg   = Get-Content (Join-Path $root 'deck-core.json') -Encoding UTF8 -Raw | ConvertFrom-Json
$notes = Get-Content (Join-Path $root 'reference-notes.json') -Encoding UTF8 -Raw | ConvertFrom-Json
$deck  = if ($Path) { $Path } else { $cfg.master }
$NAME  = 'JWIC_reference'

# The customer logo is kept in _presales\assets, NOT in img\ - img\ is served
# by GitHub Pages, and a customer logo sitting on jwicconsulting.com reads as a
# public endorsement we have not been given.
$MARK  = Join-Path (Split-Path -Parent $root) 'assets\miele-logo.png'
$MARKR = 100.0 / 38.3            # width / height of that file

$EYEBROW = 'CUSTOMER REFERENCE'
$HEAD1   = 'Miele Thailand on the group''s global ERP.'
$HEAD2   = 'Withholding tax on JWIC Thai Localization.'
$FOOT    = 'Shown as a customer reference. Miele is a trademark of Miele & Cie. KG.'

# context / requirement / solution - the shape every reference page takes
$CARDS = @(
  @{ h = 'Global rollout';
     b = 'Business Central is implemented and governed centrally by Miele in Germany. Miele Thailand runs on the same group template as every other market.' },
  @{ h = 'Local requirement';
     b = 'Thai withholding tax - certificates, PND returns and the monthly filing - falls outside the scope of the global template.' },
  @{ h = 'Local solution';
     b = 'JWIC Thai Localization covers withholding tax end to end for Miele Thailand and is in production use today.' }
)

function Hex2Ole([string]$h) {
  $h = $h.TrimStart('#')
  $r = [Convert]::ToInt32($h.Substring(0,2),16)
  $g = [Convert]::ToInt32($h.Substring(2,2),16)
  $b = [Convert]::ToInt32($h.Substring(4,2),16)
  return ($b * 65536) + ($g * 256) + $r      # PowerPoint wants BGR
}
$RED   = Hex2Ole '#8C0014'       # the red in miele-logo.svg
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

# The script is the exam: no logo file means no slide, rather than a page with
# a customer name and a hole where the mark should be.
if (-not (Test-Path $MARK)) { throw "customer logo not found: $MARK" }

$pp = New-Object -ComObject PowerPoint.Application
$pp.DisplayAlerts = 1
$pres = $null
try {
  $pres = $pp.Presentations.Open($deck, 0, 0, -1)

  for ($i = $pres.Slides.Count; $i -ge 1; $i--) {
    if ($pres.Slides.Item($i).Name -eq $NAME) { $pres.Slides.Item($i).Delete() }
  }

  $after = 0; $src = 0
  for ($i = 1; $i -le $pres.Slides.Count; $i++) {
    $t = Read-Slide $pres.Slides.Item($i)
    if ($after -eq 0 -and $t -match 'About Us' -and $t -match 'Jirapat Wichayapong') { $after = $i }
    if ($t -match 'JWIC Localization' -and $t -match 'Value Added Tax' -and $t -match 'Billing Note') { $src = $i }
  }
  if ($after -eq 0) { throw 'slide "About Us" not found' }
  if ($src -eq 0) { throw 'no light content slide to borrow the layout from' }

  # borrow the page: background, JW logo and theme come from the deck, so this
  # page keeps looking right when the deck is restyled by hand later
  $slide = $pres.Slides.Item($src).Duplicate().Item(1)
  for ($i = $slide.Shapes.Count; $i -ge 1; $i--) { $slide.Shapes.Item($i).Delete() }
  $slide.MoveTo($after + 1)
  $slide.Name = $NAME

  # --- headline ------------------------------------------------------------
  Add-Text $slide 60 54 400 16 $EYEBROW 11 $RED -1 1.8 | Out-Null
  $w = 150.0
  [void]$slide.Shapes.AddPicture($MARK, 0, -1, (900 - $w), 44, $w, ($w / $MARKR))

  Add-Text $slide 60 96  760 46 $HEAD1 32 $INK 0 0 | Out-Null
  Add-Text $slide 60 146 760 46 $HEAD2 32 $RED 0 0 | Out-Null

  $rule = $slide.Shapes.AddShape(1, 60, 212, 88, 4)
  $rule.Fill.ForeColor.RGB = $RED
  $rule.Line.Visible = 0

  # --- three cards ---------------------------------------------------------
  $x = 60.0
  foreach ($c in $CARDS) {
    $card = $slide.Shapes.AddShape(5, $x, 254, 260, 186)   # msoShapeRoundedRectangle
    $card.Adjustments.Item(1) = 0.05
    $card.Fill.ForeColor.RGB = $WHITE
    $card.Line.Visible = 0
    $tick = $slide.Shapes.AddShape(1, ($x + 26), 282, 26, 4)
    $tick.Fill.ForeColor.RGB = $RED
    $tick.Line.Visible = 0
    Add-Text $slide ($x + 26) 304 208 22 $c.h 16 $INK -1 0 | Out-Null
    Add-Text $slide ($x + 26) 334 208 92 $c.b 12.5 $BODY 0 0 | Out-Null
    $x += 280
  }

  Add-Text $slide 60 464 600 14 $FOOT 9.5 $MUTE 0 0 | Out-Null

  $jw = Join-Path $cfg.imgRoot $cfg.logo.file
  if (Test-Path $jw) {
    [void]$slide.Shapes.AddPicture($jw, 0, -1, $cfg.logo.left, $cfg.logo.top, $cfg.logo.size, $cfg.logo.size)
  }

  Set-Notes $slide $notes.a

  $pres.Save()
  Write-Host ("reference added as slide {0} of {1}" -f ($after + 1), $pres.Slides.Count)
}
finally {
  if ($null -ne $pres) { $pres.Close() }
  $pp.Quit()
  [void][Runtime.InteropServices.Marshal]::ReleaseComObject($pp)
}
