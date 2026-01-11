import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'AI Website Generator | Create Stunning Business Websites',
  description: 'Generate professional, Awwwards-level websites for local businesses using AI. Fast, SEO-optimized, and mobile-friendly.',
  keywords: ['website generator', 'AI websites', 'business websites', 'local SEO', 'web design'],
  authors: [{ name: 'AI Website Generator' }],
  openGraph: {
    title: 'AI Website Generator | Create Stunning Business Websites',
    description: 'Generate professional, Awwwards-level websites for local businesses using AI.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  )
}
