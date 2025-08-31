import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sports Gear Store - Premium Sports Equipment & Accessories',
  description: 'Gear Up for Victory – Shop Top Sports Equipment. Unleash your potential with premium gear for every sport.',
  keywords: 'sports equipment, sports gear, athletic wear, fitness equipment, sports bags, workout gear',
  authors: [{ name: 'Sports Gear Store' }],
  openGraph: {
    title: 'Sports Gear Store - Premium Sports Equipment',
    description: 'Unleash your potential with premium gear for every sport.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sports Gear Store - Premium Sports Equipment',
    description: 'Unleash your potential with premium gear for every sport.',
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#e74c3c" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} font-poppins antialiased`}>
        <div className="min-h-screen bg-white text-black">
          {children}
        </div>
      </body>
    </html>
  )
}