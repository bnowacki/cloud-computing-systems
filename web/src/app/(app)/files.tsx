'use client'

import React, { useEffect, useState } from 'react'

import { FileObject } from '@supabase/storage-js'

import { FileUpload } from '@/components/FileUpload'
import { useAuth } from '@/components/providers/user'
import { BUCKET, MB } from '@/constants'
import { UploadResult } from '@/types/upload'
import { createClient } from '@/utils/supabase/client'

export default function Files({ data }: { data: FileObject[] }) {
  const [files, setFiles] = useState<UploadResult[]>([])

  const { profile } = useAuth()

  useEffect(() => {
    ;(async () => {
      if (!data.length || !profile) {
        setFiles([])
        return
      }

      const { data: urls, error } = await createClient()
        .storage.from(BUCKET)
        .createSignedUrls(
          data.map(f => `${profile.id}/${f.name}`),
          3600
        )

      if (error) throw error

      setFiles(
        urls.map(u => ({
          name: u.path?.split('/').at(-1) || '',
          path: u.path || '',
          url: u.signedUrl || '',
        }))
      )
    })()
  }, [data, profile])

  return (
    <FileUpload
      title="Upload files"
      subtitle="Drag and drop files here or select them from disk."
      acceptedText="Accepted formats include .pdf, .jpg and .png. Maximum size of a single file 25MB"
      accept={{
        'application/pdf': ['.pdf'],
        'image/png': ['.png'],
        'image/jpeg': ['.jpg', '.jpeg', '.jfif', '.pjpeg', '.pjp'],
      }}
      maxSize={25 * MB}
      value={files}
      onUpload={v => setFiles(p => [v, ...p])}
      onDelete={v => setFiles(p => p.filter(f => f.path !== v))}
    />
  )
}
