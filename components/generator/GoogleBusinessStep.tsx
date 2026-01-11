'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Copy, Check, ExternalLink, MapPin, Building2, Phone, Mail, Clock } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { BusinessInfo } from '@/lib/types'

interface GoogleBusinessStepProps {
  businessInfo: BusinessInfo
  onNext: () => void
  onSkip: () => void
  onBack: () => void
}

interface CopyFieldProps {
  label: string
  value: string
  icon: React.ReactNode
}

function CopyField({ label, value, icon }: CopyFieldProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (!value) return null

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="text-gray-400">{icon}</div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-sm font-medium text-gray-900">{value}</p>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={copyToClipboard}>
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </Button>
    </div>
  )
}

export function GoogleBusinessStep({
  businessInfo,
  onNext,
  onSkip,
  onBack
}: GoogleBusinessStepProps) {
  const fullAddress = `${businessInfo.address}, ${businessInfo.city}, ${businessInfo.state} ${businessInfo.zipCode}`

  const steps = [
    'Go to Google Business Profile and sign in with a Google account',
    'Click "Add your business to Google"',
    'Enter the business name and category',
    'Add the business location and service area',
    'Enter contact information (phone, website)',
    'Verify the business (usually via postcard, phone, or email)',
    'Complete your profile with photos, hours, and description'
  ]

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
          <MapPin className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Google Business Profile
        </h1>
        <p className="text-gray-600">
          Set up a Google Business Profile for {businessInfo.name}
        </p>
      </motion.div>

      {/* Quick Copy Data */}
      <Card variant="gradient" className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-500" />
            Business Information
          </CardTitle>
          <CardDescription>
            Click to copy each field when filling out the Google Business form
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <CopyField
            label="Business Name"
            value={businessInfo.name}
            icon={<Building2 className="w-4 h-4" />}
          />
          <CopyField
            label="Address"
            value={fullAddress}
            icon={<MapPin className="w-4 h-4" />}
          />
          <CopyField
            label="Phone"
            value={businessInfo.phone}
            icon={<Phone className="w-4 h-4" />}
          />
          <CopyField
            label="Email"
            value={businessInfo.email}
            icon={<Mail className="w-4 h-4" />}
          />
          <CopyField
            label="Description"
            value={businessInfo.description}
            icon={<Building2 className="w-4 h-4" />}
          />
          {businessInfo.services?.length > 0 && (
            <CopyField
              label="Services"
              value={businessInfo.services.join(', ')}
              icon={<Clock className="w-4 h-4" />}
            />
          )}
        </CardContent>
      </Card>

      {/* Open Google Business */}
      <Card variant="outlined" className="mb-6">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Google Business Profile</h3>
            <p className="text-sm text-gray-500 mb-4">
              Create and manage your business presence on Google
            </p>
            <Button
              className="w-full sm:w-auto"
              onClick={() => window.open('https://business.google.com/create', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Google Business
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Steps Guide */}
      <Card variant="outlined" className="mb-8">
        <CardHeader>
          <CardTitle>Setup Steps</CardTitle>
          <CardDescription>Follow these steps to create the profile</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {steps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-medium flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-sm text-gray-600 pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="p-4 bg-amber-50 border border-amber-100 rounded-xl mb-8"
      >
        <h3 className="font-medium text-amber-900 mb-1">Verification Required</h3>
        <p className="text-sm text-amber-700">
          Google will need to verify the business ownership. This usually takes 5-14 days via postcard,
          or can be done instantly via phone/email for some businesses.
        </p>
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
