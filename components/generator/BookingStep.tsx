'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  Plus,
  Trash2,
  Clock,
  DollarSign,
  ExternalLink,
  CheckCircle
} from 'lucide-react'
import { Button, Input, Textarea, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { BookingConfig, BookableService, BOOKING_PROVIDERS } from '@/lib/types'

interface BookingStepProps {
  booking?: BookingConfig
  businessName: string
  onSubmit: (booking: BookingConfig) => void
  onBack: () => void
}

export function BookingStep({ booking, businessName, onSubmit, onBack }: BookingStepProps) {
  const [bookingConfig, setBookingConfig] = useState<BookingConfig>(
    booking || {
      enabled: true,
      provider: 'calendly',
      bookingUrl: '',
      showAvailability: true,
      services: [createEmptyService()],
      acceptWalkins: true,
      requireDeposit: false,
      depositAmount: '',
      cancellationPolicy: '',
    }
  )

  function createEmptyService(): BookableService {
    return {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      name: '',
      duration: '60 min',
      price: '',
      description: '',
    }
  }

  const addService = () => {
    setBookingConfig({
      ...bookingConfig,
      services: [...(bookingConfig.services || []), createEmptyService()],
    })
  }

  const removeService = (id: string) => {
    if ((bookingConfig.services?.length || 0) > 1) {
      setBookingConfig({
        ...bookingConfig,
        services: bookingConfig.services?.filter(s => s.id !== id),
      })
    }
  }

  const updateService = (id: string, field: keyof BookableService, value: string) => {
    setBookingConfig({
      ...bookingConfig,
      services: bookingConfig.services?.map(s =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    })
  }

  const handleSubmit = () => {
    // Filter out empty services
    const validServices = bookingConfig.services?.filter(s => s.name.trim()) || []
    onSubmit({
      ...bookingConfig,
      services: validServices,
    })
  }

  const selectedProvider = BOOKING_PROVIDERS.find(p => p.id === bookingConfig.provider)

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Online Booking Setup
        </h1>
        <p className="text-gray-600">
          Let customers book appointments directly from your website
        </p>
      </motion.div>

      {/* Enable Booking Toggle */}
      <Card variant="gradient" className="mb-6">
        <CardContent className="pt-6">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Enable Online Booking</p>
              <p className="text-sm text-gray-500">
                Allow customers to book appointments through your website
              </p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={bookingConfig.enabled}
                onChange={(e) => setBookingConfig({ ...bookingConfig, enabled: e.target.checked })}
                className="sr-only"
              />
              <div
                className={`w-14 h-8 rounded-full transition-colors ${
                  bookingConfig.enabled ? 'bg-primary-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform mt-1 ${
                    bookingConfig.enabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </div>
            </div>
          </label>
        </CardContent>
      </Card>

      {bookingConfig.enabled && (
        <>
          {/* Booking Provider Selection */}
          <Card variant="default" className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-500" />
                Booking Platform
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                {BOOKING_PROVIDERS.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => setBookingConfig({ ...bookingConfig, provider: provider.id as BookingConfig['provider'] })}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      bookingConfig.provider === provider.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{provider.name}</span>
                      {bookingConfig.provider === provider.id && (
                        <CheckCircle className="w-5 h-5 text-primary-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {bookingConfig.provider !== 'none' && (
                <div className="mt-4">
                  <Input
                    label="Booking URL"
                    placeholder={selectedProvider?.placeholder || 'Enter your booking URL'}
                    value={bookingConfig.bookingUrl || ''}
                    onChange={(e) => setBookingConfig({ ...bookingConfig, bookingUrl: e.target.value })}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    {bookingConfig.provider === 'calendly' && (
                      <>Get your Calendly link from your <a href="https://calendly.com" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">Calendly dashboard <ExternalLink className="w-3 h-3 inline" /></a></>
                    )}
                    {bookingConfig.provider === 'acuity' && (
                      <>Get your link from <a href="https://acuityscheduling.com" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">Acuity Scheduling <ExternalLink className="w-3 h-3 inline" /></a></>
                    )}
                    {bookingConfig.provider === 'square' && (
                      <>Get your link from <a href="https://squareup.com/appointments" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">Square Appointments <ExternalLink className="w-3 h-3 inline" /></a></>
                    )}
                    {bookingConfig.provider === 'custom' && (
                      <>Enter the full URL to your booking page</>
                    )}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bookable Services */}
          <Card variant="default" className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-500" />
                Services & Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500 mb-4">
                List the services customers can book (these will be displayed on your website)
              </p>

              {bookingConfig.services?.map((service, index) => (
                <div
                  key={service.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-sm font-medium text-gray-500">Service {index + 1}</span>
                    {(bookingConfig.services?.length || 0) > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeService(service.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <Input
                    placeholder="Service name (e.g., Haircut, Massage, Consultation)"
                    value={service.name}
                    onChange={(e) => updateService(service.id, 'name', e.target.value)}
                  />

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Duration
                      </label>
                      <select
                        value={service.duration}
                        onChange={(e) => updateService(service.id, 'duration', e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="15 min">15 minutes</option>
                        <option value="30 min">30 minutes</option>
                        <option value="45 min">45 minutes</option>
                        <option value="60 min">1 hour</option>
                        <option value="90 min">1.5 hours</option>
                        <option value="120 min">2 hours</option>
                        <option value="180 min">3 hours</option>
                        <option value="Varies">Varies</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <DollarSign className="w-4 h-4 inline mr-1" />
                        Price
                      </label>
                      <Input
                        placeholder="e.g., $50, From $75, Call for pricing"
                        value={service.price}
                        onChange={(e) => updateService(service.id, 'price', e.target.value)}
                      />
                    </div>
                  </div>

                  <Textarea
                    placeholder="Brief description (optional)"
                    value={service.description || ''}
                    onChange={(e) => updateService(service.id, 'description', e.target.value)}
                    className="min-h-[50px] text-sm"
                  />
                </div>
              ))}

              <Button
                variant="outline"
                onClick={addService}
                className="w-full border-dashed"
              >
                <Plus className="mr-2 w-4 h-4" />
                Add Service
              </Button>
            </CardContent>
          </Card>

          {/* Booking Policies */}
          <Card variant="default" className="mb-6">
            <CardHeader>
              <CardTitle>Booking Policies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bookingConfig.acceptWalkins}
                  onChange={(e) => setBookingConfig({ ...bookingConfig, acceptWalkins: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <span className="font-medium text-gray-900">Accept Walk-ins</span>
                  <p className="text-sm text-gray-500">Show that you welcome walk-in customers</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bookingConfig.requireDeposit}
                  onChange={(e) => setBookingConfig({ ...bookingConfig, requireDeposit: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <span className="font-medium text-gray-900">Require Deposit</span>
                  <p className="text-sm text-gray-500">Mention that a deposit is required to book</p>
                </div>
              </label>

              {bookingConfig.requireDeposit && (
                <div className="ml-7">
                  <Input
                    label="Deposit Amount"
                    placeholder="e.g., $25, 50%, Non-refundable"
                    value={bookingConfig.depositAmount || ''}
                    onChange={(e) => setBookingConfig({ ...bookingConfig, depositAmount: e.target.value })}
                  />
                </div>
              )}

              <Textarea
                label="Cancellation Policy (optional)"
                placeholder="e.g., Please provide 24 hours notice for cancellations. Late cancellations may be subject to a fee."
                value={bookingConfig.cancellationPolicy || ''}
                onChange={(e) => setBookingConfig({ ...bookingConfig, cancellationPolicy: e.target.value })}
                className="min-h-[80px]"
              />
            </CardContent>
          </Card>
        </>
      )}

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        <Button onClick={handleSubmit}>
          Continue
        </Button>
      </div>
    </div>
  )
}
