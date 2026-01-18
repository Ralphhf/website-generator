'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, DollarSign, Plus, Trash2, Star, Sparkles, Loader2 } from 'lucide-react'
import { Button, Input, Textarea, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { PricingPackage } from '@/lib/types'

interface PricingStepProps {
  pricing: PricingPackage[]
  businessName: string
  businessType: string
  services: string[]
  onSubmit: (pricing: PricingPackage[]) => void
  onBack: () => void
}

export function PricingStep({ pricing, businessName, businessType, services, onSubmit, onBack }: PricingStepProps) {
  const [packages, setPackages] = useState<PricingPackage[]>(pricing || [])
  const [isGenerating, setIsGenerating] = useState(false)

  const addPackage = () => {
    const newPackage: PricingPackage = {
      id: Date.now().toString(),
      name: '',
      price: '',
      description: '',
      features: [''],
      isPopular: false,
    }
    setPackages([...packages, newPackage])
  }

  const removePackage = (id: string) => {
    setPackages(packages.filter(p => p.id !== id))
  }

  const updatePackage = (id: string, field: keyof PricingPackage, value: string | boolean | string[]) => {
    setPackages(packages.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

  const addFeature = (packageId: string) => {
    setPackages(packages.map(p =>
      p.id === packageId ? { ...p, features: [...p.features, ''] } : p
    ))
  }

  const updateFeature = (packageId: string, featureIndex: number, value: string) => {
    setPackages(packages.map(p =>
      p.id === packageId
        ? { ...p, features: p.features.map((f, i) => i === featureIndex ? value : f) }
        : p
    ))
  }

  const removeFeature = (packageId: string, featureIndex: number) => {
    setPackages(packages.map(p =>
      p.id === packageId
        ? { ...p, features: p.features.filter((_, i) => i !== featureIndex) }
        : p
    ))
  }

  const generatePricing = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'pricing',
          businessName,
          businessType,
          services,
        }),
      })

      const data = await response.json()
      if (data.success && data.result) {
        // Result should be an array of pricing packages
        const generatedPackages = data.result.map((pkg: Omit<PricingPackage, 'id'>, index: number) => ({
          ...pkg,
          id: Date.now().toString() + index,
        }))
        setPackages(generatedPackages)
      }
    } catch (error) {
      console.error('Failed to generate pricing:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = () => {
    // Filter out empty packages and clean up features
    const cleanedPackages = packages
      .filter(p => p.name.trim() && p.price.trim())
      .map(p => ({
        ...p,
        features: p.features.filter(f => f.trim()),
      }))
    onSubmit(cleanedPackages)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pricing & Packages
        </h1>
        <p className="text-gray-600">
          Add your service packages or pricing tiers (optional)
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* AI Generate Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={generatePricing}
            disabled={isGenerating}
            className="text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            {isGenerating ? (
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 w-4 h-4" />
            )}
            Generate Pricing with AI
          </Button>
        </div>

        {/* Packages List */}
        {packages.map((pkg, index) => (
          <Card key={pkg.id} variant="gradient">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary-500" />
                  Package {index + 1}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updatePackage(pkg.id, 'isPopular', !pkg.isPopular)}
                    className={pkg.isPopular ? 'text-yellow-600' : 'text-gray-400'}
                  >
                    <Star className={`w-4 h-4 ${pkg.isPopular ? 'fill-yellow-400' : ''}`} />
                    {pkg.isPopular ? 'Popular' : 'Mark Popular'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePackage(pkg.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Package Name"
                  placeholder="e.g., Basic, Professional, Premium"
                  value={pkg.name}
                  onChange={(e) => updatePackage(pkg.id, 'name', e.target.value)}
                />
                <Input
                  label="Price"
                  placeholder="e.g., $99, $199/mo, From $500"
                  value={pkg.price}
                  onChange={(e) => updatePackage(pkg.id, 'price', e.target.value)}
                />
              </div>
              <Textarea
                label="Description (optional)"
                placeholder="Brief description of this package"
                value={pkg.description || ''}
                onChange={(e) => updatePackage(pkg.id, 'description', e.target.value)}
                className="min-h-[60px]"
              />

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features Included
                </label>
                <div className="space-y-2">
                  {pkg.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex gap-2">
                      <Input
                        placeholder="e.g., 24/7 Support, Free Consultation"
                        value={feature}
                        onChange={(e) => updateFeature(pkg.id, featureIndex, e.target.value)}
                        className="flex-1"
                      />
                      {pkg.features.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFeature(pkg.id, featureIndex)}
                          className="text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addFeature(pkg.id)}
                    className="text-primary-600"
                  >
                    <Plus className="mr-1 w-4 h-4" />
                    Add Feature
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Package Button */}
        <Button
          variant="outline"
          onClick={addPackage}
          className="w-full border-dashed"
        >
          <Plus className="mr-2 w-4 h-4" />
          Add Pricing Package
        </Button>

        {packages.length === 0 && (
          <p className="text-center text-gray-500 text-sm">
            No pricing packages added. Click above to add one, or skip this step.
          </p>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        <Button onClick={handleSubmit}>
          {packages.length > 0 ? 'Continue' : 'Skip'}
        </Button>
      </div>
    </div>
  )
}
