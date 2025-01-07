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
  const [loading, setLoading] = useState(false) // Add loading state

  const { profile } = useAuth()

  useEffect(() => {
    ;(async () => {
      if (!data.length || !profile) {
        setFiles([])
        return
      }

      setLoading(true) // Start loading when fetching signed URLs

      try {
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
      } catch (error) {
        console.error('Error fetching signed URLs:', error)
      } finally {
        setLoading(false) // Stop loading
      }
    })()
  }, [data, profile])

  return (
    <div>
      <FileUpload
        title="Upload files"
        subtitle="Drag and drop files here or select them from disk."
        acceptedText="Accepted formats include .pdf, .jpg, .png, and .zip. Maximum size of a single file is 25MB."
        accept={{
          'application/pdf': ['.pdf'],
          'image/png': ['.png'],
          'image/jpeg': ['.jpg', '.jpeg', '.jfif', '.pjpeg', '.pjp'],
          'application/zip': ['.zip'], // Allow ZIP file uploads
        }}
        maxSize={25 * MB}
        value={files}
        onUpload={async v => {
          setLoading(true) // Start loading when uploading a file
          try {
            setFiles(p => [v, ...p])
          } catch (error) {
            console.error('Error uploading file:', error)
          } finally {
            setLoading(false) // Stop loading
          }
        }}
        onDelete={v => setFiles(p => p.filter(f => f.path !== v))}
      />
      {loading && <div className="loading-indicator">Uploading...</div>} {/* Loading indicator */}
    </div>
  )
}
