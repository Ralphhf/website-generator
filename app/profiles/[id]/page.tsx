'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Building2, Loader2, AlertCircle, Download, Palette, Share2, CheckCircle2, Rocket, Globe, Copy, Check, Search, ExternalLink, QrCode, Briefcase, Star, DollarSign, Clock, Shield, CreditCard, Zap, Award, Shuffle, Sparkles, FileText, Square, CheckSquare, Mail, PenTool, CalendarDays, Bell, Users, Smartphone, Send, ChevronDown, Settings, MapPin, Camera, ShoppingBag, Home, Utensils, Stethoscope, Dumbbell, Car, Scissors, GraduationCap, Mic, MicOff, ChevronRight, RotateCcw, Megaphone, Image, Video, Facebook, Instagram, Youtube, Play } from 'lucide-react'
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
  completed_sections: string[]
  meeting_transcript: string | null
  meeting_summary: string | null
  meeting_recorded_at: string | null
  created_at: string
  updated_at: string
}

type SectionId = 'generate' | 'download' | 'deploy' | 'domain' | 'logo' | 'business-cards' | 'flyers' | 'qr-code' | 'business-email' | 'email-signature' | 'social-media' | 'appointment-booking' | 'ios-app' | 'ad-creation' | 'meeting-recording' | 'llc' | 'client-outreach'

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
  const [showEmailSetupDetails, setShowEmailSetupDetails] = useState(false)
  const [showEmailSignatureDetails, setShowEmailSignatureDetails] = useState(false)
  const [emailSignaturePromptIndex, setEmailSignaturePromptIndex] = useState(0)
  const [emailSignaturePromptCopied, setEmailSignaturePromptCopied] = useState(false)
  const [showBookingDetails, setShowBookingDetails] = useState(false)
  const [showOutreachDetails, setShowOutreachDetails] = useState(false)
  const [clientWebsiteUrl, setClientWebsiteUrl] = useState('')
  const [outreachMessageCopied, setOutreachMessageCopied] = useState(false)
  const [showIosAppDetails, setShowIosAppDetails] = useState(false)
  const [iosAppCategory, setIosAppCategory] = useState<string>('')
  const [iosAppEnablePayments, setIosAppEnablePayments] = useState(false)
  const [iosAppEnableNotifications, setIosAppEnableNotifications] = useState(true)
  const [iosAppPrimaryColor, setIosAppPrimaryColor] = useState('#3B82F6')
  const [iosAppSpecialFeatures, setIosAppSpecialFeatures] = useState('')
  const [iosAppPromptCopied, setIosAppPromptCopied] = useState(false)
  const [showAdCreationDetails, setShowAdCreationDetails] = useState(false)
  const [adCreationTab, setAdCreationTab] = useState<'image' | 'video'>('image')
  const [adPlatform, setAdPlatform] = useState<string>('facebook')
  const [adPromptCopied, setAdPromptCopied] = useState<string | null>(null)
  const [showMeetingDetails, setShowMeetingDetails] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [meetingTranscript, setMeetingTranscript] = useState<string | null>(null)
  const [meetingSummary, setMeetingSummary] = useState<string | null>(null)
  const [meetingRecordedAt, setMeetingRecordedAt] = useState<string | null>(null)
  const [showTranscript, setShowTranscript] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [recordingError, setRecordingError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (params.id) {
      fetchProfile(params.id as string)
    }
  }, [params.id])

  // Load completed sections when profile loads
  useEffect(() => {
    if (profile?.completed_sections) {
      setCompletedSections(new Set(profile.completed_sections))
    }
  }, [profile])

  // Load meeting data when profile loads
  useEffect(() => {
    if (profile) {
      setMeetingTranscript(profile.meeting_transcript)
      setMeetingSummary(profile.meeting_summary)
      setMeetingRecordedAt(profile.meeting_recorded_at)
    }
  }, [profile])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const toggleSectionComplete = async (sectionId: SectionId) => {
    if (!profile) return

    const newCompleted = new Set(completedSections)
    if (newCompleted.has(sectionId)) {
      newCompleted.delete(sectionId)
    } else {
      newCompleted.add(sectionId)
    }

    setCompletedSections(newCompleted)

    // Save to database
    try {
      await fetch(`/api/profiles/${profile.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed_sections: Array.from(newCompleted)
        })
      })
    } catch (err) {
      console.error('Failed to save completion state:', err)
    }
  }

  const isSectionComplete = (sectionId: SectionId) => completedSections.has(sectionId)

  // Recording functions
  const startRecording = async () => {
    try {
      setRecordingError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })

      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())

        // Process the recording
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        await processRecording(audioBlob)
      }

      mediaRecorder.start(1000) // Collect data every second
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (err) {
      console.error('Error starting recording:', err)
      setRecordingError('Could not access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const processRecording = async (audioBlob: Blob) => {
    if (!profile) return

    setIsProcessing(true)
    setRecordingError(null)

    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')
      formData.append('profileId', profile.id)
      formData.append('businessName', profile.name)

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process recording')
      }

      setMeetingTranscript(data.transcript)
      setMeetingSummary(data.summary)
      setMeetingRecordedAt(data.recorded_at)

      // Auto-expand summary after processing
      setShowSummary(true)

    } catch (err) {
      console.error('Error processing recording:', err)
      setRecordingError(err instanceof Error ? err.message : 'Failed to process recording')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

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
            <Card variant="gradient" className={`border-2 ${isSectionComplete('generate') ? 'border-green-300 bg-green-50/30' : 'border-primary-200'}`}>
              <CardContent className="py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSectionComplete('generate')}
                      className="flex-shrink-0 hover:scale-110 transition-transform"
                      title={isSectionComplete('generate') ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {isSectionComplete('generate') ? (
                        <CheckSquare className="w-6 h-6 text-green-500" />
                      ) : (
                        <Square className="w-6 h-6 text-gray-300 hover:text-gray-400" />
                      )}
                    </button>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                      <Rocket className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg ${isSectionComplete('generate') ? 'text-green-700 line-through' : 'text-gray-900'}`}>Generate Website</h3>
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
            <Card variant="outlined" hover className={isSectionComplete('download') ? 'border-green-300 bg-green-50/30' : ''}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSectionComplete('download')}
                      className="flex-shrink-0 hover:scale-110 transition-transform"
                      title={isSectionComplete('download') ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {isSectionComplete('download') ? (
                        <CheckSquare className="w-5 h-5 text-green-500" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-300 hover:text-gray-400" />
                      )}
                    </button>
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Download className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isSectionComplete('download') ? 'text-green-700 line-through' : 'text-gray-900'}`}>Download Website Data</h3>
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
            <Card variant="outlined" hover className={`border-2 ${isSectionComplete('deploy') ? 'border-green-300 bg-green-50/30' : 'border-orange-200 bg-orange-50/50'}`}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSectionComplete('deploy')}
                      className="flex-shrink-0 hover:scale-110 transition-transform"
                      title={isSectionComplete('deploy') ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {isSectionComplete('deploy') ? (
                        <CheckSquare className="w-5 h-5 text-green-500" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-300 hover:text-gray-400" />
                      )}
                    </button>
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isSectionComplete('deploy') ? 'text-green-700 line-through' : 'text-gray-900'}`}>Deploy to Vercel</h3>
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
            <Card variant="outlined" hover className={`border-2 ${isSectionComplete('domain') ? 'border-green-300 bg-green-50/30' : 'border-teal-200 bg-teal-50/50'}`}>
              <CardContent className="py-4">
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={() => toggleSectionComplete('domain')}
                    className="flex-shrink-0 hover:scale-110 transition-transform"
                    title={isSectionComplete('domain') ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {isSectionComplete('domain') ? (
                      <CheckSquare className="w-5 h-5 text-green-500" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-300 hover:text-gray-400" />
                    )}
                  </button>
                  <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                    <Search className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isSectionComplete('domain') ? 'text-green-700 line-through' : 'text-gray-900'}`}>Find a Domain</h3>
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
            <Card variant="outlined" className={`border-2 ${isSectionComplete('logo') ? 'border-green-300 bg-green-50/30' : 'border-purple-200 bg-purple-50/50'}`}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSectionComplete('logo')}
                      className="flex-shrink-0 hover:scale-110 transition-transform"
                      title={isSectionComplete('logo') ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {isSectionComplete('logo') ? (
                        <CheckSquare className="w-5 h-5 text-green-500" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-300 hover:text-gray-400" />
                      )}
                    </button>
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Palette className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isSectionComplete('logo') ? 'text-green-700 line-through' : 'text-gray-900'}`}>Logo Generator</h3>
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
            <Card variant="outlined" className={`border-2 ${isSectionComplete('business-cards') ? 'border-green-300 bg-green-50/30' : 'border-rose-200 bg-rose-50/50'}`}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSectionComplete('business-cards')}
                      className="flex-shrink-0 hover:scale-110 transition-transform"
                      title={isSectionComplete('business-cards') ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {isSectionComplete('business-cards') ? (
                        <CheckSquare className="w-5 h-5 text-green-500" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-300 hover:text-gray-400" />
                      )}
                    </button>
                    <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isSectionComplete('business-cards') ? 'text-green-700 line-through' : 'text-gray-900'}`}>Business Cards</h3>
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
            <Card variant="outlined" className={`border-2 ${isSectionComplete('flyers') ? 'border-green-300 bg-green-50/30' : 'border-cyan-200 bg-cyan-50/50'}`}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSectionComplete('flyers')}
                      className="flex-shrink-0 hover:scale-110 transition-transform"
                      title={isSectionComplete('flyers') ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {isSectionComplete('flyers') ? (
                        <CheckSquare className="w-5 h-5 text-green-500" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-300 hover:text-gray-400" />
                      )}
                    </button>
                    <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isSectionComplete('flyers') ? 'text-green-700 line-through' : 'text-gray-900'}`}>Flyer Design</h3>
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
            <Card variant="outlined" hover className={`border-2 ${isSectionComplete('qr-code') ? 'border-green-300 bg-green-50/30' : 'border-violet-200 bg-violet-50/50'}`}>
              <CardContent className="py-4">
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={() => toggleSectionComplete('qr-code')}
                    className="flex-shrink-0 hover:scale-110 transition-transform"
                    title={isSectionComplete('qr-code') ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {isSectionComplete('qr-code') ? (
                      <CheckSquare className="w-5 h-5 text-green-500" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-300 hover:text-gray-400" />
                    )}
                  </button>
                  <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isSectionComplete('qr-code') ? 'text-green-700 line-through' : 'text-gray-900'}`}>QR Code Generator</h3>
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

            {/* Business Email Setup */}
            <Card variant="outlined" className={`border-2 ${isSectionComplete('business-email') ? 'border-green-300 bg-green-50/30' : 'border-sky-200 bg-sky-50/50'}`}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSectionComplete('business-email')}
                      className="flex-shrink-0 hover:scale-110 transition-transform"
                      title={isSectionComplete('business-email') ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {isSectionComplete('business-email') ? (
                        <CheckSquare className="w-5 h-5 text-green-500" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-300 hover:text-gray-400" />
                      )}
                    </button>
                    <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isSectionComplete('business-email') ? 'text-green-700 line-through' : 'text-gray-900'}`}>Business Email Setup</h3>
                      <p className="text-sm text-gray-500">Get a professional email address for your business</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEmailSetupDetails(!showEmailSetupDetails)}
                    className="border-sky-300"
                  >
                    {showEmailSetupDetails ? 'Hide Details' : 'View Options'}
                  </Button>
                </div>

                {showEmailSetupDetails && (
                  <div className="space-y-6">
                    {/* Free Email Options */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">FREE</span>
                        Free Email Options
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Don't need a custom domain? These free options work great for getting started.
                      </p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {/* Gmail */}
                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="font-semibold text-gray-900">Gmail</h5>
                              <p className="text-xs text-gray-500 mb-2">Google's free email service</p>
                              <ul className="text-xs text-gray-500 space-y-1">
                                <li>• 15GB free storage</li>
                                <li>• Best spam protection</li>
                                <li>• Great mobile app</li>
                              </ul>
                              <p className="text-xs text-gray-400 mt-2">Tip: Use {profile.name.toLowerCase().replace(/[^a-z0-9]+/g, '')}@gmail.com</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open('https://accounts.google.com/signup', '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Sign Up
                            </Button>
                          </div>
                        </div>

                        {/* Outlook.com */}
                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="font-semibold text-gray-900">Outlook.com</h5>
                              <p className="text-xs text-gray-500 mb-2">Microsoft's free email</p>
                              <ul className="text-xs text-gray-500 space-y-1">
                                <li>• 15GB free storage</li>
                                <li>• Clean interface</li>
                                <li>• Office online free</li>
                              </ul>
                              <p className="text-xs text-gray-400 mt-2">Also: @hotmail.com, @live.com</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open('https://outlook.live.com/owa/?nlp=1&signup=1', '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Sign Up
                            </Button>
                          </div>
                        </div>

                        {/* Yahoo Mail */}
                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="font-semibold text-gray-900">Yahoo Mail</h5>
                              <p className="text-xs text-gray-500 mb-2">Classic free email</p>
                              <ul className="text-xs text-gray-500 space-y-1">
                                <li>• 1TB free storage</li>
                                <li>• Disposable addresses</li>
                                <li>• News integration</li>
                              </ul>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open('https://login.yahoo.com/account/create', '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Sign Up
                            </Button>
                          </div>
                        </div>

                        {/* ProtonMail Free */}
                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="font-semibold text-gray-900">Proton Mail</h5>
                              <p className="text-xs text-gray-500 mb-2">Privacy-focused free email</p>
                              <ul className="text-xs text-gray-500 space-y-1">
                                <li>• 1GB free storage</li>
                                <li>• End-to-end encrypted</li>
                                <li>• No ads, no tracking</li>
                              </ul>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open('https://proton.me/mail', '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Sign Up
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-sky-50 text-gray-500">or upgrade to a professional email</span>
                      </div>
                    </div>

                    {/* Why Business Email */}
                    <div className="p-4 bg-white rounded-lg border border-sky-200">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-sky-600" />
                        Why Upgrade to a Business Email?
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• <strong>Professionalism</strong> - yourname@{profile.name.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com looks better than gmail</li>
                        <li>• <strong>Brand Recognition</strong> - Every email reinforces your brand</li>
                        <li>• <strong>Trust & Credibility</strong> - Customers trust professional email addresses</li>
                        <li>• <strong>Security</strong> - Better spam protection and admin controls</li>
                      </ul>
                    </div>

                    {/* Email Provider Options */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Business Email Providers</h4>
                      <div className="grid gap-3">
                        {/* Google Workspace - Recommended */}
                        <div className="p-4 bg-white rounded-lg border-2 border-green-200 relative">
                          <div className="absolute -top-2 left-3 px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded">
                            RECOMMENDED
                          </div>
                          <div className="flex items-start justify-between mt-1">
                            <div>
                              <h5 className="font-semibold text-gray-900">Google Workspace</h5>
                              <p className="text-xs text-gray-500 mb-2">Professional email powered by Gmail</p>
                              <div className="flex flex-wrap gap-2 text-xs">
                                <span className="flex items-center gap-1 text-gray-600">
                                  <DollarSign className="w-3 h-3" />
                                  From $6/user/month
                                </span>
                                <span className="flex items-center gap-1 text-gray-600">
                                  <Zap className="w-3 h-3" />
                                  Gmail interface
                                </span>
                              </div>
                              <ul className="text-xs text-gray-500 mt-2 space-y-1">
                                <li>• 30GB storage per user</li>
                                <li>• Google Meet, Drive, Docs included</li>
                                <li>• Excellent mobile apps</li>
                              </ul>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-green-300 hover:bg-green-50"
                              onClick={() => window.open('https://workspace.google.com/business/signup/welcome', '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Sign Up
                            </Button>
                          </div>
                        </div>

                        {/* Microsoft 365 */}
                        <div className="p-4 bg-white rounded-lg border border-sky-200">
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="font-semibold text-gray-900">Microsoft 365 Business</h5>
                              <p className="text-xs text-gray-500 mb-2">Outlook email with Office apps</p>
                              <div className="flex flex-wrap gap-2 text-xs">
                                <span className="flex items-center gap-1 text-gray-600">
                                  <DollarSign className="w-3 h-3" />
                                  From $6/user/month
                                </span>
                                <span className="flex items-center gap-1 text-gray-600">
                                  <Zap className="w-3 h-3" />
                                  Outlook interface
                                </span>
                              </div>
                              <ul className="text-xs text-gray-500 mt-2 space-y-1">
                                <li>• 50GB mailbox per user</li>
                                <li>• Word, Excel, PowerPoint included</li>
                                <li>• Best for Microsoft users</li>
                              </ul>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-sky-300"
                              onClick={() => window.open('https://www.microsoft.com/en-us/microsoft-365/business/compare-all-microsoft-365-products', '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Sign Up
                            </Button>
                          </div>
                        </div>

                        {/* Zoho Mail */}
                        <div className="p-4 bg-white rounded-lg border border-sky-200">
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="font-semibold text-gray-900">Zoho Mail</h5>
                              <p className="text-xs text-gray-500 mb-2">Affordable business email solution</p>
                              <div className="flex flex-wrap gap-2 text-xs">
                                <span className="flex items-center gap-1 text-gray-600">
                                  <DollarSign className="w-3 h-3" />
                                  From $1/user/month
                                </span>
                                <span className="flex items-center gap-1 text-green-600">
                                  <Zap className="w-3 h-3" />
                                  Free tier available
                                </span>
                              </div>
                              <ul className="text-xs text-gray-500 mt-2 space-y-1">
                                <li>• Free for up to 5 users</li>
                                <li>• Clean, ad-free interface</li>
                                <li>• Great for budget-conscious businesses</li>
                              </ul>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-sky-300"
                              onClick={() => window.open('https://www.zoho.com/mail/zohomail-pricing.html', '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Sign Up
                            </Button>
                          </div>
                        </div>

                        {/* ProtonMail */}
                        <div className="p-4 bg-white rounded-lg border border-sky-200">
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="font-semibold text-gray-900">Proton Mail Business</h5>
                              <p className="text-xs text-gray-500 mb-2">Privacy-focused encrypted email</p>
                              <div className="flex flex-wrap gap-2 text-xs">
                                <span className="flex items-center gap-1 text-gray-600">
                                  <DollarSign className="w-3 h-3" />
                                  From $8/user/month
                                </span>
                                <span className="flex items-center gap-1 text-gray-600">
                                  <Shield className="w-3 h-3" />
                                  End-to-end encryption
                                </span>
                              </div>
                              <ul className="text-xs text-gray-500 mt-2 space-y-1">
                                <li>• Swiss privacy laws</li>
                                <li>• Zero-access encryption</li>
                                <li>• Best for privacy-sensitive businesses</li>
                              </ul>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-sky-300"
                              onClick={() => window.open('https://proton.me/business', '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Sign Up
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Setup Steps */}
                    <div className="p-4 bg-sky-50 rounded-lg border border-sky-200">
                      <h4 className="font-semibold text-sky-900 mb-2">Setup Steps</h4>
                      <ol className="text-sm text-sky-800 space-y-1 list-decimal list-inside">
                        <li>Choose an email provider above</li>
                        <li>Purchase or verify ownership of your domain</li>
                        <li>Follow provider's DNS setup instructions (MX records)</li>
                        <li>Create email addresses (info@, contact@, yourname@)</li>
                        <li>Set up email clients on your devices</li>
                      </ol>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Email Signature Generator */}
            <Card variant="outlined" className={`border-2 ${isSectionComplete('email-signature') ? 'border-green-300 bg-green-50/30' : 'border-cyan-200 bg-cyan-50/50'}`}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSectionComplete('email-signature')}
                      className="flex-shrink-0 hover:scale-110 transition-transform"
                      title={isSectionComplete('email-signature') ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {isSectionComplete('email-signature') ? (
                        <CheckSquare className="w-5 h-5 text-green-500" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-300 hover:text-gray-400" />
                      )}
                    </button>
                    <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                      <PenTool className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isSectionComplete('email-signature') ? 'text-green-700 line-through' : 'text-gray-900'}`}>Email Signature Generator</h3>
                      <p className="text-sm text-gray-500">Create a professional email signature</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEmailSignatureDetails(!showEmailSignatureDetails)}
                    className="border-cyan-300"
                  >
                    {showEmailSignatureDetails ? 'Hide Details' : 'View Options'}
                  </Button>
                </div>

                {showEmailSignatureDetails && (() => {
                  const emailSignaturePrompts = [
                    {
                      name: 'Professional Corporate',
                      prompt: `Create a professional HTML email signature for:

Business: ${profile.name}
${profile.data.email ? `Email: ${profile.data.email}` : ''}
${profile.data.phone ? `Phone: ${profile.data.phone}` : ''}
${profile.data.city && profile.data.state ? `Location: ${profile.data.city}, ${profile.data.state}` : ''}
${profile.tagline ? `Tagline: ${profile.tagline}` : ''}

Style Requirements:
- Clean, corporate design with clear hierarchy
- Company name in bold, professional font
- Contact info in organized rows with icons
- Subtle divider line between sections
- Color scheme: Navy blue (#1e3a5f) and gray
- Include social media icons if applicable
- Mobile-responsive width (max 600px)

Output: Clean HTML code ready to paste into email settings`
                    },
                    {
                      name: 'Modern Minimalist',
                      prompt: `Design a minimalist HTML email signature for:

Business: ${profile.name}
${profile.data.email ? `Email: ${profile.data.email}` : ''}
${profile.data.phone ? `Phone: ${profile.data.phone}` : ''}
${profile.data.city && profile.data.state ? `Location: ${profile.data.city}, ${profile.data.state}` : ''}
${profile.tagline ? `Tagline: ${profile.tagline}` : ''}

Style Requirements:
- Ultra-minimal design with maximum whitespace
- Single accent color line or element
- Typography-focused, no unnecessary graphics
- Thin, light fonts
- Contact info on single line with pipe separators
- No borders or boxes, just clean text
- Monochrome with one brand color accent

Output: Lightweight HTML that works in all email clients`
                    },
                    {
                      name: 'Creative & Bold',
                      prompt: `Create a bold, eye-catching HTML email signature for:

Business: ${profile.name}
${profile.data.email ? `Email: ${profile.data.email}` : ''}
${profile.data.phone ? `Phone: ${profile.data.phone}` : ''}
${profile.data.city && profile.data.state ? `Location: ${profile.data.city}, ${profile.data.state}` : ''}
${profile.tagline ? `Tagline: ${profile.tagline}` : ''}

Style Requirements:
- Bold, creative design that stands out
- Gradient accent or colorful banner element
- Strong typography with impact
- Rounded corners and modern feel
- Vibrant brand colors
- Interactive-looking social icons
- Includes a short tagline or call-to-action

Output: HTML email signature with inline styles`
                    },
                    {
                      name: 'Elegant Luxury',
                      prompt: `Design an elegant, premium HTML email signature for:

Business: ${profile.name}
${profile.data.email ? `Email: ${profile.data.email}` : ''}
${profile.data.phone ? `Phone: ${profile.data.phone}` : ''}
${profile.data.city && profile.data.state ? `Location: ${profile.data.city}, ${profile.data.state}` : ''}
${profile.tagline ? `Tagline: ${profile.tagline}` : ''}

Style Requirements:
- Sophisticated, luxury aesthetic
- Serif fonts for elegance
- Gold (#c9a962) or rose gold accents on dark background
- Refined spacing and typography
- Subtle decorative elements (thin lines, small icons)
- Name styled as if on business card
- Premium, high-end feel

Output: Elegant HTML signature suitable for luxury businesses`
                    },
                    {
                      name: 'Friendly & Approachable',
                      prompt: `Create a warm, friendly HTML email signature for:

Business: ${profile.name}
${profile.data.email ? `Email: ${profile.data.email}` : ''}
${profile.data.phone ? `Phone: ${profile.data.phone}` : ''}
${profile.data.city && profile.data.state ? `Location: ${profile.data.city}, ${profile.data.state}` : ''}
${profile.tagline ? `Tagline: ${profile.tagline}` : ''}

Style Requirements:
- Warm, welcoming design
- Rounded elements and soft corners
- Friendly colors (warm oranges, soft blues, greens)
- Casual but professional font choices
- Space for small headshot or logo placeholder
- Includes a friendly sign-off phrase
- Inviting call-to-action button style

Output: HTML signature perfect for service businesses and local shops`
                    }
                  ]

                  const currentEmailPrompt = emailSignaturePrompts[emailSignaturePromptIndex]

                  const copyEmailPrompt = async () => {
                    try {
                      await navigator.clipboard.writeText(currentEmailPrompt.prompt)
                      setEmailSignaturePromptCopied(true)
                      setTimeout(() => setEmailSignaturePromptCopied(false), 2000)
                    } catch (err) {
                      console.error('Failed to copy:', err)
                    }
                  }

                  return (
                    <div className="space-y-6">
                      {/* AI Prompt Section */}
                      <div className="p-4 bg-white rounded-lg border border-cyan-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-cyan-600" />
                            <h4 className="font-semibold text-gray-900">AI Signature Prompt</h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              {emailSignaturePromptIndex + 1} / {emailSignaturePrompts.length}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEmailSignaturePromptIndex((prev) => (prev + 1) % emailSignaturePrompts.length)
                                setEmailSignaturePromptCopied(false)
                              }}
                              className="border-cyan-300 hover:bg-cyan-50"
                            >
                              <Shuffle className="w-4 h-4 mr-1" />
                              Next Style
                            </Button>
                          </div>
                        </div>
                        <div className="mb-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800">
                            {currentEmailPrompt.name}
                          </span>
                        </div>
                        <div className="relative">
                          <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-700 whitespace-pre-wrap font-mono max-h-48 overflow-y-auto">
                            {currentEmailPrompt.prompt}
                          </pre>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={copyEmailPrompt}
                            className="absolute top-2 right-2"
                          >
                            {emailSignaturePromptCopied ? (
                              <>
                                <Check className="w-3 h-3 mr-1 text-green-500" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 mr-1" />
                                Copy
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Signature Generator Tools */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Signature Generator Tools</h4>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div className="p-4 bg-white rounded-lg border border-cyan-200">
                            <div className="flex items-start justify-between">
                              <div>
                                <h5 className="font-semibold text-gray-900">HubSpot Signature Generator</h5>
                                <p className="text-xs text-gray-500 mb-2">Free, easy-to-use generator</p>
                                <span className="text-xs text-green-600 font-medium">FREE</span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-cyan-300"
                                onClick={() => window.open('https://www.hubspot.com/email-signature-generator', '_blank')}
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Open
                              </Button>
                            </div>
                          </div>

                          <div className="p-4 bg-white rounded-lg border border-cyan-200">
                            <div className="flex items-start justify-between">
                              <div>
                                <h5 className="font-semibold text-gray-900">WiseStamp</h5>
                                <p className="text-xs text-gray-500 mb-2">Professional templates</p>
                                <span className="text-xs text-gray-600 font-medium">Free & Paid</span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-cyan-300"
                                onClick={() => window.open('https://www.wisestamp.com/signature-generator/', '_blank')}
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Open
                              </Button>
                            </div>
                          </div>

                          <div className="p-4 bg-white rounded-lg border border-cyan-200">
                            <div className="flex items-start justify-between">
                              <div>
                                <h5 className="font-semibold text-gray-900">MySignature</h5>
                                <p className="text-xs text-gray-500 mb-2">Modern signature templates</p>
                                <span className="text-xs text-green-600 font-medium">FREE</span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-cyan-300"
                                onClick={() => window.open('https://mysignature.io/', '_blank')}
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Open
                              </Button>
                            </div>
                          </div>

                          <div className="p-4 bg-white rounded-lg border border-cyan-200">
                            <div className="flex items-start justify-between">
                              <div>
                                <h5 className="font-semibold text-gray-900">ChatGPT</h5>
                                <p className="text-xs text-gray-500 mb-2">Generate custom HTML code</p>
                                <span className="text-xs text-gray-600 font-medium">Use prompt above</span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-cyan-300"
                                onClick={() => window.open('https://chat.openai.com/', '_blank')}
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Open
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tips */}
                      <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                        <h4 className="font-semibold text-cyan-900 mb-2">Email Signature Tips</h4>
                        <ul className="text-sm text-cyan-800 space-y-1">
                          <li>• Keep it concise - 3-4 lines of contact info max</li>
                          <li>• Include a call-to-action (book a call, visit website)</li>
                          <li>• Use web-safe fonts (Arial, Georgia, Verdana)</li>
                          <li>• Test your signature by sending emails to yourself</li>
                          <li>• Update seasonally or with promotions</li>
                        </ul>
                      </div>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>

            {/* Social Media Setup */}
            <Card variant="outlined" hover className={isSectionComplete('social-media') ? 'border-green-300 bg-green-50/30' : ''}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSectionComplete('social-media')}
                      className="flex-shrink-0 hover:scale-110 transition-transform"
                      title={isSectionComplete('social-media') ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {isSectionComplete('social-media') ? (
                        <CheckSquare className="w-5 h-5 text-green-500" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-300 hover:text-gray-400" />
                      )}
                    </button>
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <Share2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isSectionComplete('social-media') ? 'text-green-700 line-through' : 'text-gray-900'}`}>Social Media Setup</h3>
                      <p className="text-sm text-gray-500">Set up Google Business, social profiles & more</p>
                    </div>
                  </div>
                  <Button onClick={() => setCurrentStep('google-business')}>
                    Start
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Appointment Booking */}
            <Card variant="outlined" className={`border-2 ${isSectionComplete('appointment-booking') ? 'border-green-300 bg-green-50/30' : 'border-indigo-200 bg-indigo-50/50'}`}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSectionComplete('appointment-booking')}
                      className="flex-shrink-0 hover:scale-110 transition-transform"
                      title={isSectionComplete('appointment-booking') ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {isSectionComplete('appointment-booking') ? (
                        <CheckSquare className="w-5 h-5 text-green-500" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-300 hover:text-gray-400" />
                      )}
                    </button>
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <CalendarDays className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isSectionComplete('appointment-booking') ? 'text-green-700 line-through' : 'text-gray-900'}`}>Appointment Booking</h3>
                      <p className="text-sm text-gray-500">Let customers book appointments online</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowBookingDetails(!showBookingDetails)}
                    className="border-indigo-300"
                  >
                    {showBookingDetails ? 'Hide Details' : 'View Options'}
                  </Button>
                </div>

                {showBookingDetails && (
                  <div className="space-y-6">
                    {/* Why Booking Software */}
                    <div className="p-4 bg-white rounded-lg border border-indigo-200">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-indigo-600" />
                        Why Use Booking Software?
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• <strong>24/7 Booking</strong> - Customers book anytime, even when you're closed</li>
                        <li>• <strong>Automatic Reminders</strong> - Reduce no-shows with email/SMS notifications</li>
                        <li>• <strong>Calendar Sync</strong> - Appointments appear on your Google/Outlook calendar</li>
                        <li>• <strong>Professional Image</strong> - Modern booking experience builds trust</li>
                        <li>• <strong>Save Time</strong> - No more back-and-forth scheduling emails</li>
                      </ul>
                    </div>

                    {/* Key Features to Look For */}
                    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                      <h4 className="font-semibold text-indigo-900 mb-2">Key Features for Your Website</h4>
                      <div className="grid sm:grid-cols-2 gap-2 text-sm text-indigo-800">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                          Embeddable widget for your site
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                          Google/Outlook calendar sync
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                          Email & SMS reminders
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                          Mobile-friendly booking page
                        </div>
                      </div>
                    </div>

                    {/* Booking Platforms */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Recommended Booking Platforms</h4>
                      <div className="grid gap-3">

                        {/* Calendly - Top Recommendation */}
                        <div className="p-4 bg-white rounded-lg border-2 border-green-200 relative">
                          <div className="absolute -top-2 left-3 px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded">
                            TOP PICK
                          </div>
                          <div className="flex items-start justify-between mt-1">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-semibold text-gray-900">Calendly</h5>
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">Free Tier</span>
                              </div>
                              <p className="text-xs text-gray-500 mb-2">Most popular scheduling tool - perfect for any business</p>
                              <div className="flex flex-wrap gap-2 text-xs mb-2">
                                <span className="flex items-center gap-1 text-gray-600">
                                  <DollarSign className="w-3 h-3" />
                                  Free / $10/mo Pro
                                </span>
                                <span className="flex items-center gap-1 text-green-600">
                                  <Zap className="w-3 h-3" />
                                  Easiest to use
                                </span>
                              </div>
                              <ul className="text-xs text-gray-500 space-y-1">
                                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Beautiful embed widget for website</li>
                                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Google, Outlook, iCloud calendar sync</li>
                                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Automatic email reminders</li>
                                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> 1 event type free, unlimited on paid</li>
                              </ul>
                              <p className="text-xs text-green-700 mt-2 font-medium">Best for: Most businesses, consultants, service providers</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-green-300 hover:bg-green-50 ml-3"
                              onClick={() => window.open('https://calendly.com/signup', '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Sign Up Free
                            </Button>
                          </div>
                        </div>

                        {/* Cal.com - Best Free Option */}
                        <div className="p-4 bg-white rounded-lg border-2 border-blue-200 relative">
                          <div className="absolute -top-2 left-3 px-2 py-0.5 bg-blue-500 text-white text-xs font-medium rounded">
                            BEST FREE
                          </div>
                          <div className="flex items-start justify-between mt-1">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-semibold text-gray-900">Cal.com</h5>
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Generous Free</span>
                              </div>
                              <p className="text-xs text-gray-500 mb-2">Open-source Calendly alternative with more free features</p>
                              <div className="flex flex-wrap gap-2 text-xs mb-2">
                                <span className="flex items-center gap-1 text-gray-600">
                                  <DollarSign className="w-3 h-3" />
                                  Free / $15/mo Pro
                                </span>
                                <span className="flex items-center gap-1 text-blue-600">
                                  <Users className="w-3 h-3" />
                                  Unlimited event types free
                                </span>
                              </div>
                              <ul className="text-xs text-gray-500 space-y-1">
                                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Unlimited event types on free plan</li>
                                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Embed widget, calendar sync</li>
                                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Highly customizable</li>
                                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Open source - no vendor lock-in</li>
                              </ul>
                              <p className="text-xs text-blue-700 mt-2 font-medium">Best for: Budget-conscious, tech-savvy users wanting full features free</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-300 hover:bg-blue-50 ml-3"
                              onClick={() => window.open('https://cal.com/signup', '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Sign Up Free
                            </Button>
                          </div>
                        </div>

                        {/* Square Appointments - Best for Service Businesses */}
                        <div className="p-4 bg-white rounded-lg border-2 border-orange-200 relative">
                          <div className="absolute -top-2 left-3 px-2 py-0.5 bg-orange-500 text-white text-xs font-medium rounded">
                            BEST FOR SERVICES
                          </div>
                          <div className="flex items-start justify-between mt-1">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-semibold text-gray-900">Square Appointments</h5>
                                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">Free for Solo</span>
                              </div>
                              <p className="text-xs text-gray-500 mb-2">Perfect for salons, spas, fitness, and service businesses</p>
                              <div className="flex flex-wrap gap-2 text-xs mb-2">
                                <span className="flex items-center gap-1 text-gray-600">
                                  <DollarSign className="w-3 h-3" />
                                  Free solo / $29/mo team
                                </span>
                                <span className="flex items-center gap-1 text-orange-600">
                                  <CreditCard className="w-3 h-3" />
                                  Built-in payments
                                </span>
                              </div>
                              <ul className="text-xs text-gray-500 space-y-1">
                                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Free for individuals</li>
                                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Accept payments & deposits</li>
                                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> SMS reminders included</li>
                                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Instagram & Google integration</li>
                              </ul>
                              <p className="text-xs text-orange-700 mt-2 font-medium">Best for: Salons, spas, trainers, contractors, home services</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-orange-300 hover:bg-orange-50 ml-3"
                              onClick={() => window.open('https://squareup.com/appointments', '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Sign Up Free
                            </Button>
                          </div>
                        </div>

                        {/* Acuity Scheduling */}
                        <div className="p-4 bg-white rounded-lg border border-indigo-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-semibold text-gray-900">Acuity Scheduling</h5>
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">Premium</span>
                              </div>
                              <p className="text-xs text-gray-500 mb-2">Feature-rich scheduling by Squarespace</p>
                              <div className="flex flex-wrap gap-2 text-xs mb-2">
                                <span className="flex items-center gap-1 text-gray-600">
                                  <DollarSign className="w-3 h-3" />
                                  From $16/mo
                                </span>
                                <span className="flex items-center gap-1 text-purple-600">
                                  <Award className="w-3 h-3" />
                                  Most features
                                </span>
                              </div>
                              <ul className="text-xs text-gray-500 space-y-1">
                                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Advanced customization</li>
                                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Packages, memberships, gift cards</li>
                                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> HIPAA compliant option</li>
                              </ul>
                              <p className="text-xs text-purple-700 mt-2 font-medium">Best for: Established businesses needing advanced features</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-indigo-300 ml-3"
                              onClick={() => window.open('https://acuityscheduling.com/', '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Try Free
                            </Button>
                          </div>
                        </div>

                        {/* Setmore */}
                        <div className="p-4 bg-white rounded-lg border border-indigo-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-semibold text-gray-900">Setmore</h5>
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">Free Tier</span>
                              </div>
                              <p className="text-xs text-gray-500 mb-2">Simple and generous free plan</p>
                              <div className="flex flex-wrap gap-2 text-xs mb-2">
                                <span className="flex items-center gap-1 text-gray-600">
                                  <DollarSign className="w-3 h-3" />
                                  Free / $12/mo Pro
                                </span>
                                <span className="flex items-center gap-1 text-green-600">
                                  <Users className="w-3 h-3" />
                                  Up to 4 users free
                                </span>
                              </div>
                              <ul className="text-xs text-gray-500 space-y-1">
                                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Free for up to 4 staff</li>
                                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Zoom integration</li>
                                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Social media booking</li>
                              </ul>
                              <p className="text-xs text-gray-600 mt-2 font-medium">Best for: Small teams on a budget</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-indigo-300 ml-3"
                              onClick={() => window.open('https://www.setmore.com/', '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Sign Up Free
                            </Button>
                          </div>
                        </div>

                        {/* TidyCal - Lifetime Deal */}
                        <div className="p-4 bg-white rounded-lg border border-indigo-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-semibold text-gray-900">TidyCal</h5>
                                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">Lifetime Deal</span>
                              </div>
                              <p className="text-xs text-gray-500 mb-2">One-time payment, no monthly fees ever</p>
                              <div className="flex flex-wrap gap-2 text-xs mb-2">
                                <span className="flex items-center gap-1 text-gray-600">
                                  <DollarSign className="w-3 h-3" />
                                  $29 one-time
                                </span>
                                <span className="flex items-center gap-1 text-yellow-600">
                                  <Zap className="w-3 h-3" />
                                  No subscription
                                </span>
                              </div>
                              <ul className="text-xs text-gray-500 space-y-1">
                                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Pay once, use forever</li>
                                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> All essential features</li>
                                <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> By AppSumo (trusted)</li>
                              </ul>
                              <p className="text-xs text-yellow-700 mt-2 font-medium">Best for: Those who hate subscriptions</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-indigo-300 ml-3"
                              onClick={() => window.open('https://tidycal.com/', '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Get Deal
                            </Button>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Quick Comparison Table */}
                    <div className="overflow-x-auto">
                      <h4 className="font-semibold text-gray-900 mb-3">Quick Comparison</h4>
                      <table className="w-full text-xs border border-indigo-200 rounded-lg overflow-hidden">
                        <thead className="bg-indigo-50">
                          <tr>
                            <th className="px-3 py-2 text-left font-semibold text-indigo-900">Platform</th>
                            <th className="px-3 py-2 text-left font-semibold text-indigo-900">Free Plan</th>
                            <th className="px-3 py-2 text-left font-semibold text-indigo-900">Paid From</th>
                            <th className="px-3 py-2 text-left font-semibold text-indigo-900">Best For</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-indigo-100">
                          <tr>
                            <td className="px-3 py-2 font-medium">Calendly</td>
                            <td className="px-3 py-2 text-green-600">1 event type</td>
                            <td className="px-3 py-2">$10/mo</td>
                            <td className="px-3 py-2">Most businesses</td>
                          </tr>
                          <tr>
                            <td className="px-3 py-2 font-medium">Cal.com</td>
                            <td className="px-3 py-2 text-green-600">Unlimited events</td>
                            <td className="px-3 py-2">$15/mo</td>
                            <td className="px-3 py-2">Budget-conscious</td>
                          </tr>
                          <tr>
                            <td className="px-3 py-2 font-medium">Square</td>
                            <td className="px-3 py-2 text-green-600">Full (solo)</td>
                            <td className="px-3 py-2">$29/mo (team)</td>
                            <td className="px-3 py-2">Service businesses</td>
                          </tr>
                          <tr>
                            <td className="px-3 py-2 font-medium">Acuity</td>
                            <td className="px-3 py-2 text-gray-400">7-day trial</td>
                            <td className="px-3 py-2">$16/mo</td>
                            <td className="px-3 py-2">Advanced needs</td>
                          </tr>
                          <tr>
                            <td className="px-3 py-2 font-medium">Setmore</td>
                            <td className="px-3 py-2 text-green-600">Up to 4 users</td>
                            <td className="px-3 py-2">$12/mo</td>
                            <td className="px-3 py-2">Small teams</td>
                          </tr>
                          <tr>
                            <td className="px-3 py-2 font-medium">TidyCal</td>
                            <td className="px-3 py-2 text-gray-400">-</td>
                            <td className="px-3 py-2">$29 once</td>
                            <td className="px-3 py-2">No subscriptions</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Setup Steps */}
                    <div className="p-4 bg-white rounded-lg border border-indigo-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Rocket className="w-4 h-4 text-indigo-600" />
                        Setup Steps
                      </h4>
                      <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                        <li><strong>Sign up</strong> for your chosen platform (we recommend Calendly or Cal.com)</li>
                        <li><strong>Connect your calendar</strong> - Link Google Calendar or Outlook so bookings appear automatically</li>
                        <li><strong>Set availability</strong> - Define your working hours and buffer time between appointments</li>
                        <li><strong>Create event types</strong> - Set up different appointment types (consultation, service, etc.)</li>
                        <li><strong>Customize notifications</strong> - Set up email/SMS reminders for you and customers</li>
                        <li><strong>Get your embed code</strong> - Copy the widget code for your website</li>
                        <li><strong>Add to website</strong> - Paste the code on your contact or booking page</li>
                        <li><strong>Test it</strong> - Book a test appointment to make sure it works</li>
                      </ol>
                    </div>

                    {/* Pro Tips */}
                    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                      <h4 className="font-semibold text-indigo-900 mb-2">Pro Tips</h4>
                      <ul className="text-sm text-indigo-800 space-y-1">
                        <li>• <strong>Add buffer time</strong> between appointments (15-30 min) to avoid back-to-back stress</li>
                        <li>• <strong>Set SMS reminders</strong> - reduces no-shows by up to 90%</li>
                        <li>• <strong>Require deposits</strong> for high-value services to reduce cancellations</li>
                        <li>• <strong>Add intake questions</strong> to gather info before the appointment</li>
                        <li>• <strong>Share your booking link</strong> everywhere - email signature, social media, Google Business</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* iOS App Generator */}
            <Card variant="outlined" className={`border-2 ${isSectionComplete('ios-app') ? 'border-green-300 bg-green-50/30' : 'border-purple-200 bg-purple-50/50'}`}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSectionComplete('ios-app')}
                      className="flex-shrink-0 hover:scale-110 transition-transform"
                      title={isSectionComplete('ios-app') ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {isSectionComplete('ios-app') ? (
                        <CheckSquare className="w-5 h-5 text-green-500" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-300 hover:text-gray-400" />
                      )}
                    </button>
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isSectionComplete('ios-app') ? 'text-green-700 line-through' : 'text-gray-900'}`}>iOS App</h3>
                      <p className="text-sm text-gray-500">Generate a native mobile app with AI</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowIosAppDetails(!showIosAppDetails)}
                    className="border-purple-300"
                  >
                    {showIosAppDetails ? 'Hide' : 'Generate App'}
                  </Button>
                </div>

                {showIosAppDetails && (() => {
                  // App category definitions
                  const appCategories = [
                    {
                      id: 'home-services',
                      name: 'Home Services',
                      icon: Home,
                      keywords: ['plumber', 'plumbing', 'electrician', 'electrical', 'hvac', 'heating', 'cooling', 'air conditioning', 'roofer', 'roofing', 'landscaper', 'landscaping', 'lawn', 'garden', 'cleaning', 'cleaner', 'maid', 'janitorial', 'pest', 'exterminator', 'moving', 'mover', 'handyman', 'painter', 'painting', 'contractor', 'remodel', 'renovation', 'pool', 'fence', 'garage', 'gutter', 'pressure wash', 'carpet', 'flooring', 'tile', 'drywall', 'insulation'],
                      features: [
                        'Service request & booking system with date/time selection',
                        'Emergency service button with instant call/text option',
                        'Service area coverage map with zip code checker',
                        'Quote request form with photo upload for job assessment',
                        'Before/after project gallery',
                        'Service packages & pricing display',
                        'Real-time job status tracking',
                        'Invoice viewing & payment processing',
                        'Appointment reminders & notifications',
                        'Loyalty program & referral rewards',
                        'Service history for repeat customers',
                        'Live chat support'
                      ],
                      screens: ['Home', 'Services', 'Book Now', 'My Jobs', 'Gallery', 'Contact', 'Profile', 'Payments']
                    },
                    {
                      id: 'food-dining',
                      name: 'Food & Dining',
                      icon: Utensils,
                      keywords: ['restaurant', 'cafe', 'coffee', 'bakery', 'bar', 'pub', 'grill', 'pizzeria', 'pizza', 'sushi', 'food truck', 'catering', 'diner', 'bistro', 'kitchen', 'eatery', 'deli', 'sandwich', 'burger', 'taco', 'mexican', 'italian', 'chinese', 'thai', 'indian', 'mediterranean', 'seafood', 'steakhouse', 'bbq', 'barbecue', 'ice cream', 'dessert', 'juice', 'smoothie', 'tea', 'bubble tea', 'donut', 'bagel', 'brunch'],
                      features: [
                        'Full digital menu with photos & descriptions',
                        'Online ordering with customization options',
                        'Table reservation system',
                        'Real-time order tracking',
                        'Delivery & pickup scheduling',
                        'Loyalty points & rewards program',
                        'Special offers & daily deals',
                        'Push notifications for promotions',
                        'Multiple payment options (card, Apple Pay)',
                        'Order history & quick reorder',
                        'Dietary filters (vegan, gluten-free, etc.)',
                        'Catering request form for large orders'
                      ],
                      screens: ['Home', 'Menu', 'Order', 'Cart', 'Track Order', 'Reservations', 'Rewards', 'Profile']
                    },
                    {
                      id: 'professional-services',
                      name: 'Professional Services',
                      icon: Briefcase,
                      keywords: ['lawyer', 'attorney', 'law firm', 'legal', 'accountant', 'accounting', 'cpa', 'tax', 'financial', 'advisor', 'consultant', 'consulting', 'insurance', 'agent', 'broker', 'mortgage', 'notary', 'paralegal', 'bookkeeper', 'hr', 'human resources', 'marketing', 'agency', 'architect', 'engineer', 'surveyor', 'appraiser', 'investment'],
                      features: [
                        'Consultation booking with calendar integration',
                        'Secure document upload & sharing portal',
                        'Case/project status tracking dashboard',
                        'Secure messaging with attorney-client privilege',
                        'Appointment reminders & follow-ups',
                        'Service packages & fee structure',
                        'Client intake forms',
                        'Resource library & FAQ section',
                        'Invoice viewing & secure payment',
                        'Video consultation integration',
                        'Multi-location office finder',
                        'Team member profiles & expertise areas'
                      ],
                      screens: ['Home', 'Services', 'Book Consultation', 'Documents', 'Messages', 'My Cases', 'Resources', 'Profile']
                    },
                    {
                      id: 'beauty-wellness',
                      name: 'Beauty & Wellness',
                      icon: Scissors,
                      keywords: ['salon', 'hair', 'barber', 'barbershop', 'spa', 'massage', 'nail', 'manicure', 'pedicure', 'facial', 'skincare', 'esthetician', 'beauty', 'cosmetic', 'makeup', 'lash', 'brow', 'waxing', 'tanning', 'med spa', 'botox', 'laser', 'tattoo', 'piercing', 'threading'],
                      features: [
                        'Service menu with pricing & duration',
                        'Appointment booking with stylist/staff selection',
                        'Staff profiles with photos & specialties',
                        'Real-time availability calendar',
                        'Service add-ons & package deals',
                        'Loyalty points & referral rewards',
                        'Push notification reminders',
                        'Photo gallery of work/portfolio',
                        'Product recommendations & shop',
                        'Gift card purchase & redemption',
                        'Membership/subscription plans',
                        'Before/after transformation gallery'
                      ],
                      screens: ['Home', 'Services', 'Book', 'Our Team', 'Gallery', 'Shop', 'Rewards', 'Profile']
                    },
                    {
                      id: 'healthcare',
                      name: 'Healthcare',
                      icon: Stethoscope,
                      keywords: ['doctor', 'physician', 'medical', 'clinic', 'dentist', 'dental', 'orthodontist', 'chiropractor', 'chiropractic', 'physical therapy', 'therapist', 'psychologist', 'psychiatrist', 'counselor', 'veterinarian', 'vet', 'animal', 'pet', 'optometrist', 'eye', 'vision', 'dermatologist', 'pediatric', 'obgyn', 'urgent care', 'pharmacy', 'lab', 'imaging', 'home health', 'nurse', 'acupuncture', 'holistic', 'wellness'],
                      features: [
                        'Appointment scheduling with provider selection',
                        'Patient portal with health records access',
                        'Secure messaging with healthcare providers',
                        'Prescription refill requests',
                        'Telehealth/video visit integration',
                        'Appointment reminders & follow-up scheduling',
                        'Insurance information & billing',
                        'Lab results viewing',
                        'Health forms & questionnaires',
                        'Provider profiles & credentials',
                        'Multiple location support',
                        'Emergency contact information'
                      ],
                      screens: ['Home', 'Book Appointment', 'My Health', 'Messages', 'Prescriptions', 'Providers', 'Billing', 'Profile']
                    },
                    {
                      id: 'fitness',
                      name: 'Fitness & Recreation',
                      icon: Dumbbell,
                      keywords: ['gym', 'fitness', 'workout', 'crossfit', 'yoga', 'pilates', 'personal trainer', 'training', 'boxing', 'martial arts', 'karate', 'jiu jitsu', 'mma', 'dance', 'studio', 'spin', 'cycling', 'swimming', 'pool', 'tennis', 'golf', 'sports', 'athletic', 'bootcamp', 'barre', 'zumba', 'aerobics', 'wellness center'],
                      features: [
                        'Class schedule with easy booking',
                        'Membership management & renewal',
                        'Trainer booking & personal sessions',
                        'Workout tracking & progress photos',
                        'Check-in via QR code or digital pass',
                        'Push notifications for class reminders',
                        'Workout plans & exercise library',
                        'Nutrition tips & meal planning',
                        'Achievement badges & challenges',
                        'Social features & community',
                        'Virtual class access',
                        'Merchandise shop'
                      ],
                      screens: ['Home', 'Classes', 'Book', 'My Workouts', 'Progress', 'Trainers', 'Shop', 'Profile']
                    },
                    {
                      id: 'automotive',
                      name: 'Automotive',
                      icon: Car,
                      keywords: ['auto', 'car', 'mechanic', 'repair', 'garage', 'body shop', 'collision', 'oil change', 'tire', 'brake', 'transmission', 'car wash', 'detailing', 'towing', 'roadside', 'dealer', 'dealership', 'rental', 'windshield', 'muffler', 'exhaust', 'alignment', 'inspection', 'smog', 'emissions', 'motorcycle', 'rv', 'boat', 'marine'],
                      features: [
                        'Service appointment booking',
                        'Vehicle profile with service history',
                        'Real-time repair status tracking',
                        'Digital inspection reports with photos',
                        'Cost estimates & approval workflow',
                        'Towing/roadside assistance request',
                        'Maintenance reminders by mileage',
                        'Service packages & pricing',
                        'Loyalty rewards program',
                        'Invoice & payment history',
                        'Multiple vehicle support',
                        'Shuttle/loaner car scheduling'
                      ],
                      screens: ['Home', 'My Vehicles', 'Book Service', 'Service Status', 'History', 'Estimates', 'Rewards', 'Profile']
                    },
                    {
                      id: 'retail',
                      name: 'Retail & Shopping',
                      icon: ShoppingBag,
                      keywords: ['store', 'shop', 'retail', 'boutique', 'clothing', 'fashion', 'jewelry', 'florist', 'flower', 'gift', 'toy', 'pet store', 'hardware', 'furniture', 'antique', 'thrift', 'consignment', 'bookstore', 'music', 'electronics', 'appliance', 'sporting goods', 'outdoor', 'home decor', 'garden center', 'nursery', 'craft', 'hobby', 'liquor', 'wine', 'smoke', 'vape', 'convenience', 'grocery', 'market', 'pharmacy'],
                      features: [
                        'Product catalog with categories',
                        'Online ordering & checkout',
                        'In-store pickup scheduling',
                        'Local delivery options',
                        'Wishlist & favorites',
                        'Push notifications for sales & new arrivals',
                        'Loyalty program & rewards',
                        'Gift card purchase & balance check',
                        'Store locator with hours',
                        'Product search & filters',
                        'Order tracking',
                        'Customer reviews'
                      ],
                      screens: ['Home', 'Shop', 'Categories', 'Cart', 'Wishlist', 'Orders', 'Rewards', 'Profile']
                    },
                    {
                      id: 'real-estate',
                      name: 'Real Estate',
                      icon: Building2,
                      keywords: ['real estate', 'realtor', 'realty', 'property', 'broker', 'agent', 'home', 'house', 'apartment', 'condo', 'rental', 'property management', 'leasing', 'commercial', 'mortgage', 'title', 'escrow', 'appraisal', 'inspection', 'staging'],
                      features: [
                        'Property listings with photos & details',
                        'Advanced search & filters',
                        'Save favorite properties',
                        'Schedule property viewings',
                        'Mortgage calculator',
                        'Virtual tour integration',
                        'Agent contact & messaging',
                        'Push notifications for new listings',
                        'Neighborhood information',
                        'Recently sold comparables',
                        'Open house calendar',
                        'Document signing integration'
                      ],
                      screens: ['Home', 'Search', 'Listings', 'Favorites', 'Schedule Tour', 'Calculator', 'Agent', 'Profile']
                    },
                    {
                      id: 'events-creative',
                      name: 'Events & Creative',
                      icon: Camera,
                      keywords: ['photography', 'photographer', 'videography', 'videographer', 'dj', 'music', 'band', 'entertainment', 'event', 'planner', 'wedding', 'party', 'catering', 'florist', 'decorator', 'rental', 'venue', 'photo booth', 'printing', 'design', 'graphic', 'web', 'marketing', 'advertising', 'media', 'production', 'film', 'podcast', 'studio'],
                      features: [
                        'Portfolio gallery with categories',
                        'Package selection & pricing',
                        'Date availability checker',
                        'Event/session booking',
                        'Mood board & inspiration sharing',
                        'Client questionnaire forms',
                        'Contract viewing & e-signature',
                        'Project timeline & milestones',
                        'Private gallery for clients',
                        'Download & share options',
                        'Payment schedule tracking',
                        'Referral program'
                      ],
                      screens: ['Home', 'Portfolio', 'Packages', 'Book', 'My Events', 'Gallery', 'Contracts', 'Profile']
                    },
                    {
                      id: 'education',
                      name: 'Education & Childcare',
                      icon: GraduationCap,
                      keywords: ['school', 'daycare', 'childcare', 'preschool', 'tutoring', 'tutor', 'learning', 'academy', 'education', 'music lessons', 'art class', 'dance class', 'driving school', 'language', 'test prep', 'sat', 'act', 'college', 'enrichment', 'after school', 'summer camp', 'martial arts', 'swimming lessons', 'coaching', 'sports training', 'montessori'],
                      features: [
                        'Class schedule & enrollment',
                        'Student progress tracking',
                        'Parent/guardian communication portal',
                        'Attendance tracking',
                        'Assignment & homework submission',
                        'Grade & report card viewing',
                        'Payment & tuition management',
                        'Photo & video sharing',
                        'Calendar with events & holidays',
                        'Emergency contact information',
                        'Resource library & materials',
                        'Carpool coordination'
                      ],
                      screens: ['Home', 'Classes', 'Schedule', 'Progress', 'Messages', 'Resources', 'Payments', 'Profile']
                    }
                  ]

                  // Detect category from business type
                  const detectCategory = () => {
                    if (iosAppCategory) return iosAppCategory
                    const businessType = (profile?.business_type || profile?.data?.businessType || '').toLowerCase()
                    const businessName = (profile?.name || '').toLowerCase()
                    const combined = `${businessType} ${businessName}`

                    for (const cat of appCategories) {
                      for (const keyword of cat.keywords) {
                        if (combined.includes(keyword)) {
                          return cat.id
                        }
                      }
                    }
                    return 'home-services' // Default fallback
                  }

                  const selectedCategoryId = detectCategory()
                  const selectedCategory = appCategories.find(c => c.id === selectedCategoryId) || appCategories[0]

                  // Generate the comprehensive prompt
                  const generateAppPrompt = () => {
                    const info = profile?.data
                    const businessName = profile?.name || 'Business'
                    const businessType = profile?.business_type || info?.businessType || 'Local Business'
                    const tagline = profile?.tagline || info?.tagline || ''
                    const description = info?.description || ''
                    const services = info?.services || []
                    const phone = info?.phone || ''
                    const email = info?.email || ''
                    const address = info?.address || ''
                    const city = profile?.city || info?.city || ''
                    const state = profile?.state || info?.state || ''
                    const zipCode = info?.zipCode || ''
                    const hours = info?.openingHours || {}
                    const testimonials = info?.testimonials || []
                    const socialLinks = {
                      facebook: info?.facebookUrl,
                      instagram: info?.instagramUrl,
                      linkedin: info?.linkedinUrl,
                      yelp: info?.yelpUrl,
                      google: info?.googleProfileUrl
                    }

                    const hoursFormatted = Object.entries(hours)
                      .filter(([_, value]) => value)
                      .map(([day, time]) => `${day}: ${time}`)
                      .join(', ') || 'Contact for hours'

                    return `Create a professional iOS app for "${businessName}" - a ${businessType} business.

===== BUSINESS INFORMATION =====
Business Name: ${businessName}
Business Type: ${businessType}
${tagline ? `Tagline: ${tagline}` : ''}
${description ? `Description: ${description}` : ''}

Location:
${address ? `- Address: ${address}` : ''}
${city && state ? `- City/State: ${city}, ${state} ${zipCode}` : ''}

Contact Information:
${phone ? `- Phone: ${phone}` : ''}
${email ? `- Email: ${email}` : ''}

Business Hours: ${hoursFormatted}

${services.length > 0 ? `Services Offered:\n${services.map(s => `- ${s}`).join('\n')}` : ''}

${testimonials.length > 0 ? `Customer Testimonials:\n${testimonials.slice(0, 3).map(t => `- "${t.content}" - ${t.author}`).join('\n')}` : ''}

Social Media:
${Object.entries(socialLinks).filter(([_, url]) => url).map(([platform, url]) => `- ${platform}: ${url}`).join('\n') || '- None provided'}

===== APP CATEGORY =====
This is a ${selectedCategory.name} business app.

===== REQUIRED SCREENS =====
${selectedCategory.screens.map((s, i) => `${i + 1}. ${s}`).join('\n')}

===== REQUIRED FEATURES =====
${selectedCategory.features.map((f, i) => `${i + 1}. ${f}`).join('\n')}

===== DESIGN SPECIFICATIONS =====
Primary Color: ${iosAppPrimaryColor}
Style: Modern, clean, professional iOS design following Apple Human Interface Guidelines
Typography: San Francisco (system font) for optimal readability
Icons: SF Symbols for native iOS feel

===== FUNCTIONALITY REQUIREMENTS =====
${iosAppEnablePayments ? `
PAYMENTS (ENABLED):
- Integrate Apple Pay for seamless checkout
- Support credit/debit card payments
- Secure payment processing with encryption
- Payment history and receipts
- Saved payment methods for returning customers
` : `
PAYMENTS: Basic app without payment processing (contact business directly)
`}

${iosAppEnableNotifications ? `
PUSH NOTIFICATIONS (ENABLED):
- Appointment/booking reminders (1 day before, 1 hour before)
- Order status updates
- Promotional offers and special deals
- New service/product announcements
- Loyalty reward milestones
- Important business updates
` : `
PUSH NOTIFICATIONS: Disabled
`}

===== CORE APP STRUCTURE =====

1. ONBOARDING FLOW:
   - Welcome screen with business branding
   - Quick feature highlights (3 slides)
   - Sign up / Sign in options (email, Apple ID, phone)
   - Location permission request
   - Notification permission request

2. HOME SCREEN:
   - Business logo and name prominently displayed
   - Quick action buttons for main features
   - Featured services/products carousel
   - Current promotions banner
   - One-tap contact options (call, message, directions)

3. NAVIGATION:
   - Bottom tab bar with 4-5 main sections
   - Clean, intuitive navigation hierarchy
   - Back buttons and clear breadcrumbs

4. USER PROFILE:
   - Account information management
   - ${selectedCategory.id === 'automotive' ? 'Saved vehicles' : selectedCategory.id === 'healthcare' ? 'Health information' : selectedCategory.id === 'education' ? 'Student profiles' : 'Saved preferences'}
   - Order/booking history
   - Saved favorites
   - Payment methods (if enabled)
   - Notification preferences
   - Sign out option

5. BOOKING/ORDERING SYSTEM:
   - Date and time selection calendar
   - ${selectedCategory.id === 'beauty-wellness' || selectedCategory.id === 'healthcare' ? 'Staff/provider selection' : selectedCategory.id === 'fitness' ? 'Class/trainer selection' : 'Service selection'}
   - Real-time availability display
   - Booking confirmation with details
   - Easy modification/cancellation
   - Add to device calendar option

6. CONTACT & SUPPORT:
   - One-tap phone call
   - In-app messaging/chat
   - Email contact form
   - Business location with map
   - Get directions (Apple Maps integration)
   - FAQ section

===== TECHNICAL REQUIREMENTS =====
- Native iOS app (Swift/SwiftUI preferred)
- Minimum iOS version: 15.0
- Support for iPhone (all sizes) and iPad
- Dark mode support
- Offline capability for viewing saved data
- Fast loading times (< 2 seconds)
- Smooth 60fps animations
- Accessibility support (VoiceOver, Dynamic Type)
- Secure data storage (Keychain for sensitive data)

===== DATA & BACKEND =====
- User authentication system
- Real-time database for bookings/orders
- Cloud storage for images and documents
- API integration for business operations
- Analytics tracking for user behavior

${iosAppSpecialFeatures ? `
===== ADDITIONAL CUSTOM FEATURES =====
${iosAppSpecialFeatures}
` : ''}

===== DELIVERABLES =====
Please create:
1. Complete Xcode project with all source code
2. All required screens and navigation
3. Reusable UI components
4. Data models and services
5. Mock data for testing
6. App icons and launch screen
7. README with setup instructions

Make the app production-ready, polished, and professional. The business owner should be proud to show this to their customers.`
                  }

                  return (
                    <div className="space-y-6">
                      {/* Category Selection */}
                      <div className="p-4 bg-white rounded-lg border border-purple-200">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Settings className="w-4 h-4 text-purple-600" />
                          App Configuration
                        </h4>

                        <div className="space-y-4">
                          {/* Category Selector */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Business Category
                            </label>
                            <div className="relative">
                              <select
                                value={iosAppCategory || selectedCategoryId}
                                onChange={(e) => setIosAppCategory(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm pr-10"
                              >
                                {appCategories.map(cat => (
                                  <option key={cat.id} value={cat.id}>
                                    {cat.name} {selectedCategoryId === cat.id && !iosAppCategory ? '(Auto-detected)' : ''}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Auto-detected from "{profile?.business_type || profile?.data?.businessType || 'business type'}". Change if incorrect.
                            </p>
                          </div>

                          {/* Primary Color */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Primary App Color
                            </label>
                            <div className="flex items-center gap-3">
                              <input
                                type="color"
                                value={iosAppPrimaryColor}
                                onChange={(e) => setIosAppPrimaryColor(e.target.value)}
                                className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={iosAppPrimaryColor}
                                onChange={(e) => setIosAppPrimaryColor(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                                placeholder="#3B82F6"
                              />
                              <div className="flex gap-1">
                                {['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'].map(color => (
                                  <button
                                    key={color}
                                    onClick={() => setIosAppPrimaryColor(color)}
                                    className="w-6 h-6 rounded border-2 transition-transform hover:scale-110"
                                    style={{ backgroundColor: color, borderColor: iosAppPrimaryColor === color ? '#000' : 'transparent' }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Toggle Options */}
                          <div className="grid grid-cols-2 gap-4">
                            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                              <input
                                type="checkbox"
                                checked={iosAppEnablePayments}
                                onChange={(e) => setIosAppEnablePayments(e.target.checked)}
                                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                              />
                              <div>
                                <span className="text-sm font-medium text-gray-900">Enable Payments</span>
                                <p className="text-xs text-gray-500">Apple Pay & card processing</p>
                              </div>
                            </label>
                            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                              <input
                                type="checkbox"
                                checked={iosAppEnableNotifications}
                                onChange={(e) => setIosAppEnableNotifications(e.target.checked)}
                                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                              />
                              <div>
                                <span className="text-sm font-medium text-gray-900">Push Notifications</span>
                                <p className="text-xs text-gray-500">Reminders & promotions</p>
                              </div>
                            </label>
                          </div>

                          {/* Special Features */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Special Features (Optional)
                            </label>
                            <textarea
                              value={iosAppSpecialFeatures}
                              onChange={(e) => setIosAppSpecialFeatures(e.target.value)}
                              placeholder="Any specific features you want? E.g., 'Integration with Square POS', 'Multi-language support (Spanish)', 'Customer referral program with QR codes', etc."
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Category Features Preview */}
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                          {(() => {
                            const IconComponent = selectedCategory.icon
                            return <IconComponent className="w-4 h-4" />
                          })()}
                          {selectedCategory.name} App Features
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm text-purple-800">
                          {selectedCategory.features.slice(0, 8).map((feature, i) => (
                            <div key={i} className="flex items-start gap-1">
                              <CheckCircle2 className="w-3 h-3 mt-1 flex-shrink-0 text-purple-600" />
                              <span className="text-xs">{feature.split(' with ')[0].split(' - ')[0]}</span>
                            </div>
                          ))}
                        </div>
                        {selectedCategory.features.length > 8 && (
                          <p className="text-xs text-purple-600 mt-2">+ {selectedCategory.features.length - 8} more features included</p>
                        )}
                      </div>

                      {/* Generated Prompt */}
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">Generated App Prompt</h4>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant={iosAppPromptCopied ? "default" : "outline"}
                              className={iosAppPromptCopied ? "bg-green-600" : ""}
                              onClick={() => {
                                navigator.clipboard.writeText(generateAppPrompt())
                                setIosAppPromptCopied(true)
                                setTimeout(() => setIosAppPromptCopied(false), 3000)
                              }}
                            >
                              {iosAppPromptCopied ? (
                                <>
                                  <Check className="w-3 h-3 mr-1" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 mr-1" />
                                  Copy Prompt
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
                          <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                            {generateAppPrompt()}
                          </pre>
                        </div>
                      </div>

                      {/* Natively Link */}
                      <div className="p-4 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg border border-purple-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Create with Natively</h4>
                            <p className="text-sm text-gray-600">Paste your prompt into Natively to generate the iOS app</p>
                          </div>
                          <Button
                            className="bg-purple-600 hover:bg-purple-700"
                            onClick={() => window.open('https://natively.dev', '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open Natively
                          </Button>
                        </div>
                      </div>

                      {/* Tips */}
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <h4 className="font-medium text-purple-800 text-sm mb-2">Tips for Best Results</h4>
                        <ul className="text-xs text-purple-700 space-y-1">
                          <li>• Make sure all business information is filled in for a more complete app</li>
                          <li>• Choose the correct category - it determines which features are included</li>
                          <li>• Add special features if your business has unique requirements</li>
                          <li>• Review the generated prompt before copying to ensure accuracy</li>
                          <li>• You may need to iterate with Natively to refine the app</li>
                        </ul>
                      </div>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>

            {/* Ad Creation */}
            <Card variant="outlined" className={`border-2 ${isSectionComplete('ad-creation') ? 'border-green-300 bg-green-50/30' : 'border-orange-200 bg-orange-50/50'}`}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSectionComplete('ad-creation')}
                      className="flex-shrink-0 hover:scale-110 transition-transform"
                      title={isSectionComplete('ad-creation') ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {isSectionComplete('ad-creation') ? (
                        <CheckSquare className="w-5 h-5 text-green-500" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-300 hover:text-gray-400" />
                      )}
                    </button>
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                      <Megaphone className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isSectionComplete('ad-creation') ? 'text-green-700 line-through' : 'text-gray-900'}`}>Ad Creation</h3>
                      <p className="text-sm text-gray-500">Generate platform-specific image & video ad prompts</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdCreationDetails(!showAdCreationDetails)}
                    className="border-orange-300"
                  >
                    {showAdCreationDetails ? 'Hide' : 'Create Ads'}
                  </Button>
                </div>

                {showAdCreationDetails && (() => {
                  const businessName = profile?.name || 'Business'
                  const businessType = profile?.business_type || profile?.data?.businessType || 'local business'
                  const tagline = profile?.tagline || profile?.data?.tagline || ''
                  const description = profile?.data?.description || ''
                  const services = profile?.data?.services || []
                  const city = profile?.city || profile?.data?.city || ''

                  // Platform definitions
                  const platforms = {
                    facebook: {
                      name: 'Facebook',
                      color: 'blue',
                      audience: 'Older adults and mature users',
                      style: 'Formal to semi-formal tone. Direct messaging that clearly explains value. Focus on trust, usefulness, and real outcomes.',
                      characteristics: 'More traditional, prefer clarity and credibility, respond to straightforward messaging'
                    },
                    instagram: {
                      name: 'Instagram',
                      color: 'pink',
                      audience: 'Younger adults and teens',
                      style: 'Eye-catching and fast-scroll-friendly. Entertaining, stylish, engaging. Strong visuals and curiosity hooks.',
                      characteristics: 'Visually driven, attention-limited, enjoy trends and aesthetics'
                    },
                    youtube: {
                      name: 'YouTube',
                      color: 'red',
                      audience: 'Broad age range (general audience)',
                      style: 'Educational or informative. Clear explanations and storytelling. Engaging but focused on learning.',
                      characteristics: 'Actively chooses content, willing to spend time if value is clear'
                    },
                    tiktok: {
                      name: 'TikTok',
                      color: 'slate',
                      audience: 'Teens, young adults, and kids',
                      style: 'Highly entertaining and dynamic. Informal, playful, fast-paced. Emphasis on fun, trends, humor.',
                      characteristics: 'Extremely short attention span, trend-driven, entertainment-focused'
                    }
                  }

                  // Generate image ad prompts
                  const generateImagePrompts = (platform: 'facebook' | 'instagram') => {
                    const p = platforms[platform]
                    const prompts = []

                    if (platform === 'facebook') {
                      prompts.push({
                        title: 'Trust & Credibility Ad',
                        prompt: `Create a professional, clean advertisement image for "${businessName}", a ${businessType}${city ? ` in ${city}` : ''}.

STYLE: Corporate, trustworthy, mature aesthetic. Clean backgrounds (white, light gray, or soft blue). Professional lighting.

VISUAL ELEMENTS:
- Show the service/product being delivered professionally
- Include subtle trust indicators (checkmarks, shields, or professional setting)
- Use warm, approachable colors with professional undertones
${tagline ? `- Incorporate the tagline: "${tagline}"` : ''}

TEXT OVERLAY SPACE: Leave clear area for headline text about benefits and value proposition.

MOOD: Reliable, established, competent. Appeals to practical decision-makers who value quality and dependability.

ASPECT RATIO: 1200x628 pixels (Facebook feed optimal)`
                      })

                      prompts.push({
                        title: 'Value Proposition Ad',
                        prompt: `Design a straightforward advertisement for "${businessName}" (${businessType}) that clearly communicates value.

STYLE: Direct, informative, professional. No flashy effects - focus on clarity.

VISUAL CONCEPT:
- Before/after comparison OR clear product/service showcase
- Real-world application of the service
${services.length > 0 ? `- Highlight key services: ${services.slice(0, 3).join(', ')}` : ''}
- Professional person or setting that represents the target customer

COLORS: Conservative palette - blues, greens, or earth tones. High contrast for readability.

LAYOUT: Clear visual hierarchy. Main benefit visible within 2 seconds of viewing.

TARGET: Adults 35-65 who make careful purchasing decisions.

ASPECT RATIO: 1080x1080 pixels (Facebook square format)`
                      })

                      prompts.push({
                        title: 'Social Proof Ad',
                        prompt: `Create a testimonial-style advertisement for "${businessName}", a trusted ${businessType}${city ? ` serving ${city}` : ''}.

STYLE: Authentic, relatable, community-focused.

VISUAL ELEMENTS:
- Happy customer or family in realistic setting (not overly polished)
- Warm, natural lighting
- Subtle brand elements without overwhelming
- Space for customer quote overlay

MOOD: "Your neighbors trust us" - local, reliable, proven.

BACKGROUND: Home setting, local neighborhood feel, or professional service environment.

DEMOGRAPHIC APPEAL: Middle-aged adults, homeowners, family decision-makers.

ASPECT RATIO: 1200x628 pixels (Facebook feed)`
                      })
                    } else {
                      // Instagram prompts
                      prompts.push({
                        title: 'Aesthetic Showcase Ad',
                        prompt: `Create a visually stunning, scroll-stopping advertisement for "${businessName}" (${businessType}) optimized for Instagram.

STYLE: Modern, trendy, aesthetically pleasing. Instagram-worthy visuals that encourage saves and shares.

VISUAL ELEMENTS:
- Bold colors or striking contrast
- Clean, minimalist composition with one clear focal point
- Lifestyle imagery showing aspirational outcome
${tagline ? `- Stylized text: "${tagline}"` : ''}

MOOD: Inspirational, desirable, "I want that" feeling.

AESTHETIC: Choose ONE - Minimal & Clean / Bold & Vibrant / Warm & Cozy / Luxe & Premium

IMPORTANT: Must look native to Instagram - not like an ad. Think influencer content quality.

ASPECT RATIO: 1080x1350 pixels (Instagram portrait - highest engagement)`
                      })

                      prompts.push({
                        title: 'Story/Reel Cover Ad',
                        prompt: `Design an eye-catching Instagram Story/Reel cover image for "${businessName}" - a ${businessType}.

STYLE: Vertical format, bold and attention-grabbing. Must stop the scroll in 0.5 seconds.

VISUAL ELEMENTS:
- Dynamic composition with movement implied
- Bright, saturated colors OR dramatic contrast
- Large, readable text element (3-5 words max)
- Face or human element if possible
${services.length > 0 ? `- Feature: ${services[0]}` : ''}

HOOKS TO INCLUDE (choose one):
- "You need to see this..."
- Curiosity gap visual
- Transformation tease
- Behind-the-scenes peek

VIBE: Energetic, current, FOMO-inducing.

ASPECT RATIO: 1080x1920 pixels (9:16 vertical)`
                      })

                      prompts.push({
                        title: 'Carousel First Slide',
                        prompt: `Create the first slide of an Instagram carousel for "${businessName}" (${businessType}) that makes users swipe.

STYLE: Clean, intriguing, incomplete - users MUST swipe to get the full picture.

VISUAL CONCEPT:
- Provocative question or bold statement as text
- Teaser image that hints at value but doesn't reveal all
- Arrow or swipe indicator subtly included
- On-brand colors and aesthetic

HOOK IDEAS:
- "3 things you didn't know about [service]..."
- "Why everyone in ${city || 'your area'} is talking about..."
- "The secret to [benefit]..."

PSYCHOLOGY: Create curiosity gap. Promise value on next slides.

ASPECT RATIO: 1080x1080 pixels (Instagram square carousel)`
                      })
                    }

                    return prompts
                  }

                  // Generate video ad prompts
                  const generateVideoPrompts = (platform: 'facebook' | 'instagram' | 'youtube' | 'tiktok') => {
                    const p = platforms[platform]
                    const prompts = []

                    if (platform === 'facebook') {
                      prompts.push({
                        title: 'Explainer Video Ad (60-90 sec)',
                        prompt: `Create a professional explainer video ad for "${businessName}", a ${businessType}${city ? ` in ${city}` : ''}.

TARGET AUDIENCE: Adults 35-65, practical decision-makers who value clear information.

VIDEO STRUCTURE:
0:00-0:05 - Hook: State the problem your audience faces
0:05-0:20 - Agitate: Show the frustration of not having a solution
0:20-0:50 - Solution: Introduce ${businessName} and show how you solve the problem
${services.length > 0 ? `0:50-1:10 - Features: Highlight ${services.slice(0, 3).join(', ')}` : '0:50-1:10 - Features: Show key benefits'}
1:10-1:20 - Social proof: Quick testimonial or trust indicators
1:20-1:30 - CTA: Clear call-to-action with contact info

TONE: Professional, trustworthy, informative. No hype - just facts and benefits.

VISUALS: Real footage preferred over animation. Show actual service delivery. Professional lighting and audio.

MUSIC: Subtle, corporate-friendly background music. Not distracting.

TEXT OVERLAYS: Key points as subtitles (85% of Facebook videos watched without sound).`
                      })

                      prompts.push({
                        title: 'Testimonial Video Ad (30-45 sec)',
                        prompt: `Script a customer testimonial video ad for "${businessName}" (${businessType}).

AUDIENCE: Facebook users 40+, value peer recommendations.

STRUCTURE:
0:00-0:05 - Customer introduces themselves and their problem
0:05-0:15 - What they tried before that didn't work
0:15-0:30 - How ${businessName} solved their problem
0:30-0:40 - Specific results or benefits they experienced
0:40-0:45 - Recommendation and CTA

FILMING STYLE:
- Customer in their home or business (authentic setting)
- Natural lighting, casual but clear audio
- Cut to B-roll of service being performed
- End with logo and contact info

AUTHENTICITY: Must feel real, not scripted. Conversational language.`
                      })

                      prompts.push({
                        title: 'Before/After Video Ad (15-30 sec)',
                        prompt: `Create a before/after transformation video for "${businessName}" - ${businessType}.

AUDIENCE: Facebook users who need visual proof of results.

STRUCTURE:
0:00-0:03 - "BEFORE" text with problem state
0:03-0:08 - Show the problem in detail
0:08-0:10 - Transition effect (swipe, dissolve)
0:10-0:13 - "AFTER" text with solution
0:13-0:20 - Reveal the transformation
0:20-0:25 - ${businessName} logo and "We can do this for you"
0:25-0:30 - CTA with phone/website

VISUALS: Same angle/lighting for before and after. Dramatic but believable transformation.

MUSIC: Building anticipation, satisfying reveal.`
                      })
                    } else if (platform === 'instagram') {
                      prompts.push({
                        title: 'Reel Hook Video (15-30 sec)',
                        prompt: `Create a viral Instagram Reel for "${businessName}" (${businessType}).

AUDIENCE: 18-35, scrolling quickly, needs instant hook.

HOOK (First 1-2 seconds) - Choose one:
- "POV: You finally found a ${businessType} that actually..."
- "This is your sign to [action related to service]"
- "Nobody talks about this but..."
- Start mid-action with something visually striking

STRUCTURE:
0:00-0:02 - HOOK (text on screen + movement)
0:02-0:08 - The reveal/value/transformation
0:08-0:12 - Quick benefit showcase
0:12-0:15 - CTA or loop point
${tagline ? `Include: "${tagline}"` : ''}

STYLE: Trendy transitions, popular audio track, text overlays. Fast-paced cuts. Vertical 9:16.

VIBE: Relatable, aspirational, share-worthy. NOT salesy.

END: Encourage saves ("Save this for later") or shares.`
                      })

                      prompts.push({
                        title: 'Behind-the-Scenes Reel (20-40 sec)',
                        prompt: `Script a behind-the-scenes Instagram Reel for "${businessName}" - ${businessType}.

CONCEPT: "Day in the life" or "How we do X" content that feels authentic.

AUDIENCE: Young adults who value transparency and authenticity.

STRUCTURE:
0:00-0:03 - "Come with me to..." or "Watch me [do service]"
0:03-0:15 - Process montage with trendy transitions
0:15-0:25 - Satisfying result or completion moment
0:25-0:30 - Casual CTA ("DM us if you want this")
${services.length > 0 ? `Feature service: ${services[0]}` : ''}

STYLE:
- Handheld, authentic feel (not overly produced)
- Popular trending audio
- Quick cuts synced to beat
- Mix of wide shots and detail close-ups
- Text captions for key moments

MOOD: "We love what we do" - passionate, skilled, personable.`
                      })

                      prompts.push({
                        title: 'Transformation Reel (10-20 sec)',
                        prompt: `Create a satisfying transformation Reel for "${businessName}" (${businessType}).

HOOK: Start with the "after" for 0.5 seconds, then "wait for it..." rewind.

STRUCTURE:
0:00-0:01 - Flash of amazing result
0:01-0:03 - "Let me show you how we got here"
0:03-0:12 - Sped-up transformation process
0:12-0:15 - Final reveal with trending audio drop

MUST HAVE:
- Satisfying moment (cleaning, organizing, transformation)
- ASMR-quality audio if applicable
- Smooth transitions
- Before/after side-by-side at end

AUDIO: Use trending sound or satisfying audio track.

GOAL: Saves and shares. "So satisfying" comments.`
                      })
                    } else if (platform === 'youtube') {
                      prompts.push({
                        title: 'Educational How-To Video (3-5 min)',
                        prompt: `Script an educational YouTube video for "${businessName}" - ${businessType}${city ? ` in ${city}` : ''}.

AUDIENCE: People actively searching for solutions, all ages, value depth.

TITLE IDEAS:
- "How to Choose the Right ${businessType} (5 Things to Look For)"
- "${businessType} 101: What Every Homeowner Should Know"
- "The Complete Guide to [service] - Expert Tips from ${businessName}"

STRUCTURE:
0:00-0:30 - Hook + Introduce topic + Why it matters
0:30-1:00 - Brief intro of ${businessName} and credentials
1:00-3:30 - Main content (3-5 valuable tips or steps)
3:30-4:00 - Common mistakes to avoid
4:00-4:30 - Recap + Soft pitch for ${businessName}
4:30-5:00 - CTA (Subscribe, comment, contact)

TONE: Educational, helpful, authoritative but approachable. You're the expert sharing knowledge freely.

VISUALS:
- Talking head + B-roll of work being done
- Graphics for key points
- Before/after examples
- Professional but not corporate

${services.length > 0 ? `Highlight expertise in: ${services.join(', ')}` : ''}

END SCREEN: Subscribe button + Related video + Contact info.`
                      })

                      prompts.push({
                        title: 'Case Study Video (2-3 min)',
                        prompt: `Create a YouTube case study video for "${businessName}" showcasing a successful project.

AUDIENCE: Potential customers researching options, want proof of quality.

TITLE: "How We [Solved Problem] for [Customer Type] - ${businessName} Case Study"

STRUCTURE:
0:00-0:15 - Dramatic before shot + "Here's what we were working with"
0:15-0:45 - Customer's situation and challenges
0:45-1:30 - Our approach and process (show work being done)
1:30-2:00 - Challenges we overcame
2:00-2:30 - The final result (dramatic reveal)
2:30-3:00 - Customer reaction/testimonial + CTA

PRODUCTION:
- Documentary style
- Interview snippets with team/customer
- Time-lapse of work
- Professional voiceover or on-camera host

GOAL: "If they did this, they can help me too" feeling.`
                      })

                      prompts.push({
                        title: 'YouTube Shorts Ad (30-60 sec)',
                        prompt: `Script a YouTube Shorts vertical video for "${businessName}" (${businessType}).

AUDIENCE: YouTube mobile users, quick content consumers.

HOOK (First 2 seconds):
- Controversial opinion about your industry
- Surprising fact
- "Stop making this mistake..."

STRUCTURE:
0:00-0:02 - Hook (text + visual)
0:02-0:15 - Quick value delivery (tip, hack, or insight)
0:15-0:25 - Show proof/example
0:25-0:30 - "Follow for more" + Contact

STYLE:
- Vertical 9:16
- Fast-paced but clear
- Subtitles throughout
- Clean cuts, no fancy transitions

CONTENT IDEAS:
- "3 signs you need a ${businessType}"
- "What your ${businessType} won't tell you"
- "Quick tip that saves you money on [service]"

${tagline ? `Brand message: "${tagline}"` : ''}`
                      })
                    } else {
                      // TikTok
                      prompts.push({
                        title: 'Trending Hook Video (15-30 sec)',
                        prompt: `Create a TikTok using trending format for "${businessName}" - ${businessType}.

AUDIENCE: Gen Z and young millennials. 3-second attention span. Entertainment first.

TRENDING FORMATS TO USE (pick one):
- "POV: You're a ${businessType} and..."
- "Things that just make sense" with your service
- "I don't know who needs to hear this but..."
- "The difference between cheap vs quality ${businessType}"
- Story time format with visual demonstration

STRUCTURE:
0:00-0:01 - HOOK (movement + text + curiosity)
0:01-0:05 - Setup the scenario
0:05-0:12 - The entertaining/relatable middle
0:12-0:15 - Punchline or satisfying conclusion
Loop point back to start

MUST HAVE:
- Trending sound (check TikTok trending page)
- On-screen captions
- Fast cuts (every 2-3 seconds max)
- Personality! Be funny, relatable, or shocking

${city ? `Local angle: Mention ${city} for local reach` : ''}

DO NOT: Be boring, overly promotional, or use corporate language.`
                      })

                      prompts.push({
                        title: 'Day-in-the-Life TikTok (30-60 sec)',
                        prompt: `Script an entertaining "day in the life" TikTok for "${businessName}" (${businessType}).

AUDIENCE: Young people who love authentic, raw content.

HOOK: "Day in my life as a ${businessType} in ${city || 'the city'}..."

STRUCTURE:
0:00-0:03 - Morning routine/heading to job (relatable moment)
0:03-0:10 - Arriving at job site + what we're dealing with
0:10-0:25 - Montage of work with funny commentary
0:25-0:35 - Unexpected moment or challenge (drama!)
0:35-0:45 - Satisfying completion
0:45-0:50 - End of day + teaser for next video

VIBE:
- Raw, unfiltered, real
- Self-deprecating humor welcome
- Show the not-so-glamorous parts too
- Personality over polish

AUDIO: Trending sound or viral audio clip that fits the narrative.

GOAL: Comments like "I could watch this all day" and follows for more content.`
                      })

                      prompts.push({
                        title: 'Satisfying Process TikTok (10-20 sec)',
                        prompt: `Create a satisfying, addictive TikTok for "${businessName}" showing ${businessType} work.

AUDIENCE: Anyone who loves satisfying content (huge reach potential).

CONCEPT: Pure visual satisfaction - minimal talking, maximum "oddly satisfying" vibes.

IDEAS:
- Cleaning something very dirty
- Perfect technique demonstration
- Transformation reveal
- Symmetry and precision
- ASMR-worthy sounds

STRUCTURE:
0:00-0:02 - Tease the mess/before state
0:02-0:12 - The satisfying process (slow-mo or real-time)
0:12-0:15 - Clean reveal + logo

AUDIO:
- Trending satisfying audio
- OR original sound for ASMR
- OR popular song with beat drop at reveal

HASHTAGS: #satisfying #oddlysatisfying #${businessType.replace(/\s+/g, '')} #asmr

GOAL: Shares, saves, and "watch it again" loops.`
                      })
                    }

                    return prompts
                  }

                  const imagePlatforms = ['facebook', 'instagram'] as const
                  const videoPlatforms = ['facebook', 'instagram', 'youtube', 'tiktok'] as const

                  const imageTools = [
                    { name: 'Midjourney', url: 'https://midjourney.com', description: 'Best for artistic, creative visuals' },
                    { name: 'DALL·E', url: 'https://openai.com/dall-e-3', description: 'Great for realistic, detailed images' },
                    { name: 'Leonardo AI', url: 'https://leonardo.ai', description: 'Good for marketing visuals, free tier' },
                    { name: 'Adobe Firefly', url: 'https://firefly.adobe.com', description: 'Commercial-safe, integrates with Adobe' }
                  ]

                  const videoTools = [
                    { name: 'Runway', url: 'https://runwayml.com', description: 'Best for short AI video generation' },
                    { name: 'Pika', url: 'https://pika.art', description: 'Easy text-to-video, good for ads' },
                    { name: 'Synthesia', url: 'https://synthesia.io', description: 'AI avatars for professional videos' },
                    { name: 'HeyGen', url: 'https://heygen.com', description: 'AI spokesperson videos' }
                  ]

                  const copyPrompt = (promptId: string, text: string) => {
                    navigator.clipboard.writeText(text)
                    setAdPromptCopied(promptId)
                    setTimeout(() => setAdPromptCopied(null), 3000)
                  }

                  return (
                    <div className="space-y-6">
                      {/* Tab Selection */}
                      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                        <button
                          onClick={() => setAdCreationTab('image')}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                            adCreationTab === 'image' ? 'bg-white shadow text-orange-600' : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <Image className="w-4 h-4" />
                          Image Ads
                        </button>
                        <button
                          onClick={() => setAdCreationTab('video')}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                            adCreationTab === 'video' ? 'bg-white shadow text-orange-600' : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <Video className="w-4 h-4" />
                          Video Ads
                        </button>
                      </div>

                      {/* Image Ads Section */}
                      {adCreationTab === 'image' && (
                        <div className="space-y-4">
                          {/* Platform Tabs */}
                          <div className="flex gap-2">
                            {imagePlatforms.map(p => (
                              <button
                                key={p}
                                onClick={() => setAdPlatform(p)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                  adPlatform === p
                                    ? p === 'facebook' ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' : 'bg-pink-100 text-pink-700 border-2 border-pink-300'
                                    : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                                }`}
                              >
                                {p === 'facebook' ? <Facebook className="w-4 h-4" /> : <Instagram className="w-4 h-4" />}
                                {p.charAt(0).toUpperCase() + p.slice(1)}
                              </button>
                            ))}
                          </div>

                          {/* Platform Info */}
                          <div className={`p-3 rounded-lg ${adPlatform === 'facebook' ? 'bg-blue-50 border border-blue-200' : 'bg-pink-50 border border-pink-200'}`}>
                            <p className="text-sm">
                              <strong>Audience:</strong> {platforms[adPlatform as keyof typeof platforms].audience}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">{platforms[adPlatform as keyof typeof platforms].characteristics}</p>
                          </div>

                          {/* Prompts */}
                          <div className="space-y-4">
                            {generateImagePrompts(adPlatform as 'facebook' | 'instagram').map((item, idx) => (
                              <div key={idx} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
                                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                                  <Button
                                    size="sm"
                                    variant={adPromptCopied === `img-${adPlatform}-${idx}` ? "default" : "outline"}
                                    className={adPromptCopied === `img-${adPlatform}-${idx}` ? "bg-green-600" : ""}
                                    onClick={() => copyPrompt(`img-${adPlatform}-${idx}`, item.prompt)}
                                  >
                                    {adPromptCopied === `img-${adPlatform}-${idx}` ? (
                                      <><Check className="w-3 h-3 mr-1" /> Copied!</>
                                    ) : (
                                      <><Copy className="w-3 h-3 mr-1" /> Copy</>
                                    )}
                                  </Button>
                                </div>
                                <div className="p-3 max-h-48 overflow-y-auto">
                                  <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">{item.prompt}</pre>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Image AI Tools */}
                          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                            <h4 className="font-semibold text-gray-900 mb-3">Recommended Image AI Tools</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {imageTools.map(tool => (
                                <a
                                  key={tool.name}
                                  href={tool.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-2 bg-white rounded-lg border border-orange-200 hover:border-orange-400 transition-colors"
                                >
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{tool.name}</p>
                                    <p className="text-xs text-gray-500">{tool.description}</p>
                                  </div>
                                  <ExternalLink className="w-4 h-4 text-orange-500" />
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Video Ads Section */}
                      {adCreationTab === 'video' && (
                        <div className="space-y-4">
                          {/* Platform Tabs */}
                          <div className="flex flex-wrap gap-2">
                            {videoPlatforms.map(p => (
                              <button
                                key={p}
                                onClick={() => setAdPlatform(p)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                  adPlatform === p
                                    ? p === 'facebook' ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                                    : p === 'instagram' ? 'bg-pink-100 text-pink-700 border-2 border-pink-300'
                                    : p === 'youtube' ? 'bg-red-100 text-red-700 border-2 border-red-300'
                                    : 'bg-slate-100 text-slate-700 border-2 border-slate-300'
                                    : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                                }`}
                              >
                                {p === 'facebook' ? <Facebook className="w-4 h-4" /> :
                                 p === 'instagram' ? <Instagram className="w-4 h-4" /> :
                                 p === 'youtube' ? <Youtube className="w-4 h-4" /> :
                                 <Play className="w-4 h-4" />}
                                {p.charAt(0).toUpperCase() + p.slice(1)}
                              </button>
                            ))}
                          </div>

                          {/* Platform Info */}
                          <div className={`p-3 rounded-lg ${
                            adPlatform === 'facebook' ? 'bg-blue-50 border border-blue-200' :
                            adPlatform === 'instagram' ? 'bg-pink-50 border border-pink-200' :
                            adPlatform === 'youtube' ? 'bg-red-50 border border-red-200' :
                            'bg-slate-50 border border-slate-200'
                          }`}>
                            <p className="text-sm">
                              <strong>Audience:</strong> {platforms[adPlatform as keyof typeof platforms]?.audience || platforms.facebook.audience}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">{platforms[adPlatform as keyof typeof platforms]?.style || platforms.facebook.style}</p>
                          </div>

                          {/* Prompts */}
                          <div className="space-y-4">
                            {generateVideoPrompts(adPlatform as 'facebook' | 'instagram' | 'youtube' | 'tiktok').map((item, idx) => (
                              <div key={idx} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
                                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                                  <Button
                                    size="sm"
                                    variant={adPromptCopied === `vid-${adPlatform}-${idx}` ? "default" : "outline"}
                                    className={adPromptCopied === `vid-${adPlatform}-${idx}` ? "bg-green-600" : ""}
                                    onClick={() => copyPrompt(`vid-${adPlatform}-${idx}`, item.prompt)}
                                  >
                                    {adPromptCopied === `vid-${adPlatform}-${idx}` ? (
                                      <><Check className="w-3 h-3 mr-1" /> Copied!</>
                                    ) : (
                                      <><Copy className="w-3 h-3 mr-1" /> Copy</>
                                    )}
                                  </Button>
                                </div>
                                <div className="p-3 max-h-64 overflow-y-auto">
                                  <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">{item.prompt}</pre>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Video AI Tools */}
                          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                            <h4 className="font-semibold text-gray-900 mb-3">Recommended Video AI Tools</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {videoTools.map(tool => (
                                <a
                                  key={tool.name}
                                  href={tool.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-2 bg-white rounded-lg border border-orange-200 hover:border-orange-400 transition-colors"
                                >
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{tool.name}</p>
                                    <p className="text-xs text-gray-500">{tool.description}</p>
                                  </div>
                                  <ExternalLink className="w-4 h-4 text-orange-500" />
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tips */}
                      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <h4 className="font-medium text-orange-800 text-sm mb-2">Pro Tips</h4>
                        <ul className="text-xs text-orange-700 space-y-1">
                          <li>• Copy prompts directly into AI image/video generators like Midjourney, DALL·E, or Runway</li>
                          <li>• Each platform has 3 unique prompts tailored to its audience behavior</li>
                          <li>• For videos, use the scripts as storyboards for AI video tools or human production</li>
                          <li>• Test multiple variations - small changes can significantly impact performance</li>
                          <li>• Always A/B test your ads to find what resonates with your specific audience</li>
                        </ul>
                      </div>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>

            {/* Meeting Recording */}
            <Card variant="outlined" className={`border-2 ${isSectionComplete('meeting-recording') ? 'border-green-300 bg-green-50/30' : 'border-rose-200 bg-rose-50/50'}`}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSectionComplete('meeting-recording')}
                      className="flex-shrink-0 hover:scale-110 transition-transform"
                      title={isSectionComplete('meeting-recording') ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {isSectionComplete('meeting-recording') ? (
                        <CheckSquare className="w-5 h-5 text-green-500" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-300 hover:text-gray-400" />
                      )}
                    </button>
                    <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center">
                      <Mic className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isSectionComplete('meeting-recording') ? 'text-green-700 line-through' : 'text-gray-900'}`}>Meeting Recording</h3>
                      <p className="text-sm text-gray-500">Record & summarize client meetings with AI</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMeetingDetails(!showMeetingDetails)}
                    className="border-rose-300"
                  >
                    {showMeetingDetails ? 'Hide' : meetingRecordedAt ? 'View Recording' : 'Record Meeting'}
                  </Button>
                </div>

                {showMeetingDetails && (
                  <div className="space-y-4">
                    {/* Recording Controls */}
                    <div className="p-4 bg-white rounded-lg border border-rose-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {isRecording ? 'Recording in Progress...' : isProcessing ? 'Processing...' : 'Record Client Meeting'}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {isRecording
                              ? `Recording: ${formatTime(recordingTime)}`
                              : isProcessing
                              ? 'Transcribing and summarizing with AI...'
                              : meetingRecordedAt
                              ? `Last recorded: ${formatDate(meetingRecordedAt)}`
                              : 'Click to start recording your meeting'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {isRecording ? (
                            <Button
                              onClick={stopRecording}
                              className="bg-rose-600 hover:bg-rose-700"
                            >
                              <MicOff className="w-4 h-4 mr-2" />
                              Stop Recording
                            </Button>
                          ) : isProcessing ? (
                            <Button disabled className="bg-gray-400">
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </Button>
                          ) : (
                            <>
                              {meetingRecordedAt && (
                                <Button
                                  variant="outline"
                                  onClick={startRecording}
                                  className="border-rose-300"
                                >
                                  <RotateCcw className="w-4 h-4 mr-2" />
                                  Re-record
                                </Button>
                              )}
                              {!meetingRecordedAt && (
                                <Button
                                  onClick={startRecording}
                                  className="bg-rose-600 hover:bg-rose-700"
                                >
                                  <Mic className="w-4 h-4 mr-2" />
                                  Start Recording
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Recording indicator */}
                      {isRecording && (
                        <div className="mt-4 flex items-center gap-3 p-3 bg-rose-50 rounded-lg">
                          <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse" />
                          <span className="text-sm text-rose-700 font-medium">
                            Recording... Speak clearly into your microphone
                          </span>
                        </div>
                      )}

                      {/* Error message */}
                      {recordingError && (
                        <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 rounded-lg text-red-700">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm">{recordingError}</span>
                        </div>
                      )}
                    </div>

                    {/* Transcript Section */}
                    {meetingTranscript && (
                      <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                        <button
                          onClick={() => setShowTranscript(!showTranscript)}
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-600" />
                            <span className="font-medium text-gray-900">Full Transcript</span>
                            <span className="text-xs text-gray-500">({meetingTranscript.split(' ').length} words)</span>
                          </div>
                          <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showTranscript ? 'rotate-90' : ''}`} />
                        </button>
                        {showTranscript && (
                          <div className="p-4 border-t border-gray-200 bg-white">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{meetingTranscript}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Summary Section */}
                    {meetingSummary && (
                      <div className="bg-rose-50 rounded-lg border border-rose-200 overflow-hidden">
                        <button
                          onClick={() => setShowSummary(!showSummary)}
                          className="w-full flex items-center justify-between p-4 hover:bg-rose-100 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-rose-600" />
                            <span className="font-medium text-gray-900">AI Meeting Summary</span>
                          </div>
                          <ChevronRight className={`w-5 h-5 text-rose-400 transition-transform ${showSummary ? 'rotate-90' : ''}`} />
                        </button>
                        {showSummary && (
                          <div className="p-4 border-t border-rose-200 bg-white">
                            <div className="prose prose-sm max-w-none text-gray-700">
                              {meetingSummary.split('\n').map((line, i) => {
                                if (line.startsWith('## ')) {
                                  return <h4 key={i} className="font-semibold text-gray-900 mt-4 mb-2">{line.replace('## ', '')}</h4>
                                }
                                if (line.startsWith('- ')) {
                                  return <li key={i} className="ml-4 text-sm">{line.replace('- ', '')}</li>
                                }
                                if (line.trim() === '') {
                                  return <br key={i} />
                                }
                                return <p key={i} className="text-sm mb-2">{line}</p>
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tips */}
                    {!meetingTranscript && !isRecording && !isProcessing && (
                      <div className="p-3 bg-rose-50 rounded-lg border border-rose-200">
                        <h4 className="font-medium text-rose-800 text-sm mb-2">Recording Tips</h4>
                        <ul className="text-xs text-rose-700 space-y-1">
                          <li>• Use a quiet environment for best results</li>
                          <li>• Speak clearly and at a moderate pace</li>
                          <li>• The AI will transcribe and summarize automatically</li>
                          <li>• Recording is saved to this profile for future reference</li>
                          <li>• You can re-record to overwrite the previous meeting</li>
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* LLC Formation */}
            <Card variant="outlined" className={`border-2 ${isSectionComplete('llc') ? 'border-green-300 bg-green-50/30' : 'border-amber-200 bg-amber-50/50'}`}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSectionComplete('llc')}
                      className="flex-shrink-0 hover:scale-110 transition-transform"
                      title={isSectionComplete('llc') ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {isSectionComplete('llc') ? (
                        <CheckSquare className="w-5 h-5 text-green-500" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-300 hover:text-gray-400" />
                      )}
                    </button>
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isSectionComplete('llc') ? 'text-green-700 line-through' : 'text-gray-900'}`}>Form an LLC</h3>
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

            {/* Client Outreach Message */}
            <Card variant="outlined" className={`border-2 ${isSectionComplete('client-outreach') ? 'border-green-300 bg-green-50/30' : 'border-cyan-200 bg-cyan-50/50'}`}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSectionComplete('client-outreach')}
                      className="flex-shrink-0 hover:scale-110 transition-transform"
                      title={isSectionComplete('client-outreach') ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {isSectionComplete('client-outreach') ? (
                        <CheckSquare className="w-5 h-5 text-green-500" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-300 hover:text-gray-400" />
                      )}
                    </button>
                    <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                      <Send className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isSectionComplete('client-outreach') ? 'text-green-700 line-through' : 'text-gray-900'}`}>Send to Client</h3>
                      <p className="text-sm text-gray-500">Ready-to-send message with everything you've built</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowOutreachDetails(!showOutreachDetails)}
                    className="border-cyan-300"
                  >
                    {showOutreachDetails ? 'Hide' : 'Get Message'}
                  </Button>
                </div>

                {showOutreachDetails && (
                  <div className="space-y-4">
                    {/* Website URL Input */}
                    <div className="p-4 bg-white rounded-lg border border-cyan-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Client's Website URL
                      </label>
                      <input
                        type="url"
                        value={clientWebsiteUrl}
                        onChange={(e) => setClientWebsiteUrl(e.target.value)}
                        placeholder="https://clientbusiness.vercel.app"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">Enter the deployed website URL for this client</p>
                    </div>

                    {/* Message Preview */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">Your Outreach Message</h4>
                        <Button
                          size="sm"
                          variant={outreachMessageCopied ? "default" : "outline"}
                          className={outreachMessageCopied ? "bg-green-600" : ""}
                          onClick={() => {
                            const message = `Hi there!

I noticed ${profile?.name || 'your business'} and thought you might be interested in what I've put together.

I've created a complete professional website package for your business that includes:

✅ Fully responsive, mobile-friendly website
✅ SEO optimized for local search
✅ Fast-loading, modern design
✅ Contact forms & business information
✅ Ready to launch immediately

${clientWebsiteUrl ? `🌐 Preview your website here: ${clientWebsiteUrl}` : '🌐 [Website link will appear here once you enter it above]'}

This is a ready-to-go solution - no technical knowledge needed on your end.

If you're interested in owning this website for your business, I'd love to chat about how we can get this live for you.

Feel free to check out more of our work at: https://beirux.vercel.app/

Looking forward to hearing from you!

Best regards`
                            navigator.clipboard.writeText(message)
                            setOutreachMessageCopied(true)
                            setTimeout(() => setOutreachMessageCopied(false), 3000)
                          }}
                        >
                          {outreachMessageCopied ? (
                            <>
                              <Check className="w-3 h-3 mr-1" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 mr-1" />
                              Copy Message
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm text-gray-700 whitespace-pre-wrap font-mono">
{`Hi there!

I noticed ${profile?.name || 'your business'} and thought you might be interested in what I've put together.

I've created a complete professional website package for your business that includes:

✅ Fully responsive, mobile-friendly website
✅ SEO optimized for local search
✅ Fast-loading, modern design
✅ Contact forms & business information
✅ Ready to launch immediately

${clientWebsiteUrl ? `🌐 Preview your website here: ${clientWebsiteUrl}` : '🌐 [Website link will appear here once you enter it above]'}

This is a ready-to-go solution - no technical knowledge needed on your end.

If you're interested in owning this website for your business, I'd love to chat about how we can get this live for you.

Feel free to check out more of our work at: https://beirux.vercel.app/

Looking forward to hearing from you!

Best regards`}
                      </div>
                    </div>

                    {/* Tips */}
                    <div className="p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                      <h4 className="font-medium text-cyan-800 text-sm mb-2">Outreach Tips</h4>
                      <ul className="text-xs text-cyan-700 space-y-1">
                        <li>• Send via email, LinkedIn, Facebook, or their contact form</li>
                        <li>• Personalize the opening line based on their business</li>
                        <li>• Follow up after 3-5 days if no response</li>
                        <li>• Include a screenshot of their website in the message if possible</li>
                      </ul>
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
