'use client'

import { Inter } from 'next/font/google'
import Navigation from '../components/Navigation'
import 'bootstrap/dist/css/bootstrap.min.css'
import './globals.scss'
import Footer from '@/components/Footer'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://kit.fontawesome.com/c26d8f910e.js"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  )
} 