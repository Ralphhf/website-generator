'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Globe, Zap, Search, Palette, Rocket, PenLine } from 'lucide-react'
import Link from 'next/link'
import { MotionButton } from '@/components/ui'

export default function Home() {
  return (
    <main className="min-h-screen mesh-bg">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/70 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-xl">WebGen AI</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link href="/generator">
                <MotionButton variant="default" size="sm">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </MotionButton>
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-600 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Website Generation
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6"
          >
            Create{' '}
            <span className="gradient-text">Stunning Websites</span>
            <br />
            for Local Businesses
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-10"
          >
            Find businesses on Google that need websites, fill in their details,
            and let AI generate Awwwards-level, SEO-optimized websites in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/generator">
              <MotionButton variant="glow" size="xl">
                Start Generating
                <Rocket className="ml-2 w-5 h-5" />
              </MotionButton>
            </Link>
            <Link href="/generator?mode=quick">
              <MotionButton variant="outline" size="xl">
                Quick Entry
                <PenLine className="ml-2 w-5 h-5" />
              </MotionButton>
            </Link>
          </motion.div>
        </div>

        {/* Preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-5xl mx-auto mt-20 relative"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200/50 bg-white">
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 border-b border-gray-200">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1 bg-white rounded-lg text-sm text-gray-500">
                  <Globe className="w-3 h-3" />
                  yourwebsite.com
                </div>
              </div>
            </div>
            <div className="aspect-[16/9] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <div className="text-center px-8">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center"
                >
                  <Palette className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  Professional Website Preview
                </h3>
                <p className="text-gray-500">
                  AI-generated, responsive, and SEO-ready
                </p>
              </div>
            </div>
          </div>

          {/* Floating elements */}
          <motion.div
            className="absolute -top-6 -right-6 px-4 py-2 bg-white rounded-xl shadow-lg border border-gray-100"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="flex items-center gap-2 text-sm font-medium text-green-600">
              <Zap className="w-4 h-4" />
              SEO Optimized
            </div>
          </motion.div>

          <motion.div
            className="absolute -bottom-4 -left-6 px-4 py-2 bg-white rounded-xl shadow-lg border border-gray-100"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="flex items-center gap-2 text-sm font-medium text-primary-600">
              <Search className="w-4 h-4" />
              Local Business Ready
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to create professional websites
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Find Businesses',
                description: 'Search for local businesses on Google that don\'t have websites. Filter by location, radius, and business type.',
                icon: Search,
                gradient: 'from-blue-500 to-cyan-500',
              },
              {
                step: '02',
                title: 'Fill Details',
                description: 'Enter business information, testimonials, and portfolio images. Our smart forms guide you through everything needed.',
                icon: Palette,
                gradient: 'from-purple-500 to-pink-500',
              },
              {
                step: '03',
                title: 'Generate & Deploy',
                description: 'AI creates a stunning, SEO-optimized website. Deploy to Netlify with one click and share with the business owner.',
                icon: Rocket,
                gradient: 'from-orange-500 to-red-500',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl -z-10"
                  style={{
                    backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                  }}
                />
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-full transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl">
                  <div className="text-6xl font-bold text-gray-100 mb-4">
                    {feature.step}
                  </div>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-secondary-600 p-12 text-center text-white">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">
                Ready to Create Amazing Websites?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Join thousands of web professionals using AI to deliver
                high-quality websites faster than ever.
              </p>
              <Link href="/generator">
                <MotionButton variant="glass" size="xl">
                  Start Now - It's Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </MotionButton>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">WebGen AI</span>
          </div>
          <p className="text-sm text-gray-500">
            © 2024 WebGen AI. Create stunning websites with AI.
          </p>
        </div>
      </footer>
    </main>
  )
}
