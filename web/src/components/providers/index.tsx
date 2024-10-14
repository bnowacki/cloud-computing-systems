'use client'

import React from 'react'

import { ThemeProvider } from 'next-themes'

import { UserContextProvider } from './user'

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <UserContextProvider>{children}</UserContextProvider>
    </ThemeProvider>
  )
}

export default Providers
