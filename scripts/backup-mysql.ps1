param(
    [string]$OutputDirectory = (Join-Path (Split-Path $PSScriptRoot -Parent) "backups")
)

$ErrorActionPreference = "Stop"

$required = @("MYSQL_HOST", "MYSQL_DATABASE", "MYSQL_USER", "MYSQL_PASSWORD")
foreach ($name in $required) {
    if ([string]::IsNullOrWhiteSpace([Environment]::GetEnvironmentVariable($name))) {
        throw "Define la variable de entorno $name antes de ejecutar el respaldo."
    }
}

$port = [Environment]::GetEnvironmentVariable("MYSQL_PORT")
if ([string]::IsNullOrWhiteSpace($port)) { $port = "3306" }
$dump = (Get-Command mysqldump -ErrorAction Stop).Source
New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$file = Join-Path $OutputDirectory "$($env:MYSQL_DATABASE)-$stamp.sql"

# MYSQL_PWD avoids placing the password in the process command line.
$env:MYSQL_PWD = $env:MYSQL_PASSWORD
try {
    & $dump --host=$env:MYSQL_HOST --port=$port --user=$env:MYSQL_USER --single-transaction --routines --triggers --default-character-set=utf8mb4 $env:MYSQL_DATABASE --result-file=$file
    if ($LASTEXITCODE -ne 0) { throw "mysqldump finalizó con código $LASTEXITCODE." }
    if ((Get-Item -LiteralPath $file).Length -eq 0) { throw "El archivo de respaldo está vacío: $file" }
    Write-Output "Respaldo creado: $file"
}
finally {
    Remove-Item Env:MYSQL_PWD -ErrorAction SilentlyContinue
}
