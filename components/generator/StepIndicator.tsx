'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { FormStep } from '@/lib/types'
import { cn } from '@/lib/utils'

interface StepIndicatorProps {
  steps: { key: FormStep; label: string }[]
  currentStep: FormStep
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  const currentIndex = steps.findIndex(s => s.key === currentStep)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          const isPending = index > currentIndex

          return (
            <div key={step.key} className="flex items-center flex-1">
              {/* Step circle */}
              <div className="relative flex flex-col items-center">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isCompleted
                      ? '#0ea5e9'
                      : isCurrent
                      ? '#0ea5e9'
                      : '#e5e7eb',
                  }}
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                    isCompleted || isCurrent ? 'text-white' : 'text-gray-500'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </motion.div>
                <span
                  className={cn(
                    'absolute -bottom-6 text-xs font-medium whitespace-nowrap',
                    isCurrent ? 'text-primary-600' : 'text-gray-500'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2">
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: isCompleted ? '#0ea5e9' : '#e5e7eb',
                    }}
                    className="h-full rounded-full"
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
