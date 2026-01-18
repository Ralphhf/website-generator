'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Phone, MapPin, Globe, Facebook, Instagram, Linkedin, Video, Youtube } from 'lucide-react'
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { BusinessInfo } from '@/lib/types'
import { isValidEmail, isValidPhone, isValidUrl } from '@/lib/utils'

interface ContactInfoStepProps {
  businessInfo: BusinessInfo
  onSubmit: (data: Partial<BusinessInfo>) => void
  onBack: () => void
}

export function ContactInfoStep({ businessInfo, onSubmit, onBack }: ContactInfoStepProps) {
  const [email, setEmail] = useState(businessInfo.email || '')
  const [phone, setPhone] = useState(businessInfo.phone || '')
  const [address, setAddress] = useState(businessInfo.address || '')
  const [city, setCity] = useState(businessInfo.city || '')
  const [state, setState] = useState(businessInfo.state || '')
  const [zipCode, setZipCode] = useState(businessInfo.zipCode || '')
  const [serviceAreas, setServiceAreas] = useState(businessInfo.serviceAreas?.join(', ') || '')

  // Social links
  const [googleProfileUrl, setGoogleProfileUrl] = useState(businessInfo.googleProfileUrl || '')
  const [facebookUrl, setFacebookUrl] = useState(businessInfo.facebookUrl || '')
  const [instagramUrl, setInstagramUrl] = useState(businessInfo.instagramUrl || '')
  const [linkedinUrl, setLinkedinUrl] = useState(businessInfo.linkedinUrl || '')
  const [yelpUrl, setYelpUrl] = useState(businessInfo.yelpUrl || '')
  const [tiktokUrl, setTiktokUrl] = useState(businessInfo.tiktokUrl || '')
  const [youtubeUrl, setYoutubeUrl] = useState(businessInfo.youtubeUrl || '')

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!email.trim()) newErrors.email = 'Email is required'
    else if (!isValidEmail(email)) newErrors.email = 'Invalid email format'

    if (!phone.trim()) newErrors.phone = 'Phone is required'
    else if (!isValidPhone(phone)) newErrors.phone = 'Invalid phone format'

    if (!address.trim()) newErrors.address = 'Address is required'
    if (!city.trim()) newErrors.city = 'City is required'
    if (!state.trim()) newErrors.state = 'State is required'
    if (!zipCode.trim()) newErrors.zipCode = 'ZIP code is required'

    // Validate URLs if provided
    if (facebookUrl && !isValidUrl(facebookUrl)) newErrors.facebookUrl = 'Invalid URL'
    if (instagramUrl && !isValidUrl(instagramUrl)) newErrors.instagramUrl = 'Invalid URL'
    if (linkedinUrl && !isValidUrl(linkedinUrl)) newErrors.linkedinUrl = 'Invalid URL'
    if (tiktokUrl && !isValidUrl(tiktokUrl)) newErrors.tiktokUrl = 'Invalid URL'
    if (youtubeUrl && !isValidUrl(youtubeUrl)) newErrors.youtubeUrl = 'Invalid URL'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        serviceAreas: serviceAreas.split(',').map(s => s.trim()).filter(Boolean),
        googleProfileUrl,
        facebookUrl,
        instagramUrl,
        linkedinUrl,
        yelpUrl,
        tiktokUrl,
        youtubeUrl,
      })
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
          Contact Information
        </h1>
        <p className="text-gray-600">
          How can customers reach this business?
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Primary Contact */}
        <Card variant="gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary-500" />
              Primary Contact
            </CardTitle>
            <CardDescription>
              Main contact information for the business
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="email@business.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                icon={<Mail className="w-5 h-5" />}
              />
              <Input
                label="Phone Number"
                type="tel"
                placeholder="(555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={errors.phone}
                icon={<Phone className="w-5 h-5" />}
              />
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card variant="gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-500" />
              Business Address
            </CardTitle>
            <CardDescription>
              Physical location of the business
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Street Address"
              placeholder="123 Main Street"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              error={errors.address}
            />
            <div className="grid sm:grid-cols-3 gap-4">
              <Input
                label="City"
                placeholder="Austin"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                error={errors.city}
              />
              <Input
                label="State"
                placeholder="TX"
                value={state}
                onChange={(e) => setState(e.target.value)}
                error={errors.state}
              />
              <Input
                label="ZIP Code"
                placeholder="78701"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                error={errors.zipCode}
              />
            </div>
            <Input
              label="Service Areas (Optional)"
              placeholder="Austin, Round Rock, Cedar Park, Georgetown"
              value={serviceAreas}
              onChange={(e) => setServiceAreas(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              List cities or areas where this business provides services, separated by commas
            </p>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card variant="gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary-500" />
              Social Media & Online Presence
            </CardTitle>
            <CardDescription>
              Add social media links (optional but recommended for SEO)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Google Business Profile URL"
              placeholder="https://g.page/yourbusiness"
              value={googleProfileUrl}
              onChange={(e) => setGoogleProfileUrl(e.target.value)}
              icon={<Globe className="w-5 h-5" />}
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Facebook"
                placeholder="https://facebook.com/yourbusiness"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                error={errors.facebookUrl}
                icon={<Facebook className="w-5 h-5" />}
              />
              <Input
                label="Instagram"
                placeholder="https://instagram.com/yourbusiness"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                error={errors.instagramUrl}
                icon={<Instagram className="w-5 h-5" />}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="LinkedIn"
                placeholder="https://linkedin.com/company/yourbusiness"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                error={errors.linkedinUrl}
                icon={<Linkedin className="w-5 h-5" />}
              />
              <Input
                label="Yelp"
                placeholder="https://yelp.com/biz/yourbusiness"
                value={yelpUrl}
                onChange={(e) => setYelpUrl(e.target.value)}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="TikTok"
                placeholder="https://tiktok.com/@yourbusiness"
                value={tiktokUrl}
                onChange={(e) => setTiktokUrl(e.target.value)}
                error={errors.tiktokUrl}
                icon={<Video className="w-5 h-5" />}
              />
              <Input
                label="YouTube"
                placeholder="https://youtube.com/@yourbusiness"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                error={errors.youtubeUrl}
                icon={<Youtube className="w-5 h-5" />}
              />
            </div>
          </CardContent>
        </Card>
      </div>

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
