'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Upload, Image as ImageIcon, Sparkles, Loader2, Search, Check, X, FolderOpen, RefreshCw, ChevronRight, Video, ExternalLink, MapPin } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { PortfolioImage } from '@/lib/types'

interface UnsplashPhoto {
  id: string
  url: string
  thumbUrl: string
  alt: string
  photographer: string
  photographerUrl: string
}

interface HeroImageStepProps {
  heroImage?: string
  businessType: string
  businessName: string
  businessTagline?: string
  businessDescription?: string
  businessServices?: string[]
  portfolioImages: PortfolioImage[]
  googlePhotos?: string[]
  onSubmit: (heroImage: string) => void
  onBack: () => void
}

// Business-type specific hero image keyword suggestions
const HERO_IMAGE_KEYWORDS: Record<string, string[]> = {
  // Home Services
  plumber: ['plumber fixing pipes', 'modern bathroom', 'plumbing repair', 'water heater installation'],
  electrician: ['electrician at work', 'electrical panel', 'modern lighting', 'home wiring'],
  hvac: ['air conditioning unit', 'hvac technician', 'modern thermostat', 'heating system'],
  contractor: ['home renovation', 'construction worker', 'modern house exterior', 'remodeling project'],
  landscaping: ['beautiful garden', 'landscaping work', 'green lawn', 'outdoor living space'],
  cleaning: ['clean modern home', 'cleaning service', 'spotless kitchen', 'organized space'],
  roofing: ['roof installation', 'new roof shingles', 'roofing contractor', 'house exterior'],
  handyman: ['home repair', 'handyman tools', 'home improvement', 'fixing furniture'],
  painting: ['house painting', 'interior paint', 'paint brushes', 'colorful wall'],
  flooring: ['hardwood floor', 'flooring installation', 'modern tile', 'beautiful floors'],

  // Professional Services
  lawyer: ['law office', 'legal consultation', 'modern law firm', 'professional attorney'],
  accountant: ['accounting office', 'financial planning', 'modern office desk', 'business meeting'],
  consultant: ['business consulting', 'professional meeting', 'strategy session', 'modern conference room'],
  real_estate: ['beautiful home', 'real estate agent', 'house for sale', 'modern property'],
  insurance: ['insurance consultation', 'family protection', 'professional office', 'peace of mind'],
  financial: ['financial advisor', 'investment planning', 'wealth management', 'business growth'],

  // Health & Wellness
  dentist: ['modern dental office', 'bright smile', 'dental care', 'dentist with patient'],
  doctor: ['medical office', 'doctor consultation', 'healthcare professional', 'modern clinic'],
  chiropractor: ['chiropractic care', 'spine health', 'wellness center', 'back adjustment'],
  salon: ['hair salon interior', 'hairstylist at work', 'beauty salon', 'hair styling'],
  spa: ['spa relaxation', 'massage therapy', 'wellness retreat', 'zen atmosphere'],
  gym: ['modern gym', 'fitness training', 'workout equipment', 'personal training'],
  yoga: ['yoga studio', 'meditation space', 'yoga practice', 'peaceful wellness'],
  therapy: ['therapy session', 'counseling office', 'mental wellness', 'supportive environment'],

  // Food & Hospitality
  restaurant: ['restaurant interior', 'delicious food plating', 'fine dining', 'chef cooking'],
  cafe: ['cozy cafe', 'coffee shop interior', 'latte art', 'cafe atmosphere'],
  bakery: ['fresh baked bread', 'bakery display', 'pastries', 'artisan baking'],
  catering: ['catering event', 'food presentation', 'buffet setup', 'elegant dining'],
  bar: ['cocktail bar', 'bar interior', 'craft cocktails', 'nightlife ambiance'],
  pizza: ['pizza making', 'wood fired oven', 'italian restaurant', 'fresh pizza'],

  // Retail
  retail: ['retail store', 'shopping experience', 'product display', 'modern storefront'],
  boutique: ['boutique interior', 'fashion display', 'clothing store', 'curated collection'],
  jewelry: ['jewelry display', 'elegant jewelry', 'luxury accessories', 'jewelry store'],
  florist: ['flower shop', 'beautiful bouquet', 'floral arrangement', 'colorful flowers'],

  // Automotive
  auto_repair: ['auto mechanic', 'car repair shop', 'automotive service', 'mechanic at work'],
  car_dealer: ['car dealership', 'new cars', 'car showroom', 'automotive sales'],
  auto_detail: ['car detailing', 'shiny car', 'auto cleaning', 'car wash'],

  // Education
  school: ['classroom', 'students learning', 'education', 'school building'],
  daycare: ['happy children', 'daycare center', 'child care', 'playful kids'],
  tutoring: ['tutoring session', 'student studying', 'learning', 'education support'],
  music: ['music lesson', 'musical instruments', 'music studio', 'playing piano'],
  dance: ['dance studio', 'ballet dancer', 'dance class', 'movement'],

  // Technology
  it_services: ['tech support', 'computer repair', 'it professional', 'server room'],
  web_design: ['web design', 'creative workspace', 'digital agency', 'design studio'],
  photography: ['photography studio', 'camera equipment', 'photo shoot', 'creative photography'],

  // Pet Services
  veterinary: ['veterinary clinic', 'vet with pet', 'animal care', 'happy pets'],
  pet_grooming: ['dog grooming', 'pet spa', 'cute groomed dog', 'pet care'],
  dog_training: ['dog training', 'obedient dog', 'pet training session', 'dog and trainer'],
}

// Get suggested keywords based on business type
function getHeroKeywords(businessType: string): string[] {
  const normalizedType = businessType.toLowerCase().replace(/[^a-z]/g, '_').replace(/_+/g, '_')

  // Try exact match first
  if (HERO_IMAGE_KEYWORDS[normalizedType]) {
    return HERO_IMAGE_KEYWORDS[normalizedType]
  }

  // Try partial match
  for (const [key, keywords] of Object.entries(HERO_IMAGE_KEYWORDS)) {
    if (normalizedType.includes(key) || key.includes(normalizedType)) {
      return keywords
    }
  }

  // Default generic keywords
  return ['professional business', 'modern office', 'team at work', 'business storefront']
}

export function HeroImageStep({
  heroImage: initialHeroImage,
  businessType,
  businessName,
  businessTagline,
  businessDescription,
  businessServices,
  portfolioImages,
  googlePhotos = [],
  onSubmit,
  onBack
}: HeroImageStepProps) {
  const [selectedImage, setSelectedImage] = useState<string>(initialHeroImage || '')
  const [isVideo, setIsVideo] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'upload' | 'portfolio' | 'ai' | 'google'>(googlePhotos.length > 0 ? 'google' : 'ai')
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const videoInputRef = useRef<HTMLInputElement | null>(null)

  // AI-generated keyword suggestions
  const [aiKeywords, setAiKeywords] = useState<string[]>([])
  const [keywordsLoading, setKeywordsLoading] = useState(true)

  // Fetch AI-generated keywords on mount
  useEffect(() => {
    const fetchAiKeywords = async () => {
      setKeywordsLoading(true)
      try {
        const response = await fetch('/api/generate-hero-keywords', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            businessName,
            businessType,
            services: businessServices,
          }),
        })

        const data = await response.json()
        if (data.success && data.keywords) {
          setAiKeywords(data.keywords)
        } else {
          // Fall back to static keywords
          setAiKeywords(getHeroKeywords(businessType))
        }
      } catch (error) {
        console.error('Failed to fetch AI keywords:', error)
        // Fall back to static keywords
        setAiKeywords(getHeroKeywords(businessType))
      } finally {
        setKeywordsLoading(false)
      }
    }

    fetchAiKeywords()
  }, [businessName, businessType, businessServices])

  // Use AI keywords if available, otherwise fall back to static
  const suggestedKeywords = aiKeywords.length > 0 ? aiKeywords : getHeroKeywords(businessType)

  // AI Video Generator links
  const videoGenerators = [
    { name: 'Sora', url: 'https://sora.com', color: 'from-green-500 to-emerald-600' },
    { name: 'Veo', url: 'https://deepmind.google/technologies/veo/', color: 'from-blue-500 to-indigo-600' },
    { name: 'Runway', url: 'https://runwayml.com', color: 'from-purple-500 to-pink-600' },
  ]

  // Generate ChatGPT prompt URL with business info
  const getChatGPTUrl = () => {
    const prompt = `Help me create a video prompt for an AI video generator (like Sora, Veo, or Runway) for a business hero video.

Business Information:
- Name: ${businessName || 'Not provided'}
- Type: ${businessType?.replace(/_/g, ' ') || 'Not provided'}
- Tagline: ${businessTagline || 'Not provided'}
- Description: ${businessDescription || 'Not provided'}
- Services: ${businessServices?.join(', ') || 'Not provided'}

Please generate a detailed, cinematic video prompt that would work well as a hero background video for this business website. The video should be professional, visually stunning, and capture the essence of what this business does. Include details about:
1. Scene setting and environment
2. Lighting and mood
3. Camera movements
4. Key visual elements
5. Duration suggestion (5-10 seconds for a hero loop)

Make the prompt specific to this business type and ready to paste into an AI video generator.`

    return `https://chat.openai.com/?q=${encodeURIComponent(prompt)}`
  }

  // Unsplash state
  const [unsplashPhotos, setUnsplashPhotos] = useState<UnsplashPhoto[]>([])
  const [loadingPhotos, setLoadingPhotos] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [lastSearchQuery, setLastSearchQuery] = useState('')

  const fetchUnsplashPhotos = async (query?: string, page: number = 1) => {
    setLoadingPhotos(true)
    setHasSearched(true)
    try {
      const searchTerm = query || `${businessType.replace(/_/g, ' ')} business hero background`
      const params = new URLSearchParams({
        action: 'search',
        query: searchTerm,
        perPage: '12',
        page: page.toString(),
      })

      const response = await fetch(`/api/unsplash?${params}`)
      const data = await response.json()

      if (data.success && data.photos) {
        setUnsplashPhotos(data.photos)
        setLastSearchQuery(searchTerm)
        setCurrentPage(page)
      }
    } catch (error) {
      console.error('Failed to fetch Unsplash photos:', error)
    } finally {
      setLoadingPhotos(false)
    }
  }

  const loadMorePhotos = () => {
    fetchUnsplashPhotos(lastSearchQuery, currentPage + 1)
  }

  const refreshPhotos = () => {
    // Get a random page between 1-10 to show different results
    const randomPage = Math.floor(Math.random() * 10) + 1
    fetchUnsplashPhotos(lastSearchQuery, randomPage)
  }

  const handleImageUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0]
    const url = URL.createObjectURL(file)
    setSelectedImage(url)
    setIsVideo(false)
  }

  const handleVideoUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0]
    const url = URL.createObjectURL(file)
    setSelectedImage(url)
    setIsVideo(true)
  }

  const handleSubmit = () => {
    onSubmit(selectedImage)
  }

  const handleSkip = () => {
    onSubmit('')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Hero Image
        </h1>
        <p className="text-gray-600">
          Select a stunning background image for your landing page hero section
        </p>
      </motion.div>

      {/* Preview of selected image/video */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6"
        >
          <Card variant="gradient">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isVideo ? (
                  <Video className="w-5 h-5 text-primary-500" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-primary-500" />
                )}
                Selected Hero {isVideo ? 'Video' : 'Image'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-primary-200">
                {isVideo ? (
                  <video
                    src={selectedImage}
                    className="w-full h-full object-cover"
                    controls
                    muted
                    loop
                  />
                ) : (
                  <img
                    src={selectedImage}
                    alt="Selected hero image"
                    className="w-full h-full object-cover"
                  />
                )}
                <button
                  onClick={() => { setSelectedImage(''); setIsVideo(false); }}
                  className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Tab Selection */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {googlePhotos.length > 0 && (
          <Button
            variant={activeTab === 'google' ? 'default' : 'outline'}
            onClick={() => setActiveTab('google')}
            className="flex-1"
          >
            <MapPin className="mr-2 w-4 h-4" />
            Google Photos ({googlePhotos.length})
          </Button>
        )}
        <Button
          variant={activeTab === 'ai' ? 'default' : 'outline'}
          onClick={() => setActiveTab('ai')}
          className="flex-1"
        >
          <Sparkles className="mr-2 w-4 h-4" />
          AI Images
        </Button>
        <Button
          variant={activeTab === 'upload' ? 'default' : 'outline'}
          onClick={() => setActiveTab('upload')}
          className="flex-1"
        >
          <Upload className="mr-2 w-4 h-4" />
          Upload
        </Button>
        {portfolioImages.length > 0 && (
          <Button
            variant={activeTab === 'portfolio' ? 'default' : 'outline'}
            onClick={() => setActiveTab('portfolio')}
            className="flex-1"
          >
            <FolderOpen className="mr-2 w-4 h-4" />
            My Images
          </Button>
        )}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'ai' && (
          <motion.div
            key="ai"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card variant="outlined">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  Browse AI / Stock Images
                </CardTitle>
                <CardDescription>
                  Search for professional, high-quality images from Unsplash
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder={`Search images (e.g., "${businessType.replace(/_/g, ' ')}", "office", "storefront")`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && fetchUnsplashPhotos(searchQuery)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <Button
                    onClick={() => fetchUnsplashPhotos(searchQuery)}
                    disabled={loadingPhotos}
                  >
                    {loadingPhotos ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Search'
                    )}
                  </Button>
                </div>

                {/* Quick search suggestions - AI-generated based on business info */}
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-gray-500">
                    {keywordsLoading ? 'Generating suggestions...' : 'Suggested:'}
                  </span>
                  {keywordsLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                  ) : (
                    suggestedKeywords.map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setSearchQuery(term)
                          fetchUnsplashPhotos(term)
                        }}
                        className="text-sm px-3 py-1 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 transition-colors"
                      >
                        {term}
                      </button>
                    ))
                  )}
                </div>

                {/* Photo Grid */}
                <div className="min-h-[300px]">
                  {loadingPhotos ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                    </div>
                  ) : !hasSearched ? (
                    <div className="text-center py-12 text-gray-500">
                      <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Search for images or click a quick search suggestion above</p>
                    </div>
                  ) : unsplashPhotos.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      No photos found. Try a different search term.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {unsplashPhotos.map((photo) => (
                        <button
                          key={photo.id}
                          onClick={() => setSelectedImage(photo.url)}
                          className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage === photo.url
                              ? 'border-purple-500 ring-2 ring-purple-500/50'
                              : 'border-transparent hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={photo.thumbUrl}
                            alt={photo.alt}
                            className="w-full h-full object-cover"
                          />
                          {selectedImage === photo.url && (
                            <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                                <Check className="w-5 h-5 text-white" />
                              </div>
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                            <p className="text-xs text-white truncate">
                              by {photo.photographer}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Refresh and Next buttons */}
                {hasSearched && unsplashPhotos.length > 0 && (
                  <div className="flex items-center justify-center gap-3 pt-4 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={refreshPhotos}
                      disabled={loadingPhotos}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className={`w-4 h-4 ${loadingPhotos ? 'animate-spin' : ''}`} />
                      Shuffle Results
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadMorePhotos}
                      disabled={loadingPhotos}
                      className="flex items-center gap-2"
                    >
                      Next 12
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    <span className="text-xs text-gray-400">
                      Page {currentPage}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex gap-4">
              {/* Main upload area */}
              <div className="flex-1">
                <Card variant="outlined">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="w-5 h-5 text-primary-500" />
                      Upload Your Own Media
                    </CardTitle>
                    <CardDescription>
                      Upload a custom hero image or video for your landing page
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Image upload */}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={(e) => handleImageUpload(e.target.files)}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-8 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary-400 transition-colors flex flex-col items-center justify-center gap-3 text-gray-500 hover:text-primary-600"
                    >
                      <ImageIcon className="w-10 h-10" />
                      <div className="text-center">
                        <p className="font-medium">Upload Image</p>
                        <p className="text-sm text-gray-400">JPG, PNG, WebP</p>
                      </div>
                    </button>

                    {/* Video upload */}
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      ref={videoInputRef}
                      onChange={(e) => handleVideoUpload(e.target.files)}
                    />
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="w-full py-8 rounded-xl border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors flex flex-col items-center justify-center gap-3 text-gray-500 hover:text-purple-600"
                    >
                      <Video className="w-10 h-10" />
                      <div className="text-center">
                        <p className="font-medium">Upload Video</p>
                        <p className="text-sm text-gray-400">MP4, WebM, MOV</p>
                      </div>
                    </button>
                  </CardContent>
                </Card>
              </div>

              {/* AI Video Generators sidebar */}
              <div className="w-48 flex-shrink-0">
                <Card variant="outlined" className="h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      AI Video Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* ChatGPT - Generate video prompt */}
                    <a
                      href={getChatGPTUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:opacity-90 transition-opacity border border-gray-600"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">ChatGPT</span>
                        <ExternalLink className="w-4 h-4" />
                      </div>
                      <p className="text-xs text-white/80 mt-1">Create video prompt</p>
                    </a>

                    <div className="border-t border-gray-200 pt-3">
                      <p className="text-xs text-gray-500 mb-2">Then generate with:</p>
                    </div>

                    {videoGenerators.map((generator) => (
                      <a
                        key={generator.name}
                        href={generator.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block p-3 rounded-lg bg-gradient-to-r ${generator.color} text-white hover:opacity-90 transition-opacity`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{generator.name}</span>
                          <ExternalLink className="w-4 h-4" />
                        </div>
                        <p className="text-xs text-white/80 mt-1">Generate video</p>
                      </a>
                    ))}
                    <p className="text-xs text-gray-400 mt-2">
                      Create AI videos, then upload them here
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'portfolio' && portfolioImages.length > 0 && (
          <motion.div
            key="portfolio"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card variant="outlined">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-primary-500" />
                  Select from Your Portfolio Images
                </CardTitle>
                <CardDescription>
                  Choose one of your previously added portfolio images
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {portfolioImages.map((image) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(image.url)}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === image.url
                          ? 'border-primary-500 ring-2 ring-primary-500/50'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                      {selectedImage === image.url && (
                        <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Google Photos Tab */}
        {activeTab === 'google' && googlePhotos.length > 0 && (
          <motion.div
            key="google"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card variant="outlined">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  Google Business Photos
                </CardTitle>
                <CardDescription>
                  Select a photo from the business's Google profile - great for authenticity!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {googlePhotos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(photo)}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === photo
                          ? 'border-blue-500 ring-2 ring-blue-500/50'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`Business photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {selectedImage === photo && (
                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl"
      >
        <h3 className="font-medium text-blue-900 mb-1 flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Hero Image Tips
        </h3>
        <p className="text-sm text-blue-700">
          Choose a high-quality image that represents your business well. The hero image is the first thing
          visitors see, so pick something professional and eye-catching. Landscape images work best.
        </p>
      </motion.div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={handleSkip}>
            Skip for Now
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedImage}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
