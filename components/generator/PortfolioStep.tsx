'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Plus, Trash2, Image as ImageIcon, Upload, X, FolderOpen, Sparkles, Loader2, Search, Check, RefreshCw, ChevronRight, MapPin } from 'lucide-react'
import { Button, Input, Textarea, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { PortfolioSection, PortfolioImage } from '@/lib/types'
import { generateId, getBusinessTypeName } from '@/lib/utils'

interface UnsplashPhoto {
  id: string
  url: string
  thumbUrl: string
  alt: string
  photographer: string
  photographerUrl: string
}

interface PortfolioStepProps {
  portfolioSections: PortfolioSection[]
  businessType: string
  googlePhotos?: string[]
  onSubmit: (sections: PortfolioSection[]) => void
  onBack: () => void
}

// Suggested sections based on business type
const sectionSuggestions: Record<string, string[]> = {
  general_contractor: ['Kitchen Remodels', 'Bathroom Remodels', 'Home Additions', 'Outdoor Living'],
  painter: ['Interior Painting', 'Exterior Painting', 'Cabinet Refinishing', 'Commercial Projects'],
  roofing_contractor: ['Shingle Roofs', 'Metal Roofs', 'Roof Repairs', 'Commercial Roofing'],
  restaurant: ['Interior', 'Food', 'Private Events', 'Outdoor Dining'],
  spa: ['Treatment Rooms', 'Relaxation Areas', 'Products', 'Before & After'],
  beauty_salon: ['Hair Styling', 'Coloring', 'Nail Art', 'Special Occasions'],
  florist: ['Weddings', 'Events', 'Daily Arrangements', 'Custom Designs'],
  landscaping: ['Landscape Design', 'Hardscaping', 'Outdoor Lighting', 'Maintenance'],
  default: ['Our Work', 'Projects', 'Gallery', 'Showcase'],
}

export function PortfolioStep({ portfolioSections: initialSections, businessType, googlePhotos = [], onSubmit, onBack }: PortfolioStepProps) {
  const [sections, setSections] = useState<PortfolioSection[]>(
    initialSections.length > 0 ? initialSections : []
  )
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  // Unsplash state
  const [showUnsplashModal, setShowUnsplashModal] = useState(false)
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null)
  const [unsplashPhotos, setUnsplashPhotos] = useState<UnsplashPhoto[]>([])
  const [loadingPhotos, setLoadingPhotos] = useState(false)
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [lastSearchQuery, setLastSearchQuery] = useState('')

  // Google Photos state
  const [showGoogleModal, setShowGoogleModal] = useState(false)
  const [selectedGooglePhotos, setSelectedGooglePhotos] = useState<Set<number>>(new Set())

  const suggestions = sectionSuggestions[businessType] || sectionSuggestions.default

  function createSection(title: string = ''): PortfolioSection {
    return {
      id: generateId(),
      title,
      description: '',
      images: [],
    }
  }

  const addSection = (title: string = '') => {
    setSections([...sections, createSection(title)])
  }

  const removeSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id))
  }

  const updateSection = (id: string, field: keyof PortfolioSection, value: string) => {
    setSections(sections.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    ))
  }

  const handleImageUpload = async (sectionId: string, files: FileList | null) => {
    if (!files) return

    // Convert files to base64 data URLs so they persist and can be saved
    const newImages: PortfolioImage[] = await Promise.all(
      Array.from(files).map(async (file) => {
        const base64 = await fileToBase64(file)
        return {
          id: generateId(),
          url: base64,
          alt: file.name.replace(/\.[^/.]+$/, ''),
          caption: '',
        }
      })
    )

    setSections(sections.map(s =>
      s.id === sectionId
        ? { ...s, images: [...s.images, ...newImages] }
        : s
    ))
  }

  // Helper function to convert File to base64 data URL
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const removeImage = (sectionId: string, imageId: string) => {
    setSections(sections.map(s =>
      s.id === sectionId
        ? { ...s, images: s.images.filter(img => img.id !== imageId) }
        : s
    ))
  }

  // Unsplash functions
  const openUnsplashModal = async (sectionId: string, sectionTitle: string) => {
    setCurrentSectionId(sectionId)
    setShowUnsplashModal(true)
    setSelectedPhotos(new Set())
    setSearchQuery(sectionTitle)
    await fetchUnsplashPhotos(sectionTitle)
  }

  const fetchUnsplashPhotos = async (query: string, page: number = 1) => {
    setLoadingPhotos(true)
    try {
      const searchTerm = query || businessType.replace(/_/g, ' ')
      const params = new URLSearchParams({
        action: 'portfolio',
        businessType,
        sectionTitle: searchTerm,
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

  const togglePhotoSelection = (photoId: string) => {
    const newSelection = new Set(selectedPhotos)
    if (newSelection.has(photoId)) {
      newSelection.delete(photoId)
    } else {
      newSelection.add(photoId)
    }
    setSelectedPhotos(newSelection)
  }

  const addSelectedPhotos = () => {
    if (!currentSectionId) return

    const photosToAdd = unsplashPhotos.filter(p => selectedPhotos.has(p.id))
    const newImages: PortfolioImage[] = photosToAdd.map(photo => ({
      id: generateId(),
      url: photo.url,
      alt: photo.alt,
      caption: `Photo by ${photo.photographer}`,
    }))

    setSections(sections.map(s =>
      s.id === currentSectionId
        ? { ...s, images: [...s.images, ...newImages] }
        : s
    ))

    setShowUnsplashModal(false)
    setSelectedPhotos(new Set())
  }

  // Google Photos functions
  const openGoogleModal = (sectionId: string) => {
    setCurrentSectionId(sectionId)
    setShowGoogleModal(true)
    setSelectedGooglePhotos(new Set())
  }

  const toggleGooglePhotoSelection = (index: number) => {
    const newSelection = new Set(selectedGooglePhotos)
    if (newSelection.has(index)) {
      newSelection.delete(index)
    } else {
      newSelection.add(index)
    }
    setSelectedGooglePhotos(newSelection)
  }

  const addSelectedGooglePhotos = () => {
    if (!currentSectionId) return

    const newImages: PortfolioImage[] = Array.from(selectedGooglePhotos).map(index => ({
      id: generateId(),
      url: googlePhotos[index],
      alt: 'Business photo from Google',
      caption: 'From Google Business Profile',
    }))

    setSections(sections.map(s =>
      s.id === currentSectionId
        ? { ...s, images: [...s.images, ...newImages] }
        : s
    ))

    setShowGoogleModal(false)
    setSelectedGooglePhotos(new Set())
  }

  const handleSubmit = () => {
    // Filter out sections with no title or no images
    const validSections = sections.filter(s => s.title.trim() && s.images.length > 0)
    onSubmit(validSections)
  }

  const handleSkip = () => {
    onSubmit([])
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Portfolio & Work Showcase
        </h1>
        <p className="text-gray-600">
          Add sections to showcase the business's work with images
        </p>
      </motion.div>

      {/* Suggested Sections */}
      {sections.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card variant="outlined">
            <CardHeader>
              <CardTitle className="text-lg">Suggested Sections</CardTitle>
              <CardDescription>
                Click to add sections based on {getBusinessTypeName(businessType)} businesses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => addSection(suggestion)}
                  >
                    <Plus className="mr-1 w-3 h-3" />
                    {suggestion}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Sections */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              layout
            >
              <Card variant="gradient">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FolderOpen className="w-5 h-5 text-primary-500" />
                      Section {index + 1}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSection(section.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Section Title"
                      placeholder="e.g., Kitchen Remodels"
                      value={section.title}
                      onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                    />
                    <Input
                      label="Description (Optional)"
                      placeholder="Brief description of this category"
                      value={section.description || ''}
                      onChange={(e) => updateSection(section.id, 'description', e.target.value)}
                    />
                  </div>

                  {/* Image Upload Area */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Images
                      </label>
                      <div className="flex gap-2">
                        {googlePhotos.length > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => openGoogleModal(section.id)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <MapPin className="mr-1 w-4 h-4" />
                            Google Photos ({googlePhotos.length})
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => openUnsplashModal(section.id, section.title)}
                          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                        >
                          <Sparkles className="mr-1 w-4 h-4" />
                          Find AI Images
                        </Button>
                      </div>
                    </div>

                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      ref={(el) => { fileInputRefs.current[section.id] = el }}
                      onChange={(e) => handleImageUpload(section.id, e.target.files)}
                    />

                    {/* Image grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {section.images.map((image) => (
                        <div
                          key={image.id}
                          className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-100"
                        >
                          <img
                            src={image.url}
                            alt={image.alt}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeImage(section.id, image.id)}
                              className="text-white hover:bg-white/20"
                            >
                              <X className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      {/* Upload button */}
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[section.id]?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-primary-400 transition-colors flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-primary-600"
                      >
                        <Upload className="w-6 h-6" />
                        <span className="text-xs font-medium">Upload</span>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add Section Button */}
        <motion.div layout>
          <Button
            variant="outline"
            onClick={() => addSection()}
            className="w-full border-dashed"
          >
            <Plus className="mr-2 w-4 h-4" />
            Add Another Section
          </Button>
        </motion.div>
      </div>

      {/* Info box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 p-4 bg-purple-50 border border-purple-100 rounded-xl"
      >
        <h3 className="font-medium text-purple-900 mb-1 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          AI-Powered Image Selection
        </h3>
        <p className="text-sm text-purple-700">
          Click "Find AI Images" to browse high-quality, professional photos from Unsplash that match
          your business type. These images are perfect for showcasing your work until you have your
          own portfolio photos.
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
          <Button onClick={handleSubmit}>
            Continue to Preview
          </Button>
        </div>
      </div>

      {/* Unsplash Modal */}
      <AnimatePresence>
        {showUnsplashModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowUnsplashModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    Select Images from Unsplash
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowUnsplashModal(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Search */}
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search for images..."
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
              </div>

              {/* Photo Grid */}
              <div className="p-4 overflow-y-auto max-h-[50vh]">
                {loadingPhotos ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
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
                        onClick={() => togglePhotoSelection(photo.id)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          selectedPhotos.has(photo.id)
                            ? 'border-purple-500 ring-2 ring-purple-500/50'
                            : 'border-transparent hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={photo.thumbUrl}
                          alt={photo.alt}
                          className="w-full h-full object-cover"
                        />
                        {selectedPhotos.has(photo.id) && (
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

              {/* Pagination Controls */}
              {unsplashPhotos.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-center gap-3">
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

              {/* Modal Footer */}
              <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {selectedPhotos.size} photo{selectedPhotos.size !== 1 ? 's' : ''} selected
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowUnsplashModal(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={addSelectedPhotos}
                    disabled={selectedPhotos.size === 0}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="mr-1 w-4 h-4" />
                    Add {selectedPhotos.size} Photo{selectedPhotos.size !== 1 ? 's' : ''}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Google Photos Modal */}
      <AnimatePresence>
        {showGoogleModal && googlePhotos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowGoogleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    Google Business Photos
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowGoogleModal(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Select photos from the business's Google profile
                </p>
              </div>

              {/* Photo Grid */}
              <div className="p-4 overflow-y-auto max-h-[50vh]">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {googlePhotos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => toggleGooglePhotoSelection(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedGooglePhotos.has(index)
                          ? 'border-blue-500 ring-2 ring-blue-500/50'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`Business photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {selectedGooglePhotos.has(index) && (
                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {selectedGooglePhotos.size} photo{selectedGooglePhotos.size !== 1 ? 's' : ''} selected
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowGoogleModal(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={addSelectedGooglePhotos}
                    disabled={selectedGooglePhotos.size === 0}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="mr-1 w-4 h-4" />
                    Add {selectedGooglePhotos.size} Photo{selectedGooglePhotos.size !== 1 ? 's' : ''}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
