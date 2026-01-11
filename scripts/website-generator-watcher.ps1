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

    # Step 4: Create VS Code task to auto-run Claude CLI in integrated terminal
    Write-Host "[3/5] Setting up VS Code task..." -ForegroundColor Yellow

    # Create .vscode folder
    $vscodeFolder = Join-Path $websitePath ".vscode"
    New-Item -ItemType Directory -Path $vscodeFolder -Force | Out-Null

    # Create the Claude CLI prompt for the task
    $claudePrompt = "I need you to generate a complete Next.js website. First, read the prompt file at '$promptFile' and the business data files in '$($dataFolder.FullName)' (business-info.json, testimonials.json, portfolio.json). Then create the website in this current directory. Start by initializing the Next.js project and then build all the components and pages as specified in the prompt."

    # Create tasks.json with runOn: folderOpen to auto-start Claude CLI
    $tasksJson = @"
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Start Claude CLI - Generate Website",
            "type": "shell",
            "command": "claude",
            "args": ["$($claudePrompt -replace '"', '\"')"],
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": true,
                "panel": "new",
                "showReuseMessage": false,
                "clear": true
            },
            "runOptions": {
                "runOn": "folderOpen"
            },
            "problemMatcher": []
        }
    ]
}
"@

    $tasksJsonPath = Join-Path $vscodeFolder "tasks.json"
    $tasksJson | Out-File -FilePath $tasksJsonPath -Encoding UTF8
    Write-Host "       Created VS Code task: $tasksJsonPath" -ForegroundColor Gray

    # Create a README file with instructions
    $readmeContent = @"
# Website Generator Project

## Business: $businessName
## Created: $(Get-Date)

## Data Location
- Data folder: $($dataFolder.FullName)
- Prompt file: $promptFile

## Auto-Start
When you open this folder in VS Code, Claude CLI should automatically start in the integrated terminal.

If it doesn't start automatically:
1. Press Ctrl+Shift+P
2. Type "Tasks: Run Task"
3. Select "Start Claude CLI - Generate Website"

Or manually run in terminal:
``````
claude "Read the prompt from $promptFile and generate the website"
``````
"@

    $readmePath = Join-Path $websitePath "README.md"
    $readmeContent | Out-File -FilePath $readmePath -Encoding UTF8

    # Step 5: Open VS Code - task will auto-run
    Write-Host "[4/5] Opening VS Code..." -ForegroundColor Yellow
    Write-Host "[5/5] Claude CLI will auto-start in VS Code terminal..." -ForegroundColor Yellow

    try {
        Start-Process "code" -ArgumentList $websitePath -ErrorAction Stop
        Write-Host "       VS Code opened at: $websitePath" -ForegroundColor Gray
    }
    catch {
        Write-Host "       WARNING: Could not open VS Code. Is it installed?" -ForegroundColor Yellow
    }

    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "  DONE! VS Code is opening..." -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Project location: $projectPath" -ForegroundColor Cyan
    Write-Host "Website folder:   $websitePath" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Claude CLI should auto-start in VS Code's integrated terminal." -ForegroundColor Yellow
    Write-Host "If it doesn't, press Ctrl+Shift+P and run 'Tasks: Run Task'" -ForegroundColor Yellow
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
