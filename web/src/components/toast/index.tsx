'use client'

import React, { useState } from 'react'

import clsx from 'clsx'
import { X } from 'lucide-react'
import hotToast, {
  ToastOptions as HotToastOptions,
  Toaster as HotToaster,
  Toast,
  ToastType,
  ToasterProps,
} from 'react-hot-toast'

import styles from './styles.module.scss'

const props: ToasterProps = {
  position: 'top-right',
  toastOptions: {
    duration: 5000,
  },
}

export function Toaster() {
  return <HotToaster {...props} />
}

export type ToastOptions = HotToastOptions & {
  description?: string
  title: string
  type?: ToastType
}

export default function toast({ title, description, type = 'blank', ...options }: ToastOptions) {
  hotToast.custom(t => <CustomToast t={{ ...t, title, description, type }} />, options)
}

function CustomToast({ t }: { t: Toast & { title: string; description?: string } }) {
  const [paused, setPaused] = useState(false)

  return (
    <div
      className={clsx(
        'relative flex w-96 overflow-hidden px-3 py-4 rounded-md bg-card items-center gap-4 animate-in fade-in slide-in-from-top-4 transition-all border',
        !t.visible && 'opacity-0 translate-y-4'
      )}
      onMouseDown={() => setPaused(true)}
      onMouseUp={() => setPaused(false)}
    >
      <div className="flex flex-col items-stretch gap-2 flex-1">
        <div className="flex items-center gap-2">
          <p className="flex-1 font-bold">{t.title}</p>
          <button
            className="hover:opacity-60 active:opacity-100 transition-all"
            onClick={() => hotToast.dismiss(t.id)}
          >
            <X />
          </button>
        </div>
        {t.description && <p className="text-sm">{t.description}</p>}
      </div>
      {t.duration && (
        <div
          className={clsx(styles.DurationBar, t.type === 'error' ? styles.Error : null)}
          style={{
            animationDuration: `${t.duration}ms`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        />
      )}
    </div>
  )
}
