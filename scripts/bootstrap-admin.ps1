param(
  [Parameter(Mandatory = $true)]
  [string]$Email,

  [Parameter(Mandatory = $true)]
  [string]$Database = 'arcade-board',

  [switch]$Remote
)

$ErrorActionPreference = 'Stop'
if ($Email -notmatch '^[^\s@]+@[^\s@]+\.[^\s@]+$') {
  throw 'Provide the administrator account email, not a nickname or user-supplied token.'
}

$normalizedEmail = $Email.Trim().ToLowerInvariant()
$escapedEmail = $normalizedEmail.Replace("'", "''")
$query = "SELECT CASE WHEN EXISTS (SELECT 1 FROM pragma_table_info('users') WHERE name = 'role') THEN 1 ELSE 0 END AS role_schema_ready, COUNT(*) AS target_count FROM users WHERE email = '$escapedEmail';"
$args = @('d1', 'execute', $Database)
if ($Remote) { $args += '--remote' }
$args += @('--command', $query)
$output = & wrangler.cmd @args
if ($LASTEXITCODE -ne 0) { throw 'Admin bootstrap query failed.' }
$output
Write-Warning 'Read-only preflight only. Verify role_schema_ready=1 and target_count=1 before separately running an approved role update. Set ADMIN_EMAIL as a Wrangler secret and deploy the Worker only after that review.'