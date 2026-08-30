# Aligns the Payment Schedule slide with the Fast Implement gates (methodology doc section 7).
# Re-runnable: rewrites the whole table every time. ASCII only.
param([string]$Path)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$cfg  = Get-Content (Join-Path $root 'deck-core.json') -Encoding UTF8 -Raw | ConvertFrom-Json
$deck = if ($Path) { $Path } else { $cfg.master }

$rows = @(
  @('Milestone', 'Gate / week', '%'),
  @('Deposit on contract signing', 'Kick-off (week 1)', '30%'),
  @('Scope and Solution Blueprint signed', 'Gate 1 (week 3)', '15%'),
  @('Prototype passed, build complete', 'Gate 2 (week 6)', '20%'),
  @('UAT signed off per process', 'Gate 3 (week 8)', '20%'),
  @('Go-live, first period closed, project closure accepted', 'Gate 4-5 (week 10-14)', '15%')
)
$note = 'Each milestone is invoiced when the gate is signed off.'

$pp = New-Object -ComObject PowerPoint.Application
$pres = $null
try {
  $pres = $pp.Presentations.Open($deck, 0, 0, -1)
  $slide = $null
  for ($i = 1; $i -le $pres.Slides.Count; $i++) {
    $s = $pres.Slides.Item($i)
    $t = $s.Shapes.Item(1)
    if ($t.HasTextFrame -and $t.TextFrame.TextRange.Text -eq 'Payment Schedule') { $slide = $s; break }
  }
  if ($null -eq $slide) { throw 'Payment Schedule slide not found' }
  $tbl = $null
  for ($j = 1; $j -le $slide.Shapes.Count; $j++) { if ($slide.Shapes.Item($j).HasTable) { $tbl = $slide.Shapes.Item($j).Table } }
  while ($tbl.Rows.Count -lt $rows.Count) { [void]$tbl.Rows.Add() }
  while ($tbl.Rows.Count -gt $rows.Count) { $tbl.Rows.Item($tbl.Rows.Count).Delete() }
  for ($r = 1; $r -le $rows.Count; $r++) {
    for ($c = 1; $c -le 3; $c++) { $tbl.Cell($r, $c).Shape.TextFrame.TextRange.Text = $rows[$r-1][$c-1] }
  }
  # PowerPoint does not reflow until rendered: set row heights explicitly, then read back
  for ($r = 1; $r -le $rows.Count; $r++) {
    for ($c = 1; $c -le 3; $c++) { $tbl.Cell($r, $c).Shape.TextFrame.TextRange.Font.Size = 16 }
    $tbl.Rows.Item($r).Height = 42
  }
  $tshape = $null
  for ($j = 1; $j -le $slide.Shapes.Count; $j++) { if ($slide.Shapes.Item($j).HasTable) { $tshape = $slide.Shapes.Item($j) } }
  $bottom = $tshape.Top + $tshape.Height
  for ($j = 1; $j -le $slide.Shapes.Count; $j++) {
    $sh = $slide.Shapes.Item($j)
    if ($sh.HasTextFrame -and $sh.TextFrame.TextRange.Text -like 'Each milestone*') {
      $sh.TextFrame.TextRange.Text = $note
      $sh.Top = $bottom + 14
    }
  }
  $pres.Save()
  Write-Host ("payment schedule rewritten on slide {0}" -f $slide.SlideIndex)
}
finally {
  if ($null -ne $pres) { $pres.Close() }
  $pp.Quit()
  [void][Runtime.InteropServices.Marshal]::ReleaseComObject($pp)
}
