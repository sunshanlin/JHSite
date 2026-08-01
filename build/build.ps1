# Build the JWIC presales deck from Microsoft partner pitch decks.
# Source decks are opened read-only and never modified.
# All Thai text lives in deck-core.json so this file stays pure ASCII
# (PowerShell 5.1 script encoding is a reliable way to mangle Thai).

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version 2

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$cfg  = Get-Content (Join-Path $root 'deck-core.json') -Encoding UTF8 -Raw | ConvertFrom-Json

# PowerPoint constants
$ppLayoutText      = 2
$ppLayoutTitleOnly = 11
$ppSaveAsOpenXML   = 24
$msoTrue           = -1
$msoFalse          = 0
$msoPlaceholder    = 14
$ppPlaceholderBody = 2

function ConvertTo-OleColor([string]$hex) {
  $h = $hex.TrimStart('#')
  $r = [Convert]::ToInt32($h.Substring(0,2),16)
  $g = [Convert]::ToInt32($h.Substring(2,2),16)
  $b = [Convert]::ToInt32($h.Substring(4,2),16)
  return ($b * 65536) + ($g * 256) + $r
}

# --- read the pricing workbook (zip + sharedStrings, no Excel needed) -------
# NOTE: do not name a helper 'RD' - that is an alias for Remove-Item and wins
# over functions in PowerShell's command resolution order.
function Read-XlSheet([string]$xlsx, [string]$sheetFile) {
  Add-Type -AssemblyName System.IO.Compression.FileSystem
  $zip = [IO.Compression.ZipFile]::OpenRead($xlsx)
  try {
    $readEntry = {
      param($name)
      $e = $zip.GetEntry($name)
      if ($null -eq $e) { throw "entry not found in xlsx: $name" }
      $sr = New-Object IO.StreamReader($e.Open())
      try { $sr.ReadToEnd() } finally { $sr.Close() }
    }
    $shared = @()
    foreach ($si in [regex]::Matches((& $readEntry 'xl/sharedStrings.xml'), '<si>([\s\S]*?)</si>')) {
      $parts = [regex]::Matches($si.Groups[1].Value, '<t[^>]*>([\s\S]*?)</t>') | ForEach-Object { $_.Groups[1].Value }
      $shared += ($parts -join '')
    }
    $cells = @{}
    foreach ($row in [regex]::Matches((& $readEntry $sheetFile), '<row[^>]*>([\s\S]*?)</row>')) {
      foreach ($c in [regex]::Matches($row.Groups[1].Value, '<c r="([A-Z]+[0-9]+)"([^>]*)>([\s\S]*?)</c>')) {
        $v = [regex]::Match($c.Groups[3].Value, '<v>([\s\S]*?)</v>')
        if (-not $v.Success) { continue }
        $val = $v.Groups[1].Value
        if ($c.Groups[2].Value -match 't="s"') { $val = $shared[[int]$val] }
        $cells[$c.Groups[1].Value] = ($val -replace '&amp;', '&')
      }
    }
    return $cells
  } finally { $zip.Dispose() }
}

function Format-Baht($v) {
  if ($null -eq $v -or $v -eq '') { return '' }
  return '{0:N0}' -f [double]$v
}

Write-Host 'Reading pricing workbook...'
$xl = Read-XlSheet $cfg.sources.pricingWorkbook 'xl/worksheets/sheet1.xml'

$pricingRows = @(
  @('Microsoft Dynamics 365 Business Central Essentials, 6 users (list, per year)', (Format-Baht $xl['F3'])),
  @('Project implementation fee (Thai Localization included)',                      (Format-Baht $xl['F14'])),
  @('Subtotal',                                                                     (Format-Baht $xl['F17'])),
  @('Discount',                                                                     ('(' + (Format-Baht $xl['F18']) + ')')),
  @('Total investment, one-time (excl. VAT)',                                       (Format-Baht $xl['F19'])),
  @('VAT 7%',                                                                       (Format-Baht $xl['F20'])),
  @('Grand total (incl. VAT)',                                                      (Format-Baht $xl['F21'])),
  @('Annual maintenance after go-live (recurring, not in the one-time total)',      ((Format-Baht $xl['D16']) + ' / year'))
)

$paymentRows = @()
foreach ($r in 31..35) {
  $paymentRows += ,@(
    $xl["A$r"],
    $xl["C$r"],
    ('{0:P0}' -f [double]$xl["D$r"]),
    (Format-Baht $xl["F$r"])
  )
}

# --- open PowerPoint -------------------------------------------------------
$outDir = Split-Path -Parent $cfg.out
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Force $outDir | Out-Null }
if (Test-Path $cfg.out) { Remove-Item $cfg.out -Force }

Write-Host 'Starting PowerPoint...'
$pp = New-Object -ComObject PowerPoint.Application
$pp.DisplayAlerts = 1
$pres = $null

try {
  $pres = $pp.Presentations.Open($cfg.sources.fy27, $msoTrue, $msoFalse, $msoTrue)
  $pres.SaveAs($cfg.out, $ppSaveAsOpenXML)
  Write-Host "  base copy saved: $($cfg.out)"

  # --- keep only the wanted FY27 slides, in the wanted order ---------------
  # Tag first, then delete by tag, so original slide numbers stay meaningful.
  for ($i = 0; $i -lt $cfg.keepFy27.Count; $i++) {
    $pres.Slides.Item($cfg.keepFy27[$i]).Name = 'KEEP{0:D3}' -f $i
  }
  for ($i = $pres.Slides.Count; $i -ge 1; $i--) {
    if ($pres.Slides.Item($i).Name -notlike 'KEEP*') { $pres.Slides.Item($i).Delete() }
  }
  for ($i = 0; $i -lt $cfg.keepFy27.Count; $i++) {
    $want = 'KEEP{0:D3}' -f $i
    for ($j = 1; $j -le $pres.Slides.Count; $j++) {
      if ($pres.Slides.Item($j).Name -eq $want) { $pres.Slides.Item($j).MoveTo($i + 1); break }
    }
  }
  Write-Host "  kept $($pres.Slides.Count) Microsoft slides"

  # --- Microsoft's own confidentiality / copyright / restriction wording ---
  # "Classified as Microsoft Confidential" and the copyright line live on slide
  # masters and print on every slide, including the pricing page.
  # Patterns come from deck-core.json so what gets cut is visible in one place.
  function Remove-MatchingShapes($shapes, $patterns) {
    $kill = @()
    for ($s = 1; $s -le $shapes.Count; $s++) {
      $sh = $shapes.Item($s)
      if ($sh.HasTextFrame -ne $msoTrue) { continue }
      if ($sh.TextFrame.HasText -ne $msoTrue) { continue }
      $t = $sh.TextFrame.TextRange.Text
      foreach ($p in $patterns) { if ($t -match $p) { $kill += $s; break } }
    }
    foreach ($s in ($kill | Sort-Object -Descending)) { $shapes.Item($s).Delete() }
    return $kill.Count
  }

  # Replace() edits in place and keeps the run formatting. Assigning to
  # TextRange.Text would flatten a heading back to body style.
  function Update-TextRange($range, $swaps) {
    foreach ($k in $swaps.PSObject.Properties.Name) {
      $guard = 0
      while ($null -ne $range.Replace($k, $swaps.$k) -and $guard -lt 20) { $guard++ }
    }
  }
  function Update-ShapeText($shapes, $swaps) {
    for ($s = 1; $s -le $shapes.Count; $s++) {
      $sh = $shapes.Item($s)
      # a table shape has no TextFrame of its own - the text is in the cells,
      # which is where the capability headings on the closing slide live
      if ($sh.Type -eq 19) {
        $t = $sh.Table
        for ($r = 1; $r -le $t.Rows.Count; $r++) {
          for ($c = 1; $c -le $t.Columns.Count; $c++) {
            $tf = $t.Cell($r, $c).Shape.TextFrame
            if ($tf.HasText -eq $msoTrue) { Update-TextRange $tf.TextRange $swaps }
          }
        }
        continue
      }
      if ($sh.HasTextFrame -ne $msoTrue) { continue }
      if ($sh.TextFrame.HasText -ne $msoTrue) { continue }
      Update-TextRange $sh.TextFrame.TextRange $swaps
    }
  }
  # (both invoked after the appendix is pulled in - InsertFromFile brings in
  #  more slide masters, each carrying its own copy of this wording)

  # --- insert the new JWIC slides, ascending by final position -------------
  function Set-BodyText($slide, $bullets, $wide) {
    $body = $null
    for ($s = 1; $s -le $slide.Shapes.Count; $s++) {
      $sh = $slide.Shapes.Item($s)
      if ($sh.HasTextFrame -eq $msoTrue -and $sh.Name -notlike 'Title*') { $body = $sh; break }
    }
    if ($null -eq $body) { return }
    $w = if ($wide) { $cfg.layout.bodyWideWidth } else { $cfg.layout.bodyWidth }
    $body.Left   = [float]$cfg.layout.bodyLeft
    $body.Top    = [float]$cfg.layout.bodyTop
    $body.Width  = [float]$w
    $body.Height = [float]$cfg.layout.bodyHeight
    $body.TextFrame.TextRange.Text = ($bullets -join "`r")
    $body.TextFrame2.WordWrap = $msoTrue
    # Size the type to the amount of text and the width it has to run in.
    # PowerPoint's own shrink-on-overflow does not apply until the shape is
    # rendered, so it is no use to a headless build - the slide exports with
    # the text still hanging off the bottom.
    $chars = ($bullets -join ' ').Length
    $cap = if ($wide) { 24 } else { 20 }
    $size = [Math]::Sqrt(110000 * ($w / 400) / [Math]::Max($chars, 1))
    $body.TextFrame.TextRange.Font.Size = [float][Math]::Round([Math]::Min([Math]::Max($size, 13), $cap))
    $body.TextFrame.VerticalAnchor = 3   # middle - a short list should not hug the top of a tall box
  }

  function Add-SlideImage($slide, $file) {
    $path = Join-Path $cfg.imgRoot $file
    if (-not (Test-Path $path)) { Write-Warning "image missing: $path"; return }
    $pic = $slide.Shapes.AddPicture($path, $msoFalse, $msoTrue,
             $cfg.layout.imgLeft, $cfg.layout.imgTop, $cfg.layout.imgWidth, -1)
    $pic.LockAspectRatio = $msoTrue
    if ($pic.Height -gt $cfg.layout.imgHeight) { $pic.Height = [float]$cfg.layout.imgHeight }
    $pic.Left = [float]($cfg.layout.imgLeft + (($cfg.layout.imgWidth  - $pic.Width)  / 2))
    $pic.Top  = [float]($cfg.layout.imgTop  + (($cfg.layout.imgHeight - $pic.Height) / 2))
  }

  function Add-DeckTable($slide, $rows, $cols, $left, $top, $width, $height, $data, $headerRow) {
    $shape = $slide.Shapes.AddTable($rows, $cols, $left, $top, $width, $height)
    $tbl = $shape.Table
    # without a real header row, the theme's banded style paints row 1 as a
    # heading - on the pricing table that made the licence line look like a title
    $tbl.FirstRow = [bool]$headerRow
    for ($r = 1; $r -le $rows; $r++) {
      for ($c = 1; $c -le $cols; $c++) {
        $txt = [string]$data[$r - 1][$c - 1]
        $cell = $tbl.Cell($r, $c)
        $cell.Shape.TextFrame.TextRange.Text = $txt
        $cell.Shape.TextFrame.TextRange.Font.Size = 13
        # right-align money and percentages, never the label column
        if ($c -gt 1 -and ($txt -match '^\(?[\d,]+' -or $txt -match '%$' -or $txt -match 'THB')) {
          $cell.Shape.TextFrame.TextRange.ParagraphFormat.Alignment = 3
        }
        if ($headerRow -and $r -eq 1) { $cell.Shape.TextFrame.TextRange.Font.Bold = $msoTrue }
      }
    }
    return $shape
  }

  # --- shared JWIC slide furniture -----------------------------------------
  $L = $cfg.layout
  $green  = ConvertTo-OleColor $cfg.brand.green
  $accent = ConvertTo-OleColor $cfg.brand.accent
  $cream  = ConvertTo-OleColor $cfg.brand.cream

  function Add-Rule($slide, $top, $width, $height, $colour) {
    $r = $slide.Shapes.AddShape(1, $L.titleLeft, $top, $width, $height)
    $r.Fill.ForeColor.RGB = $colour
    $r.Line.Visible = $msoFalse
    return $r
  }
  function Add-TextBox($slide, $l, $t, $w, $h, $text, $size, $colour, $bold) {
    $tb = $slide.Shapes.AddTextbox(1, $l, $t, $w, $h)
    $tb.TextFrame.WordWrap = $msoTrue
    $tb.TextFrame.MarginLeft = 0; $tb.TextFrame.MarginTop = 0; $tb.TextFrame.MarginBottom = 0
    $tb.TextFrame.TextRange.Text = $text
    $tb.TextFrame.TextRange.Font.Size = [float]$size
    $tb.TextFrame.TextRange.Font.Color.RGB = $colour
    if ($bold) { $tb.TextFrame.TextRange.Font.Bold = $msoTrue }
    return $tb
  }
  # the "01".."07" module marker: a brand square with the number in it
  function Add-Badge($slide, $l, $t, $size, $num, $fontSize) {
    $sq = $slide.Shapes.AddShape(5, $l, $t, $size, $size)   # msoShapeRoundedRectangle
    $sq.Fill.ForeColor.RGB = $green
    $sq.Line.Visible = $msoFalse
    # default margins eat most of a small square, and "06" then wraps to "0"/"6"
    $sq.TextFrame.MarginLeft = 0; $sq.TextFrame.MarginRight = 0
    $sq.TextFrame.MarginTop = 0;  $sq.TextFrame.MarginBottom = 0
    $sq.TextFrame.WordWrap = $msoFalse
    $sq.TextFrame.VerticalAnchor = 3        # msoAnchorMiddle
    $sq.TextFrame.TextRange.Text = $num
    $sq.TextFrame.TextRange.Font.Size = [float]$fontSize
    $sq.TextFrame.TextRange.Font.Bold = $msoTrue
    $sq.TextFrame.TextRange.Font.Color.RGB = $cream
    return $sq
  }

  foreach ($n in ($cfg.newSlides | Sort-Object pos)) {
    $props = $n.PSObject.Properties.Name
    $layoutId = if ($n.layout -eq 'text') { $ppLayoutText } else { $ppLayoutTitleOnly }
    $slide = $pres.Slides.Add($n.pos, $layoutId)
    $slide.Name = 'JWIC_' + $n.id

    # ---- full-bleed brand section break
    if ($n.layout -eq 'divider') {
      $slide.FollowMasterBackground = $msoFalse
      $slide.Background.Fill.Solid()
      $slide.Background.Fill.ForeColor.RGB = $green
      $slide.Shapes.Item(1).Delete()          # the placeholder title, replaced below
      Add-Rule $slide $L.dividerRuleTop 88 4 $accent | Out-Null
      Add-TextBox $slide $L.titleLeft $L.dividerTitleTop 820 110 $n.title $L.dividerTitleSize $cream $true | Out-Null
      if ($props -contains 'subtitle') {
        Add-TextBox $slide $L.titleLeft $L.dividerSubTop 820 40 $n.subtitle $L.dividerSubSize $cream $false | Out-Null
      }
      Add-TextBox $slide $L.titleLeft $L.dividerMarkTop 400 20 $cfg.brand.company 13 $cream $true | Out-Null
      continue
    }

    # ---- everything else: title, optional number badge, accent rule
    $title = $n.title
    $titleLeft = $L.titleLeft
    if ($title -match '^(\d\d)\s+(.*)$') {
      Add-Badge $slide $L.titleLeft $L.titleTop $L.badgeSize $Matches[1] 20 | Out-Null
      $title = $Matches[2]
      $titleLeft = $L.titleLeft + $L.badgeSize + 18
    }
    $t = $slide.Shapes.Item(1)
    $t.Left = [float]$titleLeft; $t.Top = [float]$L.titleTop
    $t.Width = [float]($L.titleWidth - ($titleLeft - $L.titleLeft)); $t.Height = [float]$L.titleHeight
    $t.TextFrame.TextRange.Text = $title
    $t.TextFrame.TextRange.Font.Size = [float]$L.titleSize
    Add-Rule $slide $L.ruleTop $L.ruleWidth $L.ruleHeight $accent | Out-Null

    # ---- 7-module overview: badge + name + detail, two columns
    if ($props -contains 'grid') {
      $rows = [Math]::Ceiling($n.grid.Count / 2)
      for ($g = 0; $g -lt $n.grid.Count; $g++) {
        $item = $n.grid[$g]
        $col = [Math]::Floor($g / $rows); $row = $g % $rows
        $x = $L.gridLeft + $col * ($L.gridColWidth + $L.gridColGap)
        $y = $L.gridTop + $row * $L.gridRowHeight
        Add-Badge $slide $x $y $L.gridBadge $item.n 13 | Out-Null
        $tx = $x + $L.gridBadge + 12
        $tw = $L.gridColWidth - $L.gridBadge - 12
        Add-TextBox $slide $tx ($y - 1)  $tw 20 $item.name   15 $green $true  | Out-Null
        Add-TextBox $slide $tx ($y + 20) $tw 34 $item.detail 12 0x595959 $false | Out-Null
      }
    }

    if ($props -contains 'bullets') {
      # no picture means no reason to sit in the left half of the slide
      $wide = -not ($props -contains 'image')
      Set-BodyText $slide $n.bullets $wide
    }

    if ($props -contains 'image') { Add-SlideImage $slide $n.image }

    if ($props -contains 'table' -and $n.table -eq 'pricing') {
      $pt = Add-DeckTable $slide $pricingRows.Count 2 55 146 560 300 $pricingRows $false
      for ($r = 1; $r -le $pricingRows.Count; $r++) {
        if ($pricingRows[$r - 1][0] -notmatch '^(Total|Grand)') { continue }
        for ($c = 1; $c -le 2; $c++) {
          $cell = $pt.Table.Cell($r, $c).Shape.TextFrame.TextRange
          $cell.Font.Bold = $msoTrue
          $cell.Font.Color.RGB = $green
        }
      }
      $tb = $slide.Shapes.AddTextbox(1, 640, 140, 265, 220)
      $tb.TextFrame.WordWrap = $msoTrue
      $tb.TextFrame.TextRange.Text = "Included at no extra charge`r" +
        "JWIC Thai Localization Pack (JHCore)`r" +
        "First-year JHCore maintenance and product updates`r" +
        "Go-live statutory closing walkthrough (month-end, VAT, WHT filing)"
      $tb.TextFrame.TextRange.Font.Size = 13
      $tb.TextFrame.TextRange.Paragraphs(1).Font.Bold = $msoTrue
      $tb.TextFrame.TextRange.Font.Color.RGB = (ConvertTo-OleColor $cfg.brand.green)
      $note = $slide.Shapes.AddTextbox(1, 55, 455, 850, 30)
      $note.TextFrame.TextRange.Text = 'Assumes 1 legal entity, THB. Additional users or companies quoted separately.'
      $note.TextFrame.TextRange.Font.Size = 11
    }

    if ($props -contains 'table' -and $n.table -eq 'payment') {
      $header = ,@('Milestone', 'Success by Design phase', '%', 'THB (excl. VAT)')
      Add-DeckTable $slide ($paymentRows.Count + 1) 4 55 150 850 290 ($header + $paymentRows) $true | Out-Null
      $note = $slide.Shapes.AddTextbox(1, 55, 455, 850, 40)
      $note.TextFrame.TextRange.Text = 'Each milestone is invoiced on sign-off of the corresponding phase. VAT 7% is added per invoice.'
      $note.TextFrame.TextRange.Font.Size = 12
    }
  }
  Write-Host "  added $($cfg.newSlides.Count) JWIC slides, deck is now $($pres.Slides.Count) slides"

  # --- capability recap banner on the closing slide ------------------------
  # Microsoft's capability grid fills the whole slide, so shrink it slightly
  # to open a strip at the bottom for the JWIC block. Uniform scale, so the
  # text inside the grid stays in proportion with its boxes.
  # Shape-by-shape rather than Group(): the grid contains a table, and
  # PowerPoint refuses to group a range that includes one.
  #
  # The table drives everything. A table row will not contract below the height
  # its own text needs, so setting Height on it does nothing - the only lever is
  # the type size. Take points off the type, let the table reflow, measure how
  # much it actually gave back, then move the border boxes, the row icons and
  # the footnote row by that amount. Anything else leaves the borders drawn in
  # the wrong place with the last row hanging outside them.
  $recap = $pres.Slides.Item($cfg.recap.pos)
  $tblShape = $null
  for ($s = 1; $s -le $recap.Shapes.Count; $s++) {
    if ($recap.Shapes.Item($s).Type -eq 19) { $tblShape = $recap.Shapes.Item($s); break }
  }
  if ($null -eq $tblShape) { throw 'no capability table on the recap slide' }

  $t = $tblShape.Table
  $tblTop = [double]$tblShape.Top

  # old row tops, before anything moves
  $oldRowTop = @(); $oldRowH = @(); $y = $tblTop
  for ($r = 1; $r -le $t.Rows.Count; $r++) {
    $h = [double]$t.Rows.Item($r).Height
    $oldRowTop += $y; $oldRowH += $h; $y += $h
  }
  $oldBot = $y

  for ($r = 1; $r -le $t.Rows.Count; $r++) {
    for ($c = 1; $c -le $t.Columns.Count; $c++) {
      $tr = $t.Cell($r, $c).Shape.TextFrame.TextRange
      if ($tr.Length -gt 0) { $tr.Font.Size = [float]($tr.Font.Size - $cfg.recap.tableFontDelta) }
    }
    $t.Rows.Item($r).Height = [float]($oldRowH[$r - 1] * $cfg.recap.rowScale)
  }

  # read back: PowerPoint clamps each row at whatever its own text still needs
  $newRowTop = @(); $y = $tblTop
  for ($r = 1; $r -le $t.Rows.Count; $r++) { $newRowTop += $y; $y += [double]$t.Rows.Item($r).Height }
  $shrunk = $oldBot - $y
  Write-Host ("  recap grid gave back {0:N0}pt" -f $shrunk)

  if ($shrunk -gt 1) {
    for ($s = 1; $s -le $recap.Shapes.Count; $s++) {
      $sh = $recap.Shapes.Item($s)
      if ($sh.Name -like 'Title*' -or $sh.Type -eq 19) { continue }
      $top = [double]$sh.Top
      if ($top -ge $oldBot - 3) {
        $sh.Top = [float]($top - $shrunk)                              # footnote row
      } elseif ($top -ge $tblTop) {
        # a row icon: keep its offset inside whichever row it sits in
        $row = 0
        for ($r = 0; $r -lt $oldRowTop.Count; $r++) { if ($top -ge $oldRowTop[$r] - 3) { $row = $r } }
        $sh.Top = [float]($newRowTop[$row] + ($top - $oldRowTop[$row]))
      } elseif ($top + [double]$sh.Height -ge $oldBot - 3) {
        $sh.Height = [float]([double]$sh.Height - $shrunk)             # outer border boxes
      }
    }
  }

  # Reclaim the whitespace under the title and pull the whole grid up into it.
  $recap.Shapes.Item('Title 1').Top    = [float]$cfg.recap.titleTop
  $recap.Shapes.Item('Title 1').Height = [float]$cfg.recap.titleHeight
  for ($s = 1; $s -le $recap.Shapes.Count; $s++) {
    $sh = $recap.Shapes.Item($s)
    if ($sh.Name -like 'Title*') { continue }
    $sh.Top = [float]([double]$sh.Top - $cfg.recap.gridLift)
  }

  # Sit the JWIC block under whatever the grid actually ended up as.
  $lowest = 0
  for ($s = 1; $s -le $recap.Shapes.Count; $s++) {
    $sh = $recap.Shapes.Item($s)
    $bot = [double]$sh.Top + [double]$sh.Height
    if ($bot -gt $lowest) { $lowest = $bot }
  }
  $b = $cfg.recap.banner
  $bannerTop = [float]($lowest + 6)
  if ($bannerTop + $b.height + 18 -gt 540) {   # banner + the contact line under it
    Write-Warning ("recap banner runs off the slide (top {0:N0}pt) - lower recap.rowScale" -f $bannerTop)
  }
  $box = $recap.Shapes.AddShape(1, $b.left, $bannerTop, $b.width, $b.height)   # msoShapeRectangle
  $box.Fill.ForeColor.RGB = (ConvertTo-OleColor $cfg.brand.green)
  $box.Line.Visible = $msoFalse
  $box.TextFrame.MarginTop = 4
  $box.TextFrame.MarginBottom = 4
  $box.TextFrame.TextRange.Text = $b.line1 + "`r" + $b.line2
  $box.TextFrame.TextRange.Font.Color.RGB = (ConvertTo-OleColor $cfg.brand.cream)
  $box.TextFrame.TextRange.Paragraphs(1).Font.Size = 13
  $box.TextFrame.TextRange.Paragraphs(1).Font.Bold = $msoTrue
  $box.TextFrame.TextRange.Paragraphs(2).Font.Size = 10
  $contact = $recap.Shapes.AddTextbox(1, $b.left, [float]($bannerTop + $b.height + 2), $b.width, 16)
  $contact.TextFrame.TextRange.Text = "$($cfg.brand.person)  |  $($cfg.brand.company)  |  $($cfg.brand.email)  |  $($cfg.brand.phone)  |  $($cfg.brand.web)"
  $contact.TextFrame.TextRange.Font.Size = 10

  # --- appendix: pull ranges out of the other Microsoft decks --------------
  $at = $pres.Slides.Count
  foreach ($a in $cfg.appendix) {
    $src = $cfg.sources.($a.source)
    $n = $pres.Slides.InsertFromFile($src, $at, $a.from, $a.to)
    Write-Host ("  appendix +{0,2} from {1} s{2}-{3}" -f $n, $a.source, $a.from, $a.to)
    $at += $n
  }
  Write-Host "  deck is now $($pres.Slides.Count) slides"

  $pat = $cfg.strip.shapes
  $stripped = 0
  for ($d = 1; $d -le $pres.Designs.Count; $d++) {
    $master = $pres.Designs.Item($d).SlideMaster
    $stripped += Remove-MatchingShapes $master.Shapes $pat
    Update-ShapeText $master.Shapes $cfg.strip.textSwaps
    for ($l = 1; $l -le $master.CustomLayouts.Count; $l++) {
      $stripped += Remove-MatchingShapes $master.CustomLayouts.Item($l).Shapes $pat
      Update-ShapeText $master.CustomLayouts.Item($l).Shapes $cfg.strip.textSwaps
    }
  }
  for ($i = 1; $i -le $pres.Slides.Count; $i++) {
    $stripped += Remove-MatchingShapes $pres.Slides.Item($i).Shapes $pat
    Update-ShapeText $pres.Slides.Item($i).Shapes $cfg.strip.textSwaps
  }
  Write-Host "  stripped $stripped confidentiality / copyright / restriction shapes"

  # --- hide the detail slides ----------------------------------------------
  $hiddenIds = @($cfg.newSlides | Where-Object { $_.PSObject.Properties.Name -contains 'hidden' -and $_.hidden } | ForEach-Object { 'JWIC_' + $_.id })
  $appendixStart = ($cfg.newSlides | Where-Object { $_.id -eq 'appendix-divider' }).pos
  for ($i = 1; $i -le $pres.Slides.Count; $i++) {
    $slide = $pres.Slides.Item($i)
    if ($i -ge $appendixStart -or $hiddenIds -contains $slide.Name) {
      $slide.SlideShowTransition.Hidden = $msoTrue
    }
  }
  $shown = 0
  for ($i = 1; $i -le $pres.Slides.Count; $i++) {
    if ($pres.Slides.Item($i).SlideShowTransition.Hidden -ne $msoTrue) { $shown++ }
  }
  Write-Host "  $shown slides visible in slideshow, $($pres.Slides.Count - $shown) hidden"

  # --- JWIC logo on the slides that are ours -------------------------------
  $logoPath = Join-Path $cfg.imgRoot $cfg.logo.file
  foreach ($i in $cfg.logo.onSlides) {
    $slide = $pres.Slides.Item($i)
    $pic = $slide.Shapes.AddPicture($logoPath, $msoFalse, $msoTrue,
             $cfg.logo.left, $cfg.logo.top, $cfg.logo.size, $cfg.logo.size)
    $pic.Name = 'JWICLogo'
  }
  Write-Host "  logo placed on $($cfg.logo.onSlides.Count) slides"

  # --- Thai speaker notes ---------------------------------------------------
  $notesWritten = 0
  foreach ($key in $cfg.notesTh.PSObject.Properties.Name) {
    $idx = [int]$key
    if ($idx -lt 1 -or $idx -gt $pres.Slides.Count) { Write-Warning "notes for slide $idx out of range"; continue }
    $np = $pres.Slides.Item($idx).NotesPage
    $target = $null
    for ($s = 1; $s -le $np.Shapes.Count; $s++) {
      $sh = $np.Shapes.Item($s)
      if ($sh.HasTextFrame -ne $msoTrue) { continue }
      if ($sh.Type -eq $msoPlaceholder -and $sh.PlaceholderFormat.Type -eq $ppPlaceholderBody) { $target = $sh; break }
    }
    if ($null -eq $target -and $np.Shapes.Count -ge 2) { $target = $np.Shapes.Item(2) }
    if ($null -eq $target) { Write-Warning "no notes placeholder on slide $idx"; continue }
    $target.TextFrame.TextRange.Text = $cfg.notesTh.$key
    $notesWritten++
  }
  Write-Host "  wrote $notesWritten Thai speaker notes"

  # Microsoft's warranty boilerplate sits in its own box on the notes page and
  # would print under the talk track on every handout. Do this after the Thai
  # notes are written, or the shape indexes shift underneath them.
  $notesStripped = 0
  for ($i = 1; $i -le $pres.Slides.Count; $i++) {
    $notesStripped += Remove-MatchingShapes $pres.Slides.Item($i).NotesPage.Shapes $cfg.strip.notesShapes
  }
  Write-Host "  stripped $notesStripped legal boxes from notes pages"

  $pres.Save()
  Write-Host "DONE: $($cfg.out)  ($($pres.Slides.Count) slides)"
}
finally {
  if ($null -ne $pres) { $pres.Close() }
  $pp.Quit()
  [void][Runtime.InteropServices.Marshal]::ReleaseComObject($pp)
  [GC]::Collect()
}
