'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { motion, HTMLMotionProps } from 'framer-motion'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient' | 'outlined'
  hover?: boolean
  spotlight?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, spotlight = false, children, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-white shadow-lg',
      glass: 'bg-white/10 backdrop-blur-lg border border-white/20 shadow-glass',
      gradient: 'bg-gradient-to-br from-white to-gray-50 shadow-xl',
      outlined: 'bg-white border-2 border-gray-100',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl p-6 transition-all duration-300',
          variantStyles[variant],
          hover && 'hover:-translate-y-2 hover:shadow-2xl cursor-pointer',
          spotlight && 'spotlight',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = 'Card'

// Motion Card with animations
interface MotionCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  variant?: 'default' | 'glass' | 'gradient' | 'outlined'
  children: React.ReactNode
}

const MotionCard = React.forwardRef<HTMLDivElement, MotionCardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-white shadow-lg',
      glass: 'bg-white/10 backdrop-blur-lg border border-white/20 shadow-glass',
      gradient: 'bg-gradient-to-br from-white to-gray-50 shadow-xl',
      outlined: 'bg-white border-2 border-gray-100',
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          'rounded-2xl p-6',
          variantStyles[variant],
          className
        )}
        whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
MotionCard.displayName = 'MotionCard'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-gray-500', className)} {...props} />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center pt-4', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, MotionCard, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
