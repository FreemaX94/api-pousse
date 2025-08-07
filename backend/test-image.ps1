# test-image.ps1

# 1. Variables
$apiBase = 'http://localhost:3001/api'
$email = 'Freex94'
$password = 'Lolmdr94148!'
$itemCode = '8EE427378'
$outFile = "C:\Temp\item-$itemCode.jpg"

try {
  # 2. Connexion locale
  $loginRes = Invoke-RestMethod `
    -Uri "$apiBase/auth/login" `
    -Method Post `
    -ContentType 'application/json' `
    -Body (@{ email = $email; password = $password } | ConvertTo-Json) `
    -ErrorAction Stop

  $localToken = $loginRes.token
  Write-Host "JWT local obtenu."

  # 3. Téléchargement via ton proxy Nieuwkoop
  Invoke-WebRequest `
    -Uri "$apiBase/nieuwkoop/items/$itemCode/image" `
    -Method Get `
    -Headers @{ Authorization = "Bearer $localToken" } `
    -OutFile $outFile `
    -ErrorAction Stop

  Write-Host "Image téléchargée dans $outFile"
}
catch {
  Write-Error "Échec : $($_.Exception.Message)"
}
