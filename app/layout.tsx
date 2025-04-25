import { Inter, Roboto } from 'next/font/google'
import Navigation from '../components/Navigation'
import './external.scss'
import './globals.scss'
import Footer from '@/components/Footer'
import Script from 'next/script'
import ClientLayout from '@/components/ClientLayout'

const inter = Inter({ subsets: ['latin'] })

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
        <Script
          src="https://kit.fontawesome.com/c26d8f910e.js"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ClientLayout>
          <Navigation />
          {children}
          <Footer />
        </ClientLayout>
      </body>
    </html>
  )
} 