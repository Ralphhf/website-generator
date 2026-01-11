// Netlify deployment utilities for Next.js websites
import { BusinessInfo } from './types'
import { slugify } from './utils'

const NETLIFY_API_KEY = process.env.NETLIFY_API_KEY || ''

interface NetlifySite {
  id: string
  name: string
  url: string
  ssl_url: string
}

interface NetlifyDeploy {
  id: string
  site_id: string
  state: string
  url: string
  ssl_url: string
  deploy_url: string
  admin_url: string
}

// Create a new Netlify site
async function createNetlifySite(siteName: string): Promise<NetlifySite | null> {
  // Add random suffix to avoid name collisions
  const uniqueName = `${siteName}-${Math.random().toString(36).substring(2, 8)}`

  const response = await fetch('https://api.netlify.com/api/v1/sites', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${NETLIFY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: uniqueName,
      custom_domain: null,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('Failed to create Netlify site:', error)
    return null
  }

  return response.json()
}

// Deploy files to Netlify using the file digest method
async function deployToNetlify(
  siteId: string,
  files: Record<string, string>
): Promise<NetlifyDeploy | null> {
  // Create file digests (SHA-1 hashes)
  const fileDigests: Record<string, string> = {}
  const fileContents: Record<string, string> = {}

  for (const [filePath, content] of Object.entries(files)) {
    // Use a simple hash for the digest
    const hash = await sha1(content)
    // Normalize path to start with /
    const normalizedPath = filePath.startsWith('/') ? filePath : `/${filePath}`
    fileDigests[normalizedPath] = hash
    fileContents[hash] = content
  }

  // Create the deploy with file digests
  const deployResponse = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/deploys`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${NETLIFY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: fileDigests,
    }),
  })

  if (!deployResponse.ok) {
    const error = await deployResponse.json()
    console.error('Failed to create deploy:', error)
    return null
  }

  const deploy: NetlifyDeploy & { required: string[] } = await deployResponse.json()
  console.log(`Deploy created: ${deploy.id}, required files: ${deploy.required?.length || 0}`)

  // Upload the required files
  if (deploy.required && deploy.required.length > 0) {
    for (const hash of deploy.required) {
      const content = fileContents[hash]
      if (!content) {
        console.error(`Missing content for hash: ${hash}`)
        continue
      }

      const uploadResponse = await fetch(
        `https://api.netlify.com/api/v1/deploys/${deploy.id}/files/${hash}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${NETLIFY_API_KEY}`,
            'Content-Type': 'application/octet-stream',
          },
          body: content,
        }
      )

      if (!uploadResponse.ok) {
        console.error(`Failed to upload file with hash ${hash}`)
      }
    }
  }

  // Wait for deploy to be ready
  return waitForDeploy(deploy.id)
}

async function waitForDeploy(deployId: string): Promise<NetlifyDeploy | null> {
  const maxAttempts = 60 // 5 minutes
  let attempts = 0

  while (attempts < maxAttempts) {
    const response = await fetch(`https://api.netlify.com/api/v1/deploys/${deployId}`, {
      headers: {
        Authorization: `Bearer ${NETLIFY_API_KEY}`,
      },
    })

    if (response.ok) {
      const deploy: NetlifyDeploy = await response.json()
      console.log(`Deploy status: ${deploy.state}`)

      if (deploy.state === 'ready') {
        return deploy
      }
      if (deploy.state === 'error') {
        console.error('Deploy failed')
        return null
      }
    }

    await new Promise(resolve => setTimeout(resolve, 5000))
    attempts++
  }

  console.error('Deploy timed out')
  return null
}

// Simple SHA-1 implementation using Web Crypto API
async function sha1(content: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(content)
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Full deployment flow - deploys pre-built static files
export async function deployWebsite(
  businessInfo: BusinessInfo,
  files: Record<string, string>
): Promise<{
  success: boolean
  netlifyUrl?: string
  error?: string
}> {
  if (!NETLIFY_API_KEY) {
    return { success: false, error: 'Netlify API key not configured' }
  }

  const siteName = slugify(businessInfo.name)

  try {
    console.log('Creating Netlify site...')
    const site = await createNetlifySite(siteName)
    if (!site) {
      return { success: false, error: 'Failed to create Netlify site' }
    }
    console.log(`Site created: ${site.name} (${site.id})`)

    console.log(`Deploying ${Object.keys(files).length} static files...`)
    const deploy = await deployToNetlify(site.id, files)

    if (!deploy) {
      return { success: false, error: 'Failed to deploy to Netlify' }
    }

    return {
      success: true,
      netlifyUrl: deploy.ssl_url || deploy.url,
    }
  } catch (error) {
    console.error('Deployment error:', error)
    return { success: false, error: String(error) }
  }
}
