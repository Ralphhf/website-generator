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

    # Only process files ending in -data.zip (not -export.zip)
    $fileName = [System.IO.Path]::GetFileNameWithoutExtension($ZipPath)
    if (-not ($fileName -match "-data$")) {
        return $false
    }

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

    # Step 4: Create launcher script
    Write-Host "[3/5] Creating launcher script..." -ForegroundColor Yellow

    # Create a batch file to launch Claude CLI (keeps command simple for SendKeys)
    $launcherBat = Join-Path $websitePath "start-claude.bat"
    $launcherContent = @"
@echo off
claude "I need you to generate a complete Next.js website. First, read the prompt file at '$promptFile' and the business data files in '$($dataFolder.FullName)' (business-info.json, testimonials.json, portfolio.json). Then create the website in this current directory. Start by initializing the Next.js project and then build all the components and pages as specified in the prompt."
"@
    $launcherContent | Out-File -FilePath $launcherBat -Encoding ASCII
    Write-Host "       Created: $launcherBat" -ForegroundColor Gray

    # Step 5: Open VS Code and run Claude CLI in integrated terminal
    Write-Host "[4/5] Opening VS Code..." -ForegroundColor Yellow
    Write-Host "[5/5] Starting Claude CLI in VS Code terminal..." -ForegroundColor Yellow

    try {
        # First, add the projects folder to VS Code trusted folders to bypass trust dialog
        $vscodeSettingsPath = "$env:APPDATA\Code\User\settings.json"
        if (Test-Path $vscodeSettingsPath) {
            $settings = Get-Content $vscodeSettingsPath -Raw | ConvertFrom-Json
        } else {
            $settings = @{}
        }

        # Disable workspace trust prompts
        $settings | Add-Member -NotePropertyName "security.workspace.trust.startupPrompt" -NotePropertyValue "never" -Force
        $settings | Add-Member -NotePropertyName "security.workspace.trust.enabled" -NotePropertyValue $false -Force

        # Save settings
        $settingsDir = Split-Path $vscodeSettingsPath -Parent
        if (-not (Test-Path $settingsDir)) {
            New-Item -ItemType Directory -Path $settingsDir -Force | Out-Null
        }
        $settings | ConvertTo-Json -Depth 10 | Out-File $vscodeSettingsPath -Encoding UTF8
        Write-Host "       Configured VS Code to skip trust dialog" -ForegroundColor Gray

        # Open VS Code with the project folder
        Start-Process "code" -ArgumentList "`"$websitePath`"" -ErrorAction Stop
        Write-Host "       VS Code opening..." -ForegroundColor Gray

        # Load required assemblies
        Add-Type -AssemblyName System.Windows.Forms
        Add-Type -AssemblyName Microsoft.VisualBasic

        # Wait for VS Code to fully load (no trust dialog now)
        Write-Host "       Waiting 5 seconds for VS Code..." -ForegroundColor Gray
        Start-Sleep -Seconds 5

        # Focus VS Code
        [Microsoft.VisualBasic.Interaction]::AppActivate("Visual Studio Code")
        Start-Sleep -Seconds 1

        # Open terminal using Ctrl+Shift+` (new terminal)
        Write-Host "       Opening terminal..." -ForegroundColor Gray
        [System.Windows.Forms.SendKeys]::SendWait('^+`')
        Start-Sleep -Seconds 2

        # Focus again before typing
        [Microsoft.VisualBasic.Interaction]::AppActivate("Visual Studio Code")
        Start-Sleep -Milliseconds 500

        # Type the command
        Write-Host "       Typing command..." -ForegroundColor Gray
        [System.Windows.Forms.SendKeys]::SendWait('.\start-claude.bat')
        Start-Sleep -Milliseconds 500

        # Press Enter
        Write-Host "       Executing..." -ForegroundColor Gray
        [System.Windows.Forms.SendKeys]::SendWait('{ENTER}')

        Write-Host "       Claude CLI started in VS Code terminal!" -ForegroundColor Gray
    }
    catch {
        Write-Host "       ERROR: $_" -ForegroundColor Red
    }

    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "  DONE! Check VS Code - Claude is running!" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Project: $projectPath" -ForegroundColor Cyan
    Write-Host "Website: $websitePath" -ForegroundColor Cyan
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
# Track the start time - only process files created after the watcher started
$watcherStartTime = Get-Date

Write-Host "Watcher started at: $watcherStartTime" -ForegroundColor Gray
Write-Host ""

while ($true) {
    # Get all ZIP files in Downloads folder created after the watcher started
    # This prevents processing old ZIP files and ensures we catch new downloads
    $zipFiles = Get-ChildItem -Path $DownloadsPath -Filter "*.zip" -File |
                Where-Object { $_.CreationTime -gt $watcherStartTime -or $_.LastWriteTime -gt $watcherStartTime }

    foreach ($zip in $zipFiles) {
        # Skip if already processed
        if ($processedFiles.ContainsKey($zip.FullName)) {
            continue
        }

        # Wait for the download to complete - check if file is still being written
        $fileReady = $false
        $attempts = 0
        $maxAttempts = 30  # Wait up to 30 seconds for large downloads

        while (-not $fileReady -and $attempts -lt $maxAttempts) {
            try {
                # Try to open the file exclusively - if it fails, it's still being written
                $stream = [System.IO.File]::Open($zip.FullName, 'Open', 'Read', 'None')
                $stream.Close()
                $fileReady = $true
            }
            catch {
                $attempts++
                Start-Sleep -Seconds 1
            }
        }

        if (-not $fileReady) {
            Write-Host "       Skipping $($zip.Name) - file still in use" -ForegroundColor Yellow
            continue
        }

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

    Start-Sleep -Seconds 1
}
