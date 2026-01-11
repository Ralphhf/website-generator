import { NextRequest, NextResponse } from 'next/server'
import { generatePremiumWebsite } from '@/lib/premium-website-generator'
import * as fs from 'fs'
import * as path from 'path'

export async function POST(request: NextRequest) {
  try {
    const businessInfo = await request.json()

    // Generate the website files
    const files = generatePremiumWebsite(businessInfo)

    // Write files to test directory
    const testDir = path.join(process.cwd(), 'test-generated-site')

    // Clean directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true })
    }

    // Create files
    for (const [filePath, content] of Object.entries(files)) {
      const fullPath = path.join(testDir, filePath)
      const dir = path.dirname(fullPath)

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }

      fs.writeFileSync(fullPath, content)
    }

    return NextResponse.json({
      success: true,
      message: `Generated ${Object.keys(files).length} files to test-generated-site/`,
      files: Object.keys(files),
    })
  } catch (error) {
    console.error('Test generate error:', error)
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}
