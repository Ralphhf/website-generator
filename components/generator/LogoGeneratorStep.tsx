'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Copy, Check, ExternalLink, Sparkles, Palette, Shuffle } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'

interface LogoGeneratorStepProps {
  businessName: string
  businessType: string
  tagline?: string
  onNext: () => void
  onSkip: () => void
  onBack: () => void
}

export function LogoGeneratorStep({
  businessName,
  businessType,
  tagline,
  onNext,
  onSkip,
  onBack
}: LogoGeneratorStepProps) {
  const [copied, setCopied] = useState(false)
  const [promptIndex, setPromptIndex] = useState(0)

  const businessTypeFormatted = businessType.replace(/_/g, ' ')

  const logoPrompts = [
    // 1. Modern Minimalist
    {
      name: 'Modern Minimalist',
      prompt: `Create a minimalist, modern logo for "${businessName}", a ${businessTypeFormatted} business${tagline ? ` with the tagline "${tagline}"` : ''}.

Style Requirements:
- Ultra-clean, minimal design with lots of whitespace
- Simple geometric shapes or single-line icon
- Maximum 2 colors (prefer monochrome with one accent)
- Sans-serif typography, thin or light weight
- Negative space usage for clever visual effect

Aesthetic: Apple/Google-inspired, Silicon Valley tech minimal
Output: SVG-ready, works as small as 16x16 favicon`
    },
    // 2. Bold & Vibrant
    {
      name: 'Bold & Vibrant',
      prompt: `Design a bold, eye-catching logo for "${businessName}", a ${businessTypeFormatted} business${tagline ? ` with the tagline "${tagline}"` : ''}.

Style Requirements:
- Strong, confident design that commands attention
- Vibrant color palette (2-3 bold colors)
- Thick, heavy typography with impact
- Dynamic shapes or abstract icon
- High contrast for maximum visibility

Aesthetic: Energetic, confident, memorable, stands out in a crowd
Output: Works great on social media, billboards, merchandise`
    },
    // 3. Elegant & Premium
    {
      name: 'Elegant & Premium',
      prompt: `Create an elegant, luxury logo for "${businessName}", a ${businessTypeFormatted} business${tagline ? ` with the tagline "${tagline}"` : ''}.

Style Requirements:
- Sophisticated, high-end aesthetic
- Serif or elegant script typography
- Gold, black, navy, or deep jewel tones
- Fine lines, subtle details, or monogram style
- Could include a crest, emblem, or refined icon

Aesthetic: Luxury brand, premium service, timeless elegance
Output: Suitable for embossing, foil stamping, premium print`
    },
    // 4. Friendly & Approachable
    {
      name: 'Friendly & Approachable',
      prompt: `Design a friendly, approachable logo for "${businessName}", a ${businessTypeFormatted} business${tagline ? ` with the tagline "${tagline}"` : ''}.

Style Requirements:
- Warm, welcoming, and trustworthy feel
- Rounded shapes and soft edges
- Friendly color palette (warm tones, soft blues, greens)
- Rounded sans-serif or casual typography
- Optional: subtle smile, character, or mascot element

Aesthetic: Local business, family-friendly, community-focused
Output: Works well for storefront, uniforms, local advertising`
    },
    // 5. Classic & Professional
    {
      name: 'Classic & Professional',
      prompt: `Create a classic, professional logo for "${businessName}", a ${businessTypeFormatted} business${tagline ? ` with the tagline "${tagline}"` : ''}.

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

  const currentPrompt = logoPrompts[promptIndex]

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentPrompt.prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const nextPrompt = () => {
    setPromptIndex((prev) => (prev + 1) % logoPrompts.length)
    setCopied(false)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Palette className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create a Logo
        </h1>
        <p className="text-gray-600">
          Generate a professional logo for {businessName} using AI tools
        </p>
      </motion.div>

      <Card variant="gradient" className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                AI Logo Prompt
              </CardTitle>
              <CardDescription>
                Copy this prompt and paste it into ChatGPT or Canva AI to generate your logo
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {promptIndex + 1} / {logoPrompts.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={nextPrompt}
                className="border-purple-300 hover:bg-purple-50"
              >
                <Shuffle className="w-4 h-4 mr-1" />
                Next Style
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Style name badge */}
          <div className="mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              {currentPrompt.name}
            </span>
          </div>
          <div className="relative">
            <pre className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap font-mono">
              {currentPrompt.prompt}
            </pre>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="absolute top-2 right-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tool Links */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <Card variant="outlined" className="hover:border-purple-300 transition-colors">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#10a37f] flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">ChatGPT / DALL-E</h3>
              <p className="text-sm text-gray-500 mb-4">
                Generate logos using OpenAI's image generation
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open('https://chat.openai.com', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open ChatGPT
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card variant="outlined" className="hover:border-purple-300 transition-colors">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#00c4cc] flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Canva</h3>
              <p className="text-sm text-gray-500 mb-4">
                Use Canva's AI logo generator and templates
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open('https://www.canva.com/create/logos/', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Canva
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="p-4 bg-purple-50 border border-purple-100 rounded-xl mb-8"
      >
        <h3 className="font-medium text-purple-900 mb-2">Tips for a Great Logo</h3>
        <ul className="text-sm text-purple-700 space-y-1">
          <li>• Generate multiple variations and pick the best one</li>
          <li>• Request versions with and without text</li>
          <li>• Ask for transparent background versions</li>
          <li>• Test how it looks at small sizes (favicon, profile pic)</li>
        </ul>
      </motion.div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onSkip}>
            Skip
          </Button>
          <Button onClick={onNext}>
            Continue
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
