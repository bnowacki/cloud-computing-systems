import React from 'react'

import Link from 'next/link'

import { Button, ButtonProps } from '@/components/ui/button'

type Props = ButtonProps & {
  href: string
}

const LinkButton = ({ children, href }: Props) => {
  return (
    <Button asChild variant="secondary" className="w-full">
      <Link href={href}>{children}</Link>
    </Button>
  )
}

export default LinkButton
