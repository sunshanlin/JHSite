# Inserts the "Agenda" slide right after About Us in the master deck.
# Topics only, no timings - the session runs 09:30-12:00 and the running order
# shifts with the customer's questions; a printed clock only makes us late.
#
# Re-runnable: the slide it creates is named JWIC_agenda and is deleted first.
# ASCII only - PowerShell 5.1 reads .ps1 as ANSI (no Thai in this file).
param([string]$Path)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$cfg  = Get-Content (Join-Path $root 'deck-core.json') -Encoding UTF8 -Raw | ConvertFrom-Json
$deck = if ($Path) { $Path } else { $cfg.master }
$L    = $cfg.layout
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
$ROW = 44.0                      # 8 rows from gridTop lands the last one clear of the logo
$BADGE = 30.0

function Hex2Ole([string]$h) {
  $h = $h.TrimStart('#')
  $r = [Convert]::ToInt32($h.Substring(0,2),16)
  $g = [Convert]::ToInt32($h.Substring(2,2),16)
  $b = [Convert]::ToInt32($h.Substring(4,2),16)
  return ($b * 65536) + ($g * 256) + $r      # PowerPoint wants BGR
}
$green  = Hex2Ole $cfg.brand.green
$accent = Hex2Ole $cfg.brand.accent
$cream  = Hex2Ole $cfg.brand.cream

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

  $slide = $pres.Slides.Add($after + 1, 11)   # ppLayoutTitleOnly
  $slide.Name = $NAME

  $t = $slide.Shapes.Item(1)
  $t.Left = [float]$L.titleLeft; $t.Top = [float]$L.titleTop
  $t.Width = [float]$L.titleWidth; $t.Height = [float]$L.titleHeight
  $t.TextFrame.TextRange.Text = 'Agenda'
  $t.TextFrame.TextRange.Font.Size = [float]$L.titleSize

  $rule = $slide.Shapes.AddShape(1, $L.titleLeft, $L.ruleTop, $L.ruleWidth, $L.ruleHeight)
  $rule.Fill.ForeColor.RGB = $accent
  $rule.Line.Visible = 0

  for ($n = 0; $n -lt $ITEMS.Count; $n++) {
    $y = $L.gridTop + $n * $ROW
    $sq = $slide.Shapes.AddShape(5, [float]$L.gridLeft, [float]$y, $BADGE, $BADGE)
    $sq.Fill.ForeColor.RGB = $green
    $sq.Line.Visible = 0
    $sq.TextFrame.MarginLeft = 0; $sq.TextFrame.MarginRight = 0
    $sq.TextFrame.MarginTop = 0;  $sq.TextFrame.MarginBottom = 0
    $sq.TextFrame.WordWrap = 0
    $sq.TextFrame.VerticalAnchor = 3
    $sq.TextFrame.TextRange.Text = '{0:00}' -f ($n + 1)
    $sq.TextFrame.TextRange.Font.Size = [float]12
    $sq.TextFrame.TextRange.Font.Bold = -1
    $sq.TextFrame.TextRange.Font.Color.RGB = $cream

    $tb = $slide.Shapes.AddTextbox(1, [float]($L.gridLeft + $BADGE + 14), [float]($y + 3), 700, 24)
    $tb.TextFrame.WordWrap = 0
    $tb.TextFrame.MarginLeft = 0; $tb.TextFrame.MarginTop = 0; $tb.TextFrame.MarginBottom = 0
    $tb.TextFrame.TextRange.Text = $ITEMS[$n]
    $tb.TextFrame.TextRange.Font.Size = [float]18
    $tb.TextFrame.TextRange.Font.Bold = -1
    $tb.TextFrame.TextRange.Font.Color.RGB = $green
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
