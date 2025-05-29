# deploy.ps1

Write-Host 'Build du frontend React...'
Push-Location frontend
npm run build
if ($LASTEXITCODE -ne 0) { Write-Error 'Build frontend failed'; exit 1 }
Pop-Location

Write-Host 'Copy build to backend/public...'
$backendPublic = Join-Path '..' 'backend' 'public'
if (Test-Path $backendPublic) {
    Remove-Item $backendPublic -Recurse -Force
}
New-Item -ItemType Directory -Path $backendPublic | Out-Null
Copy-Item -Path (Join-Path 'frontend' 'dist\*') -Destination $backendPublic -Recurse

Write-Host 'Install backend dependencies...'
Push-Location backend
npm install --production
if ($LASTEXITCODE -ne 0) { Write-Error 'Backend install failed'; exit 1 }
Pop-Location

Write-Host 'Git add, commit and push'
git add .
git commit -m 'Deploy auto: frontend + backend'
git push --set-upstream origin main

Write-Host 'Done. DigitalOcean will redeploy.'
