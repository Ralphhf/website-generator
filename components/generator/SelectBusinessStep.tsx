'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Star, Phone, ArrowLeft, Check, Building2 } from 'lucide-react'
import { Button, Card, Badge } from '@/components/ui'
import { BusinessProfile } from '@/lib/types'
import { cn, getBusinessTypeName } from '@/lib/utils'

interface SelectBusinessStepProps {
  businesses: BusinessProfile[]
  onSelect: (business: BusinessProfile) => void
  onBack: () => void
}

export function SelectBusinessStep({ businesses, onSelect, onBack }: SelectBusinessStepProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleContinue = () => {
    const selected = businesses.find(b => b.placeId === selectedId)
    if (selected) {
      onSelect(selected)
    }
  }

  if (businesses.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <Building2 className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Businesses Found
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't find any businesses without websites in that area.
            Try expanding your search radius or changing the business type.
          </p>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Search
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Select a Business
        </h1>
        <p className="text-gray-600">
          Found {businesses.length} business{businesses.length !== 1 ? 'es' : ''} without websites
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {businesses.map((business, index) => (
          <motion.div
            key={business.placeId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              variant={selectedId === business.placeId ? 'gradient' : 'outlined'}
              hover
              className={cn(
                'cursor-pointer transition-all duration-200',
                selectedId === business.placeId && 'ring-2 ring-primary-500'
              )}
              onClick={() => setSelectedId(business.placeId)}
            >
              <div className="flex items-start gap-4">
                {/* Selection indicator */}
                <div
                  className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1',
                    selectedId === business.placeId
                      ? 'bg-primary-500 border-primary-500'
                      : 'border-gray-300'
                  )}
                >
                  {selectedId === business.placeId && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">
                    {business.name}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">
                      {business.address}, {business.city}
                    </span>
                  </div>

                  {business.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{business.phone}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 flex-wrap mt-3">
                    {business.rating && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        {business.rating.toFixed(1)}
                        {business.reviewCount && (
                          <span className="text-xs opacity-75">
                            ({business.reviewCount})
                          </span>
                        )}
                      </Badge>
                    )}
                    <Badge variant="outline">
                      {getBusinessTypeName(business.types[0])}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!selectedId}
        >
          Continue with Selected
        </Button>
      </div>
    </div>
  )
}
