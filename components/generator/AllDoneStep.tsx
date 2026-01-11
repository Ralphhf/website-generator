'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Globe, MapPin, Share2, Image, ArrowRight, RotateCcw } from 'lucide-react'
import { Button, Card, CardContent } from '@/components/ui'
import Link from 'next/link'

interface AllDoneStepProps {
  businessName: string
  onStartOver: () => void
}

export function AllDoneStep({ businessName, onStartOver }: AllDoneStepProps) {
  const completedSteps = [
    { icon: <Globe className="w-5 h-5" />, label: 'Website Data Generated', color: 'text-blue-500' },
    { icon: <Image className="w-5 h-5" />, label: 'Logo Prompt Created', color: 'text-purple-500' },
    { icon: <MapPin className="w-5 h-5" />, label: 'Google Business Profile Guide', color: 'text-green-500' },
    { icon: <Share2 className="w-5 h-5" />, label: 'Social Media Bios Generated', color: 'text-pink-500' },
  ]

  return (
    <div className="max-w-2xl mx-auto text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center"
      >
        <CheckCircle2 className="w-12 h-12 text-white" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          All Done!
        </h1>
        <p className="text-gray-600 mb-8">
          You've completed the setup process for <strong>{businessName}</strong>
        </p>
      </motion.div>

      {/* Completed Steps Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card variant="gradient" className="mb-8">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">What was completed</h3>
            <div className="grid grid-cols-2 gap-3">
              {completedSteps.map((step, index) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-100"
                >
                  <div className={step.color}>{step.icon}</div>
                  <span className="text-sm text-gray-700">{step.label}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-6 bg-blue-50 border border-blue-100 rounded-xl mb-8"
      >
        <h3 className="font-semibold text-blue-900 mb-3">Next Steps</h3>
        <ul className="text-sm text-blue-700 space-y-2 text-left">
          <li className="flex items-start gap-2">
            <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Use the downloaded data with Claude to generate the actual website code</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Deploy the website and update the business profile with the live URL</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Complete Google Business verification when the postcard arrives</span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Start posting content to social media accounts</span>
          </li>
        </ul>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-3 justify-center"
      >
        <Button variant="outline" onClick={onStartOver}>
          <RotateCcw className="mr-2 w-4 h-4" />
          Start New Business
        </Button>
        <Link href="/">
          <Button>
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
