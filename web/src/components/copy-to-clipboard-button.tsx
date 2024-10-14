'use client'

import { ReactNode, useCallback, useRef, useState } from 'react'

import { CheckIcon, CopyIcon } from 'lucide-react'

import useLoadingState from '@/hooks/use-loading-state'

import { Button } from './ui/button'

const CopyToClipboardButton = ({ value, children }: { value: string; children?: ReactNode }) => {
  const [copied, setCopied] = useState(false)
  const timeoutID = useRef<NodeJS.Timeout | null>(null)

  const [handleCopy, loading] = useLoadingState(
    useCallback(async () => {
      setCopied(false)
      if (timeoutID.current) {
        clearTimeout(timeoutID.current)
      }

      await navigator.clipboard.writeText(value)
      setCopied(true)

      timeoutID.current = setTimeout(() => {
        setCopied(false)
        timeoutID.current = null
      }, 2000)
    }, [value])
  )

  return (
    <Button
      aria-label="copy-to-clipboard"
      onClick={handleCopy}
      loading={loading}
      variant="ghost"
      size="sm"
    >
      <div className="flex items-center gap-2">
        {loading ? null : copied ? <CheckIcon color="green" size={16} /> : <CopyIcon size={16} />}
        {children}
      </div>
    </Button>
  )
}

export default CopyToClipboardButton
