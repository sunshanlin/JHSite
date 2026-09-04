# Adds the Fast Implement timeline slide right after the existing
# "Delivery follows Microsoft Success by Design" slide of the master deck.
#
# Source of truth for the content: D:\BC\Project\JHCore\docs\Methodology\FastImplement-SME.html
# Re-runnable: it deletes the slide it created before (it carries tagged shapes).
# ASCII only - PowerShell 5.1 reads .ps1 as ANSI. Thai lives in methodology-notes.json.
#
# ponytail: the second slide ("What keeps a 10-week project at 10 weeks") was
# cut by request - dropped from generation entirely rather than left as dead
# code. notes.b in methodology-notes.json is now unused; keep it only if that
# slide comes back.
param([string]$Path)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$cfg  = Get-Content (Join-Path $root 'deck-core.json') -Encoding UTF8 -Raw | ConvertFrom-Json
$notes = Get-Content (Join-Path $root 'methodology-notes.json') -Encoding UTF8 -Raw | ConvertFrom-Json
$deck = if ($Path) { $Path } else { $cfg.master }
$TAG  = 'fim'   # every shape this script creates is named fim<n>

function C($hex) {
  $r = [Convert]::ToInt32($hex.Substring(0,2),16)
  $g = [Convert]::ToInt32($hex.Substring(2,2),16)
  $b = [Convert]::ToInt32($hex.Substring(4,2),16)
  return ($b * 65536) + ($g * 256) + $r
}
$INK  = C '0A1B45'; $BODY = C '333F52'; $MUTE = C '7A879B'
$PAPER= C 'F5F7FA'; $LINE = C 'DCE3EE'; $WHITE= C 'FFFFFF'
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
function Fit($text, $w, $nominal) {
  # keep the longest word inside the bar - mid-word breaks look broken
  $len = 0
  foreach ($word in $text.Split(' ')) { if ($word.Length -gt $len) { $len = $word.Length } }
  if ($len -eq 0) { return $nominal }
  $max = 11.5 * ($w - 0.10) / ($len * 0.095)
  if ($max -lt $nominal) { return [math]::Max(9, [math]::Round($max, 1)) }
  return $nominal
}
function Clear-Generated($s) {
  for ($i = $s.Shapes.Count; $i -ge 1; $i--) {
    $n = $s.Shapes.Item($i).Name
    if ($n -like "ig6*" -or $n -like "$TAG*") { $s.Shapes.Item($i).Delete() }
  }
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

  # drop earlier runs of this script, then find the anchor slide
  for ($i = $pres.Slides.Count; $i -ge 1; $i--) {
    $s = $pres.Slides.Item($i)
    $mine = $false
    for ($j = 1; $j -le $s.Shapes.Count; $j++) { if ($s.Shapes.Item($j).Name -like "$TAG*") { $mine = $true } }
    if ($mine) { $s.Delete() }
  }
  $anchor = 0
  for ($i = 1; $i -le $pres.Slides.Count; $i++) {
    $t = ''
    $s = $pres.Slides.Item($i)
    for ($j = 1; $j -le $s.Shapes.Count; $j++) {
      $sh = $s.Shapes.Item($j)
      if ($sh.HasTextFrame -and $sh.TextFrame.HasText) { $t += ' ' + $sh.TextFrame.TextRange.Text }
    }
    if ($t -match 'Delivery follows Microsoft Success by Design') { $anchor = $i; break }
  }
  if ($anchor -eq 0) { throw 'anchor slide "Delivery follows Microsoft Success by Design" not found' }

  # duplicating the anchor inherits title style, accent bar and JWIC logo
  $A = $pres.Slides.Item($anchor).Duplicate().Item(1)
  Clear-Generated $A

  # ---------------------------------------------------------------- slide A
  # Phase bands are drawn back to back. The bar widths are relative weight
  # only - the calendar is deliberately not shown, because the schedule is
  # not committed until scope is signed. $COL stays as the layout grid.
  $A.Shapes.Item('Title 1').TextFrame.TextRange.Text = 'Fast Implementation'
  $X0 = 0.83; $WD = 11.67; $COL = $WD / 14

  $phases = @(
    @{ n='Discover';  a=0;  b=2;  c=$PH.discover },
    @{ n='Initiate';  a=2;  b=3;  c=$PH.initiate },
    @{ n='Implement'; a=3;  b=6;  c=$PH.implement },
    @{ n='Prepare';   a=6;  b=10; c=$PH.prepare },
    @{ n='Operate';   a=10; b=14; c=$PH.operate }
  )
  foreach ($p in $phases) {
    $x = $X0 + ($p.a * $COL); $w = ($p.b - $p.a) * $COL
    $bar = Box $A 5 ($x + 0.02) 2.22 ($w - 0.04) 0.55
    if ($p.n -eq 'Operate') {           # outside the fixed-price project scope
      $bar.Fill.ForeColor.RGB = $WHITE
      $bar.Line.Visible = -1; $bar.Line.ForeColor.RGB = (C $p.c); $bar.Line.Weight = 1.25
      $bar.Line.DashStyle = 4
      Say $bar 'Operate' (Fit 'Operate' ($w - 0.04) 14) $true (C $p.c) 2 | Out-Null
    } else {
      $bar.Fill.ForeColor.RGB = (C $p.c)
      Say $bar $p.n (Fit $p.n ($w - 0.04) 14) $true $WHITE 2 | Out-Null
    }
  }

  $acts = @(
    @{ t='Kick-off and Discovery';        a=0;  b=2;  c=$PH.discover },
    @{ t='Blueprint';                     a=2;  b=3;  c=$PH.initiate },
    @{ t='Configure and Build';           a=3;  b=5;  c=$PH.implement },
    @{ t='Prototype';                     a=5;  b=6;  c=$PH.implement },
    @{ t='Test and UAT';                  a=6;  b=8;  c=$PH.prepare },
    @{ t='Cutover and Go-live';           a=8;  b=10; c=$PH.prepare },
    @{ t='Hypercare'; a=10; b=14; c=$PH.operate }
  )
  foreach ($p in $acts) {
    $x = $X0 + ($p.a * $COL); $w = ($p.b - $p.a) * $COL
    $bar = Box $A 5 ($x + 0.02) 2.95 ($w - 0.04) 0.55
    $bar.Fill.ForeColor.RGB = $PAPER
    $bar.Line.Visible = -1; $bar.Line.ForeColor.RGB = (C $p.c); $bar.Line.Weight = 0.75
    Say $bar $p.t (Fit $p.t ($w - 0.04) 11.5) $false $BODY 2 | Out-Null
  }

  $gates = @(
    @{ n='GATE 1';  a=3;  t='Scope and design approved'; d='Scope and Fit-Gap Statement, Solution Blueprint' },
    @{ n='GATE 2';  a=6;  t='Prototype passed, design freeze'; d='Prototype script and results' },
    @{ n='GATE 3';  a=8;  t='UAT passed, no critical or high defects'; d='UAT sign-off per process, issue log' },
    @{ n='GATE 4'; a=10; t='Go / no-go, then go-live'; d='Cutover plan, opening balance reconciliation' },
    @{ n='GATE 5'; a=14; t='First period closed, handover accepted'; d='Project closure and acceptance' }
  )
  $CW = 1.50
  foreach ($g in $gates) {
    $cx = $X0 + ($g.a * $COL)
    $x = $cx - ($CW / 2)
    if (($x + $CW) -gt ($X0 + $WD)) { $x = $X0 + $WD - $CW }
    if ($x -lt $X0) { $x = $X0 }
    $ln = $A.Shapes.AddLine($cx*72, 3.50*72, $cx*72, 3.97*72)
    $ln.Line.ForeColor.RGB = $LINE; $ln.Line.Weight = 1
    Name-It $ln | Out-Null
    $chip = Box $A 5 $x 3.97 $CW 0.34
    $chip.Fill.ForeColor.RGB = $INK
    Say $chip $g.n 10 $true $WHITE 2 | Out-Null
    $txt = Tbox $A $x 4.40 $CW 1.30
    $tr = Say $txt ($g.t + [char]13 + $g.d) 10.5 $false $BODY 2
    $tr.Paragraphs(2).Font.Size = 9
    $tr.Paragraphs(2).Font.Italic = -1
    $tr.Paragraphs(2).Font.Color.RGB = $MUTE
    $tr.Paragraphs(2).ParagraphFormat.SpaceBefore = 4
  }

  $l1 = 'Project scope runs from kick-off to go-live. Hypercare is a short period of close support after go-live, closing at Gate 5 once the first period is closed.'
  $l2 = 'Fixed scope, minimal customisation, master data and opening balances only - historical transactions stay in the old system for lookup.'
  $foot = Tbox $A $X0 5.90 $WD 0.60
  $tr = Say $foot ($l1 + [char]13 + $l2) 11 $false $BODY 1
  $tr.Paragraphs(1).Font.Bold = -1
  $tr.Paragraphs(1).Font.Color.RGB = $INK
  $tr.Paragraphs(2).ParagraphFormat.SpaceBefore = 4

  Set-Notes $A $notes.a

  $pres.Save()
  Write-Host ("added slide {0} of {1}" -f $A.SlideIndex, $pres.Slides.Count)
}
finally {
  if ($null -ne $pres) { $pres.Close() }
  $pp.Quit()
  [void][Runtime.InteropServices.Marshal]::ReleaseComObject($pp)
}
