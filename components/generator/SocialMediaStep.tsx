'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Copy, Check, ExternalLink, Share2, Facebook, Instagram, Linkedin } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { BusinessInfo } from '@/lib/types'

interface SocialMediaStepProps {
  businessInfo: BusinessInfo
  onNext: () => void
  onSkip: () => void
  onBack: () => void
}

interface SocialPlatform {
  name: string
  icon: React.ReactNode
  color: string
  signupUrl: string
  bio: string
  tips: string[]
}

function BioCard({ platform, bio }: { platform: SocialPlatform; bio: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(bio)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <Card variant="outlined" className="overflow-hidden">
      <div className={`h-2 ${platform.color}`} />
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          {platform.icon}
          {platform.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Suggested Bio</span>
            <Button variant="ghost" size="sm" onClick={copyToClipboard}>
              {copied ? (
                <>
                  <Check className="w-3 h-3 mr-1 text-green-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            {bio}
          </p>
        </div>

        <div>
          <span className="text-sm font-medium text-gray-700">Quick Tips</span>
          <ul className="mt-1 text-xs text-gray-500 space-y-1">
            {platform.tips.map((tip, i) => (
              <li key={i}>• {tip}</li>
            ))}
          </ul>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => window.open(platform.signupUrl, '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Create {platform.name} Account
        </Button>
      </CardContent>
    </Card>
  )
}

export function SocialMediaStep({
  businessInfo,
  onNext,
  onSkip,
  onBack
}: SocialMediaStepProps) {
  const businessTypeFormatted = businessInfo.businessType.replace(/_/g, ' ')
  const location = `${businessInfo.city}, ${businessInfo.state}`

  const platforms: SocialPlatform[] = [
    {
      name: 'Facebook',
      icon: <Facebook className="w-5 h-5 text-[#1877F2]" />,
      color: 'bg-[#1877F2]',
      signupUrl: 'https://www.facebook.com/pages/create',
      bio: `${businessInfo.name} - Your trusted ${businessTypeFormatted} in ${location}. ${businessInfo.tagline || ''} Contact us today! ${businessInfo.phone ? `📞 ${businessInfo.phone}` : ''} ${businessInfo.email ? `✉️ ${businessInfo.email}` : ''}`.trim(),
      tips: [
        'Create a Business Page, not a personal profile',
        'Add business hours and contact info',
        'Upload a cover photo (820x312px recommended)'
      ]
    },
    {
      name: 'Instagram',
      icon: <Instagram className="w-5 h-5 text-[#E4405F]" />,
      color: 'bg-gradient-to-r from-[#833AB4] via-[#E4405F] to-[#FCAF45]',
      signupUrl: 'https://www.instagram.com/accounts/emailsignup/',
      bio: `${businessInfo.name} 📍${location}\n${businessInfo.tagline || `Professional ${businessTypeFormatted}`}\n${businessInfo.services?.slice(0, 3).map(s => `✨ ${s}`).join('\n') || ''}\n📞 Contact us today!`.trim(),
      tips: [
        'Switch to a Business account after signup',
        'Bio limit is 150 characters',
        'Add a link to your website in bio'
      ]
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="w-5 h-5 text-[#0A66C2]" />,
      color: 'bg-[#0A66C2]',
      signupUrl: 'https://www.linkedin.com/company/setup/new/',
      bio: `${businessInfo.name} is a professional ${businessTypeFormatted} serving ${location}${businessInfo.serviceAreas?.length ? ` and surrounding areas` : ''}. ${businessInfo.description?.slice(0, 200) || `We provide quality ${businessTypeFormatted} services to our community.`}${businessInfo.yearsInBusiness ? ` With ${businessInfo.yearsInBusiness} years of experience.` : ''}`,
      tips: [
        'Create a Company Page for the business',
        'Add a detailed company description',
        'Include specialties and services offered'
      ]
    }
  ]

  // X/Twitter
  const twitterBio = `${businessInfo.name} | ${businessTypeFormatted} in ${location} ${businessInfo.tagline ? `| ${businessInfo.tagline}` : ''} | ${businessInfo.phone || 'Contact us today!'}`

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
          <Share2 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Social Media Accounts
        </h1>
        <p className="text-gray-600">
          Create social media profiles for {businessInfo.name}
        </p>
      </motion.div>

      {/* Platform Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {platforms.map((platform) => (
          <BioCard key={platform.name} platform={platform} bio={platform.bio} />
        ))}
      </div>

      {/* Additional Platform - X/Twitter */}
      <Card variant="outlined" className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                <span className="text-white font-bold">𝕏</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">X (Twitter)</h3>
                <p className="text-xs text-gray-500">Optional: Good for customer updates</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  await navigator.clipboard.writeText(twitterBio)
                }}
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy Bio
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://twitter.com/i/flow/signup', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Open
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-8"
      >
        <h3 className="font-medium text-blue-900 mb-2">Social Media Best Practices</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use the same business name across all platforms for consistency</li>
          <li>• Upload the logo as the profile picture on all accounts</li>
          <li>• Keep contact information consistent everywhere</li>
          <li>• Start with 2-3 platforms you can actively manage</li>
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
