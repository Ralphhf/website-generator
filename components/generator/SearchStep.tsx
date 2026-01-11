'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Building2, Loader2 } from 'lucide-react'
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BusinessProfile } from '@/lib/types'
import { businessTypeOptions, radiusOptions } from '@/lib/google-places'

interface SearchStepProps {
  onSearchResults: (results: BusinessProfile[]) => void
}

export function SearchStep({ onSearchResults }: SearchStepProps) {
  const [location, setLocation] = useState('')
  const [radius, setRadius] = useState('10')
  const [businessType, setBusinessType] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!location || !businessType) {
      setError('Please fill in all fields')
      return
    }

    setError('')
    setIsSearching(true)

    try {
      const response = await fetch('/api/search-businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          radius: parseInt(radius),
          businessType,
        }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        onSearchResults(data.businesses)
      }
    } catch (err) {
      setError('Failed to search. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Find Businesses Without Websites
        </h1>
        <p className="text-gray-600">
          Search for local businesses on Google that don't have a website yet
        </p>
      </motion.div>

      <Card variant="gradient" className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-primary-500" />
            Search Criteria
          </CardTitle>
          <CardDescription>
            Enter the location, radius, and type of business you want to find
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Location Input */}
          <Input
            label="Location"
            placeholder="Enter city, state or zip code (e.g., Austin, TX)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            icon={<MapPin className="w-5 h-5" />}
          />

          {/* Radius Select */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Search Radius
            </label>
            <Select value={radius} onValueChange={setRadius}>
              <SelectTrigger>
                <SelectValue placeholder="Select radius" />
              </SelectTrigger>
              <SelectContent>
                {radiusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Business Type Select */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Business Type
            </label>
            <Select value={businessType} onValueChange={setBusinessType}>
              <SelectTrigger>
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                {businessTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
            >
              {error}
            </motion.div>
          )}

          <Button
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full"
            size="lg"
          >
            {isSearching ? (
              <>
                <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 w-5 h-5" />
                Search Businesses
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Info box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 p-4 bg-primary-50 border border-primary-100 rounded-xl"
      >
        <h3 className="font-medium text-primary-900 mb-1">
          Pro Tip
        </h3>
        <p className="text-sm text-primary-700">
          The search will only show businesses that don't have a website linked to their
          Google Business Profile. These are prime opportunities for website sales!
        </p>
      </motion.div>
    </div>
  )
}
