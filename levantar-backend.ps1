# Script para levantar backend y base de datos con Docker Compose
cd "c:\Users\matyn\OneDrive\Documentos\Proyecto PIS\pis-backend"

if (Test-Path Dockerfile -PathType Leaf) {
    Write-Host "Dockerfile encontrado. Iniciando docker-compose..." -ForegroundColor Green
    docker-compose up --build
} else {
    Write-Host "ERROR: No se encontró el Dockerfile en la carpeta actual." -ForegroundColor Red
    Write-Host "Ubicación actual: $PWD"
    Write-Host "Archivos en la carpeta:"
    Get-ChildItem
}
