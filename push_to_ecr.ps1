# AWS ECR Push Script for Property Finder
# Usage: .\push_to_ecr.ps1 -AWSAccountID "123456789012" -Region "us-east-1"

param (
    [Parameter(Mandatory=$true)]
    [string]$AWSAccountID,

    [Parameter(Mandatory=$false)]
    [string]$Region = "us-east-1"
)

$BackendRepo = "property-finder-backend"
$FrontendRepo = "property-finder-frontend"

Write-Host "--- Logging into AWS ECR ---" -ForegroundColor Cyan
aws ecr get-login-password --region $Region | docker login --username AWS --password-stdin "$AWSAccountID.dkr.ecr.$Region.amazonaws.com"

# 1. Backend
Write-Host "--- Building & Pushing Backend ---" -ForegroundColor Green
docker build -t $BackendRepo ./backend
docker tag "$($BackendRepo):latest" "$AWSAccountID.dkr.ecr.$Region.amazonaws.com/$($BackendRepo):latest"
docker push "$AWSAccountID.dkr.ecr.$Region.amazonaws.com/$($BackendRepo):latest"

# 2. Frontend
Write-Host "--- Building & Pushing Frontend ---" -ForegroundColor Green
docker build -t $FrontendRepo ./frontend/my_app
docker tag "$($FrontendRepo):latest" "$AWSAccountID.dkr.ecr.$Region.amazonaws.com/$($FrontendRepo):latest"
docker push "$AWSAccountID.dkr.ecr.$Region.amazonaws.com/$($FrontendRepo):latest"

Write-Host "--- PUSH COMPLETE ---" -ForegroundColor Cyan
Write-Host "Images are now available in ECR. You can update your ECS Task Definitions to use these images."
