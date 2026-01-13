'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, MapPin, Calendar, Trash2, ArrowRight, Loader2, FolderOpen, Plus, AlertCircle } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import Link from 'next/link'

interface ProfileSummary {
  id: string
  name: string
  business_type: string | null
  tagline: string | null
  city: string | null
  state: string | null
  created_at: string
  updated_at: string
}

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<ProfileSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    try {
      const response = await fetch('/api/profiles')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profiles')
      }

      setProfiles(data.profiles || [])
    } catch (err) {
      console.error('Error fetching profiles:', err)
      setError(err instanceof Error ? err.message : 'Failed to load profiles')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
      return
    }

    setDeleting(id)

    try {
      const response = await fetch(`/api/profiles/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete profile')
      }

      setProfiles(profiles.filter(p => p.id !== id))
    } catch (err) {
      console.error('Error deleting profile:', err)
      alert(err instanceof Error ? err.message : 'Failed to delete profile')
    } finally {
      setDeleting(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen mesh-bg">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/70 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <FolderOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-lg">My Profiles</span>
            </Link>
            <Link href="/generator?mode=quick">
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Profile
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Saved Business Profiles
            </h1>
            <p className="text-gray-600">
              Continue where you left off with your saved businesses
            </p>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card variant="outlined" className="border-red-200 bg-red-50">
                <CardContent className="py-8 text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Error loading profiles</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <Button onClick={fetchProfiles} variant="outline">
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && !error && profiles.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card variant="gradient">
                <CardContent className="py-16 text-center">
                  <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved profiles yet</h3>
                  <p className="text-gray-600 mb-6">
                    Create your first business profile to get started
                  </p>
                  <Link href="/generator?mode=quick">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Profiles List */}
          {!loading && !error && profiles.length > 0 && (
            <div className="space-y-4">
              <AnimatePresence>
                {profiles.map((profile, index) => (
                  <motion.div
                    key={profile.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card variant="outlined" hover className="group">
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
                              <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{profile.name}</h3>
                              <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                {profile.business_type && (
                                  <Badge variant="secondary" className="text-xs">
                                    {profile.business_type}
                                  </Badge>
                                )}
                                {(profile.city || profile.state) && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {[profile.city, profile.state].filter(Boolean).join(', ')}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(profile.updated_at)}
                                </span>
                              </div>
                              {profile.tagline && (
                                <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                                  {profile.tagline}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(profile.id, profile.name)}
                              disabled={deleting === profile.id}
                              className="text-gray-400 hover:text-red-500"
                            >
                              {deleting === profile.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                            <Link href={`/profiles/${profile.id}`}>
                              <Button size="sm">
                                Continue
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
