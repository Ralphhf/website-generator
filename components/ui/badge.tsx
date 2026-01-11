import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-200',
  {
    variants: {
      variant: {
        default:
          'bg-primary-100 text-primary-700 hover:bg-primary-200',
        secondary:
          'bg-secondary-100 text-secondary-700 hover:bg-secondary-200',
        destructive:
          'bg-red-100 text-red-700 hover:bg-red-200',
        success:
          'bg-green-100 text-green-700 hover:bg-green-200',
        warning:
          'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
        outline:
          'border border-gray-200 text-gray-700 hover:bg-gray-50',
        glass:
          'bg-white/20 backdrop-blur-sm text-white border border-white/30',
        gradient:
          'bg-gradient-to-r from-primary-500 to-secondary-500 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
