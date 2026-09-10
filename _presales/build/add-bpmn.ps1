# Adds "Standard Process Flows" as item 10 of the JWIC Localization section:
# a detail slide after "Everyday Quality of Life", plus the matching row on the
# JWIC Localization overview page.
#
# The point of the page is that the flows ship WITH the software - one BPMN per
# process, written from the same user manual - so the customer sees what their
# team will actually follow, not only what the software can do.
#
# The slide is built by duplicating the 09 detail slide and rewriting it, so the
# layout, background, JW logo and title styling come from the deck itself and
# stay right even when the section is restyled by hand later.
#
# Re-runnable: the slide is named JWIC_bpmn and is deleted first; the overview
# row is named JHBadge10 / JHTitle10 / JHSub10 and is rebuilt in place.
# ASCII only - PowerShell 5.1 reads .ps1 as ANSI. Thai lives in bpmn-notes.json.
param([string]$Path)
$ErrorActionPreference = 'Stop'
$root  = Split-Path -Parent $MyInvocation.MyCommand.Path
$cfg   = Get-Content (Join-Path $root 'deck-core.json') -Encoding UTF8 -Raw | ConvertFrom-Json
$notes = Get-Content (Join-Path $root 'bpmn-notes.json') -Encoding UTF8 -Raw | ConvertFrom-Json
$deck  = if ($Path) { $Path } else { $cfg.master }
$NAME  = 'JWIC_bpmn'

# The example page, exported from the JHCore BPMN library:
#   docs\BusinessProcess-BC\diagrams\GL-...(General Ledger and Tax).drawio, page GL8
#   "C:\Program Files\draw.io\draw.io.exe" --export --page-index 8 --format png --scale 3
# then cropped to band 1 and scaled to 2400px wide. Band 1 only - the whole page
# is 2:1 and will not fit under a title. Redo those two steps to refresh it.
$SHOT  = Join-Path (Split-Path -Parent $root) 'assets\bpmn-gl8-band1.png'
$SHOTR = 4.027                   # width / height of that file

$NUM   = '10'
$TITLE = 'Standard Process Flows'
$SUB   = 'one BPMN per process, yours at handover'
$LEAD  = 'Every module is delivered with the process flow it is meant to run - drawn from the same user manual your team is trained on.'
$CAP   = 'Example - GL8 Filing the PND withholding tax return by the 7th, first half of the flow. Green = JWIC Localization, white = standard Business Central.'

$CARDS = @(
  @{ h = 'One flow per process';    b = '103 processes across 14 areas of the business, 967 steps in all - one page each.' },
  @{ h = 'Written from the manual'; b = 'Flow and user manual come from one source, so picture and wording cannot drift apart.' },
  @{ h = 'Yours at handover';       b = 'Editable .drawio files, not screenshots - for training, internal control and the auditor.' }
)

function Hex2Ole([string]$h) {
  $h = $h.TrimStart('#')
  $r = [Convert]::ToInt32($h.Substring(0,2),16)
  $g = [Convert]::ToInt32($h.Substring(2,2),16)
  $b = [Convert]::ToInt32($h.Substring(4,2),16)
  return ($b * 65536) + ($g * 256) + $r      # PowerPoint wants BGR
}
# sampled off the section: every item has its own accent, cream chip text, grey
# body copy. 2F4858 is the one shade the other nine items do not already use.
$ACC   = Hex2Ole '#2F4858'
$CREAM = Hex2Ole '#F5F1EA'
$BODY  = Hex2Ole '#5A6270'
$MUTE  = Hex2Ole '#6E7480'
$GREY  = Hex2Ole '#595959'
$WHITE = Hex2Ole '#FFFFFF'
$FONT  = 'Segoe Sans Display'

function Add-Text($slide, $l, $t, $w, $h, $text, $size, $colour, $bold) {
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

# The script is the exam: no diagram file, no slide.
if (-not (Test-Path $SHOT)) { throw "diagram export not found: $SHOT" }

$pp = New-Object -ComObject PowerPoint.Application
$pp.DisplayAlerts = 1
$pres = $null
try {
  $pres = $pp.Presentations.Open($deck, 0, 0, -1)

  for ($i = $pres.Slides.Count; $i -ge 1; $i--) {
    if ($pres.Slides.Item($i).Name -eq $NAME) { $pres.Slides.Item($i).Delete() }
  }

  $anchor = 0; $ov = 0
  for ($i = 1; $i -le $pres.Slides.Count; $i++) {
    $t = Read-Slide $pres.Slides.Item($i)
    if ($t -match 'Everyday Quality of Life' -and $t -match 'Useful Columns') { $anchor = $i }
    if ($t -match 'JWIC Localization' -and $t -match 'Value Added Tax' -and $t -match 'Everyday Quality of Life') { $ov = $i }
  }
  if ($anchor -eq 0) { throw 'slide "Everyday Quality of Life" not found' }
  if ($ov -eq 0) { throw 'the JWIC Localization overview slide was not found' }

  # ---------------------------------------------------------------- the slide
  $slide = $pres.Slides.Item($anchor).Duplicate().Item(1)
  $slide.Name = $NAME

  # keep the three shapes that carry the section styling, drop the rest
  $chip = $null; $rule = $null; $head = $null
  for ($i = $slide.Shapes.Count; $i -ge 1; $i--) {
    $sh = $slide.Shapes.Item($i)
    $txt = ''
    if ($sh.HasTextFrame -eq -1 -and $sh.TextFrame.HasText -eq -1) { $txt = $sh.TextFrame.TextRange.Text }
    if ($txt -eq '09') { $chip = $sh; continue }
    if ($sh.Name -eq 'Title 1') { $head = $sh; continue }
    if ([math]::Round($sh.Width) -eq 88 -and [math]::Round($sh.Height) -eq 3) { $rule = $sh; continue }
    $sh.Delete()
  }
  if ($null -eq $chip -or $null -eq $rule -or $null -eq $head) { throw 'the 09 slide is not shaped the way this script expects' }

  $chip.TextFrame.TextRange.Text = $NUM
  $chip.TextFrame.TextRange.Font.Color.RGB = $CREAM
  $chip.Fill.ForeColor.RGB = $ACC
  $rule.Fill.ForeColor.RGB = $ACC
  $head.TextFrame.TextRange.Text = $TITLE

  Add-Text $slide 60 120 840 18 $LEAD 13.5 $BODY 0 | Out-Null

  $w = 840.0
  [void]$slide.Shapes.AddPicture($SHOT, 0, -1, 60, 150, $w, ($w / $SHOTR))
  Add-Text $slide 60 366 840 16 $CAP 10.5 $MUTE 0 | Out-Null

  $x = 60.0
  foreach ($c in $CARDS) {
    $card = $slide.Shapes.AddShape(5, $x, 390, 260, 96)     # msoShapeRoundedRectangle
    $card.Adjustments.Item(1) = 0.09
    $card.Fill.ForeColor.RGB = $WHITE
    $card.Line.Visible = 0
    $bar = $slide.Shapes.AddShape(1, ($x + 14), 406, 5, 64)
    $bar.Fill.ForeColor.RGB = $ACC
    $bar.Line.Visible = 0
    Add-Text $slide ($x + 32) 406 214 20 $c.h 14 $ACC -1 | Out-Null
    Add-Text $slide ($x + 32) 430 214 52 $c.b 11 $BODY 0 | Out-Null
    $x += 280
  }

  Set-Notes $slide $notes.a

  # ------------------------------------------------------------- the overview
  $o = $pres.Slides.Item($ov)
  for ($i = $o.Shapes.Count; $i -ge 1; $i--) {
    $n = $o.Shapes.Item($i).Name
    if ($n -eq 'JHBadge10' -or $n -eq 'JHTitle10' -or $n -eq 'JHSub10') { $o.Shapes.Item($i).Delete() }
  }
  # the right column stopped at 09: grow its rail and drop its end dot onto the
  # same line as the left column so the two columns still finish together
  for ($i = 1; $i -le $o.Shapes.Count; $i++) {
    $sh = $o.Shapes.Item($i)
    if ($sh.Name -eq 'Flair_RightRail')   { $sh.Height = [single]302 }
    if ($sh.Name -eq 'Flair_RightEndDot') { $sh.Top = [single]467 }
  }
  $badge = $o.Shapes.AddShape(5, 500, 454, 34, 34)
  $badge.Name = 'JHBadge10'
  $badge.Adjustments.Item(1) = 0.24
  $badge.Fill.ForeColor.RGB = $ACC
  $badge.Line.Visible = 0
  $badge.TextFrame.WordWrap = 0
  $badge.TextFrame.MarginLeft = 0; $badge.TextFrame.MarginRight = 0
  $bt = $badge.TextFrame.TextRange
  $bt.Text = $NUM
  $bt.Font.Name = $FONT; $bt.Font.Size = 14; $bt.Font.Bold = -1; $bt.Font.Color.RGB = $CREAM
  $t1 = Add-Text $o 546 453 354 23 $TITLE 17 $ACC -1
  $t1.Name = 'JHTitle10'
  $t2 = Add-Text $o 546 477 354 16.4 $SUB 13.5 $GREY 0
  $t2.Name = 'JHSub10'

  $pres.Save()
  Write-Host ("bpmn added as slide {0} of {1}; overview row on slide {2}" -f ($anchor + 1), $pres.Slides.Count, $ov)
}
finally {
  if ($null -ne $pres) { $pres.Close() }
  $pp.Quit()
  [void][Runtime.InteropServices.Marshal]::ReleaseComObject($pp)
}
