# Inserts the "Agenda" slide right after About Us in the master deck.
# Topics only, no timings - the session runs 09:30-12:00 and the running order
# shifts with the customer's questions; a printed clock only makes us late.
#
# Composition follows the deck it lives in: the brand panel on the left is the
# About Us slide's own panel and palette (navy, cyan rule, hairline rows),
# so the two pages read as one spread.
#
# Re-runnable: the slide it creates is named JWIC_agenda and is deleted first.
# ASCII only - PowerShell 5.1 reads .ps1 as ANSI (no Thai in this file).
param([string]$Path)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$cfg  = Get-Content (Join-Path $root 'deck-core.json') -Encoding UTF8 -Raw | ConvertFrom-Json
$deck = if ($Path) { $Path } else { $cfg.master }
$NAME = 'JWIC_agenda'

# follows the deck order: challenges -> product -> modules -> localization -> delivery
$ITEMS = @(
  'Where SMBs are today',
  'Business Central and Copilot',
  'Finance',
  'Supply chain and sales',
  'Projects and service',
  'Analytics and Power BI',
  'JWIC Thai Localization',
  'Delivery, investment and next steps'
)

# points, 960x540 slide
$PANEL = 300.0                   # left brand panel, same width as the About Us photo panel
$PAD   = 48.0                    # panel gutter
$LX    = 356.0                   # list column starts here
$NUMW  = 40.0                    # room for "01" before the topic
$TOP   = 108.0
$ROW   = 44.0                    # 8 rows end at 460, clear of the logo at 470

function Hex2Ole([string]$h) {
  $h = $h.TrimStart('#')
  $r = [Convert]::ToInt32($h.Substring(0,2),16)
  $g = [Convert]::ToInt32($h.Substring(2,2),16)
  $b = [Convert]::ToInt32($h.Substring(4,2),16)
  return ($b * 65536) + ($g * 256) + $r      # PowerPoint wants BGR
}
# Microsoft deck theme, sampled off the About Us slide so the two pages match
# exactly: navy panel, the cyan-teal rule under its title, its hairline rows.
$navy   = Hex2Ole '#0A1B45'      # About Us panel and its section headings
$cyan   = Hex2Ole '#1392B4'      # the rule under "About Us"
$teal   = Hex2Ole '#0E7695'      # its credential icons
$paper  = Hex2Ole '#FFFFFF'
$rule   = Hex2Ole '#D9D9E3'      # the hairline between credential rows

function Add-Text($slide, $l, $t, $w, $h, $text, $font, $size, $colour, $space) {
  $tb = $slide.Shapes.AddTextbox(1, [float]$l, [float]$t, [float]$w, [float]$h)
  $tb.TextFrame.WordWrap = -1
  $tb.TextFrame.AutoSize = 0
  $tb.TextFrame.MarginLeft = 0; $tb.TextFrame.MarginRight = 0
  $tb.TextFrame.MarginTop = 0;  $tb.TextFrame.MarginBottom = 0
  $tr = $tb.TextFrame.TextRange
  $tr.Text = $text
  $tr.Font.Name = $font
  $tr.Font.Size = [float]$size
  $tr.Font.Color.RGB = $colour
  if ($space) { $tb.TextFrame2.TextRange.Font.Spacing = [float]$space }
  return $tb
}

$pp = New-Object -ComObject PowerPoint.Application
$pp.DisplayAlerts = 1
$pres = $null
try {
  $pres = $pp.Presentations.Open($deck, 0, 0, -1)

  for ($i = $pres.Slides.Count; $i -ge 1; $i--) {
    if ($pres.Slides.Item($i).Name -eq $NAME) { $pres.Slides.Item($i).Delete() }
  }

  $after = 0
  for ($i = 1; $i -le $pres.Slides.Count; $i++) {
    $s = $pres.Slides.Item($i); $t = ''
    for ($j = 1; $j -le $s.Shapes.Count; $j++) {
      $sh = $s.Shapes.Item($j)
      if ($sh.HasTextFrame -eq -1 -and $sh.TextFrame.HasText -eq -1) { $t += ' ' + $sh.TextFrame.TextRange.Text }
    }
    if ($t -match 'About Us' -and $t -match 'Jirapat Wichayapong') { $after = $i; break }
  }
  if ($after -eq 0) { throw 'slide "About Us" not found' }

  $slide = $pres.Slides.Add($after + 1, 12)   # ppLayoutBlank - the panel carries the title
  $slide.Name = $NAME

  # --- left brand panel ----------------------------------------------------
  $panel = $slide.Shapes.AddShape(1, 0, 0, $PANEL, 540)
  $panel.Fill.ForeColor.RGB = $navy
  $panel.Line.Visible = 0

  Add-Text $slide $PAD 196 200 16 'TODAY' 'Segoe UI Semibold' 12 $paper 1.6 | Out-Null
  $r = $slide.Shapes.AddShape(1, $PAD, 226, 64, 3)
  $r.Fill.ForeColor.RGB = $cyan
  $r.Line.Visible = 0
  Add-Text $slide $PAD 246 210 56 'Agenda' 'Segoe UI Light' 40 $paper 0 | Out-Null
  Add-Text $slide $PAD 468 220 20 $cfg.brand.company 'Segoe UI Semibold' 12 $paper 0.4 | Out-Null

  # --- topic list ----------------------------------------------------------
  for ($n = 0; $n -lt $ITEMS.Count; $n++) {
    $y = $TOP + $n * $ROW
    if ($n -gt 0) {
      $ln = $slide.Shapes.AddLine($LX, $y - 8, 900, $y - 8)
      $ln.Line.ForeColor.RGB = $rule
      $ln.Line.Weight = [single]0.75
    }
    Add-Text $slide $LX ($y + 3) $NUMW 18 ('{0:00}' -f ($n + 1)) 'Segoe UI' 12 $teal 1.2 | Out-Null
    Add-Text $slide ($LX + $NUMW) $y (900 - $LX - $NUMW) 24 $ITEMS[$n] 'Segoe UI Semibold' 17 $navy 0 | Out-Null
  }

  $logo = Join-Path $cfg.imgRoot $cfg.logo.file
  if (Test-Path $logo) {
    [void]$slide.Shapes.AddPicture($logo, 0, -1, $cfg.logo.left, $cfg.logo.top, $cfg.logo.size, $cfg.logo.size)
  }

  $pres.Save()
  Write-Host ("agenda added as slide {0} of {1}" -f ($after + 1), $pres.Slides.Count)
}
finally {
  if ($null -ne $pres) { $pres.Close() }
  $pp.Quit()
  [void][Runtime.InteropServices.Marshal]::ReleaseComObject($pp)
}
