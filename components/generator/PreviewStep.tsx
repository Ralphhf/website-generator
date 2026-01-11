'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Download, Check, Building2, MapPin, Phone, Image as ImageIcon, Quote } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { BusinessInfo } from '@/lib/types'

interface PreviewStepProps {
  businessInfo: BusinessInfo
  onGenerate: () => void
  onBack: () => void
}

export function PreviewStep({ businessInfo, onGenerate, onBack }: PreviewStepProps) {
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

      {/* Download CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl text-white text-center"
      >
        <Download className="w-12 h-12 mx-auto mb-4 opacity-80" />
        <h3 className="text-xl font-semibold mb-2">Ready to Download?</h3>
        <p className="text-white/80 mb-6 max-w-md mx-auto">
          Download all business information as a ZIP file containing organized JSON data files.
        </p>
        <Button
          variant="glass"
          size="xl"
          onClick={onGenerate}
        >
          <Download className="mr-2 w-5 h-5" />
          Download Data
        </Button>
      </motion.div>

      <div className="flex justify-start mt-8">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Edit
        </Button>
      </div>
    </div>
  )
}
