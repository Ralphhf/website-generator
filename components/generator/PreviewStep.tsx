'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Download, Check, Building2, MapPin, Phone, Image as ImageIcon, Quote, Sparkles, X, Terminal, FolderOpen, Play, ExternalLink } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { BusinessInfo } from '@/lib/types'

interface PreviewStepProps {
  businessInfo: BusinessInfo
  onGenerate: () => void
  onBack: () => void
}

export function PreviewStep({ businessInfo, onGenerate, onBack }: PreviewStepProps) {
  const [showSetupModal, setShowSetupModal] = useState(false)
  const [setupComplete, setSetupComplete] = useState(() => {
    // Check if user has already set up the watcher
    if (typeof window !== 'undefined') {
      return localStorage.getItem('website-generator-watcher-setup') === 'true'
    }
    return false
  })

  const handleGenerateWebsite = () => {
    if (!setupComplete) {
      setShowSetupModal(true)
    } else {
      onGenerate()
    }
  }

  const confirmSetupAndGenerate = () => {
    localStorage.setItem('website-generator-watcher-setup', 'true')
    setSetupComplete(true)
    setShowSetupModal(false)
    onGenerate()
  }

  const sections = [
    {
      title: 'Basic Information',
      icon: Building2,
      items: [
        { label: 'Business Name', value: businessInfo.name },
        { label: 'Tagline', value: businessInfo.tagline || 'Not provided' },
        { label: 'Years in Business', value: businessInfo.yearsInBusiness ? `${businessInfo.yearsInBusiness} years` : 'Not provided' },
        { label: 'Services', value: businessInfo.services?.join(', ') || 'Not provided' },
      ],
      complete: !!businessInfo.name && !!businessInfo.description,
    },
    {
      title: 'Contact Information',
      icon: Phone,
      items: [
        { label: 'Email', value: businessInfo.email },
        { label: 'Phone', value: businessInfo.phone },
        { label: 'Address', value: `${businessInfo.address}, ${businessInfo.city}, ${businessInfo.state} ${businessInfo.zipCode}` },
        { label: 'Service Areas', value: businessInfo.serviceAreas?.join(', ') || 'Not specified' },
      ],
      complete: !!businessInfo.email && !!businessInfo.phone && !!businessInfo.address,
    },
    {
      title: 'Social Links',
      icon: MapPin,
      items: [
        { label: 'Google', value: businessInfo.googleProfileUrl || 'Not provided' },
        { label: 'Facebook', value: businessInfo.facebookUrl || 'Not provided' },
        { label: 'Instagram', value: businessInfo.instagramUrl || 'Not provided' },
      ],
      complete: true,
    },
    {
      title: 'Testimonials',
      icon: Quote,
      items: businessInfo.testimonials.length > 0
        ? businessInfo.testimonials.map(t => ({
            label: t.author,
            value: `"${t.content.slice(0, 50)}${t.content.length > 50 ? '...' : ''}" - ${t.rating} stars`,
          }))
        : [{ label: 'Status', value: 'No testimonials added' }],
      complete: businessInfo.testimonials.length > 0,
    },
    {
      title: 'Portfolio',
      icon: ImageIcon,
      items: businessInfo.portfolioSections.length > 0
        ? businessInfo.portfolioSections.map(s => ({
            label: s.title,
            value: `${s.images.length} image${s.images.length !== 1 ? 's' : ''}`,
          }))
        : [{ label: 'Status', value: 'No portfolio sections added' }],
      complete: businessInfo.portfolioSections.length > 0,
    },
  ]

  const completedSections = sections.filter(s => s.complete).length
  const totalSections = sections.length

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Review & Download
        </h1>
        <p className="text-gray-600">
          Review the information before downloading the data
        </p>
      </motion.div>

      {/* Completion Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card variant="gradient">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Completion Status</h3>
                <p className="text-sm text-gray-600">
                  {completedSections} of {totalSections} sections complete
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-32 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedSections / totalSections) * 100}%` }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  />
                </div>
                <Badge variant={completedSections === totalSections ? 'success' : 'warning'}>
                  {Math.round((completedSections / totalSections) * 100)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Section Summary */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <Card variant="outlined" hover>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <section.icon className="w-5 h-5 text-primary-500" />
                    {section.title}
                  </CardTitle>
                  {section.complete ? (
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                  ) : (
                    <Badge variant="warning">Optional</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="-mt-2">
                <dl className="space-y-2">
                  {section.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <dt className="text-gray-500">{item.label}</dt>
                      <dd className="text-gray-900 font-medium text-right max-w-[60%] truncate">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Description Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6"
      >
        <Card variant="glass" className="bg-gray-900 text-white">
          <CardHeader>
            <CardTitle className="text-white">Business Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 leading-relaxed">
              {businessInfo.description || 'No description provided'}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 grid md:grid-cols-2 gap-4"
      >
        {/* Download Data Option */}
        <div className="p-6 bg-gray-100 rounded-2xl text-center">
          <Download className="w-10 h-10 mx-auto mb-3 text-gray-600" />
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Download Data Only</h3>
          <p className="text-gray-600 mb-4 text-sm">
            Get the ZIP file with all business data and prompts for manual website generation.
          </p>
          <Button
            variant="outline"
            size="lg"
            onClick={onGenerate}
            className="w-full"
          >
            <Download className="mr-2 w-4 h-4" />
            Download Data
          </Button>
        </div>

        {/* Generate Website Option */}
        <div className="p-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl text-white text-center">
          <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-90" />
          <h3 className="text-lg font-semibold mb-2">Generate Website</h3>
          <p className="text-white/80 mb-4 text-sm">
            Automatically download, extract, and start Claude CLI to generate your website.
          </p>
          <Button
            variant="glass"
            size="lg"
            onClick={handleGenerateWebsite}
            className="w-full"
          >
            <Sparkles className="mr-2 w-4 h-4" />
            Generate Website
          </Button>
          {setupComplete && (
            <p className="text-white/60 text-xs mt-2">Watcher is set up</p>
          )}
        </div>
      </motion.div>

      <div className="flex justify-start mt-8">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Edit
        </Button>
      </div>

      {/* Setup Instructions Modal */}
      <AnimatePresence>
        {showSetupModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowSetupModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Terminal className="w-6 h-6 text-primary-500" />
                    One-Time Setup Required
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSetupModal(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-gray-600 mt-2">
                  To automatically generate websites, you need to run a small watcher script on your computer.
                </p>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Download the Watcher Script</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Download and extract the watcher script to your computer.
                    </p>
                    <a
                      href="https://github.com/Ralphhf/website-generator/tree/main/scripts"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      <FolderOpen className="w-4 h-4" />
                      View scripts on GitHub
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Run the Watcher</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Double-click <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">Start-Website-Generator-Watcher.bat</code> to start watching your Downloads folder.
                    </p>
                    <div className="bg-gray-900 text-gray-100 p-3 rounded-lg text-sm font-mono">
                      <span className="text-green-400">$</span> Website Generator Watcher<br />
                      <span className="text-gray-400">Watching: C:\Users\...\Downloads</span><br />
                      <span className="text-gray-400">Waiting for website-generator ZIP files...</span>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Click Generate Website</h3>
                    <p className="text-gray-600 text-sm">
                      Once the watcher is running, click the button below. The ZIP will download, extract automatically, and Claude CLI will start generating your website.
                    </p>
                  </div>
                </div>

                {/* Optional: Auto-start */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <h4 className="font-medium text-blue-900 mb-1 flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Optional: Auto-start on Login
                  </h4>
                  <p className="text-sm text-blue-700">
                    Run <code className="bg-blue-100 px-2 py-0.5 rounded">Install-To-Startup.bat</code> to have the watcher start automatically when you log in to Windows.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 flex items-center justify-between">
                <Button variant="outline" onClick={() => setShowSetupModal(false)}>
                  Cancel
                </Button>
                <Button onClick={confirmSetupAndGenerate} className="bg-primary-600 hover:bg-primary-700">
                  <Sparkles className="mr-2 w-4 h-4" />
                  I've Set It Up - Generate Website
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
