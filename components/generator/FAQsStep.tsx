'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, HelpCircle, Plus, Trash2, Sparkles, Loader2 } from 'lucide-react'
import { Button, Input, Textarea, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { FAQ } from '@/lib/types'

interface FAQsStepProps {
  faqs: FAQ[]
  businessName: string
  businessType: string
  services: string[]
  onSubmit: (faqs: FAQ[]) => void
  onBack: () => void
}

export function FAQsStep({ faqs, businessName, businessType, services, onSubmit, onBack }: FAQsStepProps) {
  const [faqList, setFaqList] = useState<FAQ[]>(faqs || [])
  const [isGenerating, setIsGenerating] = useState(false)

  const addFaq = () => {
    const newFaq: FAQ = {
      id: Date.now().toString(),
      question: '',
      answer: '',
    }
    setFaqList([...faqList, newFaq])
  }

  const removeFaq = (id: string) => {
    setFaqList(faqList.filter(f => f.id !== id))
  }

  const updateFaq = (id: string, field: 'question' | 'answer', value: string) => {
    setFaqList(faqList.map(f =>
      f.id === id ? { ...f, [field]: value } : f
    ))
  }

  const generateFaqs = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'faqs',
          businessName,
          businessType,
          services,
        }),
      })

      const data = await response.json()
      if (data.success && data.result) {
        // Result should be an array of FAQs
        const generatedFaqs = data.result.map((faq: Omit<FAQ, 'id'>, index: number) => ({
          ...faq,
          id: Date.now().toString() + index,
        }))
        setFaqList(generatedFaqs)
      }
    } catch (error) {
      console.error('Failed to generate FAQs:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = () => {
    // Filter out empty FAQs
    const cleanedFaqs = faqList.filter(f => f.question.trim() && f.answer.trim())
    onSubmit(cleanedFaqs)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600">
          Add common questions customers ask (optional but great for SEO)
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* AI Generate Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={generateFaqs}
            disabled={isGenerating}
            className="text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            {isGenerating ? (
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 w-4 h-4" />
            )}
            Generate FAQs with AI
          </Button>
        </div>

        {/* FAQs List */}
        {faqList.map((faq, index) => (
          <Card key={faq.id} variant="gradient">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary-500" />
                  Question {index + 1}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFaq(faq.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Question"
                placeholder="e.g., What are your business hours?"
                value={faq.question}
                onChange={(e) => updateFaq(faq.id, 'question', e.target.value)}
              />
              <Textarea
                label="Answer"
                placeholder="Provide a helpful answer to this question"
                value={faq.answer}
                onChange={(e) => updateFaq(faq.id, 'answer', e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
        ))}

        {/* Add FAQ Button */}
        <Button
          variant="outline"
          onClick={addFaq}
          className="w-full border-dashed"
        >
          <Plus className="mr-2 w-4 h-4" />
          Add FAQ
        </Button>

        {faqList.length === 0 && (
          <p className="text-center text-gray-500 text-sm">
            No FAQs added. Click above to add one, or use AI to generate common questions.
          </p>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        <Button onClick={handleSubmit}>
          {faqList.length > 0 ? 'Continue' : 'Skip'}
        </Button>
      </div>
    </div>
  )
}
