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
} from 'lucide-react'
import {
  findIndustryProfile,
  generateImagePrompt,
  generateVideoScript,
  PLATFORM_SPECS,
  type IndustryProfile,
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

interface GeneratedAdCopy {
  variations: AdCopyVariation[]
  targetAudience: string
  bestTimeToPost: string
  proTip: string
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

  // Copy generation state
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false)
  const [generatedCopy, setGeneratedCopy] = useState<GeneratedAdCopy | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  // Video script state
  const [videoDuration, setVideoDuration] = useState<'15s' | '30s' | '60s'>('15s')

  // Industry profile
  const [industryProfile, setIndustryProfile] = useState<IndustryProfile | null>(null)

  // Load industry profile
  useEffect(() => {
    const profile = findIndustryProfile(
      businessInfo.businessType,
      businessInfo.name,
      businessInfo.services
    )
    setIndustryProfile(profile)
  }, [businessInfo])

  // Load existing images
  useEffect(() => {
    if (profileId && isExpanded) {
      loadExistingImages()
    }
  }, [profileId, isExpanded])

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
      const prompt = generateImagePrompt(
        industryProfile,
        businessInfo.name,
        selectedPlatform,
        imagePromptType
      )

      // Determine size based on platform
      let size: '1024x1024' | '1792x1024' | '1024x1792' = '1024x1024'
      if (selectedPlatform === 'instagram' || selectedPlatform === 'tiktok') {
        size = '1024x1792' // Portrait for Stories/Reels
      } else if (selectedPlatform === 'youtube') {
        size = '1792x1024' // Landscape for YouTube
      }

      const response = await fetch('/api/generate-ad-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
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
          prompt,
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
        setGeneratedCopy(data)
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
  const videoScript = industryProfile ? generateVideoScript(
    industryProfile,
    businessInfo.name,
    businessInfo.services,
    businessInfo.city,
    selectedPlatform === 'google' ? 'youtube' : selectedPlatform,
    videoDuration
  ) : null

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
          {/* Industry Detection */}
          {industryProfile && (
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

              {/* Prompt Preview */}
              {industryProfile && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-xs font-medium text-gray-500 uppercase mb-2 block">AI Prompt Preview</label>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {generateImagePrompt(industryProfile, businessInfo.name, selectedPlatform, imagePromptType)}
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
                          `HOOK: ${videoScript.hook}\n\nSCENES:\n${videoScript.scenes.join('\n')}\n\nVOICEOVER:\n${videoScript.voiceover}\n\nCTA: ${videoScript.cta}`,
                          -1
                        )}
                        className="flex items-center gap-1 px-3 py-1 bg-white border rounded-md text-sm hover:bg-gray-50"
                      >
                        {copiedIndex === -1 ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        {copiedIndex === -1 ? 'Copied!' : 'Copy Script'}
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-purple-600 uppercase">Opening Hook</label>
                        <p className="text-purple-900 font-medium text-lg">{videoScript.hook}</p>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-purple-600 uppercase">Scene Breakdown</label>
                        <div className="space-y-2 mt-1">
                          {videoScript.scenes.map((scene, i) => (
                            <div key={i} className="flex gap-2 text-sm">
                              <span className="text-purple-400 font-mono">{String(i + 1).padStart(2, '0')}</span>
                              <span className="text-gray-700">{scene}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-purple-600 uppercase">Voiceover Script</label>
                        <p className="text-gray-800 bg-white p-3 rounded-lg mt-1 italic">
                          &ldquo;{videoScript.voiceover}&rdquo;
                        </p>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-purple-600 uppercase">Call to Action</label>
                        <p className="text-orange-600 font-semibold">{videoScript.cta}</p>
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
        </div>
      )}
    </div>
  )
}
