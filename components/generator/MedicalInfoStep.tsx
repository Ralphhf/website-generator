'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Stethoscope,
  Plus,
  X,
  Building2,
  Globe,
  Video,
  Shield,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { Button, Input, Textarea, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { MedicalConfig, COMMON_INSURANCE_PROVIDERS, MEDICAL_CREDENTIALS } from '@/lib/types'

interface MedicalInfoStepProps {
  medical?: MedicalConfig
  businessName: string
  onSubmit: (medical: MedicalConfig) => void
  onBack: () => void
}

const COMMON_LANGUAGES = [
  'English', 'Spanish', 'Chinese', 'Vietnamese', 'Korean', 'Tagalog',
  'French', 'German', 'Arabic', 'Russian', 'Portuguese', 'Hindi'
]

export function MedicalInfoStep({ medical, businessName, onSubmit, onBack }: MedicalInfoStepProps) {
  const [medicalConfig, setMedicalConfig] = useState<MedicalConfig>(
    medical || {
      acceptingNewPatients: true,
      insuranceAccepted: [],
      specialties: [],
      credentials: [],
      hospitalAffiliations: [],
      languages: ['English'],
      telehealth: false,
      patientPortalUrl: '',
      hipaaNotice: true,
      emergencyNotice: 'For medical emergencies, please call 911.',
    }
  )

  const [newInsurance, setNewInsurance] = useState('')
  const [newSpecialty, setNewSpecialty] = useState('')
  const [newCredential, setNewCredential] = useState('')
  const [newHospital, setNewHospital] = useState('')

  const toggleArrayItem = <T extends string>(
    field: keyof MedicalConfig,
    item: T
  ) => {
    const current = (medicalConfig[field] as T[]) || []
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item]
    setMedicalConfig({ ...medicalConfig, [field]: updated })
  }

  const addCustomItem = (
    field: keyof MedicalConfig,
    value: string,
    setter: (val: string) => void
  ) => {
    if (value.trim()) {
      const current = (medicalConfig[field] as string[]) || []
      if (!current.includes(value.trim())) {
        setMedicalConfig({
          ...medicalConfig,
          [field]: [...current, value.trim()],
        })
      }
      setter('')
    }
  }

  const removeItem = (field: keyof MedicalConfig, item: string) => {
    const current = (medicalConfig[field] as string[]) || []
    setMedicalConfig({
      ...medicalConfig,
      [field]: current.filter(i => i !== item),
    })
  }

  const handleSubmit = () => {
    onSubmit(medicalConfig)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Healthcare Information
        </h1>
        <p className="text-gray-600">
          Add important medical practice details for your patients
        </p>
      </motion.div>

      {/* Accepting New Patients */}
      <Card variant="gradient" className="mb-6">
        <CardContent className="pt-6">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Accepting New Patients</p>
                <p className="text-sm text-gray-500">
                  Show that your practice is welcoming new patients
                </p>
              </div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={medicalConfig.acceptingNewPatients}
                onChange={(e) => setMedicalConfig({ ...medicalConfig, acceptingNewPatients: e.target.checked })}
                className="sr-only"
              />
              <div
                className={`w-14 h-8 rounded-full transition-colors ${
                  medicalConfig.acceptingNewPatients ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform mt-1 ${
                    medicalConfig.acceptingNewPatients ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </div>
            </div>
          </label>
        </CardContent>
      </Card>

      {/* Insurance Accepted */}
      <Card variant="default" className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-500" />
            Insurance Accepted
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500">
            Select the insurance providers you accept
          </p>

          <div className="flex flex-wrap gap-2">
            {COMMON_INSURANCE_PROVIDERS.map((insurance) => (
              <button
                key={insurance}
                onClick={() => toggleArrayItem('insuranceAccepted', insurance)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  medicalConfig.insuranceAccepted.includes(insurance)
                    ? 'bg-primary-100 text-primary-700 border border-primary-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                {medicalConfig.insuranceAccepted.includes(insurance) && (
                  <CheckCircle className="w-3 h-3 inline mr-1" />
                )}
                {insurance}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Add other insurance..."
              value={newInsurance}
              onChange={(e) => setNewInsurance(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addCustomItem('insuranceAccepted', newInsurance, setNewInsurance)
                }
              }}
            />
            <Button
              variant="outline"
              onClick={() => addCustomItem('insuranceAccepted', newInsurance, setNewInsurance)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {medicalConfig.insuranceAccepted.filter(i => !COMMON_INSURANCE_PROVIDERS.includes(i)).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {medicalConfig.insuranceAccepted
                .filter(i => !COMMON_INSURANCE_PROVIDERS.includes(i))
                .map((insurance) => (
                  <span
                    key={insurance}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                  >
                    {insurance}
                    <button
                      onClick={() => removeItem('insuranceAccepted', insurance)}
                      className="hover:text-primary-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Credentials */}
      <Card variant="default" className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-primary-500" />
            Credentials & Certifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {MEDICAL_CREDENTIALS.map((credential) => (
              <button
                key={credential}
                onClick={() => toggleArrayItem('credentials', credential)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  medicalConfig.credentials?.includes(credential)
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                {credential}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Add other credentials..."
              value={newCredential}
              onChange={(e) => setNewCredential(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addCustomItem('credentials', newCredential, setNewCredential)
                }
              }}
            />
            <Button
              variant="outline"
              onClick={() => addCustomItem('credentials', newCredential, setNewCredential)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Specialties */}
      <Card variant="default" className="mb-6">
        <CardHeader>
          <CardTitle>Specialties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Family Medicine, Cosmetic Dentistry, Sports Injuries..."
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addCustomItem('specialties', newSpecialty, setNewSpecialty)
                }
              }}
            />
            <Button
              variant="outline"
              onClick={() => addCustomItem('specialties', newSpecialty, setNewSpecialty)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {(medicalConfig.specialties?.length || 0) > 0 && (
            <div className="flex flex-wrap gap-2">
              {medicalConfig.specialties?.map((specialty) => (
                <span
                  key={specialty}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                >
                  {specialty}
                  <button
                    onClick={() => removeItem('specialties', specialty)}
                    className="hover:text-purple-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hospital Affiliations */}
      <Card variant="default" className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary-500" />
            Hospital Affiliations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Memorial Hospital, St. Mary's Medical Center..."
              value={newHospital}
              onChange={(e) => setNewHospital(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addCustomItem('hospitalAffiliations', newHospital, setNewHospital)
                }
              }}
            />
            <Button
              variant="outline"
              onClick={() => addCustomItem('hospitalAffiliations', newHospital, setNewHospital)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {(medicalConfig.hospitalAffiliations?.length || 0) > 0 && (
            <div className="flex flex-wrap gap-2">
              {medicalConfig.hospitalAffiliations?.map((hospital) => (
                <span
                  key={hospital}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  <Building2 className="w-3 h-3" />
                  {hospital}
                  <button
                    onClick={() => removeItem('hospitalAffiliations', hospital)}
                    className="hover:text-gray-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Languages */}
      <Card variant="default" className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary-500" />
            Languages Spoken
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {COMMON_LANGUAGES.map((language) => (
              <button
                key={language}
                onClick={() => toggleArrayItem('languages', language)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  medicalConfig.languages?.includes(language)
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                {language}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Telehealth */}
      <Card variant="default" className="mb-6">
        <CardContent className="pt-6">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Video className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Telehealth Available</p>
                <p className="text-sm text-gray-500">
                  Offer virtual appointments via video call
                </p>
              </div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={medicalConfig.telehealth}
                onChange={(e) => setMedicalConfig({ ...medicalConfig, telehealth: e.target.checked })}
                className="sr-only"
              />
              <div
                className={`w-14 h-8 rounded-full transition-colors ${
                  medicalConfig.telehealth ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform mt-1 ${
                    medicalConfig.telehealth ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </div>
            </div>
          </label>
        </CardContent>
      </Card>

      {/* Patient Portal */}
      <Card variant="default" className="mb-6">
        <CardHeader>
          <CardTitle>Patient Portal</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            label="Patient Portal URL (optional)"
            placeholder="https://yourpatientportal.com"
            value={medicalConfig.patientPortalUrl || ''}
            onChange={(e) => setMedicalConfig({ ...medicalConfig, patientPortalUrl: e.target.value })}
          />
          <p className="mt-2 text-sm text-gray-500">
            Link to your patient portal for scheduling, records, and messaging
          </p>
        </CardContent>
      </Card>

      {/* HIPAA & Emergency Notice */}
      <Card variant="default" className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Compliance & Safety
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={medicalConfig.hipaaNotice}
              onChange={(e) => setMedicalConfig({ ...medicalConfig, hipaaNotice: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <div>
              <span className="font-medium text-gray-900">Include HIPAA Notice</span>
              <p className="text-sm text-gray-500">
                Add a HIPAA privacy notice to your website footer
              </p>
            </div>
          </label>

          <Textarea
            label="Emergency Notice"
            placeholder="e.g., For medical emergencies, please call 911."
            value={medicalConfig.emergencyNotice || ''}
            onChange={(e) => setMedicalConfig({ ...medicalConfig, emergencyNotice: e.target.value })}
            className="min-h-[60px]"
          />
          <p className="text-sm text-gray-500">
            This notice will be displayed prominently on your contact page
          </p>
        </CardContent>
      </Card>

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
