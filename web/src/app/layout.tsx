import { Inter as FontSans } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'

import Providers from '@/components/providers'
import { Toaster } from '@/components/toast'
import { cn } from '@/utils/cn'

import '../styles/globals.scss'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Cloudrive',
  description: 'Store files',
}

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased text-foreground',
          fontSans.variable
        )}
      >
        <NextTopLoader color="#fff" height={3} shadow={`0 0 5px #fff`} showSpinner={false} />
        <Providers>
          <main className="min-h-screen">{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
