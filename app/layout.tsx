import type { Metadata } from 'next'
import './globals.css'
import QueryProvider from '@/lib/QueryProvider'

export const metadata: Metadata = {
  title: 'Travel Workspace',
  description: 'Your personal travel inspiration and knowledge base',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body className="antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
