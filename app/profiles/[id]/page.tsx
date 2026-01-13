'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Building2, Loader2, AlertCircle, Download, Palette, Share2, CheckCircle2, Rocket } from 'lucide-react'
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

            {/* Re-download */}
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

            {/* Logo Generator */}
            <Card variant="outlined" hover>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Palette className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Logo Generator</h3>
                      <p className="text-sm text-gray-500">Create a logo for your business</p>
                    </div>
                  </div>
                  <Button onClick={() => setCurrentStep('logo-generator')}>
                    Start
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

            {/* Full Setup Flow */}
            <Card variant="gradient" className="mt-8">
              <CardContent className="py-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Complete Setup Wizard</h3>
                    <p className="text-sm text-gray-500">Go through all steps: Logo, Google Business, Social Media</p>
                  </div>
                </div>
                <Button className="w-full" onClick={() => setCurrentStep('logo-generator')}>
                  Start Complete Setup
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
