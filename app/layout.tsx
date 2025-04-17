import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '../components/Navigation'
import 'bootstrap/dist/css/bootstrap.min.css'
import './globals.scss'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Checkmirrors School of Motoring',
  description: 'Professional driving instruction in the UK',
}

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
      </body>
    </html>
  )
} 