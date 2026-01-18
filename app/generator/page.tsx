'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { BusinessProfile, BusinessInfo, FormStep, Testimonial, PortfolioSection, PricingPackage, FAQ } from '@/lib/types'
import { SearchStep } from '@/components/generator/SearchStep'
import { SelectBusinessStep } from '@/components/generator/SelectBusinessStep'
import { BasicInfoStep } from '@/components/generator/BasicInfoStep'
import { HeroImageStep } from '@/components/generator/HeroImageStep'
import { ContactInfoStep } from '@/components/generator/ContactInfoStep'
import { TestimonialsStep } from '@/components/generator/TestimonialsStep'
import { PortfolioStep } from '@/components/generator/PortfolioStep'
import { PricingStep } from '@/components/generator/PricingStep'
import { FAQsStep } from '@/components/generator/FAQsStep'
import { PreviewStep, WebsiteStyle } from '@/components/generator/PreviewStep'
import { GeneratingStep } from '@/components/generator/GeneratingStep'
import { CompleteStep } from '@/components/generator/CompleteStep'
import { LogoGeneratorStep } from '@/components/generator/LogoGeneratorStep'
import { GoogleBusinessStep } from '@/components/generator/GoogleBusinessStep'
import { SocialMediaStep } from '@/components/generator/SocialMediaStep'
import { UpdateProfilesStep } from '@/components/generator/UpdateProfilesStep'
import { AllDoneStep } from '@/components/generator/AllDoneStep'
import { StepIndicator } from '@/components/generator/StepIndicator'

// Loading fallback for Suspense
function GeneratorLoading() {
  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center animate-pulse">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg text-gray-600">Loading...</span>
      </div>
    </div>
  )
}

// Wrapper component to handle Suspense for useSearchParams
export default function GeneratorPage() {
  return (
    <Suspense fallback={<GeneratorLoading />}>
      <GeneratorContent />
    </Suspense>
  )
}

const initialBusinessInfo: BusinessInfo = {
  name: '',
  tagline: '',
  description: '',
  yearsInBusiness: 0,
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  googleProfileUrl: '',
  facebookUrl: '',
  instagramUrl: '',
  linkedinUrl: '',
  yelpUrl: '',
  tiktokUrl: '',
  youtubeUrl: '',
  businessType: '',
  services: [],
  serviceAreas: [],
  openingHours: {},
  testimonials: [],
  portfolioSections: [],
  pricing: [],
  faqs: [],
  primaryCTA: undefined,
}

const steps: { key: FormStep; label: string }[] = [
  { key: 'search', label: 'Search' },
  { key: 'select-business', label: 'Select' },
  { key: 'basic-info', label: 'Basic Info' },
  { key: 'hero-image', label: 'Hero Image' },
  { key: 'contact-info', label: 'Contact' },
  { key: 'testimonials', label: 'Testimonials' },
  { key: 'portfolio', label: 'Portfolio' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'faqs', label: 'FAQs' },
  { key: 'preview', label: 'Preview' },
]

function GeneratorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<FormStep>('search')
  const [searchResults, setSearchResults] = useState<BusinessProfile[]>([])
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessProfile | null>(null)
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(initialBusinessInfo)
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false)
  const [isQuickMode, setIsQuickMode] = useState<boolean>(false)

  // Handle quick mode - start directly at basic-info step
  useEffect(() => {
    const mode = searchParams.get('mode')
    if (mode === 'quick') {
      setIsQuickMode(true)
      setCurrentStep('basic-info')
    }
  }, [searchParams])

  const handleSearchResults = (results: BusinessProfile[]) => {
    setSearchResults(results)
    setCurrentStep('select-business')
  }

  const handleSelectBusiness = (business: BusinessProfile) => {
    setSelectedBusiness(business)
    // Pre-fill business info from the selected profile
    setBusinessInfo({
      ...initialBusinessInfo,
      name: business.name,
      phone: business.phone || '',
      address: business.address,
      city: business.city,
      state: business.state,
      zipCode: business.zipCode,
      businessType: business.types[0] || '',
    })
    setCurrentStep('basic-info')
  }

  const handleBasicInfoSubmit = (data: Partial<BusinessInfo>) => {
    setBusinessInfo(prev => ({ ...prev, ...data }))
    setCurrentStep('hero-image')
  }

  const handleHeroImageSubmit = (heroImage: string) => {
    setBusinessInfo(prev => ({ ...prev, heroImage }))
    setCurrentStep('contact-info')
  }

  const handleContactInfoSubmit = (data: Partial<BusinessInfo>) => {
    setBusinessInfo(prev => ({ ...prev, ...data }))
    setCurrentStep('testimonials')
  }

  const handleTestimonialsSubmit = (testimonials: Testimonial[]) => {
    setBusinessInfo(prev => ({ ...prev, testimonials }))
    setCurrentStep('portfolio')
  }

  const handlePortfolioSubmit = (portfolioSections: PortfolioSection[]) => {
    setBusinessInfo(prev => ({ ...prev, portfolioSections }))
    setCurrentStep('pricing')
  }

  const handlePricingSubmit = (pricing: PricingPackage[]) => {
    setBusinessInfo(prev => ({ ...prev, pricing }))
    setCurrentStep('faqs')
  }

  const handleFAQsSubmit = (faqs: FAQ[]) => {
    setBusinessInfo(prev => ({ ...prev, faqs }))
    setCurrentStep('preview')
  }

  const handleGenerate = async (style: WebsiteStyle) => {
    setCurrentStep('generating')

    try {
      const response = await fetch('/api/download-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ businessInfo, style }),
      })

      if (response.ok) {
        // Get the blob from the response
        const blob = await response.blob()

        // Create a download link
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        // Use -data.zip suffix - this triggers the watcher
        a.download = `${businessInfo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-data.zip`
        document.body.appendChild(a)
        a.click()

        // Cleanup
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        setDownloadSuccess(true)
      } else {
        console.error('Download failed')
        setDownloadSuccess(false)
      }

      setCurrentStep('complete')
    } catch (error) {
      console.error('Download error:', error)
      setDownloadSuccess(false)
      setCurrentStep('complete')
    }
  }

  // Download only - uses different filename so watcher doesn't pick it up
  const handleDownloadOnly = async (style: WebsiteStyle) => {
    setCurrentStep('generating')

    try {
      const response = await fetch('/api/download-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ businessInfo, style }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        // Use -export.zip suffix - this does NOT trigger the watcher
        a.download = `${businessInfo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-export.zip`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        setDownloadSuccess(true)
      } else {
        console.error('Download failed')
        setDownloadSuccess(false)
      }

      setCurrentStep('complete')
    } catch (error) {
      console.error('Download error:', error)
      setDownloadSuccess(false)
      setCurrentStep('complete')
    }
  }

  const handleBack = () => {
    const stepOrder: FormStep[] = [
      'search',
      'select-business',
      'basic-info',
      'hero-image',
      'contact-info',
      'testimonials',
      'portfolio',
      'pricing',
      'faqs',
      'preview',
    ]
    const postWebsiteSteps: FormStep[] = [
      'complete',
      'logo-generator',
      'google-business',
      'social-media',
      'update-profiles',
    ]

    // In quick mode, going back from basic-info returns to home
    if (isQuickMode && currentStep === 'basic-info') {
      router.push('/')
      return
    }

    // Handle back for main flow
    const mainIndex = stepOrder.indexOf(currentStep)
    if (mainIndex > 0) {
      setCurrentStep(stepOrder[mainIndex - 1])
      return
    }

    // Handle back for post-website flow
    const postIndex = postWebsiteSteps.indexOf(currentStep)
    if (postIndex > 0) {
      setCurrentStep(postWebsiteSteps[postIndex - 1])
    }
  }

  // Handlers for post-website steps
  const handleContinueToLogo = () => setCurrentStep('logo-generator')
  const handleLogoNext = () => setCurrentStep('google-business')
  const handleLogoSkip = () => setCurrentStep('google-business')
  const handleGoogleNext = () => setCurrentStep('social-media')
  const handleGoogleSkip = () => setCurrentStep('social-media')
  const handleSocialNext = () => setCurrentStep('update-profiles')
  const handleSocialSkip = () => setCurrentStep('update-profiles')
  const handleUpdateFinish = () => setCurrentStep('all-done')
  const handleUpdateSkip = () => setCurrentStep('all-done')

  const handleStartOver = () => {
    if (isQuickMode) {
      setCurrentStep('basic-info')
    } else {
      setCurrentStep('search')
    }
    setSearchResults([])
    setSelectedBusiness(null)
    setBusinessInfo(initialBusinessInfo)
    setDownloadSuccess(false)
  }

  const postWebsiteSteps: FormStep[] = ['complete', 'logo-generator', 'google-business', 'social-media', 'update-profiles', 'all-done']
  const showStepIndicator = !['generating', ...postWebsiteSteps].includes(currentStep)

  // Steps to display in the indicator - quick mode skips search and select steps
  const quickModeSteps = steps.filter(s => s.key !== 'search' && s.key !== 'select-business')
  const displaySteps = isQuickMode ? quickModeSteps : steps

  return (
    <div className="min-h-screen mesh-bg">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/70 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </Link>

            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-lg">Website Generator</span>
              </div>
            </div>

            <div className="w-20" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Step Indicator */}
      {showStepIndicator && (
        <div className="pt-24 pb-8 px-4">
          <StepIndicator steps={displaySteps} currentStep={currentStep} />
        </div>
      )}

      {/* Main Content */}
      <main className={`px-4 sm:px-6 lg:px-8 pb-20 ${!showStepIndicator ? 'pt-24' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 'search' && (
              <SearchStep onSearchResults={handleSearchResults} />
            )}

            {currentStep === 'select-business' && (
              <SelectBusinessStep
                businesses={searchResults}
                onSelect={handleSelectBusiness}
                onBack={handleBack}
              />
            )}

            {currentStep === 'basic-info' && (selectedBusiness || isQuickMode) && (
              <BasicInfoStep
                businessInfo={businessInfo}
                onSubmit={handleBasicInfoSubmit}
                onBack={handleBack}
              />
            )}

            {currentStep === 'hero-image' && (
              <HeroImageStep
                heroImage={businessInfo.heroImage}
                businessType={businessInfo.businessType}
                businessName={businessInfo.name}
                businessTagline={businessInfo.tagline}
                businessDescription={businessInfo.description}
                businessServices={businessInfo.services}
                portfolioImages={businessInfo.portfolioSections.flatMap(s => s.images)}
                onSubmit={handleHeroImageSubmit}
                onBack={handleBack}
              />
            )}

            {currentStep === 'contact-info' && (
              <ContactInfoStep
                businessInfo={businessInfo}
                onSubmit={handleContactInfoSubmit}
                onBack={handleBack}
              />
            )}

            {currentStep === 'testimonials' && (
              <TestimonialsStep
                testimonials={businessInfo.testimonials}
                businessName={businessInfo.name}
                businessType={businessInfo.businessType}
                services={businessInfo.services}
                onSubmit={handleTestimonialsSubmit}
                onBack={handleBack}
              />
            )}

            {currentStep === 'portfolio' && (
              <PortfolioStep
                portfolioSections={businessInfo.portfolioSections}
                businessType={businessInfo.businessType}
                onSubmit={handlePortfolioSubmit}
                onBack={handleBack}
              />
            )}

            {currentStep === 'pricing' && (
              <PricingStep
                pricing={businessInfo.pricing || []}
                businessName={businessInfo.name}
                businessType={businessInfo.businessType}
                services={businessInfo.services}
                onSubmit={handlePricingSubmit}
                onBack={handleBack}
              />
            )}

            {currentStep === 'faqs' && (
              <FAQsStep
                faqs={businessInfo.faqs || []}
                businessName={businessInfo.name}
                businessType={businessInfo.businessType}
                services={businessInfo.services}
                onSubmit={handleFAQsSubmit}
                onBack={handleBack}
              />
            )}

            {currentStep === 'preview' && (
              <PreviewStep
                businessInfo={businessInfo}
                onGenerate={handleGenerate}
                onDownloadOnly={handleDownloadOnly}
                onBack={handleBack}
              />
            )}

            {currentStep === 'generating' && (
              <GeneratingStep businessName={businessInfo.name} />
            )}

            {currentStep === 'complete' && (
              <CompleteStep
                businessInfo={businessInfo}
                downloadSuccess={downloadSuccess}
                onContinue={handleContinueToLogo}
              />
            )}

            {currentStep === 'logo-generator' && (
              <LogoGeneratorStep
                businessName={businessInfo.name}
                businessType={businessInfo.businessType}
                tagline={businessInfo.tagline}
                onNext={handleLogoNext}
                onSkip={handleLogoSkip}
                onBack={handleBack}
              />
            )}

            {currentStep === 'google-business' && (
              <GoogleBusinessStep
                businessInfo={businessInfo}
                onNext={handleGoogleNext}
                onSkip={handleGoogleSkip}
                onBack={handleBack}
              />
            )}

            {currentStep === 'social-media' && (
              <SocialMediaStep
                businessInfo={businessInfo}
                onNext={handleSocialNext}
                onSkip={handleSocialSkip}
                onBack={handleBack}
              />
            )}

            {currentStep === 'update-profiles' && (
              <UpdateProfilesStep
                businessName={businessInfo.name}
                onFinish={handleUpdateFinish}
                onSkip={handleUpdateSkip}
                onBack={handleBack}
              />
            )}

            {currentStep === 'all-done' && (
              <AllDoneStep
                businessName={businessInfo.name}
                onStartOver={handleStartOver}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
