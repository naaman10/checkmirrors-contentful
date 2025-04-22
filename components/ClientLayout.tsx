'use client'

import { ReactNode } from 'react'
import TrustmaryScript from './TrustmaryScript'

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <TrustmaryScript />
      {children}
    </>
  )
} 