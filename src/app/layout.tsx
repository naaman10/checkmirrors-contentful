import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../app/external.scss";
import "../app/globals.scss";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Script from 'next/script';
import ClientLayout from '@/components/ClientLayout';

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Check Mirrors",
  description: "Professional driving instructor training and support",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      <body className={inter.variable} suppressHydrationWarning>
        <ClientLayout>
          <Navigation />
          {children}
          <Footer />
        </ClientLayout>
      </body>
    </html>
  );
}
