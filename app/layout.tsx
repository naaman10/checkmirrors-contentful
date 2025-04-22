'use client'

import { Inter } from 'next/font/google'
import Navigation from '../components/Navigation'
import 'bootstrap/dist/css/bootstrap.min.css'
import './globals.scss'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  )
} 