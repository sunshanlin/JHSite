# Adds the "What Each Phase Delivers" slide right after "Fast Implementation"
# in the master deck - pulls the sign-off deliverable out of each Success by
# Design phase so it reads on its own, instead of buried at the end of that
# phase's activity list on the SBD slide two pages back.
#
# Source of truth for the content: the deck itself. Deliverable names are
# copied from the "sbd" slide bullets, the Fast Implementation gate
# descriptions and the Payment Schedule milestone names, so all three slides
# keep saying the same thing about the same gate.
# Re-runnable: it deletes the slide it created before (it carries tagged shapes).
# ASCII only - PowerShell 5.1 reads .ps1 as ANSI. Thai lives in methodology-notes.json.
param([string]$Path)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$cfg  = Get-Content (Join-Path $root 'deck-core.json') -Encoding UTF8 -Raw | ConvertFrom-Json
$notes = Get-Content (Join-Path $root 'methodology-notes.json') -Encoding UTF8 -Raw | ConvertFrom-Json
$deck = if ($Path) { $Path } else { $cfg.master }
$TAG  = 'dbp'   # every shape this script creates is named dbp<n> - "deliverables by phase"

function C($hex) {
  $r = [Convert]::ToInt32($hex.Substring(0,2),16)
  $g = [Convert]::ToInt32($hex.Substring(2,2),16)
  $b = [Convert]::ToInt32($hex.Substring(4,2),16)
  return ($b * 65536) + ($g * 256) + $r
}
$INK = C '0A1B45'; $BODY = C '333F52'; $WHITE = C 'FFFFFF'
$PH = @{ discover='0078D4'; initiate='1392B4'; implement='6B5BC4'; prepare='A0509E'; operate='0A1B45' }

$script:seq = 0
function Name-It($sh) { $script:seq++; $sh.Name = "$TAG$($script:seq)"; return $sh }

function Box($s, $type, $x, $y, $w, $h) {
  $sh = $s.Shapes.AddShape($type, $x*72, $y*72, $w*72, $h*72)
  $sh.Line.Visible = 0
  $sh.Shadow.Visible = 0
  $sh.TextFrame.WordWrap = -1
  $sh.TextFrame.AutoSize = 0
  $sh.TextFrame.MarginLeft = 5; $sh.TextFrame.MarginRight = 5
  $sh.TextFrame.MarginTop = 2;  $sh.TextFrame.MarginBottom = 2
  return (Name-It $sh)
}
function Tbox($s, $x, $y, $w, $h) {
  $sh = $s.Shapes.AddTextbox(1, $x*72, $y*72, $w*72, $h*72)
  $sh.TextFrame.WordWrap = -1
  $sh.TextFrame.AutoSize = 0
  $sh.TextFrame.MarginLeft = 0; $sh.TextFrame.MarginRight = 0
  $sh.TextFrame.MarginTop = 0;  $sh.TextFrame.MarginBottom = 0
  return (Name-It $sh)
}
function Say($sh, $text, $size, $bold, $color, $align) {
  $tr = $sh.TextFrame.TextRange
  $tr.Text = $text
  $tr.Font.Name = 'Segoe UI'
  $tr.Font.Size = [single]$size
  $tr.Font.Bold = $(if ($bold) { -1 } else { 0 })
  $tr.Font.Color.RGB = $color
  $tr.ParagraphFormat.Alignment = $align      # 1 left, 2 center
  $tr.ParagraphFormat.SpaceWithin = [single]0.92
  return $tr
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

$pp = New-Object -ComObject PowerPoint.Application
$pp.DisplayAlerts = 1
$pres = $null
try {
  $pres = $pp.Presentations.Open($deck, 0, 0, -1)

  # drop earlier runs of this script (whole slide - it carries tagged shapes)
  for ($i = $pres.Slides.Count; $i -ge 1; $i--) {
    $s = $pres.Slides.Item($i)
    $mine = $false
    for ($j = 1; $j -le $s.Shapes.Count; $j++) { if ($s.Shapes.Item($j).Name -like "$TAG*") { $mine = $true } }
    if ($mine) { $s.Delete() }
  }

  # anchor on Fast Implementation - Duplicate() inserts right after it, which
  # lands this new slide right before Payment Schedule
  $anchor = 0
  for ($i = 1; $i -le $pres.Slides.Count; $i++) {
    $t = ''
    $s = $pres.Slides.Item($i)
    for ($j = 1; $j -le $s.Shapes.Count; $j++) {
      $sh = $s.Shapes.Item($j)
      if ($sh.HasTextFrame -and $sh.TextFrame.HasText) { $t += ' ' + $sh.TextFrame.TextRange.Text }
    }
    if ($t -match 'Fast Implementation') { $anchor = $i; break }
  }
  if ($anchor -eq 0) { throw 'anchor slide "Fast Implementation" not found' }

  # duplicating Fast Implementation inherits title style, accent bar, JWIC
  # logo, and keeps the PH phase colours matching the slide right before it
  $D = $pres.Slides.Item($anchor).Duplicate().Item(1)
  for ($i = $D.Shapes.Count; $i -ge 1; $i--) {
    if ($D.Shapes.Item($i).Name -like 'fim*') { $D.Shapes.Item($i).Delete() }
  }

  $D.Shapes.Item('Title 1').TextFrame.TextRange.Text = 'What Each Phase Delivers'

  $X0 = 0.83; $WD = 11.67; $GAP = 0.14; $N = 5
  $colW = ($WD - $GAP * ($N - 1)) / $N

  # deliverable wording is copied from the sbd bullets / fim gate text /
  # payment milestone names - Gate 1 covers Discover+Initiate together and
  # Gate 4-5 covers the Prepare/Operate handover together, same as Payment
  # Schedule groups them
  # "note" items are real deliverables too, but they are not a signed
  # artifact that gates a payment milestone - kept visually distinct
  # (italic) and out of the footer's "sign-off" claim, so the slide never
  # implies the customer signs off on a user manual to release payment
  $cols = @(
    @{ n='Discover';  c=$PH.discover;  g='GATE 1';   items=@('Scope and Fit-Gap Statement, signed') },
    @{ n='Initiate';  c=$PH.initiate;  g='GATE 1';   items=@('Solution Blueprint, signed'); notes=@('BPMN process maps', 'User manual') },
    @{ n='Implement'; c=$PH.implement; g='GATE 2';   items=@('Prototype scenario', 'Build complete, approved extensions only') },
    @{ n='Prepare';   c=$PH.prepare;   g='GATE 3';   items=@('UAT sign-off per process', 'Cutover plan and rehearsal', 'Opening balances reconciled') },
    @{ n='Operate';   c=$PH.operate;   g='GATE 4-5'; items=@('Go-live readiness confirmed', 'First period closed with Finance', 'Handover document, project closure accepted') }
  )

  for ($k = 0; $k -lt $cols.Count; $k++) {
    $col = $cols[$k]
    $x = $X0 + $k * ($colW + $GAP)

    $head = Box $D 5 $x 1.62 $colW 0.5
    $head.Fill.ForeColor.RGB = (C $col.c)
    Say $head $col.n 15 $true $WHITE 2 | Out-Null

    $pillW = 1.3
    $pillX = $x + ($colW - $pillW) / 2
    $pill = Box $D 5 $pillX 2.24 $pillW 0.32
    $pill.Fill.ForeColor.RGB = $INK
    Say $pill $col.g 10 $true $WHITE 2 | Out-Null

    $noteItems = if ($col.ContainsKey('notes')) { $col.notes } else { @() }
    $allItems = @($col.items) + @($noteItems)
    $lines = ($allItems | ForEach-Object { [char]0x2022 + ' ' + $_ }) -join [char]13
    $bodyBox = Tbox $D $x 2.78 $colW 2.7
    $tr = Say $bodyBox $lines 16 $false $BODY 1
    for ($p = 2; $p -le $allItems.Count; $p++) {
      $tr.Paragraphs($p).ParagraphFormat.SpaceBefore = 20
    }
    for ($p = $col.items.Count + 1; $p -le $allItems.Count; $p++) {
      $tr.Paragraphs($p).Font.Italic = -1
    }
  }

  $foot = Tbox $D $X0 5.55 $WD 0.45
  Say $foot 'Sign-off items above are what unlocks each payment milestone - see Payment Schedule next. Italic items ship in the same phase but are not a payment gate.' 11 $true $INK 1 | Out-Null

  Set-Notes $D $notes.c

  $pres.Save()
  Write-Host ("added slide {0} of {1}" -f $D.SlideIndex, $pres.Slides.Count)
}
finally {
  if ($null -ne $pres) { $pres.Close() }
  $pp.Quit()
  [void][Runtime.InteropServices.Marshal]::ReleaseComObject($pp)
}
