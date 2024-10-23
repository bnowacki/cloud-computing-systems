import React, { ReactNode } from 'react'

export default async function layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <div className="w-2 flex-1">{children}</div>
    </div>
  )
}
