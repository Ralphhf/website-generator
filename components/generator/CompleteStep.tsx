'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Download, FileText, Archive, Rocket, ArrowRight, Save, Loader2 } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import Link from 'next/link'
import { BusinessInfo } from '@/lib/types'

interface CompleteStepProps {
  businessInfo: BusinessInfo
  downloadSuccess: boolean
  onContinue: () => void
}

export function CompleteStep({ businessInfo, downloadSuccess, onContinue }: CompleteStepProps) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleSaveProfile = async () => {
    setSaving(true)
    setSaveError(null)

    try {
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ businessInfo }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save profile')
      }

      setSaved(true)
    } catch (error) {
      console.error('Error saving profile:', error)
      setSaveError(error instanceof Error ? error.message : 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Success animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="text-center mb-8"
      >
        <motion.div
          className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
            downloadSuccess
              ? 'bg-gradient-to-br from-green-400 to-emerald-500'
              : 'bg-gradient-to-br from-yellow-400 to-orange-500'
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.4 }}
          >
            {downloadSuccess ? (
              <Check className="w-12 h-12 text-white" />
            ) : (
              <Download className="w-12 h-12 text-white" />
            )}
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-gray-900 mb-2"
        >
          {downloadSuccess ? 'Download Complete!' : 'Download Failed'}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600"
        >
          {downloadSuccess
            ? <>Your data for <span className="font-medium">{businessInfo.name}</span> has been downloaded.</>
            : <>There was an issue downloading the data for <span className="font-medium">{businessInfo.name}</span>. Please try again.</>
          }
        </motion.p>
      </motion.div>

      {/* Save Profile Card */}
      {downloadSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mb-6"
        >
          <Card variant="outlined" className="border-primary-200 bg-primary-50/50">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Save this profile?</h3>
                  <p className="text-sm text-gray-600">
                    Save to continue with logo & social media later
                  </p>
                </div>
                {saved ? (
                  <Badge variant="success" className="flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Saved
                  </Badge>
                ) : (
                  <Button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    size="sm"
                    className="bg-primary-600 hover:bg-primary-700"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Profile
                      </>
                    )}
                  </Button>
                )}
              </div>
              {saveError && (
                <p className="text-sm text-red-600 mt-2">{saveError}</p>
              )}
              {saved && (
                <p className="text-sm text-green-600 mt-2">
                  Profile saved! You can find it in <Link href="/profiles" className="underline font-medium">My Profiles</Link>
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* What's included */}
      {downloadSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card variant="gradient" hover>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Archive className="w-5 h-5 text-primary-500" />
                  Downloaded Package
                </CardTitle>
                <Badge variant="success">Complete</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Your ZIP file contains:</p>
              <div className="space-y-2">
                {[
                  { icon: FileText, label: 'CLAUDE_PROMPT.md - Ready-to-use prompt for Claude' },
                  { icon: FileText, label: 'business-info.json - All business details' },
                  { icon: FileText, label: 'testimonials.json - Customer testimonials' },
                  { icon: FileText, label: 'portfolio.json - Portfolio sections and images' },
                  { icon: FileText, label: 'summary.txt - Human-readable summary' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm text-gray-700">
                    <item.icon className="w-4 h-4 text-primary-500" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Next steps */}
      {downloadSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-6 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl"
        >
          <h3 className="font-semibold text-gray-900 mb-4">How to Generate Your Awwwards-Level Website</h3>
          <ol className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm flex-shrink-0">1</span>
              <span>Extract the ZIP file to a folder</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm flex-shrink-0">2</span>
              <span>Open Claude Desktop and attach the extracted folder</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm flex-shrink-0">3</span>
              <span>Copy the contents of <strong>CLAUDE_PROMPT.md</strong> into Claude</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm flex-shrink-0">4</span>
              <span>Claude will generate a premium website using Aceternity UI & 21st.dev components</span>
            </li>
          </ol>
        </motion.div>
      )}

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col gap-4 mt-8"
      >
        {downloadSuccess && (
          <Button onClick={onContinue} className="w-full" size="lg">
            Continue to Logo & Social Media Setup
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/generator" className="flex-1">
            <Button variant="outline" className="w-full" size="lg">
              <Rocket className="w-4 h-4 mr-2" />
              Export Another Business
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="ghost" className="w-full" size="lg">
              Back to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
