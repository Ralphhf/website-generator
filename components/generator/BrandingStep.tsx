'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Palette, Type, MessageSquare, Check } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Input } from '@/components/ui'
import {
  BrandingConfig,
  ColorScheme,
  FontStyle,
  BrandTone,
  COLOR_SCHEMES,
  FONT_STYLES,
  BRAND_TONES
} from '@/lib/types'

interface BrandingStepProps {
  branding?: BrandingConfig
  onSubmit: (branding: BrandingConfig) => void
  onBack: () => void
}

const colorSchemeKeys = Object.keys(COLOR_SCHEMES) as Exclude<ColorScheme, 'custom'>[]
const fontStyleKeys = Object.keys(FONT_STYLES) as FontStyle[]
const brandToneKeys = Object.keys(BRAND_TONES) as BrandTone[]

export function BrandingStep({ branding, onSubmit, onBack }: BrandingStepProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(branding?.colorScheme || 'blue')
  const [customPrimaryColor, setCustomPrimaryColor] = useState(branding?.customPrimaryColor || '#3b82f6')
  const [customSecondaryColor, setCustomSecondaryColor] = useState(branding?.customSecondaryColor || '#1e40af')
  const [fontStyle, setFontStyle] = useState<FontStyle>(branding?.fontStyle || 'modern')
  const [brandTone, setBrandTone] = useState<BrandTone>(branding?.brandTone || 'professional')

  const handleSubmit = () => {
    onSubmit({
      colorScheme,
      customPrimaryColor: colorScheme === 'custom' ? customPrimaryColor : undefined,
      customSecondaryColor: colorScheme === 'custom' ? customSecondaryColor : undefined,
      fontStyle,
      brandTone,
    })
  }

  const getSelectedColors = () => {
    if (colorScheme === 'custom') {
      return { primary: customPrimaryColor, secondary: customSecondaryColor }
    }
    return COLOR_SCHEMES[colorScheme]
  }

  const selectedColors = getSelectedColors()

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Brand Your Website
        </h1>
        <p className="text-gray-600">
          Choose colors, fonts, and tone that match your brand identity
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Color Scheme */}
        <Card variant="gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary-500" />
              Color Scheme
            </CardTitle>
            <CardDescription>
              Select a color palette for your website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {colorSchemeKeys.map((scheme) => (
                <button
                  key={scheme}
                  type="button"
                  onClick={() => setColorScheme(scheme)}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    colorScheme === scheme
                      ? 'border-gray-900 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex gap-1 mb-2">
                    <div
                      className="w-8 h-8 rounded-lg shadow-inner"
                      style={{ backgroundColor: COLOR_SCHEMES[scheme].primary }}
                    />
                    <div
                      className="w-8 h-8 rounded-lg shadow-inner"
                      style={{ backgroundColor: COLOR_SCHEMES[scheme].secondary }}
                    />
                  </div>
                  <p className="text-xs font-medium text-gray-700">{COLOR_SCHEMES[scheme].name}</p>
                  {colorScheme === scheme && (
                    <div className="absolute top-2 right-2">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Custom Color Option */}
            <button
              type="button"
              onClick={() => setColorScheme('custom')}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                colorScheme === 'custom'
                  ? 'border-gray-900 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div
                      className="w-8 h-8 rounded-lg shadow-inner border border-gray-200"
                      style={{ backgroundColor: customPrimaryColor }}
                    />
                    <div
                      className="w-8 h-8 rounded-lg shadow-inner border border-gray-200"
                      style={{ backgroundColor: customSecondaryColor }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Custom Colors</span>
                </div>
                {colorScheme === 'custom' && <Check className="w-4 h-4 text-green-600" />}
              </div>
            </button>

            {colorScheme === 'custom' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 bg-gray-50 rounded-xl space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={customPrimaryColor}
                        onChange={(e) => setCustomPrimaryColor(e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer border border-gray-200"
                      />
                      <Input
                        value={customPrimaryColor}
                        onChange={(e) => setCustomPrimaryColor(e.target.value)}
                        placeholder="#3b82f6"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secondary Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={customSecondaryColor}
                        onChange={(e) => setCustomSecondaryColor(e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer border border-gray-200"
                      />
                      <Input
                        value={customSecondaryColor}
                        onChange={(e) => setCustomSecondaryColor(e.target.value)}
                        placeholder="#1e40af"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Live Preview */}
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-2">Preview</p>
              <div className="flex items-center gap-3">
                <button
                  className="px-4 py-2 rounded-full text-white text-sm font-medium"
                  style={{ backgroundColor: selectedColors.primary }}
                >
                  Primary Button
                </button>
                <button
                  className="px-4 py-2 rounded-full text-white text-sm font-medium"
                  style={{ backgroundColor: selectedColors.secondary }}
                >
                  Secondary
                </button>
                <span
                  className="text-sm font-semibold"
                  style={{ color: selectedColors.primary }}
                >
                  Link Text
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Font Style */}
        <Card variant="gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="w-5 h-5 text-primary-500" />
              Font Style
            </CardTitle>
            <CardDescription>
              Choose fonts that reflect your brand personality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-3">
              {fontStyleKeys.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setFontStyle(style)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                    fontStyle === style
                      ? 'border-gray-900 shadow-lg bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="mb-2">
                    <p
                      className="text-xl font-bold text-gray-900"
                      style={{ fontFamily: `${FONT_STYLES[style].heading}, sans-serif` }}
                    >
                      {FONT_STYLES[style].name}
                    </p>
                    <p
                      className="text-sm text-gray-600"
                      style={{ fontFamily: `${FONT_STYLES[style].body}, sans-serif` }}
                    >
                      {FONT_STYLES[style].description}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">
                    {FONT_STYLES[style].heading} + {FONT_STYLES[style].body}
                  </div>
                  {fontStyle === style && (
                    <div className="absolute top-3 right-3">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Brand Tone */}
        <Card variant="gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary-500" />
              Brand Tone
            </CardTitle>
            <CardDescription>
              This affects how AI generates your website copy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-3">
              {brandToneKeys.map((tone) => (
                <button
                  key={tone}
                  type="button"
                  onClick={() => setBrandTone(tone)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                    brandTone === tone
                      ? 'border-gray-900 shadow-lg bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-semibold text-gray-900 mb-1">
                    {BRAND_TONES[tone].name}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    {BRAND_TONES[tone].description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {BRAND_TONES[tone].keywords.slice(0, 3).map((keyword) => (
                      <span
                        key={keyword}
                        className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  {brandTone === tone && (
                    <div className="absolute top-3 right-3">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

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
