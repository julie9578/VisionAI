$ErrorActionPreference = 'Stop'

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$branch = (& git -C $repoRoot branch --show-current).Trim()
if ($branch -ne 'main') {
  throw "Cloudflare Pages production deploy requires branch 'main'; current branch is '$branch'."
}

$status = @(& git -C $repoRoot status --porcelain)
if ($status.Count -gt 0) {
  throw 'Commit or stash all changes before deploying Cloudflare Pages.'
}

$wrangler = Get-Command wrangler.cmd -ErrorAction SilentlyContinue
if (-not $wrangler) {
  throw 'wrangler.cmd was not found. Install Wrangler and authenticate with Cloudflare first.'
}

$commit = (& git -C $repoRoot rev-parse HEAD).Trim()
$commitMessage = (& git -C $repoRoot log -1 --format=%s).Trim()
$deploymentDirectory = Join-Path $env:TEMP ('visionai-pages-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $deploymentDirectory | Out-Null

try {
  $publicExtensions = '\.(html|css|js|svg|png|jpe?g|webp|ico|txt|xml)$'
  $trackedFiles = @(& git -C $repoRoot ls-files)
  foreach ($relativePath in $trackedFiles) {
    if ($relativePath -notmatch $publicExtensions) { continue }
    if ($relativePath -match '^(src|migrations|scripts|harness)(/|$)') { continue }

    $source = Join-Path $repoRoot ($relativePath -replace '/', '\')
    if (-not (Test-Path -LiteralPath $source -PathType Leaf)) { continue }

    $destination = Join-Path $deploymentDirectory ($relativePath -replace '/', '\')
    $parent = Split-Path -Parent $destination
    if (-not (Test-Path -LiteralPath $parent)) {
      New-Item -ItemType Directory -Path $parent -Force | Out-Null
    }
    Copy-Item -LiteralPath $source -Destination $destination
  }

  $headersSource = Join-Path $repoRoot 'cloudflare-pages\_headers'
  if (-not (Test-Path -LiteralPath $headersSource -PathType Leaf)) {
    throw 'Missing cloudflare-pages/_headers security header configuration.'
  }
  Copy-Item -LiteralPath $headersSource -Destination (Join-Path $deploymentDirectory '_headers')

  if (-not (Test-Path -LiteralPath (Join-Path $deploymentDirectory 'index.html') -PathType Leaf)) {
    throw 'The staged deployment does not contain index.html.'
  }

  Write-Output "Deploying commit $commit ($commitMessage) to Cloudflare Pages project visionai-arcade..."
  Push-Location $repoRoot
  try {
    $previousNativePreference = $PSNativeCommandUseErrorActionPreference
    $PSNativeCommandUseErrorActionPreference = $false
    & $wrangler.Source pages deploy $deploymentDirectory --project-name visionai-arcade --branch main --commit-hash $commit --commit-message $commitMessage
    $deployExitCode = $LASTEXITCODE
  }
  finally {
    $PSNativeCommandUseErrorActionPreference = $previousNativePreference
    Pop-Location
  }
  if ($deployExitCode -ne 0) {
    throw "Wrangler deploy failed with exit code $deployExitCode."
  }
}
finally {
  if (Test-Path -LiteralPath $deploymentDirectory) {
    Remove-Item -LiteralPath $deploymentDirectory -Recurse -Force
  }
}