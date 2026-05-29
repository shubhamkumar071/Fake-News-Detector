$body = @{username='testuser'; password='password'} | ConvertTo-Json
try {
  $resp = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/login' -Method Post -Body $body -ContentType 'application/json' -TimeoutSec 10
  $resp | ConvertTo-Json -Compress
} catch {
  Write-Error $_.Exception.Response.StatusCode.Value__
  $_.Exception.Response | Select-Object * | ConvertTo-Json -Compress
  exit 1
}
