import { Inter, Roboto } from 'next/font/google'
import Navigation from '../components/Navigation'
import './external.scss'
import './globals.scss'
import Footer from '@/components/Footer'
import Script from 'next/script'
import ClientLayout from '@/components/ClientLayout'
import TermlyScriptLoader from '@/components/TermlyScriptLoader'
import GoogleAnalyticsLoader from '@/components/GoogleAnalyticsLoader'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Check Mirrors',
  description: 'Check Mirrors - Professional Driving School',
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'manifest',
        url: '/site.webmanifest',
      },
    ],
  },
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <TermlyScriptLoader />
        <Script
          src="https://kit.fontawesome.com/c26d8f910e.js"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <GoogleAnalyticsLoader />
        <ClientLayout>
          <Navigation />
          {children}
          <Footer />
        </ClientLayout>
      </body>
    </html>
  )
} 