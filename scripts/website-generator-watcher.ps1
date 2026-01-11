# Website Generator Watcher Script
# This script watches your Downloads folder for ZIP files from the website-generator app
# When detected, it automatically extracts, opens VS Code, and starts Claude CLI

param(
    [string]$DownloadsPath = "$env:USERPROFILE\Downloads",
    [string]$ProjectsPath = "$env:USERPROFILE\Projects\generated-websites",
    [switch]$RunOnce = $false
)

$host.UI.RawUI.WindowTitle = "Website Generator Watcher"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Website Generator Watcher" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Watching: $DownloadsPath" -ForegroundColor Yellow
Write-Host "Projects: $ProjectsPath" -ForegroundColor Yellow
Write-Host ""
Write-Host "Waiting for website-generator ZIP files..." -ForegroundColor Green
Write-Host "(Press Ctrl+C to stop)" -ForegroundColor Gray
Write-Host ""

# Create projects directory if it doesn't exist
if (-not (Test-Path $ProjectsPath)) {
    New-Item -ItemType Directory -Path $ProjectsPath -Force | Out-Null
    Write-Host "Created projects directory: $ProjectsPath" -ForegroundColor Gray
}

# Track processed files to avoid duplicates
$processedFiles = @{}

function Test-IsWebsiteGeneratorZip {
    param([string]$ZipPath)

    try {
        Add-Type -AssemblyName System.IO.Compression.FileSystem
        $zip = [System.IO.Compression.ZipFile]::OpenRead($ZipPath)

        $hasPrompt = $false
        foreach ($entry in $zip.Entries) {
            if ($entry.Name -eq "CLAUDE_PROMPT.md") {
                $hasPrompt = $true
                break
            }
        }

        $zip.Dispose()
        return $hasPrompt
    }
    catch {
        return $false
    }
}

function Get-BusinessNameFromZip {
    param([string]$ZipPath)

    # Extract business name from ZIP filename (e.g., "my-business-data.zip" -> "my-business")
    $fileName = [System.IO.Path]::GetFileNameWithoutExtension($ZipPath)
    if ($fileName -match "^(.+)-data$") {
        return $matches[1]
    }
    return $fileName
}

function Process-WebsiteGeneratorZip {
    param([string]$ZipPath)

    $businessName = Get-BusinessNameFromZip -ZipPath $ZipPath
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $projectName = "$businessName-$timestamp"
    $projectPath = Join-Path $ProjectsPath $projectName
    $websitePath = Join-Path $projectPath "website"

    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "  New Website Generator ZIP Detected!" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Business: $businessName" -ForegroundColor Cyan
    Write-Host "Project:  $projectPath" -ForegroundColor Cyan
    Write-Host ""

    # Step 1: Create project directory
    Write-Host "[1/5] Creating project directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $projectPath -Force | Out-Null
    New-Item -ItemType Directory -Path $websitePath -Force | Out-Null

    # Step 2: Extract ZIP
    Write-Host "[2/5] Extracting ZIP file..." -ForegroundColor Yellow
    try {
        Expand-Archive -Path $ZipPath -DestinationPath $projectPath -Force
        Write-Host "       Extracted to: $projectPath" -ForegroundColor Gray
    }
    catch {
        Write-Host "       ERROR: Failed to extract ZIP" -ForegroundColor Red
        return
    }

    # Step 3: Find the extracted data folder and CLAUDE_PROMPT.md
    $dataFolder = Get-ChildItem -Path $projectPath -Directory | Where-Object { $_.Name -match "-data$" } | Select-Object -First 1
    if (-not $dataFolder) {
        $dataFolder = Get-ChildItem -Path $projectPath -Directory | Select-Object -First 1
    }

    $promptFile = $null
    if ($dataFolder) {
        $promptFile = Join-Path $dataFolder.FullName "CLAUDE_PROMPT.md"
        if (-not (Test-Path $promptFile)) {
            $promptFile = Get-ChildItem -Path $projectPath -Recurse -Filter "CLAUDE_PROMPT.md" | Select-Object -First 1
            if ($promptFile) { $promptFile = $promptFile.FullName }
        }
    }

    if (-not $promptFile -or -not (Test-Path $promptFile)) {
        Write-Host "       WARNING: CLAUDE_PROMPT.md not found" -ForegroundColor Yellow
    }
    else {
        Write-Host "       Found prompt: $promptFile" -ForegroundColor Gray
    }

    # Step 4: Open VS Code
    Write-Host "[3/5] Opening VS Code..." -ForegroundColor Yellow
    try {
        Start-Process "code" -ArgumentList $websitePath -ErrorAction Stop
        Write-Host "       VS Code opened at: $websitePath" -ForegroundColor Gray
    }
    catch {
        Write-Host "       WARNING: Could not open VS Code. Is it installed?" -ForegroundColor Yellow
    }

    # Give VS Code time to open
    Start-Sleep -Seconds 2

    # Step 5: Create the Claude CLI command file
    Write-Host "[4/5] Preparing Claude CLI..." -ForegroundColor Yellow

    # Read the prompt content
    $promptContent = ""
    if ($promptFile -and (Test-Path $promptFile)) {
        $promptContent = Get-Content -Path $promptFile -Raw
    }

    # Create a startup script for Claude CLI
    $claudeScript = @"
# Website Generator - Auto Start Script
# Project: $businessName
# Created: $(Get-Date)

# The business data is located at:

"@

    if ($dataFolder) {
        $claudeScript += "# Data folder: $($dataFolder.FullName)`n"
    }

    $claudeScript += @"

# To generate the website, Claude CLI will be started with the following prompt.
# The prompt file is located at: $promptFile

"@

    $claudeScriptPath = Join-Path $websitePath "GENERATE.md"
    $claudeScript | Out-File -FilePath $claudeScriptPath -Encoding UTF8

    # Create the actual command to run in terminal
    $claudeCommand = "cd `"$websitePath`" && claude `"Read the prompt from $promptFile and the data files in $($dataFolder.FullName). Generate the complete Next.js website in this folder ($websitePath). Start by creating the project structure.`""

    Write-Host "[5/5] Starting Claude CLI..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "       Opening new terminal with Claude CLI..." -ForegroundColor Gray

    # Open Windows Terminal or PowerShell with Claude CLI
    $terminalCommand = @"
cd "$websitePath"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Website Generator - Claude CLI" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Project folder: $websitePath" -ForegroundColor Yellow
Write-Host "Data folder: $($dataFolder.FullName)" -ForegroundColor Yellow
Write-Host "Prompt file: $promptFile" -ForegroundColor Yellow
Write-Host ""
Write-Host "Starting Claude CLI..." -ForegroundColor Green
Write-Host ""

claude "I need you to generate a complete Next.js website. First, read the prompt file at '$promptFile' and the business data files in '$($dataFolder.FullName)' (business-info.json, testimonials.json, portfolio.json). Then create the website in this current directory ($websitePath). Start by initializing the Next.js project and then build all the components and pages as specified in the prompt."
"@

    # Save the terminal command to a file and execute it
    $terminalScriptPath = Join-Path $projectPath "start-claude.ps1"
    $terminalCommand | Out-File -FilePath $terminalScriptPath -Encoding UTF8

    # Start new PowerShell window with Claude CLI
    Start-Process "powershell" -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", $terminalScriptPath

    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "  DONE! Claude CLI is starting..." -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Project location: $projectPath" -ForegroundColor Cyan
    Write-Host "Website folder:   $websitePath" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "A new terminal window should open with Claude CLI." -ForegroundColor Yellow
    Write-Host "If it doesn't, run this manually:" -ForegroundColor Yellow
    Write-Host "  $terminalScriptPath" -ForegroundColor Gray
    Write-Host ""

    # Optional: Move the ZIP to processed folder
    $processedFolder = Join-Path $DownloadsPath "website-generator-processed"
    if (-not (Test-Path $processedFolder)) {
        New-Item -ItemType Directory -Path $processedFolder -Force | Out-Null
    }

    try {
        $newZipPath = Join-Path $processedFolder ([System.IO.Path]::GetFileName($ZipPath))
        Move-Item -Path $ZipPath -Destination $newZipPath -Force
        Write-Host "Moved ZIP to: $newZipPath" -ForegroundColor Gray
    }
    catch {
        Write-Host "Note: Could not move ZIP file (may be in use)" -ForegroundColor Gray
    }

    Write-Host ""
}

# Main watching loop
$lastCheck = Get-Date

while ($true) {
    # Get all ZIP files in Downloads folder
    $zipFiles = Get-ChildItem -Path $DownloadsPath -Filter "*.zip" -File |
                Where-Object { $_.LastWriteTime -gt $lastCheck.AddSeconds(-5) }

    foreach ($zip in $zipFiles) {
        # Skip if already processed
        if ($processedFiles.ContainsKey($zip.FullName)) {
            continue
        }

        # Wait a moment for the download to complete
        Start-Sleep -Milliseconds 500

        # Check if this is a website-generator ZIP
        if (Test-IsWebsiteGeneratorZip -ZipPath $zip.FullName) {
            $processedFiles[$zip.FullName] = $true
            Process-WebsiteGeneratorZip -ZipPath $zip.FullName

            if ($RunOnce) {
                Write-Host "RunOnce mode - exiting." -ForegroundColor Gray
                exit 0
            }
        }
    }

    $lastCheck = Get-Date
    Start-Sleep -Seconds 1
}
