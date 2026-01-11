'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Building2, FileText, Calendar, Tag, Sparkles, Loader2 } from 'lucide-react'
import { Button, Input, Textarea, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { BusinessInfo } from '@/lib/types'

interface BasicInfoStepProps {
  businessInfo: BusinessInfo
  onSubmit: (data: Partial<BusinessInfo>) => void
  onBack: () => void
}

export function BasicInfoStep({ businessInfo, onSubmit, onBack }: BasicInfoStepProps) {
  const [name, setName] = useState(businessInfo.name)
  const [tagline, setTagline] = useState(businessInfo.tagline || '')
  const [description, setDescription] = useState(businessInfo.description || '')
  const [yearsInBusiness, setYearsInBusiness] = useState(businessInfo.yearsInBusiness?.toString() || '')
  const [services, setServices] = useState(businessInfo.services?.join(', ') || '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // AI generation states
  const [generatingTagline, setGeneratingTagline] = useState(false)
  const [generatingDescription, setGeneratingDescription] = useState(false)
  const [generatingServices, setGeneratingServices] = useState(false)

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) newErrors.name = 'Business name is required'
    if (!description.trim()) newErrors.description = 'Description is required'
    if (description.length < 50) newErrors.description = 'Description should be at least 50 characters for better SEO'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({
        name,
        tagline,
        description,
        yearsInBusiness: parseInt(yearsInBusiness) || 0,
        services: services.split(',').map(s => s.trim()).filter(Boolean),
      })
    }
  }

  const generateTagline = async () => {
    if (!name.trim()) {
      setErrors({ ...errors, name: 'Business name is required to generate tagline' })
      return
    }

    setGeneratingTagline(true)
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'tagline',
          businessName: name,
          businessType: businessInfo.businessType,
          services: services.split(',').map(s => s.trim()).filter(Boolean),
        }),
      })

      const data = await response.json()
      if (data.success && data.result) {
        setTagline(data.result)
      }
    } catch (error) {
      console.error('Failed to generate tagline:', error)
    } finally {
      setGeneratingTagline(false)
    }
  }

  const generateDescription = async () => {
    if (!name.trim()) {
      setErrors({ ...errors, name: 'Business name is required to generate description' })
      return
    }

    setGeneratingDescription(true)
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'description',
          businessName: name,
          businessType: businessInfo.businessType,
          services: services.split(',').map(s => s.trim()).filter(Boolean),
          yearsInBusiness: parseInt(yearsInBusiness) || 0,
          city: businessInfo.city,
          state: businessInfo.state,
        }),
      })

      const data = await response.json()
      if (data.success && data.result) {
        setDescription(data.result)
      }
    } catch (error) {
      console.error('Failed to generate description:', error)
    } finally {
      setGeneratingDescription(false)
    }
  }

  const generateServices = async () => {
    console.log('generateServices called, name:', name)

    if (!name.trim()) {
      console.log('No name provided, showing error')
      setErrors({ ...errors, name: 'Business name is required to suggest services' })
      return
    }

    setGeneratingServices(true)
    console.log('Calling API...')
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'services',
          businessName: name,
          businessType: businessInfo.businessType || '',
          existingServices: services.split(',').map(s => s.trim()).filter(Boolean),
        }),
      })

      console.log('API response status:', response.status)
      const data = await response.json()
      console.log('API response data:', data)

      if (data.success && data.result) {
        setServices(data.result.join(', '))
      } else {
        console.log('API did not return success or result')
      }
    } catch (error) {
      console.error('Failed to generate services:', error)
    } finally {
      setGeneratingServices(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Basic Business Information
        </h1>
        <p className="text-gray-600">
          Tell us about the business to create compelling website content
        </p>
      </motion.div>

      <Card variant="gradient">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary-500" />
            Business Details
          </CardTitle>
          <CardDescription>
            This information will be used to generate SEO-optimized content. Use the <Sparkles className="w-4 h-4 inline text-purple-500" /> AI buttons to auto-generate content!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Input
            label="Business Name"
            placeholder="Enter the business name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            icon={<Building2 className="w-5 h-5" />}
          />

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Tagline (Optional)</label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={generateTagline}
                disabled={generatingTagline}
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              >
                {generatingTagline ? (
                  <Loader2 className="mr-1 w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-1 w-4 h-4" />
                )}
                Generate with AI
              </Button>
            </div>
            <Input
              placeholder="A short catchy phrase that describes the business"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              icon={<Tag className="w-5 h-5" />}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Business Description</label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={generateDescription}
                disabled={generatingDescription}
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              >
                {generatingDescription ? (
                  <Loader2 className="mr-1 w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-1 w-4 h-4" />
                )}
                Generate with AI
              </Button>
            </div>
            <Textarea
              placeholder="Describe what this business does, their mission, and what makes them unique. Include details about their services, experience, and why customers should choose them. (Minimum 50 characters)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={errors.description}
              className="min-h-[150px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Years in Business"
              type="number"
              placeholder="e.g., 10"
              value={yearsInBusiness}
              onChange={(e) => setYearsInBusiness(e.target.value)}
              icon={<Calendar className="w-5 h-5" />}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Services Offered</label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={generateServices}
                disabled={generatingServices}
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              >
                {generatingServices ? (
                  <Loader2 className="mr-1 w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-1 w-4 h-4" />
                )}
                Suggest Services
              </Button>
            </div>
            <Input
              placeholder="Enter services separated by commas (e.g., Kitchen Remodeling, Bathroom Renovation)"
              value={services}
              onChange={(e) => setServices(e.target.value)}
              icon={<FileText className="w-5 h-5" />}
            />
            <p className="mt-1 text-xs text-gray-500">
              Separate multiple services with commas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AI Info Box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 p-4 bg-purple-50 border border-purple-100 rounded-xl"
      >
        <h3 className="font-medium text-purple-900 mb-1 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          AI-Powered Content Generation
        </h3>
        <p className="text-sm text-purple-700">
          Click the "Generate with AI" buttons to automatically create professional, SEO-optimized
          content for your business. The AI will consider your business type, location, and services
          to create compelling copy.
        </p>
      </motion.div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        <Button onClick={handleSubmit}>
          Continue
        </Button>
      </div>
    </div>
  )
}
