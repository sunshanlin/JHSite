# Export a few slides to PNG so they can be eyeballed after a build.
# Usage: shots.ps1 1 2 13 14 15 26 27 29
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$cfg  = Get-Content (Join-Path $root 'deck-core.json') -Encoding UTF8 -Raw | ConvertFrom-Json
$outDir = Join-Path (Split-Path -Parent $cfg.master) 'shots'
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Force $outDir | Out-Null }

$pp = New-Object -ComObject PowerPoint.Application
$pres = $null
try {
  $pres = $pp.Presentations.Open($cfg.master, -1, 0, -1)
  foreach ($n in $args) {
    $i = [int]$n
    $path = Join-Path $outDir ('slide{0:D2}.png' -f $i)
    $pres.Slides.Item($i).Export($path, 'PNG', 1440, 810)
    Write-Host "  $path"
  }
}
finally {
  if ($null -ne $pres) { $pres.Close() }
  $pp.Quit()
  [void][Runtime.InteropServices.Marshal]::ReleaseComObject($pp)
}
