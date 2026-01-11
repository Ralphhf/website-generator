'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, ExternalLink, Image, CheckCircle2, Circle, Facebook, Instagram, Linkedin, MapPin } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'

interface UpdateProfilesStepProps {
  businessName: string
  onFinish: () => void
  onSkip: () => void
  onBack: () => void
}

interface ChecklistItem {
  id: string
  platform: string
  icon: React.ReactNode
  task: string
  settingsUrl: string
  color: string
}

export function UpdateProfilesStep({
  businessName,
  onFinish,
  onSkip,
  onBack
}: UpdateProfilesStepProps) {
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set())

  const checklistItems: ChecklistItem[] = [
    {
      id: 'google-logo',
      platform: 'Google Business',
      icon: <MapPin className="w-5 h-5" />,
      task: 'Upload logo to Google Business Profile',
      settingsUrl: 'https://business.google.com/',
      color: 'text-blue-500'
    },
    {
      id: 'google-cover',
      platform: 'Google Business',
      icon: <MapPin className="w-5 h-5" />,
      task: 'Add cover photo to Google Business Profile',
      settingsUrl: 'https://business.google.com/',
      color: 'text-blue-500'
    },
    {
      id: 'facebook-logo',
      platform: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      task: 'Set logo as Facebook Page profile picture',
      settingsUrl: 'https://www.facebook.com/pages/',
      color: 'text-[#1877F2]'
    },
    {
      id: 'facebook-cover',
      platform: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      task: 'Add cover photo to Facebook Page',
      settingsUrl: 'https://www.facebook.com/pages/',
      color: 'text-[#1877F2]'
    },
    {
      id: 'instagram-logo',
      platform: 'Instagram',
      icon: <Instagram className="w-5 h-5" />,
      task: 'Set logo as Instagram profile picture',
      settingsUrl: 'https://www.instagram.com/accounts/edit/',
      color: 'text-[#E4405F]'
    },
    {
      id: 'linkedin-logo',
      platform: 'LinkedIn',
      icon: <Linkedin className="w-5 h-5" />,
      task: 'Set logo as LinkedIn Company Page logo',
      settingsUrl: 'https://www.linkedin.com/company/',
      color: 'text-[#0A66C2]'
    },
    {
      id: 'linkedin-cover',
      platform: 'LinkedIn',
      icon: <Linkedin className="w-5 h-5" />,
      task: 'Add cover image to LinkedIn Company Page',
      settingsUrl: 'https://www.linkedin.com/company/',
      color: 'text-[#0A66C2]'
    }
  ]

  const toggleItem = (id: string) => {
    const newCompleted = new Set(completedItems)
    if (newCompleted.has(id)) {
      newCompleted.delete(id)
    } else {
      newCompleted.add(id)
    }
    setCompletedItems(newCompleted)
  }

  const completedCount = completedItems.size
  const totalCount = checklistItems.length
  const progress = (completedCount / totalCount) * 100

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
          <Image className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Update Profile Pictures
        </h1>
        <p className="text-gray-600">
          Add the logo to all created accounts for {businessName}
        </p>
      </motion.div>

      {/* Progress Bar */}
      <Card variant="gradient" className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{completedCount} of {totalCount} completed</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-teal-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Checklist */}
      <Card variant="outlined" className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Profile Update Checklist
          </CardTitle>
          <CardDescription>
            Click each item to mark as complete and open the settings page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {checklistItems.map((item) => {
            const isCompleted = completedItems.has(item.id)
            return (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                  isCompleted
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleItem(item.id)}
              >
                <div className="flex items-center gap-3">
                  <button
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isCompleted
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {isCompleted && <Check className="w-4 h-4 text-white" />}
                  </button>
                  <div className={item.color}>{item.icon}</div>
                  <div>
                    <p className={`text-sm font-medium ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                      {item.task}
                    </p>
                    <p className="text-xs text-gray-500">{item.platform}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(item.settingsUrl, '_blank')
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Image Size Guide */}
      <Card variant="outlined" className="mb-8">
        <CardHeader>
          <CardTitle>Recommended Image Sizes</CardTitle>
          <CardDescription>Use these dimensions for best quality</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-900">Profile Pictures</p>
              <ul className="text-gray-600 space-y-1 mt-1">
                <li>• Google: 250x250px</li>
                <li>• Facebook: 170x170px</li>
                <li>• Instagram: 320x320px</li>
                <li>• LinkedIn: 300x300px</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-gray-900">Cover Photos</p>
              <ul className="text-gray-600 space-y-1 mt-1">
                <li>• Google: 1080x608px</li>
                <li>• Facebook: 820x312px</li>
                <li>• LinkedIn: 1128x191px</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="p-4 bg-green-50 border border-green-100 rounded-xl mb-8"
      >
        <h3 className="font-medium text-green-900 mb-2">Pro Tips</h3>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Use the same logo across all platforms for brand consistency</li>
          <li>• Save logo in PNG format with transparent background</li>
          <li>• Create a simple version without text for small profile pictures</li>
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
          <Button onClick={onFinish} className="bg-green-600 hover:bg-green-700">
            <Check className="mr-2 w-4 h-4" />
            Finish Setup
          </Button>
        </div>
      </div>
    </div>
  )
}
