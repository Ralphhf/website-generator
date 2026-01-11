import { NextRequest, NextResponse } from 'next/server'
import { BusinessInfo } from '@/lib/types'
import { generatePremiumWebsite } from '@/lib/premium-website-generator'
import { deployWebsite } from '@/lib/deployment'
import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'

// Build the Next.js site locally and return the static output files
async function buildSiteLocally(
  sourceFiles: Record<string, string>,
  siteName: string
): Promise<Record<string, string>> {
  const tempDir = path.join(process.cwd(), 'temp-build', siteName)
  const outDir = path.join(tempDir, 'out')

  try {
    // Clean and create temp directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true })
    }
    fs.mkdirSync(tempDir, { recursive: true })

    // Write source files
    for (const [filePath, content] of Object.entries(sourceFiles)) {
      const fullPath = path.join(tempDir, filePath)
      const dir = path.dirname(fullPath)

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }

      fs.writeFileSync(fullPath, content)
    }

    console.log(`Source files written to ${tempDir}`)

    // Install dependencies and build
    console.log('Installing dependencies...')
    execSync('npm install', {
      cwd: tempDir,
      stdio: 'pipe',
      timeout: 120000, // 2 minute timeout
    })

    console.log('Building Next.js site...')
    // Create a clean env without the parent's NODE_ENV
    const { NODE_ENV, ...buildEnv } = process.env
    execSync('npm run build', {
      cwd: tempDir,
      stdio: 'pipe',
      timeout: 180000, // 3 minute timeout
      env: buildEnv as NodeJS.ProcessEnv,
    })

    console.log('Build complete, reading output files...')

    // Read all files from the out directory
    const outputFiles: Record<string, string> = {}
    readDirRecursive(outDir, outDir, outputFiles)

    console.log(`Read ${Object.keys(outputFiles).length} output files`)

    // Clean up temp directory
    fs.rmSync(tempDir, { recursive: true })

    return outputFiles
  } catch (error) {
    console.error('Build error:', error)
    // Clean up on error
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true })
    }
    throw error
  }
}

// Recursively read all files from a directory
function readDirRecursive(
  dir: string,
  baseDir: string,
  files: Record<string, string>
): void {
  const items = fs.readdirSync(dir)

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/')
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      readDirRecursive(fullPath, baseDir, files)
    } else {
      // Read file content - for binary files, read as base64
      const ext = path.extname(item).toLowerCase()
      const binaryExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.woff', '.woff2', '.ttf', '.eot']

      if (binaryExtensions.includes(ext)) {
        // For binary files, we'll skip them or encode as base64
        // Netlify API requires text content, so we skip binary for now
        // The JS/CSS chunks are text and will be included
      } else {
        try {
          const content = fs.readFileSync(fullPath, 'utf-8')
          files[relativePath] = content
        } catch {
          // Skip files that can't be read as text
        }
      }
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const businessInfo: BusinessInfo = await request.json()

    // Validate required fields
    if (!businessInfo.name) {
      return NextResponse.json(
        { success: false, error: 'Business name is required' },
        { status: 400 }
      )
    }

    // Generate premium Next.js website with Awwwards-level design
    console.log('Generating premium Next.js website...')
    const sourceFiles = generatePremiumWebsite(businessInfo)
    console.log(`Generated ${Object.keys(sourceFiles).length} source files`)

    // Build the site locally
    console.log('Building site locally...')
    const siteName = businessInfo.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    const outputFiles = await buildSiteLocally(sourceFiles, siteName)
    console.log(`Built ${Object.keys(outputFiles).length} output files`)

    // Deploy static files to Netlify
    console.log('Deploying to Netlify...')
    const result = await deployWebsite(businessInfo, outputFiles)

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          netlifyUrl: result.netlifyUrl,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      netlifyUrl: result.netlifyUrl,
    })
  } catch (error) {
    console.error('Generate website error:', error)
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}
