'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, icon, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)

    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              'flex h-12 w-full rounded-xl border-2 bg-white px-4 py-3 text-sm transition-all duration-200',
              'placeholder:text-gray-400',
              'focus:outline-none focus:ring-0',
              icon && 'pl-12',
              error
                ? 'border-red-300 focus:border-red-500'
                : 'border-gray-200 focus:border-primary-500',
              isFocused && !error && 'shadow-lg shadow-primary-500/10',
              className
            )}
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          {isFocused && !error && (
            <motion.div
              className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-primary-500/20 to-secondary-500/20 blur-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            />
          )}
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
