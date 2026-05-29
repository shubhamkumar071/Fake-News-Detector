$token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUk9MRV9VU0VSIiwic3ViIjoidGVzdHVzZXIiLCJpYXQiOjE3NzkyNzYxNDksImV4cCI6MTc3OTM2MjU0OX0.Cgj2MhoXxpnTCLQhK8gtT_we4o0MZTEI52Y_qeFGH_A'
Invoke-RestMethod -Uri 'http://localhost:8080/api/analysis/analyze' -Method Post -ContentType 'application/json' -Headers @{ Authorization = "Bearer $token" } -InFile '.\nlp-service\payload.json' | ConvertTo-Json -Depth 5
