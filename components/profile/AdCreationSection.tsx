'use client'

import { useState, useEffect } from 'react'
import {
  Megaphone,
  Image as ImageIcon,
  Video,
  Sparkles,
  Copy,
  Check,
  Download,
  Loader2,
  ChevronDown,
  ChevronUp,
  Trash2,
  RefreshCw,
  Target,
  Lightbulb,
  Clock,
  Users,
  Zap,
  FileText,
  ExternalLink,
  Crosshair,
  DollarSign,
  MapPin,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Film,
  Mic,
  Layers,
  Package,
  Sun,
  Camera,
  Eye,
  Smartphone,
  Palette,
} from 'lucide-react'
import {
  findIndustryProfile,
  generateImagePrompt,
  generateImagePromptWithStyle,
  generateVideoScript,
  generateVoiceoverScript,
  PLATFORM_SPECS,
  VIDEO_FORMATS_2026,
  UGC_STYLES,
  SCROLL_STOP_TECHNIQUES,
  IMAGE_FORMAT_PRESETS,
  AI_DISCLOSURE,
  getSeasonalContent,
  VOICEOVER_STYLES,
  exportToCsv,
  generateBulkConfig,
  calculateBulkGenerationCount,
  // Platform-specific rankings (2026)
  PLATFORM_UGC_RANKINGS,
  PLATFORM_VIDEO_FORMAT_RANKINGS,
  PLATFORM_SCROLLSTOP_RANKINGS,
  PLATFORM_HOOK_RANKINGS,
  getBestUGCStyleForPlatform,
  getBestVideoFormatForPlatform,
  getBestScrollStopForPlatform,
  type IndustryProfile,
  type VideoScript2026,
  type UGCStyleKey,
} from '@/lib/marketing-library'

interface BusinessInfo {
  name: string
  businessType: string
  services: string[]
  city: string
  state: string
  tagline?: string
}

interface GeneratedImage {
  id?: string
  image: string
  prompt: string
  revisedPrompt?: string
  platform: string
  storagePath?: string
  created_at?: string
}

interface AdCopyVariation {
  hook: string
  body: string
  cta: string
  headline: string
  hashtags: string[]
}

interface TargetingSection {
  label: string
  items: string[]
}

interface FormattedTargeting {
  title: string
  sections: TargetingSection[]
}

interface GeneratedAdCopy {
  variations: AdCopyVariation[]
  targetAudience: string
  bestTimeToPost: string
  proTip: string
  formattedTargeting?: FormattedTargeting
}

interface AdCreationSectionProps {
  profileId: string
  businessInfo: BusinessInfo
  isComplete: boolean
  onToggleComplete: () => void
}

type Platform = 'facebook' | 'instagram' | 'youtube' | 'tiktok' | 'google'
type AdType = 'awareness' | 'consideration' | 'conversion'

export function AdCreationSection({
  profileId,
  businessInfo,
  isComplete,
  onToggleComplete,
}: AdCreationSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'copy'>('copy')
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('facebook')
  const [selectedAdType, setSelectedAdType] = useState<AdType>('consideration')

  // Image generation state
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [imagePromptType, setImagePromptType] = useState<'hero' | 'service' | 'testimonial' | 'promo'>('hero')
  const [selectedUgcStyle, setSelectedUgcStyle] = useState<UGCStyleKey | null>(null)
  const [selectedScrollStop, setSelectedScrollStop] = useState<keyof typeof SCROLL_STOP_TECHNIQUES.visual | null>(null)
  const [selectedImageFormat, setSelectedImageFormat] = useState<string | null>(null)

  // Copy generation state
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false)
  const [generatedCopy, setGeneratedCopy] = useState<GeneratedAdCopy | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  // Video script state
  const [videoDuration, setVideoDuration] = useState<'15s' | '30s' | '60s'>('15s')
  const [selectedVideoFormat, setSelectedVideoFormat] = useState<keyof typeof VIDEO_FORMATS_2026 | null>(null)
  const [showAllHooks, setShowAllHooks] = useState(false)
  const [showBroll, setShowBroll] = useState(false)
  const [showVoiceover, setShowVoiceover] = useState(false)
  const [selectedVoiceStyle, setSelectedVoiceStyle] = useState<keyof typeof VOICEOVER_STYLES>('conversational')

  // Industry profile
  const [industryProfile, setIndustryProfile] = useState<IndustryProfile | null>(null)

  // Seasonal content
  const [seasonalContent, setSeasonalContent] = useState<ReturnType<typeof getSeasonalContent> | null>(null)

  // Bulk generation state
  const [bulkScope, setBulkScope] = useState<'minimal' | 'standard' | 'comprehensive'>('standard')
  const [showBulkPanel, setShowBulkPanel] = useState(false)

  // Load industry profile
  useEffect(() => {
    const profile = findIndustryProfile(
      businessInfo.businessType,
      businessInfo.name,
      businessInfo.services
    )
    setIndustryProfile(profile)

    // Get seasonal content
    const seasonal = getSeasonalContent(profile.id)
    setSeasonalContent(seasonal)
  }, [businessInfo])

  // Load existing images
  useEffect(() => {
    if (profileId && isExpanded) {
      loadExistingImages()
    }
  }, [profileId, isExpanded])

  // AUTO-SELECT: Platform-optimized defaults when platform changes
  useEffect(() => {
    // Auto-select best UGC style for platform
    const bestUGC = getBestUGCStyleForPlatform(selectedPlatform)
    if (bestUGC.style && bestUGC.ranking === 'recommended') {
      setSelectedUgcStyle(bestUGC.style as UGCStyleKey)
    } else {
      setSelectedUgcStyle(null) // Studio for platforms that prefer professional shots
    }

    // Auto-select best scroll-stop technique for platform
    const bestScrollStop = getBestScrollStopForPlatform(selectedPlatform)
    if (bestScrollStop.ranking === 'top3') {
      setSelectedScrollStop(bestScrollStop.technique as keyof typeof SCROLL_STOP_TECHNIQUES.visual)
    }

    // Auto-select best video format for platform
    const bestVideoFormat = getBestVideoFormatForPlatform(selectedPlatform)
    if (bestVideoFormat.ranking === 'top3') {
      setSelectedVideoFormat(bestVideoFormat.format as keyof typeof VIDEO_FORMATS_2026)
    }
  }, [selectedPlatform])

  // Helper: Get UGC style ranking for current platform
  const getUGCRanking = (style: UGCStyleKey): 'recommended' | 'acceptable' | 'avoid' | null => {
    const rankings = PLATFORM_UGC_RANKINGS[selectedPlatform]
    if (!rankings) return null
    if (rankings.recommended.includes(style)) return 'recommended'
    if (rankings.acceptable.includes(style)) return 'acceptable'
    if (rankings.avoid.includes(style)) return 'avoid'
    return null
  }

  // Helper: Get scroll-stop technique ranking for current platform
  const getScrollStopRanking = (technique: string): 'top3' | 'effective' | 'less' | null => {
    const rankings = PLATFORM_SCROLLSTOP_RANKINGS[selectedPlatform]
    if (!rankings) return null
    if (rankings.top3.includes(technique)) return 'top3'
    if (rankings.effective.includes(technique)) return 'effective'
    if (rankings.lessEffective.includes(technique)) return 'less'
    return null
  }

  // Helper: Get video format ranking for current platform
  const getVideoFormatRanking = (format: string): 'top3' | 'good' | 'avoid' | null => {
    const rankings = PLATFORM_VIDEO_FORMAT_RANKINGS[selectedPlatform]
    if (!rankings) return null
    if (rankings.top3.includes(format)) return 'top3'
    if (rankings.good.includes(format)) return 'good'
    if (rankings.avoid.includes(format)) return 'avoid'
    return null
  }

  const loadExistingImages = async () => {
    try {
      const response = await fetch(`/api/generate-ad-image?profileId=${profileId}`)
      if (response.ok) {
        const data = await response.json()
        setGeneratedImages(data.images || [])
      }
    } catch (error) {
      console.error('Failed to load images:', error)
    }
  }

  const handleGenerateImage = async () => {
    if (!industryProfile) return

    setIsGeneratingImage(true)
    try {
      // Use enhanced prompt with UGC and scroll-stop if selected
      const promptData = selectedUgcStyle || selectedScrollStop
        ? generateImagePromptWithStyle(
            industryProfile,
            businessInfo.name,
            selectedPlatform,
            imagePromptType,
            selectedUgcStyle || undefined,
            selectedScrollStop || undefined
          )
        : {
            prompt: generateImagePrompt(
              industryProfile,
              businessInfo.name,
              selectedPlatform,
              imagePromptType
            ),
            format: IMAGE_FORMAT_PRESETS[selectedPlatform].formats[0],
          }

      // Determine size based on selected format or platform default
      let size: '1024x1024' | '1792x1024' | '1024x1792' = '1024x1024'
      const format = selectedImageFormat
        ? IMAGE_FORMAT_PRESETS[selectedPlatform].formats.find(f => f.name === selectedImageFormat)
        : IMAGE_FORMAT_PRESETS[selectedPlatform].formats.find(
            f => f.name === IMAGE_FORMAT_PRESETS[selectedPlatform].recommended
          )

      if (format) {
        if (format.ratio === '9:16' || format.ratio === '4:5') {
          size = '1024x1792'
        } else if (format.ratio === '16:9' || format.ratio === '1.91:1') {
          size = '1792x1024'
        }
      }

      const response = await fetch('/api/generate-ad-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptData.prompt,
          profileId,
          platform: selectedPlatform,
          size,
          quality: 'hd',
          style: 'natural',
        }),
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedImages(prev => [{
          image: data.image,
          prompt: promptData.prompt,
          revisedPrompt: data.revisedPrompt,
          platform: selectedPlatform,
          storagePath: data.storagePath,
        }, ...prev])
      } else {
        alert(data.error || 'Failed to generate image')
      }
    } catch (error) {
      console.error('Generate image error:', error)
      alert('Failed to generate image')
    } finally {
      setIsGeneratingImage(false)
    }
  }

  const handleGenerateCopy = async () => {
    setIsGeneratingCopy(true)
    try {
      const response = await fetch('/api/generate-ad-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: businessInfo.name,
          businessType: businessInfo.businessType,
          services: businessInfo.services,
          city: businessInfo.city,
          state: businessInfo.state,
          tagline: businessInfo.tagline,
          platform: selectedPlatform,
          adType: selectedAdType,
          includeEmoji: selectedPlatform !== 'google',
        }),
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedCopy({
          variations: data.variations,
          targetAudience: data.targetAudience,
          bestTimeToPost: data.bestTimeToPost,
          proTip: data.proTip,
          formattedTargeting: data.formattedTargeting,
        })
      } else {
        alert(data.error || 'Failed to generate copy')
      }
    } catch (error) {
      console.error('Generate copy error:', error)
      alert('Failed to generate ad copy')
    } finally {
      setIsGeneratingCopy(false)
    }
  }

  const handleCopyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleDeleteImage = async (image: GeneratedImage) => {
    if (!image.id) {
      setGeneratedImages(prev => prev.filter(img => img.image !== image.image))
      return
    }

    try {
      const response = await fetch(
        `/api/generate-ad-image?imageId=${image.id}&storagePath=${image.storagePath}`,
        { method: 'DELETE' }
      )

      if (response.ok) {
        setGeneratedImages(prev => prev.filter(img => img.id !== image.id))
      }
    } catch (error) {
      console.error('Delete image error:', error)
    }
  }

  const handleDownloadImage = async (imageUrl: string, platform: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${businessInfo.name.toLowerCase().replace(/\s+/g, '-')}-${platform}-ad.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download error:', error)
    }
  }

  const handleExportAll = () => {
    if (!generatedCopy || !industryProfile) return

    const ads = generatedCopy.variations.map((v, i) => ({
      platform: selectedPlatform,
      adName: `${businessInfo.name} - ${selectedPlatform} - Variation ${i + 1}`,
      headline: v.headline,
      primaryText: v.body,
      description: v.hook,
      callToAction: v.cta,
      targeting: generatedCopy.targetAudience,
      placement: 'Feed',
      format: 'Single Image',
    }))

    const csv = exportToCsv(ads)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${businessInfo.name.toLowerCase().replace(/\s+/g, '-')}-ads-export.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const platformColors: Record<Platform, string> = {
    facebook: 'bg-blue-500',
    instagram: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500',
    youtube: 'bg-red-500',
    tiktok: 'bg-black',
    google: 'bg-blue-600',
  }

  const adTypeLabels: Record<AdType, { label: string; icon: typeof Target; description: string }> = {
    awareness: { label: 'Awareness', icon: Users, description: 'Build brand recognition' },
    consideration: { label: 'Consideration', icon: Lightbulb, description: 'Drive interest & research' },
    conversion: { label: 'Conversion', icon: Zap, description: 'Get immediate action' },
  }

  // Generate video script
  const videoScript: VideoScript2026 | null = industryProfile ? generateVideoScript(
    industryProfile,
    businessInfo.name,
    businessInfo.services,
    businessInfo.city,
    selectedPlatform === 'google' ? 'youtube' : selectedPlatform,
    videoDuration,
    selectedVideoFormat || undefined
  ) : null

  // Generate voiceover if video script exists
  const voiceoverData = videoScript
    ? generateVoiceoverScript(videoScript, selectedVoiceStyle)
    : null

  // Bulk generation config
  const bulkConfig = generateBulkConfig(bulkScope)
  const bulkCounts = calculateBulkGenerationCount(bulkConfig)

  // Get AI disclosure for current platform
  const getAIDisclosure = () => {
    if (selectedPlatform === 'tiktok') {
      return { requirement: AI_DISCLOSURE.tiktok.requirement, disclosureText: AI_DISCLOSURE.tiktok.disclosureText, how: AI_DISCLOSURE.tiktok.how }
    } else if (['facebook', 'instagram'].includes(selectedPlatform)) {
      return { requirement: AI_DISCLOSURE.meta.requirement, disclosureText: AI_DISCLOSURE.meta.disclosureText, how: AI_DISCLOSURE.meta.how }
    } else {
      return { requirement: AI_DISCLOSURE.google.requirement, disclosureText: AI_DISCLOSURE.google.disclosureText, how: AI_DISCLOSURE.google.how }
    }
  }
  const currentDisclosure = getAIDisclosure()

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${isComplete ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${isComplete ? 'bg-green-500' : 'bg-gradient-to-br from-orange-500 to-pink-500'} flex items-center justify-center`}>
            <Megaphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className={`font-semibold ${isComplete ? 'text-green-700' : 'text-gray-900'}`}>
              Ad Creation Studio
            </h3>
            <p className="text-sm text-gray-500">Generate ads for Facebook, Instagram, YouTube & TikTok</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleComplete(); }}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${isComplete ? 'bg-green-200 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {isComplete ? 'Completed' : 'Mark Complete'}
          </button>
          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 space-y-6">
          {/* Industry Detection + Seasonal Alert */}
          {industryProfile && (
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-indigo-900">Industry Detected: {industryProfile.name}</p>
                    <p className="text-sm text-indigo-700 mt-1">
                      Prompts and copy are optimized for {industryProfile.name.toLowerCase()} marketing best practices.
                    </p>
                  </div>
                </div>
              </div>

              {/* Seasonal Alert */}
              {seasonalContent?.isHighSeason && seasonalContent.activeSeason && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
                  <div className="flex items-start gap-3">
                    <Sun className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-900">
                        Seasonal Opportunity: {seasonalContent.activeSeason.name}
                      </p>
                      <p className="text-sm text-amber-700 mt-1">
                        {seasonalContent.urgencyMessage}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {seasonalContent.hooks.slice(0, 2).map((hook, i) => (
                          <span key={i} className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                            "{hook}"
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Disclosure Warning */}
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-3 border border-yellow-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <span className="font-medium text-yellow-800">AI Disclosure Required: </span>
                    <span className="text-yellow-700">{currentDisclosure.disclosureText}</span>
                    <p className="text-xs text-yellow-600 mt-1">{currentDisclosure.how}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Platform Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Platform</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(PLATFORM_SPECS) as Platform[]).map((platform) => (
                <button
                  key={platform}
                  onClick={() => setSelectedPlatform(platform)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedPlatform === platform
                      ? `${platformColors[platform]} text-white shadow-lg scale-105`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {PLATFORM_SPECS[platform].name}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            {[
              { id: 'copy', label: 'Ad Copy', icon: FileText },
              { id: 'image', label: 'Images', icon: ImageIcon },
              { id: 'video', label: 'Video Scripts', icon: Video },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as 'copy' | 'image' | 'video')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                  activeTab === id
                    ? 'bg-white text-gray-900 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* AD COPY TAB */}
          {activeTab === 'copy' && (
            <div className="space-y-4">
              {/* Ad Type Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ad Objective</label>
                <div className="grid grid-cols-3 gap-3">
                  {(Object.entries(adTypeLabels) as [AdType, typeof adTypeLabels.awareness][]).map(([type, { label, icon: Icon, description }]) => (
                    <button
                      key={type}
                      onClick={() => setSelectedAdType(type)}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        selectedAdType === type
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-1 ${selectedAdType === type ? 'text-orange-600' : 'text-gray-400'}`} />
                      <p className="font-medium text-sm">{label}</p>
                      <p className="text-xs text-gray-500">{description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateCopy}
                disabled={isGeneratingCopy}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGeneratingCopy ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Ad Copy...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate {PLATFORM_SPECS[selectedPlatform].name} Ad Copy
                  </>
                )}
              </button>

              {/* Generated Copy Results */}
              {generatedCopy && (
                <div className="space-y-4">
                  {/* Meta Info */}
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-700 font-medium mb-1">
                        <Target className="w-4 h-4" />
                        Target Audience
                      </div>
                      <p className="text-blue-600">{generatedCopy.targetAudience}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700 font-medium mb-1">
                        <Clock className="w-4 h-4" />
                        Best Time to Post
                      </div>
                      <p className="text-green-600">{generatedCopy.bestTimeToPost}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-purple-700 font-medium mb-1">
                        <Lightbulb className="w-4 h-4" />
                        Pro Tip
                      </div>
                      <p className="text-purple-600">{generatedCopy.proTip}</p>
                    </div>
                  </div>

                  {/* Export Button */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleExportAll}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Export All to CSV
                    </button>
                  </div>

                  {/* Variations */}
                  <div className="space-y-4">
                    {generatedCopy.variations.map((variation, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-700">Variation {index + 1}</span>
                          <button
                            onClick={() => handleCopyToClipboard(
                              `${variation.headline}\n\n${variation.hook}\n\n${variation.body}\n\n${variation.cta}\n\n${variation.hashtags.join(' ')}`,
                              index
                            )}
                            className="flex items-center gap-1 px-3 py-1 bg-white border rounded-md text-sm hover:bg-gray-50"
                          >
                            {copiedIndex === index ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            {copiedIndex === index ? 'Copied!' : 'Copy All'}
                          </button>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase">Headline</label>
                            <p className="font-bold text-lg text-gray-900">{variation.headline}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase">Hook</label>
                            <p className="text-gray-800 font-medium">{variation.hook}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase">Body</label>
                            <p className="text-gray-700 whitespace-pre-wrap">{variation.body}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase">CTA</label>
                            <p className="text-orange-600 font-semibold">{variation.cta}</p>
                          </div>
                          {variation.hashtags.length > 0 && (
                            <div>
                              <label className="text-xs font-medium text-gray-500 uppercase">Hashtags</label>
                              <p className="text-blue-600">{variation.hashtags.join(' ')}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Targeting Recommendations */}
                  {generatedCopy.formattedTargeting && (
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-5 border border-indigo-100">
                      <div className="flex items-center gap-2 mb-4">
                        <Crosshair className="w-5 h-5 text-indigo-600" />
                        <h4 className="font-semibold text-indigo-900 text-lg">
                          {generatedCopy.formattedTargeting.title}
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {generatedCopy.formattedTargeting.sections.map((section, sIdx) => {
                          let SectionIcon = Target
                          if (section.label.includes('Demographic')) SectionIcon = Users
                          if (section.label.includes('Interest') || section.label.includes('Keyword')) SectionIcon = TrendingUp
                          if (section.label.includes('Budget')) SectionIcon = DollarSign
                          if (section.label.includes('Timing')) SectionIcon = Calendar
                          if (section.label.includes('Location')) SectionIcon = MapPin
                          if (section.label.includes('Exclude')) SectionIcon = Trash2

                          return (
                            <div
                              key={sIdx}
                              className={`bg-white rounded-lg p-3 ${
                                section.label.includes('Budget') || section.label.includes('Timing')
                                  ? 'md:col-span-2'
                                  : ''
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <SectionIcon className="w-4 h-4 text-indigo-500" />
                                <span className="font-medium text-sm text-indigo-800">{section.label}</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {section.items.map((item, iIdx) => (
                                  <span
                                    key={iIdx}
                                    className={`inline-block px-2 py-1 text-xs rounded-md ${
                                      section.label.includes('Exclude') || section.label.includes('Negative')
                                        ? 'bg-red-100 text-red-700'
                                        : section.label.includes('Budget')
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-indigo-100 text-indigo-700'
                                    }`}
                                  >
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      <button
                        onClick={() => {
                          const targetingText = generatedCopy.formattedTargeting!.sections
                            .map(s => `${s.label}:\n${s.items.map(i => `  • ${i}`).join('\n')}`)
                            .join('\n\n')
                          navigator.clipboard.writeText(targetingText)
                          setCopiedIndex(-2)
                          setTimeout(() => setCopiedIndex(null), 2000)
                        }}
                        className="mt-4 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                      >
                        {copiedIndex === -2 ? (
                          <>
                            <Check className="w-4 h-4" />
                            Targeting Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy All Targeting Settings
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Regenerate */}
                  <button
                    onClick={handleGenerateCopy}
                    disabled={isGeneratingCopy}
                    className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
                  >
                    <RefreshCw className={`w-4 h-4 ${isGeneratingCopy ? 'animate-spin' : ''}`} />
                    Generate New Variations
                  </button>
                </div>
              )}
            </div>
          )}

          {/* IMAGE TAB */}
          {activeTab === 'image' && (
            <div className="space-y-4">
              {/* Image Type Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image Type</label>
                <div className="flex flex-wrap gap-2">
                  {(['hero', 'service', 'testimonial', 'promo'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setImagePromptType(type)}
                      className={`px-4 py-2 rounded-lg capitalize transition-all ${
                        imagePromptType === type
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* UGC Style Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    UGC Style (Auto-optimized for {selectedPlatform})
                  </span>
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedUgcStyle(null)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all relative ${
                      !selectedUgcStyle
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } ${selectedPlatform === 'google' ? 'ring-2 ring-green-500' : ''}`}
                  >
                    Studio
                    {selectedPlatform === 'google' && (
                      <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        Best
                      </span>
                    )}
                  </button>
                  {(Object.keys(UGC_STYLES) as UGCStyleKey[]).map((style) => {
                    const ranking = getUGCRanking(style)
                    return (
                      <button
                        key={style}
                        onClick={() => setSelectedUgcStyle(style)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all relative ${
                          selectedUgcStyle === style
                            ? 'bg-orange-500 text-white'
                            : ranking === 'avoid'
                              ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                              : ranking === 'recommended'
                                ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        title={`${UGC_STYLES[style].description}${ranking === 'recommended' ? ' (Recommended for ' + selectedPlatform + ')' : ranking === 'avoid' ? ' (Not recommended for ' + selectedPlatform + ')' : ''}`}
                      >
                        {UGC_STYLES[style].name}
                        {ranking === 'recommended' && selectedUgcStyle !== style && (
                          <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                            Best
                          </span>
                        )}
                        {ranking === 'avoid' && selectedUgcStyle !== style && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                            Avoid
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
                {selectedUgcStyle && (
                  <p className="text-xs text-gray-500 mt-1">
                    {UGC_STYLES[selectedUgcStyle].description}
                    {getUGCRanking(selectedUgcStyle) === 'recommended' && (
                      <span className="text-green-600 ml-1 font-medium">- Optimal for {selectedPlatform}</span>
                    )}
                    {getUGCRanking(selectedUgcStyle) === 'avoid' && (
                      <span className="text-red-600 ml-1 font-medium">- Consider different style for {selectedPlatform}</span>
                    )}
                  </p>
                )}
                {/* Platform reasoning */}
                <p className="text-xs text-blue-600 mt-1 italic">
                  {PLATFORM_UGC_RANKINGS[selectedPlatform]?.reasoning}
                </p>
              </div>

              {/* Scroll-Stop Technique */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Scroll-Stop Technique (Auto-optimized for {selectedPlatform})
                  </span>
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedScrollStop(null)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      !selectedScrollStop
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    None
                  </button>
                  {(Object.keys(SCROLL_STOP_TECHNIQUES.visual) as (keyof typeof SCROLL_STOP_TECHNIQUES.visual)[]).map((technique) => {
                    const ranking = getScrollStopRanking(technique)
                    return (
                      <button
                        key={technique}
                        onClick={() => setSelectedScrollStop(technique)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all relative ${
                          selectedScrollStop === technique
                            ? 'bg-purple-500 text-white'
                            : ranking === 'top3'
                              ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                              : ranking === 'less'
                                ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        title={`${SCROLL_STOP_TECHNIQUES.visual[technique].implementation}${ranking === 'top3' ? ' (Top performer for ' + selectedPlatform + ')' : ranking === 'less' ? ' (Less effective on ' + selectedPlatform + ')' : ''}`}
                      >
                        {SCROLL_STOP_TECHNIQUES.visual[technique].name}
                        {ranking === 'top3' && selectedScrollStop !== technique && (
                          <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                            Top
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
                {/* Platform reasoning */}
                <p className="text-xs text-blue-600 mt-1 italic">
                  {PLATFORM_SCROLLSTOP_RANKINGS[selectedPlatform]?.reasoning}
                </p>
              </div>

              {/* Image Format Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Image Format
                  </span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {IMAGE_FORMAT_PRESETS[selectedPlatform].formats.map((format) => (
                    <button
                      key={format.name}
                      onClick={() => setSelectedImageFormat(format.name)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        selectedImageFormat === format.name ||
                        (!selectedImageFormat && format.name === IMAGE_FORMAT_PRESETS[selectedPlatform].recommended)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {format.name} ({format.ratio})
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Preview */}
              {industryProfile && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-xs font-medium text-gray-500 uppercase mb-2 block">AI Prompt Preview</label>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-6">
                    {selectedUgcStyle || selectedScrollStop
                      ? generateImagePromptWithStyle(
                          industryProfile,
                          businessInfo.name,
                          selectedPlatform,
                          imagePromptType,
                          selectedUgcStyle || undefined,
                          selectedScrollStop || undefined
                        ).prompt.substring(0, 500) + '...'
                      : generateImagePrompt(industryProfile, businessInfo.name, selectedPlatform, imagePromptType).substring(0, 500) + '...'
                    }
                  </p>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerateImage}
                disabled={isGeneratingImage}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGeneratingImage ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating with DALL-E 3... (30-60s)
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate {PLATFORM_SPECS[selectedPlatform].name} Ad Image (~$0.08)
                  </>
                )}
              </button>

              {/* Generated Images Gallery */}
              {generatedImages.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700">Generated Images ({generatedImages.length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {generatedImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img.image}
                          alt={`Generated ad for ${img.platform}`}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleDownloadImage(img.image, img.platform)}
                            className="p-2 bg-white rounded-full hover:bg-gray-100"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <a
                            href={img.image}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white rounded-full hover:bg-gray-100"
                            title="Open in new tab"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDeleteImage(img)}
                            className="p-2 bg-white rounded-full hover:bg-red-50 text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <span className={`absolute top-2 left-2 px-2 py-1 text-xs font-medium text-white rounded ${platformColors[img.platform as Platform]}`}>
                          {img.platform}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Platform Specs Info */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  {PLATFORM_SPECS[selectedPlatform].name} Image Specs
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {PLATFORM_SPECS[selectedPlatform].imageFormats.map((format, i) => (
                    <div key={i} className="text-blue-700">
                      <span className="font-medium">{format.name}:</span> {format.width}x{format.height} ({format.ratio})
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIDEO TAB */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              {/* Duration Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Video Duration</label>
                <div className="flex gap-2">
                  {(['15s', '30s', '60s'] as const).map((duration) => (
                    <button
                      key={duration}
                      onClick={() => setVideoDuration(duration)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        videoDuration === duration
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {duration}
                    </button>
                  ))}
                </div>
              </div>

              {/* Video Format Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <Film className="w-4 h-4" />
                    Video Format (Auto-optimized for {selectedPlatform})
                  </span>
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedVideoFormat(null)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      !selectedVideoFormat
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Auto (Best for Platform)
                  </button>
                  {(Object.keys(VIDEO_FORMATS_2026) as (keyof typeof VIDEO_FORMATS_2026)[]).map((format) => {
                    const ranking = getVideoFormatRanking(format)
                    return (
                      <button
                        key={format}
                        onClick={() => setSelectedVideoFormat(format)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all relative ${
                          selectedVideoFormat === format
                            ? 'bg-purple-500 text-white'
                            : ranking === 'top3'
                              ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                              : ranking === 'avoid'
                                ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        title={`${VIDEO_FORMATS_2026[format].name} - Best for: ${VIDEO_FORMATS_2026[format].bestFor.join(', ')}${ranking === 'top3' ? ' (Top performer for ' + selectedPlatform + ')' : ranking === 'avoid' ? ' (Avoid on ' + selectedPlatform + ')' : ''}`}
                      >
                        {VIDEO_FORMATS_2026[format].name}
                        {ranking === 'top3' && selectedVideoFormat !== format && (
                          <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                            Best
                          </span>
                        )}
                        {ranking === 'avoid' && selectedVideoFormat !== format && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                            Avoid
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
                {/* Platform reasoning */}
                <p className="text-xs text-blue-600 mt-1 italic">
                  {PLATFORM_VIDEO_FORMAT_RANKINGS[selectedPlatform]?.reasoning}
                </p>
              </div>

              {/* Video Script */}
              {videoScript && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-purple-900">
                        {PLATFORM_SPECS[selectedPlatform === 'google' ? 'youtube' : selectedPlatform].name} Video Script ({videoDuration})
                      </h4>
                      <button
                        onClick={() => handleCopyToClipboard(
                          `HOOK: ${videoScript.hook}\n\nSCENES:\n${videoScript.scenes.map((s, i) => `${i + 1}. [${s.time}] ${s.action}\n   Visual: ${s.visual}\n   Text: ${s.textOverlay}`).join('\n\n')}\n\nVOICEOVER:\n${videoScript.voiceover}\n\nCTA: ${videoScript.cta}`,
                          -1
                        )}
                        className="flex items-center gap-1 px-3 py-1 bg-white border rounded-md text-sm hover:bg-gray-50"
                      >
                        {copiedIndex === -1 ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        {copiedIndex === -1 ? 'Copied!' : 'Copy Script'}
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Hook */}
                      <div>
                        <label className="text-xs font-medium text-purple-600 uppercase">Opening Hook ({videoScript.hookType})</label>
                        <p className="text-purple-900 font-medium text-lg">{videoScript.hook}</p>
                      </div>

                      {/* Scene Breakdown - Enhanced */}
                      <div>
                        <label className="text-xs font-medium text-purple-600 uppercase">Scene Breakdown</label>
                        <div className="space-y-3 mt-2">
                          {videoScript.scenes.map((scene, i) => (
                            <div key={i} className="bg-white rounded-lg p-3 border border-purple-100">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-purple-500 font-mono text-sm font-bold">{scene.time}</span>
                                <span className="font-medium text-gray-900">{scene.action}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-gray-500">Visual:</span>
                                  <span className="text-gray-700 ml-1">{scene.visual}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Text Overlay:</span>
                                  <span className="text-purple-700 ml-1 font-medium">{scene.textOverlay}</span>
                                </div>
                              </div>
                              {scene.patternInterrupt && scene.patternInterrupt !== 'None - let hook land' && (
                                <div className="mt-1 text-xs text-orange-600">
                                  <Zap className="w-3 h-3 inline mr-1" />
                                  {scene.patternInterrupt}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Voiceover */}
                      <div>
                        <label className="text-xs font-medium text-purple-600 uppercase">Voiceover Script</label>
                        <p className="text-gray-800 bg-white p-3 rounded-lg mt-1 italic">
                          &ldquo;{videoScript.voiceover}&rdquo;
                        </p>
                      </div>

                      {/* CTA */}
                      <div>
                        <label className="text-xs font-medium text-purple-600 uppercase">Call to Action</label>
                        <p className="text-orange-600 font-semibold">{videoScript.cta}</p>
                      </div>
                    </div>
                  </div>

                  {/* All Hooks Panel */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <button
                      onClick={() => setShowAllHooks(!showAllHooks)}
                      className="flex items-center justify-between w-full"
                    >
                      <span className="font-medium text-gray-700 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        All Generated Hooks ({Object.keys(videoScript.hooks).length} types)
                      </span>
                      {showAllHooks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {showAllHooks && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(videoScript.hooks).map(([type, hooks]) => (
                          <div key={type} className="bg-white rounded-lg p-3">
                            <span className="text-xs font-medium text-purple-600 uppercase">{type}</span>
                            <div className="space-y-1 mt-1">
                              {(hooks as string[]).slice(0, 2).map((hook, i) => (
                                <p key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                  <span className="text-purple-400">•</span>
                                  {hook}
                                  <button
                                    onClick={() => handleCopyToClipboard(hook, i * 100 + Object.keys(videoScript.hooks).indexOf(type))}
                                    className="text-gray-400 hover:text-gray-600"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* B-Roll Panel */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <button
                      onClick={() => setShowBroll(!showBroll)}
                      className="flex items-center justify-between w-full"
                    >
                      <span className="font-medium text-gray-700 flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        B-Roll Shot List
                      </span>
                      {showBroll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {showBroll && (
                      <div className="mt-4 space-y-3">
                        {videoScript.scenes.map((scene, i) => (
                          scene.broll && scene.broll.length > 0 && (
                            <div key={i} className="bg-white rounded-lg p-3">
                              <span className="text-xs font-medium text-gray-500">{scene.time}</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {scene.broll.map((shot, j) => (
                                  <span key={j} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                    {shot}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Voiceover Panel */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <button
                      onClick={() => setShowVoiceover(!showVoiceover)}
                      className="flex items-center justify-between w-full"
                    >
                      <span className="font-medium text-gray-700 flex items-center gap-2">
                        <Mic className="w-4 h-4" />
                        AI Voiceover Guidance
                      </span>
                      {showVoiceover ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {showVoiceover && voiceoverData && (
                      <div className="mt-4 space-y-4">
                        {/* Voice Style Selector */}
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase mb-2 block">Voice Style</label>
                          <div className="flex flex-wrap gap-2">
                            {(Object.keys(VOICEOVER_STYLES) as (keyof typeof VOICEOVER_STYLES)[]).map((style) => (
                              <button
                                key={style}
                                onClick={() => setSelectedVoiceStyle(style)}
                                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                                  selectedVoiceStyle === style
                                    ? 'bg-green-500 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border'
                                }`}
                              >
                                {VOICEOVER_STYLES[style].name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Voiceover Details */}
                        <div className="bg-white rounded-lg p-4 space-y-3">
                          <div className="grid grid-cols-3 gap-3 text-sm">
                            <div>
                              <span className="text-gray-500">Word Count:</span>
                              <span className="ml-2 font-medium">{voiceoverData.wordCount}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Duration:</span>
                              <span className="ml-2 font-medium">{voiceoverData.estimatedDuration}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Recommended Voice:</span>
                              <span className="ml-2 font-medium">{voiceoverData.aiVoiceSettings.voiceName}</span>
                            </div>
                          </div>

                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase">Speaking Notes</span>
                            <ul className="mt-1 space-y-1">
                              {voiceoverData.speakingNotes.map((note, i) => (
                                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                  {note}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                            <strong>AI Voice Settings:</strong> {voiceoverData.aiVoiceSettings.service} -
                            Speed: {voiceoverData.aiVoiceSettings.speed}x,
                            Stability: {voiceoverData.aiVoiceSettings.stability},
                            Clarity: {voiceoverData.aiVoiceSettings.clarity}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pacing & Caption Strategy */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Pacing Rules
                      </h4>
                      <div className="space-y-2 text-sm text-blue-700">
                        <p><strong>Hook Window:</strong> {videoScript.pacing.hookWindow}</p>
                        <p><strong>Cut Frequency:</strong> {videoScript.pacing.cutFrequency}</p>
                        <p><strong>Text On Screen:</strong> {videoScript.pacing.textOnScreen}</p>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Caption Strategy
                      </h4>
                      <div className="space-y-2 text-sm text-green-700">
                        <p><strong>Position:</strong> {videoScript.captionStrategy.position}</p>
                        <p><strong>Style:</strong> {videoScript.captionStrategy.style}</p>
                      </div>
                    </div>
                  </div>

                  {/* Video Best Practices */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-2">
                      {PLATFORM_SPECS[selectedPlatform === 'google' ? 'youtube' : selectedPlatform].name} Video Best Practices
                    </h4>
                    <ul className="space-y-1">
                      {PLATFORM_SPECS[selectedPlatform === 'google' ? 'youtube' : selectedPlatform].bestPractices.map((practice, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {practice}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Video Tools Recommendations */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Recommended AI Video Tools</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <a href="https://runwayml.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-700 hover:text-blue-900">
                        <ExternalLink className="w-4 h-4" /> Runway ML
                      </a>
                      <a href="https://pika.art" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-700 hover:text-blue-900">
                        <ExternalLink className="w-4 h-4" /> Pika Labs
                      </a>
                      <a href="https://www.capcut.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-700 hover:text-blue-900">
                        <ExternalLink className="w-4 h-4" /> CapCut
                      </a>
                      <a href="https://www.descript.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-700 hover:text-blue-900">
                        <ExternalLink className="w-4 h-4" /> Descript
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* BULK GENERATION PANEL */}
          <div className="border-t pt-4 mt-4">
            <button
              onClick={() => setShowBulkPanel(!showBulkPanel)}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="font-medium text-gray-700 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Bulk Generation
              </span>
              {showBulkPanel ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showBulkPanel && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Generation Scope</label>
                  <div className="flex gap-2">
                    {(['minimal', 'standard', 'comprehensive'] as const).map((scope) => (
                      <button
                        key={scope}
                        onClick={() => setBulkScope(scope)}
                        className={`px-4 py-2 rounded-lg capitalize transition-all ${
                          bulkScope === scope
                            ? 'bg-indigo-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {scope}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-lg p-4">
                  <h4 className="font-medium text-indigo-900 mb-3">Generation Summary</h4>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-indigo-600">{bulkCounts.images}</p>
                      <p className="text-indigo-700">Images</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-indigo-600">{bulkCounts.videos}</p>
                      <p className="text-indigo-700">Video Scripts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-indigo-600">{bulkCounts.copyVariations}</p>
                      <p className="text-indigo-700">Copy Variations</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{bulkCounts.estimatedCost}</p>
                      <p className="text-green-700">Est. Cost</p>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-indigo-600">
                    <strong>Platforms:</strong> {bulkConfig.platforms.join(', ')} |
                    <strong> Formats:</strong> {bulkConfig.videoFormats.slice(0, 3).join(', ')}{bulkConfig.videoFormats.length > 3 ? '...' : ''} |
                    <strong> Styles:</strong> {bulkConfig.ugcStyles.join(', ')}
                  </div>
                </div>

                <button
                  disabled
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg opacity-50 cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Package className="w-5 h-5" />
                  Generate All ({bulkCounts.total} items) - Coming Soon
                </button>
                <p className="text-xs text-gray-500 text-center">
                  Bulk generation will create all variations across selected platforms automatically
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
