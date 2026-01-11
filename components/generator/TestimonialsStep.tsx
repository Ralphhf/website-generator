'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Plus, Trash2, Star, Quote, User, Sparkles, Loader2 } from 'lucide-react'
import { Button, Input, Textarea, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { Testimonial } from '@/lib/types'
import { generateId } from '@/lib/utils'

interface TestimonialsStepProps {
  testimonials: Testimonial[]
  businessName: string
  businessType: string
  services: string[]
  onSubmit: (testimonials: Testimonial[]) => void
  onBack: () => void
}

export function TestimonialsStep({
  testimonials: initialTestimonials,
  businessName,
  businessType,
  services,
  onSubmit,
  onBack
}: TestimonialsStepProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(
    initialTestimonials.length > 0
      ? initialTestimonials
      : [createEmptyTestimonial()]
  )
  const [generating, setGenerating] = useState(false)

  function createEmptyTestimonial(): Testimonial {
    return {
      id: generateId(),
      author: '',
      role: '',
      company: '',
      content: '',
      rating: 5,
    }
  }

  const addTestimonial = () => {
    setTestimonials([...testimonials, createEmptyTestimonial()])
  }

  const removeTestimonial = (id: string) => {
    if (testimonials.length > 1) {
      setTestimonials(testimonials.filter(t => t.id !== id))
    }
  }

  const updateTestimonial = (id: string, field: keyof Testimonial, value: string | number) => {
    setTestimonials(testimonials.map(t =>
      t.id === id ? { ...t, [field]: value } : t
    ))
  }

  const generateTestimonials = async () => {
    setGenerating(true)
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'testimonials',
          businessName,
          businessType,
          services,
          count: 3,
        }),
      })

      const data = await response.json()
      if (data.success && data.result && Array.isArray(data.result)) {
        const newTestimonials = data.result.map((t: Omit<Testimonial, 'id'>) => ({
          ...t,
          id: generateId(),
        }))
        setTestimonials(newTestimonials)
      }
    } catch (error) {
      console.error('Failed to generate testimonials:', error)
    } finally {
      setGenerating(false)
    }
  }

  const handleSubmit = () => {
    // Filter out empty testimonials
    const validTestimonials = testimonials.filter(
      t => t.author.trim() && t.content.trim()
    )
    onSubmit(validTestimonials)
  }

  const handleSkip = () => {
    onSubmit([])
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Customer Testimonials
        </h1>
        <p className="text-gray-600">
          Add reviews and testimonials from satisfied customers to build trust
        </p>
      </motion.div>

      {/* AI Generate Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card variant="outlined" className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Generate AI Testimonials</h3>
                  <p className="text-sm text-gray-600">Create realistic testimonials based on your business</p>
                </div>
              </div>
              <Button
                onClick={generateTestimonials}
                disabled={generating}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 w-4 h-4" />
                    Generate 3 Testimonials
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              layout
            >
              <Card variant="gradient">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Quote className="w-5 h-5 text-primary-500" />
                      Testimonial {index + 1}
                    </CardTitle>
                    {testimonials.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTestimonial(testimonial.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Rating */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Rating
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => updateTestimonial(testimonial.id, 'rating', star)}
                          className="p-1 transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= testimonial.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Review Content */}
                  <Textarea
                    label="Review"
                    placeholder="Write the customer's testimonial here..."
                    value={testimonial.content}
                    onChange={(e) => updateTestimonial(testimonial.id, 'content', e.target.value)}
                    className="min-h-[100px]"
                  />

                  {/* Author Info */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Input
                      label="Customer Name"
                      placeholder="John Smith"
                      value={testimonial.author}
                      onChange={(e) => updateTestimonial(testimonial.id, 'author', e.target.value)}
                      icon={<User className="w-5 h-5" />}
                    />
                    <Input
                      label="Role (Optional)"
                      placeholder="Homeowner"
                      value={testimonial.role || ''}
                      onChange={(e) => updateTestimonial(testimonial.id, 'role', e.target.value)}
                    />
                    <Input
                      label="Location (Optional)"
                      placeholder="Austin, TX"
                      value={testimonial.company || ''}
                      onChange={(e) => updateTestimonial(testimonial.id, 'company', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add More Button */}
        <motion.div layout>
          <Button
            variant="outline"
            onClick={addTestimonial}
            className="w-full border-dashed"
          >
            <Plus className="mr-2 w-4 h-4" />
            Add Another Testimonial
          </Button>
        </motion.div>
      </div>

      {/* Info box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-xl"
      >
        <h3 className="font-medium text-amber-900 mb-1">
          Why Testimonials Matter
        </h3>
        <p className="text-sm text-amber-700">
          Customer testimonials build trust and credibility. They help convert visitors into
          customers by showing real experiences with the business. Include specific details
          about what the customer appreciated for maximum impact.
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
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
