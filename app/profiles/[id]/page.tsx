'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Building2, Loader2, AlertCircle, Download, Palette, Share2, CheckCircle2, Rocket, Globe, Copy, Check, Search, ExternalLink, QrCode, Briefcase, Star, DollarSign, Clock, Shield, CreditCard, Zap, Award, Shuffle, Sparkles, FileText } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import Link from 'next/link'
import { BusinessInfo } from '@/lib/types'
import { LogoGeneratorStep } from '@/components/generator/LogoGeneratorStep'
import { GoogleBusinessStep } from '@/components/generator/GoogleBusinessStep'
import { SocialMediaStep } from '@/components/generator/SocialMediaStep'
import { UpdateProfilesStep } from '@/components/generator/UpdateProfilesStep'
import { AllDoneStep } from '@/components/generator/AllDoneStep'

type ProfileStep = 'overview' | 'logo-generator' | 'google-business' | 'social-media' | 'update-profiles' | 'all-done'

interface SavedProfile {
  id: string
  name: string
  business_type: string | null
  tagline: string | null
  city: string | null
  state: string | null
  data: BusinessInfo
  created_at: string
  updated_at: string
}

export default function ProfileDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [profile, setProfile] = useState<SavedProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<ProfileStep>('overview')
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [qrUrl, setQrUrl] = useState('')
  const [qrGenerated, setQrGenerated] = useState(false)
  const [showLlcDetails, setShowLlcDetails] = useState(false)
  const [showBusinessCardDetails, setShowBusinessCardDetails] = useState(false)
  const [businessCardPromptIndex, setBusinessCardPromptIndex] = useState(0)
  const [businessCardPromptCopied, setBusinessCardPromptCopied] = useState(false)
  const [showFlyerDetails, setShowFlyerDetails] = useState(false)
  const [flyerPromptIndex, setFlyerPromptIndex] = useState(0)
  const [flyerPromptCopied, setFlyerPromptCopied] = useState(false)
  const [showLogoDetails, setShowLogoDetails] = useState(false)
  const [logoPromptIndex, setLogoPromptIndex] = useState(0)
  const [logoPromptCopied, setLogoPromptCopied] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProfile(params.id as string)
    }
  }, [params.id])

  const fetchProfile = async (id: string) => {
    try {
      const response = await fetch(`/api/profiles/${id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profile')
      }

      setProfile(data.profile)
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleRedownload = async () => {
    if (!profile) return

    try {
      const response = await fetch('/api/download-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile.data),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${profile.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-data.zip`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (err) {
      console.error('Download error:', err)
      alert('Failed to download. Please try again.')
    }
  }

  const handleGenerateWebsite = async () => {
    if (!profile) return

    setGenerating(true)
    try {
      const response = await fetch('/api/download-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile.data),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${profile.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-data.zip`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        alert('ZIP downloaded! If the watcher is running, it will automatically start generating your website in VS Code.')
      }
    } catch (err) {
      console.error('Generate error:', err)
      alert('Failed to start generation. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const handleCopyDeployPrompt = async () => {
    if (!profile) return

    const repoName = profile.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const prompt = `I need you to deploy this website to production. Please do the following:

1. Initialize a git repository if not already done
2. Create a new GitHub repository called "${repoName}" (use gh repo create)
3. Push all the code to the GitHub repository
4. Deploy the site to Vercel using the Vercel CLI (vercel --prod)
5. Give me the live URL when done

Make sure the deployment is successful and the site is accessible.`

    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      alert('Failed to copy to clipboard')
    }
  }

  // Navigation handlers
  const handleLogoNext = () => setCurrentStep('google-business')
  const handleLogoSkip = () => setCurrentStep('google-business')
  const handleGoogleNext = () => setCurrentStep('social-media')
  const handleGoogleSkip = () => setCurrentStep('social-media')
  const handleSocialNext = () => setCurrentStep('update-profiles')
  const handleSocialSkip = () => setCurrentStep('update-profiles')
  const handleUpdateFinish = () => setCurrentStep('all-done')
  const handleUpdateSkip = () => setCurrentStep('all-done')
  const handleBack = () => {
    const stepOrder: ProfileStep[] = ['overview', 'logo-generator', 'google-business', 'social-media', 'update-profiles']
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1])
    }
  }
  const handleStartOver = () => router.push('/profiles')

  if (loading) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center px-4">
        <Card variant="outlined" className="max-w-md w-full border-red-200 bg-red-50">
          <CardContent className="py-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Profile not found</h3>
            <p className="text-gray-600 mb-4">{error || 'This profile may have been deleted.'}</p>
            <Link href="/profiles">
              <Button>Back to Profiles</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render step components
  if (currentStep === 'logo-generator') {
    return (
      <div className="min-h-screen mesh-bg pt-8 px-4">
        <LogoGeneratorStep
          businessName={profile.data.name}
          businessType={profile.data.businessType}
          tagline={profile.data.tagline}
          onNext={handleLogoNext}
          onSkip={handleLogoSkip}
          onBack={handleBack}
        />
      </div>
    )
  }

  if (currentStep === 'google-business') {
    return (
      <div className="min-h-screen mesh-bg pt-8 px-4">
        <GoogleBusinessStep
          businessInfo={profile.data}
          onNext={handleGoogleNext}
          onSkip={handleGoogleSkip}
          onBack={handleBack}
        />
      </div>
    )
  }

  if (currentStep === 'social-media') {
    return (
      <div className="min-h-screen mesh-bg pt-8 px-4">
        <SocialMediaStep
          businessInfo={profile.data}
          onNext={handleSocialNext}
          onSkip={handleSocialSkip}
          onBack={handleBack}
        />
      </div>
    )
  }

  if (currentStep === 'update-profiles') {
    return (
      <div className="min-h-screen mesh-bg pt-8 px-4">
        <UpdateProfilesStep
          businessName={profile.data.name}
          onFinish={handleUpdateFinish}
          onSkip={handleUpdateSkip}
          onBack={handleBack}
        />
      </div>
    )
  }

  if (currentStep === 'all-done') {
    return (
      <div className="min-h-screen mesh-bg pt-8 px-4">
        <AllDoneStep
          businessName={profile.data.name}
          onStartOver={handleStartOver}
        />
      </div>
    )
  }

  // Overview (default)
  return (
    <div className="min-h-screen mesh-bg">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/70 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Link
              href="/profiles"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-lg truncate max-w-[200px]">{profile.name}</span>
              </div>
            </div>
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
            {profile.tagline && (
              <p className="text-gray-600">{profile.tagline}</p>
            )}
            <div className="flex items-center justify-center gap-2 mt-3">
              {profile.business_type && (
                <Badge variant="secondary">{profile.business_type}</Badge>
              )}
              {(profile.city || profile.state) && (
                <Badge variant="outline">
                  {[profile.city, profile.state].filter(Boolean).join(', ')}
                </Badge>
              )}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {/* Generate Website - Primary Action */}
            <Card variant="gradient" className="border-2 border-primary-200">
              <CardContent className="py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                      <Rocket className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">Generate Website</h3>
                      <p className="text-sm text-gray-500">Auto-generate with Claude CLI (watcher must be running)</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleGenerateWebsite}
                    disabled={generating}
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Starting...
                      </>
                    ) : (
                      'Generate'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Download Website Data */}
            <Card variant="outlined" hover>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Download className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Download Website Data</h3>
                      <p className="text-sm text-gray-500">Re-download the ZIP with all business data</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleRedownload}>
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Deploy to Vercel */}
            <Card variant="outlined" hover className="border-2 border-orange-200 bg-orange-50/50">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Deploy to Vercel</h3>
                      <p className="text-sm text-gray-500">Copy prompt to deploy via GitHub & Vercel</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleCopyDeployPrompt}
                    className="border-orange-300 hover:bg-orange-100"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2 text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Prompt
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Domain Search */}
            <Card variant="outlined" hover className="border-2 border-teal-200 bg-teal-50/50">
              <CardContent className="py-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                    <Search className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Find a Domain</h3>
                    <p className="text-sm text-gray-500">Search and register a domain for your website</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-xs text-gray-500 font-medium">Suggested domains:</p>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      const baseName = profile.name.toLowerCase().replace(/[^a-z0-9]+/g, '')
                      const shortName = baseName.slice(0, 15)
                      return [
                        `${shortName}.com`,
                        `${shortName}.co`,
                        `${shortName}.io`,
                        `get${shortName}.com`,
                        `${shortName}hq.com`,
                      ].map((domain) => (
                        <span
                          key={domain}
                          className="px-2 py-1 bg-white border border-teal-200 rounded text-sm text-gray-700"
                        >
                          {domain}
                        </span>
                      ))
                    })()}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-teal-300 hover:bg-teal-100"
                    onClick={() => {
                      const searchTerm = profile.name.toLowerCase().replace(/[^a-z0-9]+/g, '')
                      window.open(`https://www.godaddy.com/domainsearch/find?domainToCheck=${searchTerm}`, '_blank')
                    }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Search on GoDaddy
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Logo Generator */}
            <Card variant="outlined" className="border-2 border-purple-200 bg-purple-50/50">
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Palette className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Logo Generator</h3>
                      <p className="text-sm text-gray-500">Create a professional logo for your business</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowLogoDetails(!showLogoDetails)}
                    className="border-purple-300"
                  >
                    {showLogoDetails ? 'Hide Details' : 'View Options'}
                  </Button>
                </div>

                {showLogoDetails && (() => {
                  const businessTypeFormatted = (profile.business_type || 'business').replace(/_/g, ' ')
                  const logoPrompts = [
                    {
                      name: 'Modern Minimalist',
                      prompt: `Create a minimalist, modern logo for "${profile.name}", a ${businessTypeFormatted} business${profile.tagline ? ` with the tagline "${profile.tagline}"` : ''}.

Style Requirements:
- Ultra-clean, minimal design with lots of whitespace
- Simple geometric shapes or single-line icon
- Maximum 2 colors (prefer monochrome with one accent)
- Sans-serif typography, thin or light weight
- Negative space usage for clever visual effect

Aesthetic: Apple/Google-inspired, Silicon Valley tech minimal
Output: SVG-ready, works as small as 16x16 favicon`
                    },
                    {
                      name: 'Bold & Vibrant',
                      prompt: `Design a bold, eye-catching logo for "${profile.name}", a ${businessTypeFormatted} business${profile.tagline ? ` with the tagline "${profile.tagline}"` : ''}.

Style Requirements:
- Strong, confident design that commands attention
- Vibrant color palette (2-3 bold colors)
- Thick, heavy typography with impact
- Dynamic shapes or abstract icon
- High contrast for maximum visibility

Aesthetic: Energetic, confident, memorable, stands out in a crowd
Output: Works great on social media, billboards, merchandise`
                    },
                    {
                      name: 'Elegant & Premium',
                      prompt: `Create an elegant, luxury logo for "${profile.name}", a ${businessTypeFormatted} business${profile.tagline ? ` with the tagline "${profile.tagline}"` : ''}.

Style Requirements:
- Sophisticated, high-end aesthetic
- Serif or elegant script typography
- Gold, black, navy, or deep jewel tones
- Fine lines, subtle details, or monogram style
- Could include a crest, emblem, or refined icon

Aesthetic: Luxury brand, premium service, timeless elegance
Output: Suitable for embossing, foil stamping, premium print`
                    },
                    {
                      name: 'Friendly & Approachable',
                      prompt: `Design a friendly, approachable logo for "${profile.name}", a ${businessTypeFormatted} business${profile.tagline ? ` with the tagline "${profile.tagline}"` : ''}.

Style Requirements:
- Warm, welcoming, and trustworthy feel
- Rounded shapes and soft edges
- Friendly color palette (warm tones, soft blues, greens)
- Rounded sans-serif or casual typography
- Optional: subtle smile, character, or mascot element

Aesthetic: Local business, family-friendly, community-focused
Output: Works well for storefront, uniforms, local advertising`
                    },
                    {
                      name: 'Classic & Professional',
                      prompt: `Create a classic, professional logo for "${profile.name}", a ${businessTypeFormatted} business${profile.tagline ? ` with the tagline "${profile.tagline}"` : ''}.

Style Requirements:
- Timeless design that won't look dated in 10 years
- Traditional color scheme (navy, burgundy, forest green, or classic blue)
- Professional serif or strong sans-serif typography
- Industry-appropriate icon or symbol
- Balanced, symmetrical composition

Aesthetic: Established business, trustworthy, corporate-ready
Output: Versatile for business cards, letterheads, signage, websites`
                    }
                  ]
                  const currentLogoPrompt = logoPrompts[logoPromptIndex]

                  return (
                    <div className="space-y-6">
                      {/* AI Prompt Section */}
                      <div className="p-4 bg-white rounded-lg border border-purple-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-500" />
                            AI Logo Prompt
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              {logoPromptIndex + 1} / {logoPrompts.length}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setLogoPromptIndex((prev) => (prev + 1) % logoPrompts.length)
                                setLogoPromptCopied(false)
                              }}
                              className="border-purple-300 hover:bg-purple-50"
                            >
                              <Shuffle className="w-3 h-3 mr-1" />
                              Next Style
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Copy this prompt and paste it into ChatGPT, DALL-E, or other AI tools
                        </p>
                        <div className="mb-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                            {currentLogoPrompt.name}
                          </span>
                        </div>
                        <div className="relative">
                          <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-700 whitespace-pre-wrap font-mono max-h-48 overflow-y-auto">
                            {currentLogoPrompt.prompt}
                          </pre>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={async () => {
                              await navigator.clipboard.writeText(currentLogoPrompt.prompt)
                              setLogoPromptCopied(true)
                              setTimeout(() => setLogoPromptCopied(false), 2000)
                            }}
                          >
                            {logoPromptCopied ? (
                              <><Check className="w-3 h-3 mr-1 text-green-500" /> Copied</>
                            ) : (
                              <><Copy className="w-3 h-3 mr-1" /> Copy</>
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Logo Tools */}
                      <div className="p-4 bg-white rounded-lg border border-purple-200">
                        <h4 className="font-semibold text-gray-900 mb-3">Logo Design Tools</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <Button
                            variant="outline"
                            className="flex flex-col items-center gap-2 h-auto py-3 hover:border-purple-300"
                            onClick={() => window.open('https://chat.openai.com', '_blank')}
                          >
                            <div className="w-8 h-8 rounded-lg bg-[#10a37f] flex items-center justify-center">
                              <span className="text-white font-bold text-sm">G</span>
                            </div>
                            <span className="text-xs">ChatGPT</span>
                          </Button>
                          <Button
                            variant="outline"
                            className="flex flex-col items-center gap-2 h-auto py-3 hover:border-purple-300"
                            onClick={() => window.open('https://www.canva.com/create/logos/', '_blank')}
                          >
                            <div className="w-8 h-8 rounded-lg bg-[#7d2ae8] flex items-center justify-center">
                              <span className="text-white font-bold text-sm">C</span>
                            </div>
                            <span className="text-xs">Canva</span>
                          </Button>
                          <Button
                            variant="outline"
                            className="flex flex-col items-center gap-2 h-auto py-3 hover:border-purple-300"
                            onClick={() => window.open('https://looka.com/logo-maker', '_blank')}
                          >
                            <div className="w-8 h-8 rounded-lg bg-[#5340ff] flex items-center justify-center">
                              <span className="text-white font-bold text-sm">L</span>
                            </div>
                            <span className="text-xs">Looka</span>
                          </Button>
                          <Button
                            variant="outline"
                            className="flex flex-col items-center gap-2 h-auto py-3 hover:border-purple-300"
                            onClick={() => window.open('https://www.fiverr.com/logo-maker', '_blank')}
                          >
                            <div className="w-8 h-8 rounded-lg bg-[#1dbf73] flex items-center justify-center">
                              <span className="text-white font-bold text-sm">F</span>
                            </div>
                            <span className="text-xs">Fiverr</span>
                          </Button>
                        </div>
                      </div>

                      {/* Tips */}
                      <div className="p-4 bg-purple-100/50 rounded-lg border border-purple-200">
                        <h4 className="font-semibold text-purple-800 mb-2">Tips for a Great Logo</h4>
                        <ul className="text-sm text-purple-700 space-y-1">
                          <li>• Generate multiple variations and pick the best one</li>
                          <li>• Request versions with and without text</li>
                          <li>• Ask for transparent background versions (PNG)</li>
                          <li>• Test how it looks at small sizes (favicon, profile pic)</li>
                          <li>• Get both light and dark background versions</li>
                        </ul>
                      </div>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>

            {/* Business Cards */}
            <Card variant="outlined" className="border-2 border-rose-200 bg-rose-50/50">
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Business Cards</h3>
                      <p className="text-sm text-gray-500">Design and order professional business cards</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowBusinessCardDetails(!showBusinessCardDetails)}
                    className="border-rose-300"
                  >
                    {showBusinessCardDetails ? 'Hide Details' : 'View Options'}
                  </Button>
                </div>

                {showBusinessCardDetails && (
                  <div className="space-y-6">
                    {/* Step 1: Design */}
                    <div className="p-4 bg-white rounded-lg border border-rose-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-rose-500 text-white text-sm flex items-center justify-center">1</span>
                        Design Your Business Card
                      </h4>

                      {/* Logo Reminder */}
                      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm text-amber-800">
                          <strong>⚠️ Have your logo ready first!</strong> Use the Logo Generator section above to create your logo before designing your business card.
                        </p>
                      </div>

                      {/* AI Prompt */}
                      {(() => {
                        const businessCardPrompts = [
                          {
                            name: 'Modern Minimalist',
                            prompt: `Design a modern minimalist business card for "${profile.name}"${profile.tagline ? `, "${profile.tagline}"` : ''}.

Business Type: ${profile.business_type || 'Business'}
${profile.data.phone ? `Phone: ${profile.data.phone}` : ''}
${profile.data.email ? `Email: ${profile.data.email}` : ''}
${profile.data.city && profile.data.state ? `Location: ${profile.data.city}, ${profile.data.state}` : ''}

Style Requirements:
- Ultra-clean design with generous whitespace
- Single accent color with black/white base
- Thin, modern sans-serif typography
- Logo placement on left, info on right
- QR code on back (small, bottom corner)
- Standard size: 3.5" x 2" horizontal

Aesthetic: Apple-inspired, Silicon Valley minimal`
                          },
                          {
                            name: 'Bold & Professional',
                            prompt: `Design a bold, professional business card for "${profile.name}"${profile.tagline ? `, "${profile.tagline}"` : ''}.

Business Type: ${profile.business_type || 'Business'}
${profile.data.phone ? `Phone: ${profile.data.phone}` : ''}
${profile.data.email ? `Email: ${profile.data.email}` : ''}
${profile.data.city && profile.data.state ? `Location: ${profile.data.city}, ${profile.data.state}` : ''}

Style Requirements:
- Strong, confident design that makes an impact
- Bold typography with clear hierarchy
- Dark background with light text (or vice versa)
- Full-bleed color or gradient accent
- Large logo prominently displayed
- QR code on back with call-to-action
- Standard size: 3.5" x 2" horizontal

Aesthetic: Corporate executive, Fortune 500`
                          },
                          {
                            name: 'Creative & Artistic',
                            prompt: `Design a creative, artistic business card for "${profile.name}"${profile.tagline ? `, "${profile.tagline}"` : ''}.

Business Type: ${profile.business_type || 'Business'}
${profile.data.phone ? `Phone: ${profile.data.phone}` : ''}
${profile.data.email ? `Email: ${profile.data.email}` : ''}
${profile.data.city && profile.data.state ? `Location: ${profile.data.city}, ${profile.data.state}` : ''}

Style Requirements:
- Unique, eye-catching design that stands out
- Creative use of shapes, patterns, or illustrations
- Vibrant or unexpected color combinations
- Artistic typography or custom lettering
- Memorable visual element or texture
- QR code integrated creatively into design
- Standard size: 3.5" x 2" horizontal

Aesthetic: Design agency, creative professional`
                          },
                          {
                            name: 'Elegant & Luxury',
                            prompt: `Design an elegant, luxury business card for "${profile.name}"${profile.tagline ? `, "${profile.tagline}"` : ''}.

Business Type: ${profile.business_type || 'Business'}
${profile.data.phone ? `Phone: ${profile.data.phone}` : ''}
${profile.data.email ? `Email: ${profile.data.email}` : ''}
${profile.data.city && profile.data.state ? `Location: ${profile.data.city}, ${profile.data.state}` : ''}

Style Requirements:
- Sophisticated, high-end aesthetic
- Gold, silver, or copper foil accents
- Premium serif or elegant script typography
- Black, navy, or deep jewel tone background
- Embossed or debossed logo effect
- QR code in gold/silver on back
- Standard size: 3.5" x 2" horizontal

Aesthetic: Luxury brand, premium service, high-end clientele`
                          },
                          {
                            name: 'Friendly & Approachable',
                            prompt: `Design a friendly, approachable business card for "${profile.name}"${profile.tagline ? `, "${profile.tagline}"` : ''}.

Business Type: ${profile.business_type || 'Business'}
${profile.data.phone ? `Phone: ${profile.data.phone}` : ''}
${profile.data.email ? `Email: ${profile.data.email}` : ''}
${profile.data.city && profile.data.state ? `Location: ${profile.data.city}, ${profile.data.state}` : ''}

Style Requirements:
- Warm, welcoming design that builds trust
- Rounded corners and soft shapes
- Friendly color palette (warm tones, soft blues)
- Rounded sans-serif typography
- Approachable layout with breathing room
- QR code on back with friendly call-to-action
- Standard size: 3.5" x 2" horizontal

Aesthetic: Local business, family-friendly, community-focused`
                          }
                        ]
                        const currentPrompt = businessCardPrompts[businessCardPromptIndex]

                        return (
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm text-gray-600">Use this prompt with ChatGPT/DALL-E to design your card:</p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">
                                  {businessCardPromptIndex + 1} / {businessCardPrompts.length}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setBusinessCardPromptIndex((prev) => (prev + 1) % businessCardPrompts.length)
                                    setBusinessCardPromptCopied(false)
                                  }}
                                  className="border-rose-300 hover:bg-rose-50"
                                >
                                  <Shuffle className="w-3 h-3 mr-1" />
                                  Next Style
                                </Button>
                              </div>
                            </div>
                            <div className="mb-2">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-rose-100 text-rose-800">
                                {currentPrompt.name}
                              </span>
                            </div>
                            <div className="relative">
                              <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-700 whitespace-pre-wrap font-mono max-h-48 overflow-y-auto">
                                {currentPrompt.prompt}
                              </pre>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={async () => {
                                  await navigator.clipboard.writeText(currentPrompt.prompt)
                                  setBusinessCardPromptCopied(true)
                                  setTimeout(() => setBusinessCardPromptCopied(false), 2000)
                                }}
                              >
                                {businessCardPromptCopied ? (
                                  <><Check className="w-3 h-3 mr-1 text-green-500" /> Copied</>
                                ) : (
                                  <><Copy className="w-3 h-3 mr-1" /> Copy</>
                                )}
                              </Button>
                            </div>
                          </div>
                        )
                      })()}

                      {/* Design Tools */}
                      <p className="text-sm text-gray-600 mb-2">Or use these design tools:</p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open('https://www.logoai.com/design/business-card', '_blank')}
                          className="border-rose-300 text-rose-700 hover:bg-rose-50"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          LogoAI (Recommended)
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open('https://www.canva.com/create/business-cards/', '_blank')}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Canva
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open('https://www.adobe.com/express/create/business-card', '_blank')}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Adobe Express
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open('https://chat.openai.com', '_blank')}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          ChatGPT
                        </Button>
                      </div>
                    </div>

                    {/* What to Include */}
                    <div className="p-4 bg-white rounded-lg border border-rose-200">
                      <h4 className="font-semibold text-gray-900 mb-2">What to Include</h4>
                      <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>Logo (use Logo Generator above)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>Business name & tagline</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>Your name & title</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>Phone number</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>Email address</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>Website URL</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>QR code (use QR Generator above)</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Check className="w-4 h-4" />
                          <span>Address (optional)</span>
                        </div>
                      </div>
                    </div>

                    {/* Step 2: Order */}
                    <div className="p-4 bg-white rounded-lg border border-rose-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-rose-500 text-white text-sm flex items-center justify-center">2</span>
                        Order Your Cards
                      </h4>

                      <div className="grid gap-3">
                        {/* Fastest */}
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-blue-800 text-sm">Fastest - Same Day Pickup</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-300 text-blue-700 hover:bg-blue-100"
                              onClick={() => window.open('https://www.staples.com/services/printing/business-cards', '_blank')}
                            >
                              Staples
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-300 text-blue-700 hover:bg-blue-100"
                              onClick={() => window.open('https://www.fedex.com/en-us/printing/business-cards.html', '_blank')}
                            >
                              FedEx Office
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-300 text-blue-700 hover:bg-blue-100"
                              onClick={() => window.open('https://www.officedepot.com/cm/print-and-copy/business-cards', '_blank')}
                            >
                              Office Depot
                            </Button>
                          </div>
                          <p className="text-xs text-blue-600 mt-2">Pick up in-store within hours</p>
                        </div>

                        {/* Cheapest */}
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="font-semibold text-green-800 text-sm">Cheapest - Starting ~$10 for 500</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-green-300 text-green-700 hover:bg-green-100"
                              onClick={() => window.open('https://www.vistaprint.com/business-cards', '_blank')}
                            >
                              VistaPrint
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-green-300 text-green-700 hover:bg-green-100"
                              onClick={() => window.open('https://www.gotprint.com/products/business-cards.html', '_blank')}
                            >
                              GotPrint
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-green-300 text-green-700 hover:bg-green-100"
                              onClick={() => window.open('https://www.4over4.com/printing/business-cards', '_blank')}
                            >
                              4over4
                            </Button>
                          </div>
                          <p className="text-xs text-green-600 mt-2">Ships in 3-7 business days</p>
                        </div>

                        {/* Best Quality */}
                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Award className="w-4 h-4 text-amber-600" />
                            <span className="font-semibold text-amber-800 text-sm">Best Quality - Premium Cards</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-amber-300 text-amber-700 hover:bg-amber-100"
                              onClick={() => window.open('https://www.moo.com/us/business-cards', '_blank')}
                            >
                              Moo
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-amber-300 text-amber-700 hover:bg-amber-100"
                              onClick={() => window.open('https://www.jukebox.com/us/business-cards', '_blank')}
                            >
                              Jukebox
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-amber-300 text-amber-700 hover:bg-amber-100"
                              onClick={() => window.open('https://www.printingforless.com/business-cards.html', '_blank')}
                            >
                              PrintingForLess
                            </Button>
                          </div>
                          <p className="text-xs text-amber-600 mt-2">Premium paper, unique finishes, luxury feel</p>
                        </div>
                      </div>
                    </div>

                    {/* Tips */}
                    <div className="p-4 bg-rose-100/50 rounded-lg border border-rose-200">
                      <h4 className="font-semibold text-rose-800 mb-2">Pro Tips</h4>
                      <ul className="text-sm text-rose-700 space-y-1">
                        <li>• <strong>Standard size:</strong> 3.5" x 2" (US) or 85mm x 55mm (EU)</li>
                        <li>• <strong>Paper weight:</strong> 14pt or 16pt cardstock recommended</li>
                        <li>• <strong>Finishes:</strong> Matte (professional), Glossy (vibrant), Soft-touch (premium)</li>
                        <li>• <strong>Bleed:</strong> Extend design 0.125" past edges for clean cuts</li>
                        <li>• <strong>Quantity:</strong> Start with 250-500 cards, reorder is easy</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Flyers */}
            <Card variant="outlined" className="border-2 border-cyan-200 bg-cyan-50/50">
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Flyer Design</h3>
                      <p className="text-sm text-gray-500">Create eye-catching promotional flyers</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFlyerDetails(!showFlyerDetails)}
                    className="border-cyan-300"
                  >
                    {showFlyerDetails ? 'Hide Details' : 'View Options'}
                  </Button>
                </div>

                {showFlyerDetails && (
                  <div className="space-y-6">
                    {/* AI Prompt Section */}
                    {(() => {
                      const flyerPrompts = [
                        {
                          name: 'Grand Opening',
                          prompt: `Design a grand opening promotional flyer for "${profile.name}"${profile.tagline ? `, "${profile.tagline}"` : ''}.

Business Type: ${profile.business_type || 'Business'}
${profile.data.phone ? `Phone: ${profile.data.phone}` : ''}
${profile.data.email ? `Email: ${profile.data.email}` : ''}
${profile.data.city && profile.data.state ? `Location: ${profile.data.city}, ${profile.data.state}` : ''}

Flyer Requirements:
- Size: 8.5" x 11" (letter size), print-ready
- Bold "GRAND OPENING" headline at top
- Business name and logo prominently displayed
- Include special opening offer/discount (placeholder)
- Date and time of opening (placeholder)
- Address and contact information
- QR code placeholder for website
- Eye-catching colors that match business type
- Professional but exciting design

Style: Celebratory, exciting, inviting`
                        },
                        {
                          name: 'Special Promotion',
                          prompt: `Design a special promotion/sale flyer for "${profile.name}"${profile.tagline ? `, "${profile.tagline}"` : ''}.

Business Type: ${profile.business_type || 'Business'}
${profile.data.phone ? `Phone: ${profile.data.phone}` : ''}
${profile.data.email ? `Email: ${profile.data.email}` : ''}
${profile.data.city && profile.data.state ? `Location: ${profile.data.city}, ${profile.data.state}` : ''}

Flyer Requirements:
- Size: 8.5" x 11" (letter size), print-ready
- Large discount/offer number (e.g., "20% OFF")
- Clear promotion headline
- Limited time urgency messaging
- Business name and logo
- List 3-4 key services/products
- Terms and conditions area
- Contact info and QR code
- Bold, attention-grabbing colors

Style: Urgent, valuable, action-driving`
                        },
                        {
                          name: 'Services Overview',
                          prompt: `Design a services overview flyer for "${profile.name}"${profile.tagline ? `, "${profile.tagline}"` : ''}.

Business Type: ${profile.business_type || 'Business'}
${profile.data.phone ? `Phone: ${profile.data.phone}` : ''}
${profile.data.email ? `Email: ${profile.data.email}` : ''}
${profile.data.city && profile.data.state ? `Location: ${profile.data.city}, ${profile.data.state}` : ''}

Flyer Requirements:
- Size: 8.5" x 11" (letter size), print-ready
- Professional header with logo and business name
- 4-6 service boxes with icons and descriptions
- Pricing information area (optional)
- Customer testimonial quote area
- Clear call-to-action
- Contact information prominently displayed
- QR code to website/booking
- Clean, organized layout

Style: Professional, informative, trustworthy`
                        },
                        {
                          name: 'Event Announcement',
                          prompt: `Design an event announcement flyer for "${profile.name}"${profile.tagline ? `, "${profile.tagline}"` : ''}.

Business Type: ${profile.business_type || 'Business'}
${profile.data.phone ? `Phone: ${profile.data.phone}` : ''}
${profile.data.email ? `Email: ${profile.data.email}` : ''}
${profile.data.city && profile.data.state ? `Location: ${profile.data.city}, ${profile.data.state}` : ''}

Flyer Requirements:
- Size: 8.5" x 11" (letter size), print-ready
- Large event title/name at top
- Date, time, and location prominently displayed
- Event description/highlights
- Guest speaker or special feature area
- RSVP or registration info
- Business branding (logo, colors)
- Map or directions area
- QR code for registration/more info

Style: Exciting, informative, community-focused`
                        },
                        {
                          name: 'Seasonal/Holiday',
                          prompt: `Design a seasonal/holiday promotional flyer for "${profile.name}"${profile.tagline ? `, "${profile.tagline}"` : ''}.

Business Type: ${profile.business_type || 'Business'}
${profile.data.phone ? `Phone: ${profile.data.phone}` : ''}
${profile.data.email ? `Email: ${profile.data.email}` : ''}
${profile.data.city && profile.data.state ? `Location: ${profile.data.city}, ${profile.data.state}` : ''}

Flyer Requirements:
- Size: 8.5" x 11" (letter size), print-ready
- Seasonal theme (customize for current season)
- Holiday-appropriate graphics and colors
- Special seasonal offer or promotion
- Gift ideas or holiday services
- Extended holiday hours (if applicable)
- Festive but professional design
- Business branding maintained
- Contact info and QR code

Style: Festive, warm, seasonal, inviting`
                        }
                      ]
                      const currentFlyerPrompt = flyerPrompts[flyerPromptIndex]

                      return (
                        <div className="p-4 bg-white rounded-lg border border-cyan-200">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-cyan-500" />
                              AI Flyer Prompt
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">
                                {flyerPromptIndex + 1} / {flyerPrompts.length}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setFlyerPromptIndex((prev) => (prev + 1) % flyerPrompts.length)
                                  setFlyerPromptCopied(false)
                                }}
                                className="border-cyan-300 hover:bg-cyan-50"
                              >
                                <Shuffle className="w-3 h-3 mr-1" />
                                Next Style
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            Copy this prompt and paste it into ChatGPT, DALL-E, or Canva AI
                          </p>
                          <div className="mb-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800">
                              {currentFlyerPrompt.name}
                            </span>
                          </div>
                          <div className="relative">
                            <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-700 whitespace-pre-wrap font-mono max-h-48 overflow-y-auto">
                              {currentFlyerPrompt.prompt}
                            </pre>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={async () => {
                                await navigator.clipboard.writeText(currentFlyerPrompt.prompt)
                                setFlyerPromptCopied(true)
                                setTimeout(() => setFlyerPromptCopied(false), 2000)
                              }}
                            >
                              {flyerPromptCopied ? (
                                <><Check className="w-3 h-3 mr-1 text-green-500" /> Copied</>
                              ) : (
                                <><Copy className="w-3 h-3 mr-1" /> Copy</>
                              )}
                            </Button>
                          </div>
                        </div>
                      )
                    })()}

                    {/* AI Design Tools */}
                    <div className="p-4 bg-white rounded-lg border border-cyan-200">
                      <h4 className="font-semibold text-gray-900 mb-3">AI Flyer Design Tools</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Use AI to generate professional flyers instantly:
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <Button
                          variant="outline"
                          className="flex flex-col items-center gap-2 h-auto py-3 hover:border-cyan-300"
                          onClick={() => window.open('https://chat.openai.com', '_blank')}
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#10a37f] flex items-center justify-center">
                            <span className="text-white font-bold text-sm">G</span>
                          </div>
                          <span className="text-xs">ChatGPT</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="flex flex-col items-center gap-2 h-auto py-3 hover:border-cyan-300"
                          onClick={() => window.open('https://www.canva.com/create/flyers/', '_blank')}
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#7d2ae8] flex items-center justify-center">
                            <span className="text-white font-bold text-sm">C</span>
                          </div>
                          <span className="text-xs">Canva</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="flex flex-col items-center gap-2 h-auto py-3 hover:border-cyan-300"
                          onClick={() => window.open('https://www.adobe.com/express/create/flyer', '_blank')}
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#ff0000] flex items-center justify-center">
                            <span className="text-white font-bold text-sm">A</span>
                          </div>
                          <span className="text-xs">Adobe Express</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="flex flex-col items-center gap-2 h-auto py-3 hover:border-cyan-300"
                          onClick={() => window.open('https://www.visme.co/flyer-maker/', '_blank')}
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#3b82f6] flex items-center justify-center">
                            <span className="text-white font-bold text-sm">V</span>
                          </div>
                          <span className="text-xs">Visme</span>
                        </Button>
                      </div>
                    </div>

                    {/* Printing Services */}
                    <div className="p-4 bg-white rounded-lg border border-cyan-200">
                      <h4 className="font-semibold text-gray-900 mb-3">Print Your Flyers</h4>
                      <div className="space-y-4">
                        {/* Fast Printing */}
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            Fast Printing (Same Day - Next Day)
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-cyan-300 text-cyan-700 hover:bg-cyan-100"
                              onClick={() => window.open('https://www.staples.com/sbd/content/copyandprint/flyers.html', '_blank')}
                            >
                              Staples
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-cyan-300 text-cyan-700 hover:bg-cyan-100"
                              onClick={() => window.open('https://www.fedex.com/en-us/printing/flyers.html', '_blank')}
                            >
                              FedEx
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-cyan-300 text-cyan-700 hover:bg-cyan-100"
                              onClick={() => window.open('https://www.officedepot.com/cm/print-and-copy/flyers', '_blank')}
                            >
                              Office Depot
                            </Button>
                          </div>
                        </div>

                        {/* Affordable Printing */}
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            Affordable Bulk Printing
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-green-300 text-green-700 hover:bg-green-100"
                              onClick={() => window.open('https://www.vistaprint.com/marketing-materials/flyers', '_blank')}
                            >
                              VistaPrint
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-green-300 text-green-700 hover:bg-green-100"
                              onClick={() => window.open('https://www.gotprint.com/products/flyers.html', '_blank')}
                            >
                              GotPrint
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-green-300 text-green-700 hover:bg-green-100"
                              onClick={() => window.open('https://www.48hourprint.com/flyer-printing.html', '_blank')}
                            >
                              48HourPrint
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-green-300 text-green-700 hover:bg-green-100"
                              onClick={() => window.open('https://www.printful.com/custom-flyers', '_blank')}
                            >
                              Printful
                            </Button>
                          </div>
                        </div>

                        {/* Premium Printing */}
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Award className="w-4 h-4 text-amber-500" />
                            Premium Quality
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-amber-300 text-amber-700 hover:bg-amber-100"
                              onClick={() => window.open('https://www.moo.com/us/products/flyers', '_blank')}
                            >
                              Moo
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-amber-300 text-amber-700 hover:bg-amber-100"
                              onClick={() => window.open('https://www.overnightprints.com/flyers', '_blank')}
                            >
                              OvernightPrints
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-amber-300 text-amber-700 hover:bg-amber-100"
                              onClick={() => window.open('https://www.printingforless.com/flyer-printing.html', '_blank')}
                            >
                              PrintingForLess
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tips */}
                    <div className="p-4 bg-cyan-100/50 rounded-lg border border-cyan-200">
                      <h4 className="font-semibold text-cyan-800 mb-2">Pro Tips for Effective Flyers</h4>
                      <ul className="text-sm text-cyan-700 space-y-1">
                        <li>• <strong>One clear message:</strong> Don't overcrowd - focus on one main offer or announcement</li>
                        <li>• <strong>Strong headline:</strong> Grab attention in the first 3 seconds</li>
                        <li>• <strong>Clear call-to-action:</strong> Tell people exactly what to do next</li>
                        <li>• <strong>High-resolution images:</strong> Use 300 DPI for print quality</li>
                        <li>• <strong>Include QR code:</strong> Link to website, booking page, or special offer</li>
                        <li>• <strong>Paper matters:</strong> Glossy for photos, matte for text-heavy designs</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* QR Code Generator */}
            <Card variant="outlined" hover className="border-2 border-violet-200 bg-violet-50/50">
              <CardContent className="py-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">QR Code Generator</h3>
                    <p className="text-sm text-gray-500">Create a QR code for your website</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <input
                    type="url"
                    placeholder="Enter your website URL (e.g., https://example.com)"
                    value={qrUrl}
                    onChange={(e) => {
                      setQrUrl(e.target.value)
                      setQrGenerated(false)
                    }}
                    className="w-full px-3 py-2 border border-violet-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  {qrGenerated && qrUrl && (
                    <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-lg border border-violet-200">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUrl)}`}
                        alt="QR Code"
                        className="w-48 h-48"
                      />
                      <a
                        href={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrUrl)}&format=png`}
                        download={`${profile.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-qrcode.png`}
                        className="text-sm text-violet-600 hover:text-violet-800 underline"
                      >
                        Download QR Code
                      </a>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    className="w-full border-violet-300 hover:bg-violet-100"
                    onClick={() => setQrGenerated(true)}
                    disabled={!qrUrl}
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Generate QR Code
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Social Media Setup */}
            <Card variant="outlined" hover>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <Share2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Social Media Setup</h3>
                      <p className="text-sm text-gray-500">Set up Google Business, social profiles & more</p>
                    </div>
                  </div>
                  <Button onClick={() => setCurrentStep('google-business')}>
                    Start
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* LLC Formation */}
            <Card variant="outlined" className="border-2 border-amber-200 bg-amber-50/50">
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Form an LLC</h3>
                      <p className="text-sm text-gray-500">Protect your business with legal entity status</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowLlcDetails(!showLlcDetails)}
                    className="border-amber-300"
                  >
                    {showLlcDetails ? 'Hide Details' : 'View Options'}
                  </Button>
                </div>

                {showLlcDetails && (
                  <div className="space-y-6">
                    {/* Why LLC */}
                    <div className="p-4 bg-white rounded-lg border border-amber-200">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-amber-600" />
                        Why Form an LLC?
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• <strong>Personal Asset Protection</strong> - Separates personal and business liability</li>
                        <li>• <strong>Tax Flexibility</strong> - Choose how your business is taxed</li>
                        <li>• <strong>Credibility</strong> - Looks more professional to customers</li>
                        <li>• <strong>Easy Management</strong> - Less paperwork than corporations</li>
                      </ul>
                    </div>

                    {/* Formation Services */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Recommended Formation Services</h4>
                      <div className="grid gap-3">
                        {/* ZenBusiness - Recommended */}
                        <div className="p-4 bg-white rounded-lg border-2 border-green-200 relative">
                          <div className="absolute -top-2 left-3 px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded">
                            RECOMMENDED
                          </div>
                          <div className="flex items-start justify-between mt-1">
                            <div>
                              <h5 className="font-semibold text-gray-900">ZenBusiness</h5>
                              <p className="text-xs text-gray-500 mb-2">Best overall value for small businesses</p>
                              <div className="flex flex-wrap gap-2 text-xs">
                                <span className="flex items-center gap-1 text-green-600">
                                  <DollarSign className="w-3 h-3" /> From $0 + state fee
                                </span>
                                <span className="flex items-center gap-1 text-blue-600">
                                  <Clock className="w-3 h-3" /> 1-2 business days
                                </span>
                                <span className="flex items-center gap-1 text-amber-600">
                                  <Star className="w-3 h-3" /> 4.8/5 rating
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-2">Includes: Filing, registered agent (1 yr), operating agreement template</p>
                            </div>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => window.open('https://www.zenbusiness.com/llc/', '_blank')}
                            >
                              Start
                            </Button>
                          </div>
                        </div>

                        {/* Incfile */}
                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="font-semibold text-gray-900">Incfile</h5>
                              <p className="text-xs text-gray-500 mb-2">Best free option (only pay state fees)</p>
                              <div className="flex flex-wrap gap-2 text-xs">
                                <span className="flex items-center gap-1 text-green-600">
                                  <DollarSign className="w-3 h-3" /> $0 + state fee
                                </span>
                                <span className="flex items-center gap-1 text-blue-600">
                                  <Clock className="w-3 h-3" /> 1-3 weeks
                                </span>
                                <span className="flex items-center gap-1 text-amber-600">
                                  <Star className="w-3 h-3" /> 4.7/5 rating
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-2">Includes: Basic filing, 1 year registered agent, digital dashboard</p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open('https://www.incfile.com/form-an-llc/', '_blank')}
                            >
                              Start
                            </Button>
                          </div>
                        </div>

                        {/* LegalZoom */}
                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="font-semibold text-gray-900">LegalZoom</h5>
                              <p className="text-xs text-gray-500 mb-2">Most recognized brand, comprehensive services</p>
                              <div className="flex flex-wrap gap-2 text-xs">
                                <span className="flex items-center gap-1 text-green-600">
                                  <DollarSign className="w-3 h-3" /> From $79 + state fee
                                </span>
                                <span className="flex items-center gap-1 text-blue-600">
                                  <Clock className="w-3 h-3" /> 7-10 business days
                                </span>
                                <span className="flex items-center gap-1 text-amber-600">
                                  <Star className="w-3 h-3" /> 4.5/5 rating
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-2">Includes: Name search, filing, compliance calendar</p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open('https://www.legalzoom.com/business/business-formation/llc-overview.html', '_blank')}
                            >
                              Start
                            </Button>
                          </div>
                        </div>

                        {/* Northwest */}
                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="font-semibold text-gray-900">Northwest Registered Agent</h5>
                              <p className="text-xs text-gray-500 mb-2">Best for privacy & registered agent service</p>
                              <div className="flex flex-wrap gap-2 text-xs">
                                <span className="flex items-center gap-1 text-green-600">
                                  <DollarSign className="w-3 h-3" /> $39 + state fee
                                </span>
                                <span className="flex items-center gap-1 text-blue-600">
                                  <Clock className="w-3 h-3" /> Same day - 2 weeks
                                </span>
                                <span className="flex items-center gap-1 text-amber-600">
                                  <Star className="w-3 h-3" /> 4.9/5 rating
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-2">Includes: Filing, free year of registered agent, privacy protection</p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open('https://www.northwestregisteredagent.com/llc', '_blank')}
                            >
                              Start
                            </Button>
                          </div>
                        </div>

                        {/* Rocket Lawyer */}
                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="font-semibold text-gray-900">Rocket Lawyer</h5>
                              <p className="text-xs text-gray-500 mb-2">Best for ongoing legal support</p>
                              <div className="flex flex-wrap gap-2 text-xs">
                                <span className="flex items-center gap-1 text-green-600">
                                  <DollarSign className="w-3 h-3" /> $99 + state fee
                                </span>
                                <span className="flex items-center gap-1 text-blue-600">
                                  <Clock className="w-3 h-3" /> 5-7 business days
                                </span>
                                <span className="flex items-center gap-1 text-amber-600">
                                  <Star className="w-3 h-3" /> 4.6/5 rating
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-2">Includes: Filing, operating agreement, attorney consultations</p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open('https://www.rocketlawyer.com/business-and-contracts/starting-a-business/form-an-llc', '_blank')}
                            >
                              Start
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Steps */}
                    <div className="p-4 bg-white rounded-lg border border-amber-200">
                      <h4 className="font-semibold text-gray-900 mb-3">Steps to Form an LLC</h4>
                      <ol className="text-sm text-gray-600 space-y-2">
                        <li className="flex gap-2">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center justify-center font-medium">1</span>
                          <span><strong>Choose your state</strong> - Usually where you do business (state fees: $50-$500)</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center justify-center font-medium">2</span>
                          <span><strong>Name your LLC</strong> - Must be unique in your state, end with "LLC"</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center justify-center font-medium">3</span>
                          <span><strong>Choose a Registered Agent</strong> - Required in all states (person/service to receive legal mail)</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center justify-center font-medium">4</span>
                          <span><strong>File Articles of Organization</strong> - Main formation document filed with state</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center justify-center font-medium">5</span>
                          <span><strong>Create Operating Agreement</strong> - Internal document outlining ownership & rules</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center justify-center font-medium">6</span>
                          <span><strong>Get EIN from IRS</strong> - Free tax ID number for your business (like SSN for business)</span>
                        </li>
                      </ol>
                    </div>

                    {/* Additional Tips */}
                    <div className="p-4 bg-amber-100/50 rounded-lg border border-amber-200">
                      <h4 className="font-semibold text-amber-800 mb-2">Pro Tips</h4>
                      <ul className="text-sm text-amber-700 space-y-1">
                        <li>• Get your <strong>EIN for free</strong> at <a href="https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online" target="_blank" rel="noopener noreferrer" className="underline">IRS.gov</a> - don't pay a service for this</li>
                        <li>• Open a <strong>business bank account</strong> after getting your EIN</li>
                        <li>• Consider <strong>business insurance</strong> even with LLC protection</li>
                        <li>• Keep business and personal finances <strong>completely separate</strong></li>
                        <li>• Some states (like California) have <strong>annual fees</strong> - check before filing</li>
                      </ul>
                    </div>

                    {/* DIY Option */}
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500">
                        <strong>DIY Option:</strong> You can file directly with your state's Secretary of State website to save money.
                        <a
                          href="https://www.usa.gov/state-business"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-600 hover:text-amber-800 underline ml-1"
                        >
                          Find your state's business portal →
                        </a>
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

          </motion.div>
        </div>
      </main>
    </div>
  )
}
