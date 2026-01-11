'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, FileText, Archive, Check } from 'lucide-react'

interface GeneratingStepProps {
  businessName: string
}

const steps = [
  { icon: FileText, label: 'Gathering business information', duration: 800 },
  { icon: Archive, label: 'Preparing data files', duration: 600 },
  { icon: Download, label: 'Creating download package', duration: 600 },
]

export function GeneratingStep({ businessName }: GeneratingStepProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  useEffect(() => {
    const runSteps = async () => {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i)
        await new Promise(resolve => setTimeout(resolve, steps[i].duration))
        setCompletedSteps(prev => [...prev, i])
      }
    }
    runSteps()
  }, [])

  return (
    <div className="max-w-xl mx-auto py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-12"
      >
        {/* Animated logo */}
        <motion.div
          className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center"
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Download className="w-12 h-12 text-white" />
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Preparing Your Download
        </h1>
        <p className="text-gray-600">
          Packaging data for <span className="font-medium">{businessName}</span>
        </p>
      </motion.div>

      {/* Progress steps */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index)
          const isCurrent = currentStep === index && !isCompleted

          return (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                isCompleted
                  ? 'bg-green-50 border border-green-200'
                  : isCurrent
                  ? 'bg-primary-50 border border-primary-200'
                  : 'bg-gray-50 border border-gray-100'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? 'bg-green-500'
                    : isCurrent
                    ? 'bg-primary-500'
                    : 'bg-gray-200'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <step.icon
                    className={`w-5 h-5 ${
                      isCurrent ? 'text-white' : 'text-gray-400'
                    }`}
                  />
                )}
              </div>

              <div className="flex-1">
                <p
                  className={`font-medium ${
                    isCompleted
                      ? 'text-green-700'
                      : isCurrent
                      ? 'text-primary-700'
                      : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </p>
              </div>

              {isCurrent && (
                <motion.div
                  className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              )}

              {isCompleted && (
                <span className="text-sm text-green-600 font-medium">Done</span>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
